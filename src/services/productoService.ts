import { api } from "../api/axiosConfig";
import { productoDesdeApi } from "../api/mapeadores";
import { Producto } from "../types";
import { ProductoApi } from "../types/api";

// Todo el acceso a datos de productos pasa por este servicio:
// los componentes no conocen axios ni las rutas del backend.
export const productoService = {
  async obtenerTodos(): Promise<Producto[]> {
    const respuesta = await api.get<ProductoApi[]>("/api/productos");
    return respuesta.data.map(productoDesdeApi);
  },
};
