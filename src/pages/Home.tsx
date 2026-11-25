import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito";
import { tieneOferta } from "../utils/format";
import ProductCard from "../components/ProductCard";
import Mapa from "../components/Mapa";
import FormularioContacto from "../components/FormularioContacto";
import Alerta from "../components/Alerta";
import CargandoDatos from "../components/CargandoDatos";
import ErrorDeCarga from "../components/ErrorDeCarga";
import TituloPagina from "../components/TituloPagina";

export default function Home() {
  const { productos, cargandoCatalogo, errorCatalogo, recargarCatalogo } =
    useStore();
  const { alerta, limpiar, agregar } = useAgregarAlCarrito();

  const destacados = useMemo(
    () => productos.filter(tieneOferta).slice(0, 4),
    [productos],
  );

  return (
    <main className="container my-4">
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-dark text-white rounded-3 shadow-sm text-center">
        <h1 className="display-5 fw-bold text-warning">
          ¡Bienvenido a Ferretería Los Maestros!
        </h1>
        <p className="col-md-10 fs-5 mx-auto text-light">
          Encuentra las mejores herramientas, materiales de construcción,
          pinturas y artículos de gasfitería al mejor precio.
        </p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold mt-2">
          Ver Catálogo Completo 🛠️
        </Link>
      </div>

      <Alerta alerta={alerta} flotante onCerrar={limpiar} />

      {/* Ofertas Destacadas */}
      <section className="mb-5">
        <TituloPagina>Ofertas Destacadas 🔥</TituloPagina>
        {cargandoCatalogo ? (
          <CargandoDatos mensaje="Cargando ofertas..." />
        ) : errorCatalogo ? (
          <ErrorDeCarga
            mensaje={errorCatalogo}
            onReintentar={recargarCatalogo}
          />
        ) : destacados.length === 0 ? (
          <p className="text-muted">Por ahora no hay ofertas disponibles.</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {destacados.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                variante="destacado"
                onAgregar={agregar}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-5">
        <TituloPagina>Quiénes Somos</TituloPagina>
        <div className="card shadow-sm p-4">
          <p className="card-text">
            <strong>Ferretería Los Maestros</strong> es una empresa dedicada a
            abastecer a maestros, constructoras y familias con productos de
            calidad comprobada para sus proyectos de edificación y remodelación.
          </p>
          <p className="card-text mb-0">
            Nuestro propósito es facilitar el acceso a insumos de ferretería con
            los mejores precios y una atención personalizada.
          </p>
        </div>
      </section>

      <section className="mb-5">
        <Mapa />
      </section>

      <section className="mb-5">
        <FormularioContacto />
      </section>
    </main>
  );
}
