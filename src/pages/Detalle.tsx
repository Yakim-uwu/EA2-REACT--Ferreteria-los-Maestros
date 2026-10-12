import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { clp, imgSrc, precioEfectivo } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Detalle() {
  const { id } = useParams<{ id: string }>();
  const { productos, agregarAlCarrito } = useStore();
  const [cantidad, setCantidad] = useState<number>(1);
  const { alerta, mostrar } = useAlerta();

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted">Producto no encontrado 🔍</h3>
        <p>El producto seleccionado no existe o fue eliminado.</p>
        <Link to="/catalogo" className="btn btn-warning fw-bold">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const handleAgregar = () => {
    const r = agregarAlCarrito(producto.id, cantidad);
    mostrar(r.mensaje || "", !r.ok);
  };

  return (
    <main className="container my-5">
      <Link to="/catalogo" className="btn btn-outline-secondary mb-4">
        ← Volver al Catálogo
      </Link>

      <Alerta alerta={alerta} />

      <div className="card shadow-sm p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center">
            <img
              src={imgSrc(producto.imagen)}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: "350px", objectFit: "contain" }}
            />
          </div>
          <div className="col-md-6">
            <span className="badge bg-secondary mb-2">
              {producto.categoria}
            </span>
            <h2 className="fw-bold">{producto.nombre}</h2>
            <p className="text-muted fs-5">{producto.descripcion}</p>

            <div className="my-3">
              <span className="text-danger fw-bold fs-3 me-2">
                ${clp(precioEfectivo(producto))}
              </span>
              {producto.precioOferta && (
                <del className="text-muted fs-5">${clp(producto.precio)}</del>
              )}
            </div>

            <p className="mb-3">
              <strong>Stock disponible:</strong>{" "}
              <span
                className={
                  producto.stock > 0
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {producto.stock > 0 ? `${producto.stock} unidades` : "Agotado"}
              </span>
            </p>

            {producto.stock > 0 && (
              <div className="d-flex align-items-center gap-3 my-4">
                <label htmlFor="cantSelect" className="fw-bold">
                  Cantidad:
                </label>
                <input
                  id="cantSelect"
                  type="number"
                  min="1"
                  max={producto.stock}
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Math.max(1, Number(e.target.value)))
                  }
                  className="form-control"
                  style={{ width: "90px" }}
                />
                <button
                  onClick={handleAgregar}
                  className="btn btn-warning fw-bold px-4"
                >
                  🛒 Agregar al Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
