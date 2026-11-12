import { useCallback, useMemo } from "react";
import { DatosUsuario, RespuestaOperacion, Usuario } from "../types";
import { usuariosSemilla } from "../data/usuarios";
import { calcularEdad } from "../utils/format";
import { useLocalStorage } from "./useLocalStorage";

export interface RespuestaSesion extends RespuestaOperacion {
  usuario?: Usuario;
}

/** Usuarios, sesión activa y reglas de negocio de roles y permisos. */
export function useUsuarios() {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(
    "usuarios",
    usuariosSemilla,
  );
  // Solo se guarda el id de la sesión: el usuario activo se deriva de la lista,
  // así los cambios de rol o de perfil se reflejan de inmediato en los permisos.
  const [idActivo, setIdActivo] = useLocalStorage<string | null>(
    "idUsuarioActivo",
    null,
  );

  const usuarioActivo = useMemo<Usuario | null>(
    () => usuarios.find((u) => u.id === idActivo) ?? null,
    [usuarios, idActivo],
  );

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
    (correo: string, contrasena: string): RespuestaSesion => {
      const encontrado = usuarios.find(
        (u) =>
          u.correo.toLowerCase() === correo.trim().toLowerCase() &&
          u.contrasena === contrasena,
      );
      if (!encontrado) {
        return {
          ok: false,
          mensaje: "Credenciales incorrectas. Revisa el correo y la contraseña.",
        };
      }
      setIdActivo(encontrado.id);
      return {
        ok: true,
        mensaje: `¡Bienvenido/a ${encontrado.nombreCompleto}!`,
        usuario: encontrado,
      };
    },
    [usuarios, setIdActivo],
  );

  const cerrarSesion = useCallback(() => setIdActivo(null), [setIdActivo]);

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

  /** El usuario activo edita su propio perfil. El rol nunca se modifica desde aquí. */
  const actualizarPerfil = useCallback(
    (datos: Omit<DatosUsuario, "rol">): RespuestaOperacion => {
      if (!usuarioActivo) return { ok: false, mensaje: "No hay sesión activa." };
      if (correoEnUso(datos.correo, usuarioActivo.id)) {
        return {
          ok: false,
          mensaje: "Ese correo electrónico ya pertenece a otro usuario.",
        };
      }
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioActivo.id
            ? { ...u, ...datos, edad: calcularEdad(datos.fechaNacimiento) }
            : u,
        ),
      );
      return { ok: true, mensaje: "Perfil actualizado correctamente." };
    },
    [usuarioActivo, correoEnUso, setUsuarios],
  );

  return {
    usuarios,
    usuarioActivo,
    iniciarSesion,
    cerrarSesion,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPerfil,
  };
}
