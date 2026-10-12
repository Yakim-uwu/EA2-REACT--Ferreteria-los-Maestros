import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { clp, imgSrc, precioEfectivo } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Detalle() {
  const { id } = useParams();
  const { productos, agregarAlCarrito } = useStore();
  const prod = productos.find((p) => p.id === id);
  const [cantidad, setCantidad] = useState(1);
  const { alerta, mostrar } = useAlerta();

  if (!prod) {
    return (
      <main className="container my-5">
        <div className="card shadow-sm p-4">
          <div className="text-center py-5">
            <h4>Producto no encontrado.</h4>
            <Link to="/catalogo" className="btn btn-warning mt-2">Volver al catálogo</Link>
          </div>
        </div>
      </main>
    );
  }

  const agregar = () => {
    const qty = parseInt(cantidad, 10) || 1;
    const r = agregarAlCarrito(prod.id, qty);
    mostrar(r.mensaje, !r.ok);
  };

  const sinStock = prod.stock <= 0;

  return (
    <main className="container my-5">
      <div className="card shadow-sm p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <img
              src={imgSrc(prod.imagen)}
              alt={prod.nombre}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: 400, objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column">
            <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
              {prod.categoria}
            </span>
            <h2 className="fw-bold mb-2">{prod.nombre}</h2>
            <p className="text-muted mb-2">
              Marca: <strong>{prod.marca}</strong> ({prod.unidad})
            </p>

            <div className="mb-3">
              <span className="text-danger fw-bold fs-2">${clp(precioEfectivo(prod))}</span>
              {prod.precioOferta && (
                <del className="text-muted fs-5 ms-2">${clp(prod.precio)}</del>
              )}
            </div>

            <p className="mb-3"><strong>Stock Disponible:</strong> {prod.stock} unidades</p>
            <p className="text-secondary mb-4">{prod.descripcion}</p>

            <div className="row g-2 align-items-center mb-3">
              <div className="col-auto">
                <label htmlFor="cantidadInput" className="col-form-label fw-bold">Cantidad:</label>
              </div>
              <div className="col-auto">
                <input
                  type="number"
                  id="cantidadInput"
                  className="form-control"
                  min="1"
                  max={prod.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  style={{ width: 90 }}
                />
              </div>
            </div>

            <button className="btn btn-warning btn-lg fw-bold w-100" onClick={agregar} disabled={sinStock}>
              {sinStock ? "Sin Stock Disponible" : "🛒 Agregar al Carrito"}
            </button>

            <Alerta alerta={alerta} />
          </div>
        </div>
      </div>
    </main>
  );
}
