import React, { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito";
import { FiltrosProductos } from "../types";
import {
  FILTROS_INICIALES,
  calcularPrecioTope,
  filtrarProductos,
} from "../utils/filtros";
import ProductCard from "../components/ProductCard";
import FiltrosCatalogo from "../components/FiltrosCatalogo";
import Alerta from "../components/Alerta";
import TituloPagina from "../components/TituloPagina";

export default function Catalogo() {
  const { productos, categorias } = useStore();
  const { alerta, limpiar, agregar } = useAgregarAlCarrito();

  // El tope del slider sale del producto más caro, no de un valor fijo
  const precioTope = useMemo(() => calcularPrecioTope(productos), [productos]);

  const [filtros, setFiltros] = useState<FiltrosProductos>(() =>
    FILTROS_INICIALES(precioTope),
  );

  // Si el catálogo cambia (p. ej. sube el precio máximo), el filtro nunca excede el tope
  const filtrosEfectivos = useMemo<FiltrosProductos>(
    () => ({ ...filtros, precioMax: Math.min(filtros.precioMax, precioTope) }),
    [filtros, precioTope],
  );

  const filtrados = useMemo(
    () => filtrarProductos(productos, filtrosEfectivos),
    [productos, filtrosEfectivos],
  );

  const actualizarFiltros = (cambios: Partial<FiltrosProductos>) =>
    setFiltros((prev) => ({ ...prev, ...cambios }));

  return (
    <main className="container my-4">
      <TituloPagina>Catálogo de Productos</TituloPagina>

      <FiltrosCatalogo
        filtros={filtrosEfectivos}
        categorias={categorias.map((c) => c.nombre)}
        precioTope={precioTope}
        totalResultados={filtrados.length}
        onChange={actualizarFiltros}
        onLimpiar={() => setFiltros(FILTROS_INICIALES(precioTope))}
      />

      <Alerta alerta={alerta} flotante onCerrar={limpiar} />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
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
