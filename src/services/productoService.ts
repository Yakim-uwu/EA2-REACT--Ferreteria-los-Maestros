import { api } from "../api/axiosConfig";
import { productoARequest, productoDesdeApi } from "../api/mapeadores";
import { Producto } from "../types";
import { ProductoApi } from "../types/api";

// Todo el acceso a datos de productos pasa por este servicio:
// los componentes no conocen axios ni las rutas del backend.
export const productoService = {
  async obtenerTodos(): Promise<Producto[]> {
    const respuesta = await api.get<ProductoApi[]>("/api/productos");
    return respuesta.data.map(productoDesdeApi);
  },

  /** Solo administrador. */
  async crear(producto: Omit<Producto, "id">, idCategoria: number): Promise<Producto> {
    const respuesta = await api.post<ProductoApi>(
      "/api/productos",
      productoARequest(producto, idCategoria),
    );
    return productoDesdeApi(respuesta.data);
  },

  /** Solo administrador. */
  async actualizar(
    id: string,
    producto: Omit<Producto, "id">,
    idCategoria: number,
  ): Promise<Producto> {
    const respuesta = await api.put<ProductoApi>(
      `/api/productos/${id}`,
      productoARequest(producto, idCategoria),
    );
    return productoDesdeApi(respuesta.data);
  },

  /** Administrador y vendedor. */
  async actualizarStock(id: string, stock: number): Promise<Producto> {
    const respuesta = await api.patch<ProductoApi>(`/api/productos/${id}/stock`, { stock });
    return productoDesdeApi(respuesta.data);
  },

  /** Solo administrador. */
  async eliminar(id: string): Promise<void> {
    await api.delete(`/api/productos/${id}`);
  },
};
