import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DatosUsuario, RespuestaOperacion, Usuario } from "../types";
import { usuariosSemilla } from "../data/usuarios";
import { EVENTO_SESION_EXPIRADA } from "../api/axiosConfig";
import { authService } from "../services/authService";
import { usuarioService } from "../services/usuarioService";
import { calcularEdad } from "../utils/format";
import { mensajeDeError } from "../utils/errores";
import { CLAVE_TOKENS, limpiarTokens, obtenerTokens } from "../utils/tokens";
import { useLocalStorage } from "./useLocalStorage";

export interface RespuestaSesion extends RespuestaOperacion {
  usuario?: Usuario;
}

/** Sesión (JWT), usuarios y reglas de roles y permisos. */
export function useUsuarios() {
  // Lista local de ejemplo: la usan los paneles de Administrador y Vendedor
  // hasta que se migren a la API (paso siguiente).
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(
    "usuarios",
    usuariosSemilla,
  );

  // El usuario con sesión viene del backend. En el navegador solo se guardan los tokens.
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);
  // true mientras se verifica con el backend una sesión guardada (por ejemplo, al recargar la página)
  const [cargandoSesion, setCargandoSesion] = useState<boolean>(
    () => obtenerTokens() !== null,
  );

  // Al abrir o recargar la página: si hay tokens guardados, se recupera la sesión.
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
        // Tokens inválidos o vencidos (y no renovables): se descartan
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

  // La sesión se cierra sola si no se pudo renovar el token o si se cerró en otra pestaña.
  useEffect(() => {
    const alExpirar = () => setUsuarioActivo(null);
    const alCambiarAlmacenamiento = (evento: StorageEvent) => {
      if (evento.key !== null && evento.key !== CLAVE_TOKENS) return;
      if (obtenerTokens() === null) setUsuarioActivo(null);
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    window.addEventListener("storage", alCambiarAlmacenamiento);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
      window.removeEventListener("storage", alCambiarAlmacenamiento);
    };
  }, []);

  const correoEnUso = useCallback(
    (correo: string, idExcluido?: string): boolean =>
      usuarios.some(
        (u) =>
          u.id !== idExcluido &&
          u.correo.toLowerCase() === correo.trim().toLowerCase(),
      ),
    [usuarios],
  );

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
  }, []);

  /** Registro público de un cliente (se guarda en el backend). */
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

  /** El usuario con sesión edita su propio perfil. El rol nunca se modifica desde aquí. */
  const actualizarPerfil = useCallback(
    async (datos: Omit<DatosUsuario, "rol">): Promise<RespuestaOperacion> => {
      if (!usuarioActivo) return { ok: false, mensaje: "No hay sesión activa." };
      try {
        const actualizado = await usuarioService.actualizarMiPerfil({
          ...datos,
          rol: usuarioActivo.rol,
        });
        setUsuarioActivo(actualizado);
        return { ok: true, mensaje: "Perfil actualizado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [usuarioActivo],
  );

  // --- Gestión de usuarios (lista local de ejemplo; se migra a la API en el paso siguiente) ---
  const registrarUsuario = useCallback(
    (datos: DatosUsuario): RespuestaOperacion => {
      if (correoEnUso(datos.correo)) {
        return {
          ok: false,
          mensaje: "El correo electrónico ya se encuentra registrado.",
        };
      }
      // Regla de negocio: solo un administrador crea cuentas con rol distinto de cliente
      if (datos.rol !== "cliente" && usuarioActivo?.rol !== "administrador") {
        return {
          ok: false,
          mensaje: "Solo un administrador puede crear usuarios con ese rol.",
        };
      }

      const nuevo: Usuario = {
        ...datos,
        id: `usr-${Date.now()}`,
        edad: calcularEdad(datos.fechaNacimiento),
      };
      setUsuarios((prev) => [...prev, nuevo]);
      return { ok: true, mensaje: "Usuario registrado con éxito." };
    },
    [correoEnUso, usuarioActivo, setUsuarios],
  );

  const actualizarUsuario = useCallback(
    (id: string, datos: DatosUsuario): RespuestaOperacion => {
      if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
        return {
          ok: false,
          mensaje: "Solo un administrador puede editar usuarios.",
        };
      }
      const actual = usuarios.find((u) => u.id === id);
      if (!actual) return { ok: false, mensaje: "El usuario no existe." };

      if (correoEnUso(datos.correo, id)) {
        return {
          ok: false,
          mensaje: "Ese correo electrónico ya pertenece a otro usuario.",
        };
      }

      if (datos.rol !== actual.rol) {
        if (id === usuarioActivo.id) {
          return { ok: false, mensaje: "No puedes cambiar tu propio rol." };
        }
        const totalAdmins = usuarios.filter(
          (u) => u.rol === "administrador",
        ).length;
        if (actual.rol === "administrador" && totalAdmins <= 1) {
          return {
            ok: false,
            mensaje: "Debe existir al menos un administrador en el sistema.",
          };
        }
      }

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, ...datos, edad: calcularEdad(datos.fechaNacimiento) }
            : u,
        ),
      );
      return { ok: true, mensaje: "Usuario actualizado correctamente." };
    },
    [usuarioActivo, usuarios, correoEnUso, setUsuarios],
  );

  const eliminarUsuario = useCallback(
    (id: string): RespuestaOperacion => {
      if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
        return {
          ok: false,
          mensaje: "Solo un administrador puede eliminar usuarios.",
        };
      }
      if (usuarioActivo.id === id) {
        return {
          ok: false,
          mensaje: "No puedes eliminar tu propia cuenta activa.",
        };
      }
      const objetivo = usuarios.find((u) => u.id === id);
      if (!objetivo) return { ok: false, mensaje: "El usuario no existe." };

      const totalAdmins = usuarios.filter(
        (u) => u.rol === "administrador",
      ).length;
      if (objetivo.rol === "administrador" && totalAdmins <= 1) {
        return {
          ok: false,
          mensaje: "Debe existir al menos un administrador en el sistema.",
        };
      }

      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      return { ok: true, mensaje: "Usuario eliminado." };
    },
    [usuarioActivo, usuarios, setUsuarios],
  );

  return {
    usuarios,
    usuarioActivo,
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
    registrarse,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPerfil,
  };
}
