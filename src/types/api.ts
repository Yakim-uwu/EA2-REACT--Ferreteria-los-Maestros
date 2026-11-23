// Tipos que describen las respuestas JSON del backend (Spring Boot).
// Son distintos de los tipos internos del frontend (src/types/index.ts):
// el backend usa ids numéricos y el frontend los maneja como texto.

export interface UsuarioApi {
  id: number;
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  correo: string;
  direccion: string;
  region: string;
  genero: string;
  rol: string;
}

/** Cuerpo que recibe el backend para registrar o editar un usuario. */
export interface UsuarioRequestApi {
  nombreCompleto: string;
  fechaNacimiento: string;
  correo: string;
  direccion: string;
  region: string;
  genero: string;
  rol?: string;
  contrasena?: string;
  aceptaTerminos: boolean;
}

export interface AuthApi {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // segundos de vida del access token
  usuario: UsuarioApi;
}

export interface CategoriaApi {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface ProductoApi {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  precioOferta?: number | null;
  stock: number;
  imagen?: string | null;
  categoria: CategoriaApi;
}

export interface ItemPedidoApi {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export interface PedidoApi {
  id: number;
  fecha: string;
  clienteId: number;
  clienteNombre: string;
  total: number;
  items: ItemPedidoApi[];
}

/** Formato de error que devuelve el backend. */
export interface ErrorApi {
  status: number;
  error: string;
  mensaje: string;
  detalles?: Record<string, string> | null;
  timestamp: string;
}
