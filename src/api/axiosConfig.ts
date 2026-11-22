import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AuthApi } from "../types/api";
import { guardarTokens, limpiarTokens, obtenerTokens } from "../utils/tokens";

// Dirección del backend: viene de la variable VITE_API_URL (archivo .env.local)
// y, si no existe, se usa el puerto 8080.
const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/** Evento que se dispara cuando no se pudo renovar la sesión (la app debe cerrarla). */
export const EVENTO_SESION_EXPIRADA = "ferreteria:sesion-expirada";

/** Cliente HTTP principal: agrega el token a cada solicitud y renueva la sesión si expira. */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Cliente sin interceptores, solo para renovar el token (evita bucles infinitos).
const apiSinSesion = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

const esRutaDeAuth = (url?: string): boolean => url?.startsWith("/api/auth/") ?? false;

// 1) Antes de enviar: adjunta "Authorization: Bearer <accessToken>" si hay sesión.
api.interceptors.request.use((config) => {
  const tokens = obtenerTokens();
  if (tokens && !esRutaDeAuth(config.url)) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

interface ConfigConReintento extends InternalAxiosRequestConfig {
  _reintento?: boolean;
}

// Si varias solicitudes fallan a la vez, se renueva el token una sola vez.
let renovacionEnCurso: Promise<string> | null = null;

async function renovarAccessToken(): Promise<string> {
  const tokens = obtenerTokens();
  if (!tokens) throw new Error("No hay sesión que renovar");

  const respuesta = await apiSinSesion.post<AuthApi>("/api/auth/refresh", {
    refreshToken: tokens.refreshToken,
  });
  guardarTokens({
    accessToken: respuesta.data.accessToken,
    refreshToken: respuesta.data.refreshToken,
  });
  return respuesta.data.accessToken;
}

// 2) Al recibir la respuesta: si el backend dice 401 (token vencido), se renueva
//    el token y se repite la solicitud original una sola vez.
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error: AxiosError) => {
    const original = error.config as ConfigConReintento | undefined;

    const debeRenovar =
      error.response?.status === 401 &&
      original !== undefined &&
      !original._reintento &&
      !esRutaDeAuth(original.url) &&
      obtenerTokens() !== null;

    if (!debeRenovar || !original) {
      return Promise.reject(error);
    }

    original._reintento = true;
    try {
      if (!renovacionEnCurso) {
        renovacionEnCurso = renovarAccessToken().finally(() => {
          renovacionEnCurso = null;
        });
      }
      const nuevoToken = await renovacionEnCurso;
      original.headers.Authorization = `Bearer ${nuevoToken}`;
      return api(original);
    } catch {
      // No se pudo renovar: la sesión terminó
      limpiarTokens();
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
      return Promise.reject(error);
    }
  },
);
