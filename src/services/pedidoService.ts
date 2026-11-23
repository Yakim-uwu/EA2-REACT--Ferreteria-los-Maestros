import { api } from "../api/axiosConfig";
import { carritoAPedidoRequest, pedidoDesdeApi } from "../api/mapeadores";
import { ItemCarrito, Pedido } from "../types";
import { PedidoApi } from "../types/api";

export const pedidoService = {
  /** Solo clientes: registra la compra y descuenta el stock en MySQL. */
  async crear(items: ItemCarrito[]): Promise<Pedido> {
    const respuesta = await api.post<PedidoApi>(
      "/api/pedidos",
      carritoAPedidoRequest(items),
    );
    return pedidoDesdeApi(respuesta.data);
  },

  /** Solo clientes: historial "Mis Compras". */
  async obtenerMisPedidos(): Promise<Pedido[]> {
    const respuesta = await api.get<PedidoApi[]>("/api/pedidos/mis");
    return respuesta.data.map(pedidoDesdeApi);
  },

  /** Administrador y vendedor: listado global de ventas. */
  async obtenerTodos(): Promise<Pedido[]> {
    const respuesta = await api.get<PedidoApi[]>("/api/pedidos");
    return respuesta.data.map(pedidoDesdeApi);
  },
};
