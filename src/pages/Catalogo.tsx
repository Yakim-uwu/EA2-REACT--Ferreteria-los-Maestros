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
import CargandoDatos from "../components/CargandoDatos";
import ErrorDeCarga from "../components/ErrorDeCarga";
import TituloPagina from "../components/TituloPagina";

export default function Catalogo() {
  const { productos, categorias, cargandoCatalogo, errorCatalogo, recargarCatalogo } =
    useStore();
  const { alerta, limpiar, agregar } = useAgregarAlCarrito();

  // El tope del slider sale del producto más caro, que llega desde el backend
  const precioTope = useMemo(() => calcularPrecioTope(productos), [productos]);

  const [filtros, setFiltros] = useState<FiltrosProductos>(() => FILTROS_INICIALES(0));
  // null = sin límite: el máximo acompaña al producto más caro aunque el catálogo tarde en cargar
  const [precioElegido, setPrecioElegido] = useState<number | null>(null);

  const filtrosEfectivos = useMemo<FiltrosProductos>(
    () => ({
      ...filtros,
      precioMax: Math.min(precioElegido ?? precioTope, precioTope),
    }),
    [filtros, precioElegido, precioTope],
  );

  const filtrados = useMemo(
    () => filtrarProductos(productos, filtrosEfectivos),
    [productos, filtrosEfectivos],
  );

  const actualizarFiltros = (cambios: Partial<FiltrosProductos>) => {
    const { precioMax, ...resto } = cambios;
    if (precioMax !== undefined) setPrecioElegido(precioMax);
    setFiltros((prev) => ({ ...prev, ...resto }));
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES(0));
    setPrecioElegido(null);
  };

  return (
    <main className="container my-4">
      <TituloPagina>Catálogo de Productos</TituloPagina>

      {cargandoCatalogo ? (
        <CargandoDatos mensaje="Cargando productos..." />
      ) : errorCatalogo ? (
        <ErrorDeCarga mensaje={errorCatalogo} onReintentar={recargarCatalogo} />
      ) : (
        <>
          <FiltrosCatalogo
            filtros={filtrosEfectivos}
            categorias={categorias.map((c) => c.nombre)}
            precioTope={precioTope}
            totalResultados={filtrados.length}
            onChange={actualizarFiltros}
            onLimpiar={limpiarFiltros}
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
        </>
      )}
    </main>
  );
}
