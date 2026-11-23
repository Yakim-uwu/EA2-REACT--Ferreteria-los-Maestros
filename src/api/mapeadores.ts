import {
  Categoria,
  DatosUsuario,
  GeneroUsuario,
  ItemCarrito,
  Pedido,
  Producto,
  RolUsuario,
  Usuario,
} from "../types";
import {
  CategoriaApi,
  CategoriaRequestApi,
  PedidoApi,
  PedidoRequestApi,
  ProductoApi,
  ProductoRequestApi,
  UsuarioApi,
  UsuarioRequestApi,
} from "../types/api";

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

const ROLES: RolUsuario[] = ["administrador", "vendedor", "cliente"];
const GENEROS: GeneroUsuario[] = [
  "masculino",
  "femenino",
  "otro",
  "prefiero_no_decir",
];

export const usuarioDesdeApi = (u: UsuarioApi): Usuario => ({
  id: String(u.id),
  nombreCompleto: u.nombreCompleto,
  fechaNacimiento: u.fechaNacimiento,
  edad: u.edad,
  correo: u.correo,
  direccion: u.direccion,
  region: u.region,
  genero: GENEROS.includes(u.genero as GeneroUsuario)
    ? (u.genero as GeneroUsuario)
    : "prefiero_no_decir",
  // Si llegara un rol desconocido se asume el de menor privilegio
  rol: ROLES.includes(u.rol as RolUsuario) ? (u.rol as RolUsuario) : "cliente",
});

export const datosUsuarioARequest = (
  d: DatosUsuario,
  aceptaTerminos: boolean,
): UsuarioRequestApi => ({
  nombreCompleto: d.nombreCompleto,
  fechaNacimiento: d.fechaNacimiento,
  correo: d.correo,
  direccion: d.direccion,
  region: d.region,
  genero: d.genero,
  rol: d.rol,
  contrasena: d.contrasena ?? "",
  aceptaTerminos,
});

export const productoARequest = (
  p: Omit<Producto, "id">,
  idCategoria: number,
): ProductoRequestApi => ({
  nombre: p.nombre,
  descripcion: p.descripcion ?? "",
  precio: p.precio,
  precioOferta: p.precioOferta ?? null,
  stock: p.stock,
  imagen: p.imagen,
  categoria: { id: idCategoria },
});

export const categoriaARequest = (
  c: Omit<Categoria, "id">,
): CategoriaRequestApi => ({
  nombre: c.nombre,
  descripcion: c.descripcion ?? "",
});
export const pedidoDesdeApi = (p: PedidoApi): Pedido => ({
  id: String(p.id),
  fecha: p.fecha,
  idCliente: String(p.clienteId),
  nombreCliente: p.clienteNombre,
  total: p.total,
  items: p.items.map((item) => ({
    idProducto: String(item.productoId),
    nombre: item.nombre,
    precioUnitario: item.precioUnitario,
    cantidad: item.cantidad,
    imagen: IMAGEN_POR_DEFECTO,
  })),
});

export const carritoAPedidoRequest = (
  items: ItemCarrito[],
): PedidoRequestApi => ({
  items: items.map((item) => ({
    productoId: Number(item.idProducto),
    cantidad: item.cantidad,
  })),
});
