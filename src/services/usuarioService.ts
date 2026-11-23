import { api } from "../api/axiosConfig";
import { datosUsuarioARequest, usuarioDesdeApi } from "../api/mapeadores";
import { DatosUsuario, Usuario } from "../types";
import { UsuarioApi } from "../types/api";

export const usuarioService = {
  /** Datos del usuario con sesión (sirve para recuperar la sesión al recargar la página). */
  async obtenerMiPerfil(): Promise<Usuario> {
    const respuesta = await api.get<UsuarioApi>("/api/usuarios/yo");
    return usuarioDesdeApi(respuesta.data);
  },

  /** El usuario edita su propio perfil. El backend ignora cualquier intento de cambiar el rol. */
  async actualizarMiPerfil(datos: DatosUsuario): Promise<Usuario> {
    const respuesta = await api.put<UsuarioApi>(
      "/api/usuarios/yo",
      datosUsuarioARequest(datos, true),
    );
    return usuarioDesdeApi(respuesta.data);
  },
};
