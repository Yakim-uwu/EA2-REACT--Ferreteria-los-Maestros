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

  /** Administrador ve todos; vendedor recibe solo clientes desde el backend. */
  async obtenerTodos(): Promise<Usuario[]> {
    const respuesta = await api.get<UsuarioApi[]>("/api/usuarios");
    return respuesta.data.map(usuarioDesdeApi);
  },

  /** Alta por administrador (cualquier rol) o vendedor (el backend fuerza rol cliente). */
  async crear(datos: DatosUsuario): Promise<Usuario> {
    const respuesta = await api.post<UsuarioApi>(
      "/api/usuarios",
      datosUsuarioARequest(datos, true),
    );
    return usuarioDesdeApi(respuesta.data);
  },

  /** Solo administrador: edita datos y rol. */
  async actualizar(id: string, datos: DatosUsuario): Promise<Usuario> {
    const respuesta = await api.put<UsuarioApi>(
      `/api/usuarios/${id}`,
      datosUsuarioARequest(datos, true),
    );
    return usuarioDesdeApi(respuesta.data);
  },

  /** Solo administrador: elimina un usuario. */
  async eliminar(id: string): Promise<void> {
    await api.delete(`/api/usuarios/${id}`);
  },
};
