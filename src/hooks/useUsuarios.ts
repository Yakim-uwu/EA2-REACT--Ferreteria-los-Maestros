import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DatosUsuario, RespuestaOperacion, Usuario } from "../types";
import { EVENTO_SESION_EXPIRADA } from "../api/axiosConfig";
import { authService } from "../services/authService";
import { usuarioService } from "../services/usuarioService";
import { mensajeDeError } from "../utils/errores";
import { CLAVE_TOKENS, limpiarTokens, obtenerTokens } from "../utils/tokens";

export interface RespuestaSesion extends RespuestaOperacion {
  usuario?: Usuario;
}

/** Sesión (JWT), usuarios y reglas de roles y permisos conectados al backend. */
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState<boolean>(
    () => obtenerTokens() !== null,
  );

  // Recupera la sesión al recargar la página si existen tokens
  useEffect(() => {
    if (obtenerTokens() === null) {
      setCargandoSesion(false);
      return;
    }
    let vigente = true;
    usuarioService
      .obtenerMiPerfil()
      .then((usuario) => {
        if (vigente) setUsuarioActivo(usuario);
      })
      .catch((error: unknown) => {
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          limpiarTokens();
        }
      })
      .finally(() => {
        if (vigente) setCargandoSesion(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  // Carga la lista de usuarios desde la API cuando hay sesión de administrador o vendedor
  const recargarUsuarios = useCallback(async (): Promise<void> => {
    if (
      !usuarioActivo ||
      (usuarioActivo.rol !== "administrador" &&
        usuarioActivo.rol !== "vendedor")
    ) {
      setUsuarios([]);
      return;
    }
    try {
      const lista = await usuarioService.obtenerTodos();
      setUsuarios(lista);
    } catch {
      setUsuarios([]);
    }
  }, [usuarioActivo]);

  useEffect(() => {
    void recargarUsuarios();
  }, [recargarUsuarios]);

  // Cierra sesión si expira el refresh token o se cierra en otra pestaña
  useEffect(() => {
    const alExpirar = () => {
      setUsuarioActivo(null);
      setUsuarios([]);
    };
    const alCambiarAlmacenamiento = (evento: StorageEvent) => {
      if (evento.key !== null && evento.key !== CLAVE_TOKENS) return;
      if (obtenerTokens() === null) {
        setUsuarioActivo(null);
        setUsuarios([]);
      }
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    window.addEventListener("storage", alCambiarAlmacenamiento);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
      window.removeEventListener("storage", alCambiarAlmacenamiento);
    };
  }, []);

  const iniciarSesion = useCallback(
    async (correo: string, contrasena: string): Promise<RespuestaSesion> => {
      try {
        const usuario = await authService.login(correo, contrasena);
        setUsuarioActivo(usuario);
        return {
          ok: true,
          mensaje: `¡Bienvenido/a ${usuario.nombreCompleto}!`,
          usuario,
        };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  const cerrarSesion = useCallback(() => {
    limpiarTokens();
    setUsuarioActivo(null);
    setUsuarios([]);
  }, []);

  /** Registro público de un cliente (POST /api/auth/registro). */
  const registrarse = useCallback(
    async (datos: DatosUsuario): Promise<RespuestaOperacion> => {
      try {
        await authService.registrar(datos);
        return { ok: true, mensaje: "Usuario registrado con éxito." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  /** Edición del propio perfil (PUT /api/usuarios/yo). */
  const actualizarPerfil = useCallback(
    async (datos: Omit<DatosUsuario, "rol">): Promise<RespuestaOperacion> => {
      if (!usuarioActivo)
        return { ok: false, mensaje: "No hay sesión activa." };
      try {
        const actualizado = await usuarioService.actualizarMiPerfil({
          ...datos,
          rol: usuarioActivo.rol,
        });
        setUsuarioActivo(actualizado);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === actualizado.id ? actualizado : u)),
        );
        return { ok: true, mensaje: "Perfil actualizado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [usuarioActivo],
  );

  /** Alta de usuario por Administrador o Vendedor (POST /api/usuarios). */
  const registrarUsuario = useCallback(
    async (datos: DatosUsuario): Promise<RespuestaOperacion> => {
      try {
        const creado = await usuarioService.crear(datos);
        setUsuarios((prev) => [...prev, creado]);
        return { ok: true, mensaje: "Usuario registrado con éxito." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  /** Edición de usuario y rol por Administrador (PUT /api/usuarios/{id}). */
  const actualizarUsuario = useCallback(
    async (id: string, datos: DatosUsuario): Promise<RespuestaOperacion> => {
      try {
        const actualizado = await usuarioService.actualizar(id, datos);
        setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)));
        return { ok: true, mensaje: "Usuario actualizado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  /** Eliminación de usuario por Administrador (DELETE /api/usuarios/{id}). */
  const eliminarUsuario = useCallback(
    async (id: string): Promise<RespuestaOperacion> => {
      try {
        await usuarioService.eliminar(id);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        return { ok: true, mensaje: "Usuario eliminado." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  return {
    usuarios,
    usuarioActivo,
    cargandoSesion,
    recargarUsuarios,
    iniciarSesion,
    cerrarSesion,
    registrarse,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPerfil,
  };
}
