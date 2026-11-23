// src/types/index.ts
// Tipos e interfaces compartidos por toda la aplicación.

// --- Usuarios y roles ---
export type RolUsuario = "administrador" | "vendedor" | "cliente";

export type GeneroUsuario =
  | "masculino"
  | "femenino"
  | "otro"
  | "prefiero_no_decir";

export interface Usuario {
  id: string;
  nombreCompleto: string;
  fechaNacimiento: string; // formato ISO yyyy-mm-dd
  edad: number; // derivada de fechaNacimiento (calcularEdad)
  correo: string;
  direccion: string;
  region: string;
  genero: GeneroUsuario;
  rol: RolUsuario;
  avatar?: string;
  /** Solo existe en los datos locales de ejemplo; el backend nunca envía la contraseña. */
  contrasena?: string;
}

/** Datos que entrega un formulario para crear o editar un usuario. */
export type DatosUsuario = Omit<Usuario, "id" | "edad">;

// --- Catálogo ---
export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  categoria: string;
  categoriaId?: string;
  imagen: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

// --- Compras ---
export interface ItemCarrito {
  idProducto: string;
  nombre: string;
  precioUnitario: number;
  imagen: string;
  cantidad: number;
}

export interface Pedido {
  id: string;
  fecha: string; // ISO 8601
  idCliente: string;
  nombreCliente: string;
  items: ItemCarrito[];
  total: number;
}

// --- Filtros del catálogo ---
export type OrdenProductos =
  | "relevancia"
  | "precio_asc"
  | "precio_desc"
  | "nombre";

export interface FiltrosProductos {
  texto: string;
  categoria: string; // "TODAS" o nombre de la categoría
  precioMax: number;
  soloOfertas: boolean;
  orden: OrdenProductos;
}

// --- Utilidades transversales ---
/** Resultado estándar de las operaciones del store. */
export interface RespuestaOperacion {
  ok: boolean;
  mensaje: string | null;
}

export interface TipoAlerta {
  mensaje: string;
  esError: boolean;
}
