import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import Mapa from "../components/Mapa";
import FormularioContacto from "../components/FormularioConctacto";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Home() {
  const { productos, agregarAlCarrito } = useStore();
  const { alerta, mostrar } = useAlerta();

  const destacados = useMemo(
    () =>
      productos.filter((p) => p.precioOferta && p.precioOferta > 0).slice(0, 4),
    [productos],
  );

  const agregar = (id: string) => {
    const r = agregarAlCarrito(id, 1);
    mostrar(r.mensaje || "", !r.ok);
  };

  return (
    <main className="container my-4">
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-dark text-white rounded-3 shadow-sm text-center">
        <h1 className="display-5 fw-bold text-warning">
          ¡Bienvenido a Ferretería Los Maestros!
        </h1>
        <p className="col-md-10 fs-5 mx-auto text-light">
          Encuentra las mejores herramientas, materiales de construcción,
          pinturas y artículos de gasitería al mejor precio.
        </p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold mt-2">
          Ver Catálogo Completo 🛠️
        </Link>
      </div>

      <Alerta alerta={alerta} />

      {/* Ofertas Destacadas */}
      <section className="mb-5">
        <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 my-4">
          Ofertas Destacadas 🔥
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {destacados.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              variante="destacado"
              onAgregar={agregar}
            />
          ))}
        </div>
      </section>

      {/* Mapa y Ubicación */}
      <section className="mb-5">
        <Mapa />
      </section>

      {/* Formulario de Contacto */}
      <section className="mb-5">
        <FormularioContacto />
      </section>
    </main>
  );
}
