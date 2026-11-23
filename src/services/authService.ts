import { api } from "../api/axiosConfig";
import { datosUsuarioARequest, usuarioDesdeApi } from "../api/mapeadores";
import { DatosUsuario, Usuario } from "../types";
import { AuthApi, UsuarioApi } from "../types/api";
import { guardarTokens } from "../utils/tokens";

export const authService = {
  /** Inicia sesión: guarda los tokens JWT y devuelve los datos del usuario. */
  async login(correo: string, contrasena: string): Promise<Usuario> {
    const respuesta = await api.post<AuthApi>("/api/auth/login", {
      correo: correo.trim(),
      contrasena,
    });
    guardarTokens({
      accessToken: respuesta.data.accessToken,
      refreshToken: respuesta.data.refreshToken,
    });
    return usuarioDesdeApi(respuesta.data.usuario);
  },

  /** Registro público: el backend siempre crea la cuenta con rol cliente. */
  async registrar(datos: DatosUsuario): Promise<void> {
    // El formulario de registro ya exigió aceptar los términos antes de llegar aquí
    await api.post<UsuarioApi>("/api/auth/registro", datosUsuarioARequest(datos, true));
  },
};
