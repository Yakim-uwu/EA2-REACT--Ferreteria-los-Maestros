import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import Alerta, { useAlerta } from "../components/Alerta";

const TituloSeccion = ({ children }) => (
  <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">{children}</h2>
);

export default function Home() {
  const { productos, agregarAlCarrito } = useStore();
  const destacados = productos.slice(0, 3);
  const contacto = useAlerta();

  const agregar = (id) => {
    const r = agregarAlCarrito(id);
    if (!r.ok) alert(r.mensaje);
  };

  const enviarContacto = (e) => {
    e.preventDefault();
    contacto.mostrar("¡Gracias por contactarnos! Tu mensaje ha sido enviado.", false);
    e.target.reset();
  };

  return (
    <main className="container my-4">
      {/* Hero */}
      <section className="hero-banner text-center mb-5 shadow-sm">
        <h1 className="display-5 fw-bold">Los mejores materiales para tus proyectos</h1>
        <p className="lead">
          Herramientas, gasfitería, electricidad y materiales de construcción con garantía de calidad.
        </p>
        <Link to="/catalogo" className="btn btn-warning btn-lg fw-bold mt-2">
          Ver Catálogo Completo
        </Link>
      </section>

      {/* Destacados */}
      <section className="mb-5">
        <TituloSeccion>Productos Destacados</TituloSeccion>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {destacados.map((p) => (
            <ProductCard key={p.id} producto={p} variante="destacado" onAgregar={agregar} />
          ))}
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="mb-5">
        <TituloSeccion>Quiénes Somos</TituloSeccion>
        <div className="card shadow-sm p-4">
          <p className="card-text">
            <strong>Ferretería Los Maestros</strong> es una empresa dedicada a abastecer a maestros,
            constructoras y familias con productos de calidad comprobada para sus proyectos de
            edificación y remodelación.
          </p>
          <p className="card-text mb-0">
            Nuestro propósito es facilitar el acceso a insumos de ferretería con los mejores precios y
            una atención personalizada.
          </p>
        </div>
      </section>

      {/* Contacto */}
      <section className="mb-4">
        <TituloSeccion>Contáctanos</TituloSeccion>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm p-3">
              <h5 className="card-title fw-bold">Ubicación de la tienda</h5>
              <p className="card-text text-muted">
                Av. Concha y Toro 1340, Puente Alto, Región Metropolitana
              </p>
              <iframe
                title="Mapa de la tienda"
                src="https://maps.google.com/maps?q=Puente%20Alto%20Duoc&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-100 rounded"
                style={{ height: 280, border: 0 }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm p-4">
              <h5 className="card-title fw-bold mb-3">Envíanos una consulta</h5>
              <form onSubmit={enviarContacto}>
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows="3" required></textarea>
                </div>
                <button type="submit" className="btn btn-dark w-100 fw-bold">Enviar Mensaje</button>
                <Alerta alerta={contacto.alerta} />
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
