import axios from "axios";
import { ErrorApi } from "../types/api";

/** Convierte cualquier error de una petición HTTP en un mensaje legible para el usuario. */
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError<ErrorApi>(error)) {
    if (error.code === "ECONNABORTED") {
      return "El servidor tardó demasiado en responder. Intenta nuevamente.";
    }
    if (!error.response) {
      return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
    }

    const datos = error.response.data;
    // Errores de validación: "detalles" trae un mensaje por campo
    if (datos?.detalles && Object.keys(datos.detalles).length > 0) {
      return Object.values(datos.detalles).join(" ");
    }
    if (datos?.mensaje) return datos.mensaje;

    if (error.response.status === 401) return "Tu sesión no es válida o expiró. Inicia sesión nuevamente.";
    if (error.response.status === 403) return "No tienes permisos para realizar esta acción.";
    return `El servidor respondió con el error ${error.response.status}.`;
  }
  return "Ocurrió un error inesperado.";
}
