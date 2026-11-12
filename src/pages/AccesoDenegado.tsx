import React from "react";
import { Link } from "react-router-dom";

export default function AccesoDenegado() {
  return (
    <main className="container my-5 text-center py-5">
      <h1 className="display-1 fw-bold text-danger">403</h1>
      <h2 className="fw-bold mb-3">Acceso denegado</h2>
      <p className="text-muted mb-4">
        Tu perfil no tiene permisos para ver esta sección.
      </p>
      <Link to="/" className="btn btn-warning fw-bold px-4 py-2">
        Volver al Inicio 🏠
      </Link>
    </main>
  );
}
