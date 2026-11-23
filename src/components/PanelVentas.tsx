import React, { useEffect } from "react";
import { useStore } from "../context/StoreContext";
import TablaPedidos from "./TablaPedidos";

export default function PanelVentas() {
  const { pedidos, recargarPedidos } = useStore();
  const totalVendido = pedidos.reduce((suma, p) => suma + p.total, 0);

  useEffect(() => {
    void recargarPedidos();
  }, [recargarPedidos]);

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold mb-0">Ventas realizadas</h5>
        <span className="badge bg-dark fs-6">
          {pedidos.length} venta(s) · ${totalVendido.toLocaleString("es-CL")}
        </span>
      </div>
      <TablaPedidos
        pedidos={pedidos}
        mostrarCliente
        mensajeVacio="Todavía no se registran ventas."
      />
    </div>
  );
}
