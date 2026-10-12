import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container my-5 text-center py-5">
      <h1 className="display-1 fw-bold text-warning">404</h1>
      <h2 className="fw-bold mb-3">Página no encontrada</h2>
      <p className="text-muted mb-4">
        La sección que estás buscando no existe o no dispones de los permisos
        requeridos.
      </p>
      <Link to="/" className="btn btn-warning fw-bold px-4 py-2">
        Volver al Inicio 🏠
      </Link>
    </main>
  );
}
