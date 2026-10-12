import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container my-5 text-center">
      <h2 className="fw-bold">Página no encontrada</h2>
      <p className="text-muted">La dirección que buscas no existe.</p>
      <Link to="/" className="btn btn-warning fw-bold">Volver al inicio</Link>
    </main>
  );
}
