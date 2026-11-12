import React, { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { Producto } from "../types";
import { clp } from "../utils/format";
import Alerta from "./Alerta";
import InputCantidad from "./InputCantidad";

const colorStock = (stock: number): string => {
  if (stock <= 5) return "bg-danger";
  if (stock <= 10) return "bg-warning text-dark";
  return "bg-success";
};

/** Consulta y actualización de stock (vendedor). */
export default function PanelStock() {
  const { productos, modificarStockProducto } = useStore();
  const { alerta, mostrar, mostrarRespuesta, limpiar } = useAlerta();
  const [busqueda, setBusqueda] = useState<string>("");

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        texto === "" ||
        `${p.nombre} ${p.categoria}`.toLowerCase().includes(texto),
    );
  }, [productos, busqueda]);

  const cambiarStock = (p: Producto, valor: string) => {
    const numero = Number(valor);
    if (valor.trim() === "" || !Number.isInteger(numero) || numero < 0) {
      mostrar("El stock debe ser un número entero igual o mayor a 0.");
      return;
    }
    const res = modificarStockProducto(p.id, numero);
    if (res.ok) {
      mostrar(`Stock de "${p.nombre}" actualizado a ${numero} unidades.`, false);
    } else {
      mostrarRespuesta(res);
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h5 className="fw-bold mb-3">Consulta y Actualización de Stock</h5>
      <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />

      <input
        type="search"
        className="form-control form-control-sm mb-3"
        placeholder="Buscar por nombre o categoría..."
        aria-label="Buscar productos"
        value={busqueda}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBusqueda(e.target.value)
        }
      />

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock (Enter o salir del campo para guardar)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-3">
                  No hay productos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              visibles.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="fw-semibold">{p.nombre}</span>
                    <br />
                    <small className="text-muted">{p.categoria}</small>
                  </td>
                  <td>${clp(p.precio)}</td>
                  <td>
                    <InputCantidad
                      valor={p.stock}
                      min={0}
                      ancho={90}
                      etiqueta={`Stock de ${p.nombre}`}
                      onConfirmar={(v) => cambiarStock(p, v)}
                    />
                  </td>
                  <td>
                    <span className={`badge ${colorStock(p.stock)}`}>
                      {p.stock <= 0 ? "Agotado" : p.stock <= 5 ? "Stock crítico" : p.stock <= 10 ? "Stock bajo" : "Disponible"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
