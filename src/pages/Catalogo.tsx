import React, { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { categorias } from "../data/productos";
import { clp, precioEfectivo } from "../utils/format";
import ProductCard from "../components/ProductCard";
import Alerta, { useAlerta } from "../components/Alerta";
import { Producto } from "../types";

export default function Catalogo() {
  const { productos, agregarAlCarrito } = useStore();
  const [categoria, setCategoria] = useState<string>("TODAS");
  const [precioMax, setPrecioMax] = useState<number>(50000);
  const { alerta, mostrar } = useAlerta();

  // Filtrado de productos mediante map/filter tipados
  const filtrados = useMemo<Producto[]>(
    () =>
      productos.filter(
        (p) =>
          (categoria === "TODAS" || p.categoria === categoria) &&
          precioEfectivo(p) <= precioMax,
      ),
    [productos, categoria, precioMax],
  );

  const agregar = (id: string) => {
    const r = agregarAlCarrito(id, 1);
    mostrar(r.mensaje || "", !r.ok);
  };

  return (
    <main className="container my-4">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Catálogo de Productos
      </h2>

      {/* Filtros */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <label htmlFor="filterCat" className="form-label fw-bold">
              Categoría
            </label>
            <select
              id="filterCat"
              className="form-select"
              value={categoria}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCategoria(e.target.value)
              }
            >
              <option value="TODAS">Todas las Categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-7">
            <label htmlFor="filterPrice" className="form-label fw-bold">
              Precio Máximo: ${clp(precioMax)}
            </label>
            <input
              type="range"
              className="form-range"
              id="filterPrice"
              min="1000"
              max="50000"
              step="1000"
              value={precioMax}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrecioMax(Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      <Alerta alerta={alerta} className="" />

      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
        {filtrados.length === 0 ? (
          <div className="col-12">
            <p className="text-center text-muted py-4">
              No existen productos que coincidan con los filtros aplicados.
            </p>
          </div>
        ) : (
          filtrados.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              variante="catalogo"
              onAgregar={agregar}
            />
          ))
        )}
      </div>
    </main>
  );
}
