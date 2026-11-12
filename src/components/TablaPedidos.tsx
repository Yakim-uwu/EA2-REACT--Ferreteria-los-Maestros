import React from "react";
import { Pedido } from "../types";
import { clp, formatearFecha } from "../utils/format";

interface TablaPedidosProps {
  pedidos: Pedido[];
  mostrarCliente?: boolean;
  mensajeVacio?: string;
}

export default function TablaPedidos({
  pedidos,
  mostrarCliente = false,
  mensajeVacio = "Aún no hay compras registradas.",
}: TablaPedidosProps) {
  if (pedidos.length === 0) {
    return <p className="text-muted text-center py-3 mb-0">{mensajeVacio}</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Fecha</th>
            {mostrarCliente && <th>Cliente</th>}
            <th>Detalle</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td className="text-nowrap small">{formatearFecha(pedido.fecha)}</td>
              {mostrarCliente && <td>{pedido.nombreCliente}</td>}
              <td>
                <ul className="list-unstyled mb-0 small">
                  {pedido.items.map((item) => (
                    <li key={item.idProducto}>
                      {item.cantidad} × {item.nombre}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="text-end fw-bold">${clp(pedido.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
