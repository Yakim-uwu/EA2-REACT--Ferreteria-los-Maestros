import React from "react";
import { Link } from "react-router-dom";
import { clp, imgSrc, precioEfectivo, tieneOferta } from "../utils/format";
import { Producto } from "../types";

interface ProductCardProps {
  producto: Producto;
  variante?: "destacado" | "catalogo";
  onAgregar: (id: string) => void;
}

export default function ProductCard({
  producto: p,
  variante = "catalogo",
  onAgregar,
}: ProductCardProps) {
  const esCatalogo = variante === "catalogo";
  const agotado = p.stock <= 0;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm product-card">
        <img
          src={imgSrc(p.imagen)}
          className="card-img-top product-img"
          alt={p.nombre}
        />
        <div className="card-body d-flex flex-column">
          <span
            className="badge bg-secondary mb-2"
            style={{ width: "fit-content" }}
          >
            {p.categoria}
          </span>
          <h5 className="card-title h6 fw-bold">{p.nombre}</h5>

          {esCatalogo ? (
            <>
              <p className="card-text text-danger fw-bold fs-5 mb-1">
                ${clp(precioEfectivo(p))}
                {tieneOferta(p) && (
                  <del className="text-muted fs-6 ms-1">${clp(p.precio)}</del>
                )}
              </p>
              <small className="text-muted mb-3">
                Stock: {p.stock} unidades
              </small>
            </>
          ) : (
            <p className="card-text text-danger fw-bold fs-5 mt-auto">
              ${clp(precioEfectivo(p))}
            </p>
          )}

          <div className={`d-flex gap-2${esCatalogo ? " mt-auto" : ""}`}>
            <Link
              to={`/detalle/${p.id}`}
              className="btn btn-outline-dark btn-sm flex-fill"
            >
              {esCatalogo ? "Detalle" : "Ver Detalle"}
            </Link>
            <button
              type="button"
              onClick={() => onAgregar(p.id)}
              className="btn btn-warning btn-sm"
              disabled={agotado}
              aria-label={`Agregar ${p.nombre} al carrito`}
            >
              {agotado ? "Agotado" : "🛒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
