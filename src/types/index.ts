// src/types/index.ts

// 1. Definición del tipo para los tres roles del sistema
export type RolUsuario = "administrador" | "vendedor" | "cliente";
export type GeneroUsuario =
  | "masculino"
  | "femenino"
  | "otro"
  | "prefiero_no_decir";
// 2. Interfaz principal de Usuario
export interface Usuario {
  id: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  correo: string;
  direccion: string;
  region: string;
  genero: GeneroUsuario;
  rol: RolUsuario; // Se reconoce correctamente
  avatar?: string;
  contrasena: string;
}

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

export interface ItemCarrito {
  idProducto: string;
  nombre: string;
  precioUnitario: number;
  imagen: string;
  cantidad: number;
}
