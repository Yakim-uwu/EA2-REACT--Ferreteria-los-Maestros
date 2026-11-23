import { api } from "../api/axiosConfig";
import { categoriaARequest, categoriaDesdeApi } from "../api/mapeadores";
import { Categoria } from "../types";
import { CategoriaApi } from "../types/api";

export const categoriaService = {
  async obtenerTodas(): Promise<Categoria[]> {
    const respuesta = await api.get<CategoriaApi[]>("/api/categorias");
    return respuesta.data.map(categoriaDesdeApi);
  },

  /** Solo administrador. */
  async crear(categoria: Omit<Categoria, "id">): Promise<Categoria> {
    const respuesta = await api.post<CategoriaApi>(
      "/api/categorias",
      categoriaARequest(categoria),
    );
    return categoriaDesdeApi(respuesta.data);
  },

  /** Solo administrador. */
  async actualizar(id: string, categoria: Omit<Categoria, "id">): Promise<Categoria> {
    const respuesta = await api.put<CategoriaApi>(
      `/api/categorias/${id}`,
      categoriaARequest(categoria),
    );
    return categoriaDesdeApi(respuesta.data);
  },

  /** Solo administrador. El backend rechaza eliminar una categoría con productos. */
  async eliminar(id: string): Promise<void> {
    await api.delete(`/api/categorias/${id}`);
  },
};
