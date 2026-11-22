import { api } from "../api/axiosConfig";
import { categoriaDesdeApi } from "../api/mapeadores";
import { Categoria } from "../types";
import { CategoriaApi } from "../types/api";

export const categoriaService = {
  async obtenerTodas(): Promise<Categoria[]> {
    const respuesta = await api.get<CategoriaApi[]>("/api/categorias");
    return respuesta.data.map(categoriaDesdeApi);
  },
};
