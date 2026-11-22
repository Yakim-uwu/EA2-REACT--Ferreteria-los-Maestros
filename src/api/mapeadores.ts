import { Categoria, Producto } from "../types";
import { CategoriaApi, ProductoApi } from "../types/api";

// Traducen las respuestas del backend a los tipos que usa el frontend.
// Diferencias: el backend usa ids numéricos (aquí son texto) y entrega la categoría como objeto.

const IMAGEN_POR_DEFECTO = "/IMG/taladro.jpg";

export const categoriaDesdeApi = (c: CategoriaApi): Categoria => ({
  id: String(c.id),
  nombre: c.nombre,
  descripcion: c.descripcion ?? undefined,
});

export const productoDesdeApi = (p: ProductoApi): Producto => ({
  id: String(p.id),
  nombre: p.nombre,
  descripcion: p.descripcion ?? undefined,
  precio: p.precio,
  precioOferta: p.precioOferta ?? undefined,
  stock: p.stock,
  categoria: p.categoria.nombre,
  categoriaId: String(p.categoria.id),
  imagen: p.imagen ?? IMAGEN_POR_DEFECTO,
});
