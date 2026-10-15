import React, { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { clp, precioEfectivo } from "../utils/format";
import ProductCard from "../components/ProductCard";
import Alerta, { useAlerta } from "../components/Alerta";
import { Producto } from "../types";

export default function Catalogo() {
  const { productos, categorias, agregarAlCarrito } = useStore();
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("TODAS");
  const [precioMax, setPrecioMax] = useState<number>(50000);
  const { alerta, mostrar } = useAlerta();

  // Lista de categorías obtenida desde el contexto global
  const listaCategorias = useMemo(() => {
    if (categorias && categorias.length > 0) {
      return categorias.map((c) => c.nombre);
    }
    return Array.from(new Set(productos.map((p) => p.categoria))).filter(
      Boolean,
    );
  }, [categorias, productos]);

  // Filtrado flexible por nombre o id de categoría
  const filtrados = useMemo<Producto[]>(
    () =>
      productos.filter((p) => {
        const coincideCategoria =
          categoriaSeleccionada === "TODAS" ||
          p.categoria === categoriaSeleccionada ||
          p.categoriaId === categoriaSeleccionada;

        const coincidePrecio = precioEfectivo(p) <= precioMax;

        return coincideCategoria && coincidePrecio;
      }),
    [productos, categoriaSeleccionada, precioMax],
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
              value={categoriaSeleccionada}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCategoriaSeleccionada(e.target.value)
              }
            >
              <option value="TODAS">Todas las Categorías</option>
              {listaCategorias.map((catNombre) => (
                <option key={catNombre} value={catNombre}>
                  {catNombre}
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

      {/* 🔔 Alerta Flotante Fija (Siempre visible al hacer scroll) */}
      <div
        className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-3"
        style={{ zIndex: 1100, maxWidth: "600px", width: "90%" }}
      >
        <Alerta alerta={alerta} className="shadow-lg border border-2 mb-0" />
      </div>

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
