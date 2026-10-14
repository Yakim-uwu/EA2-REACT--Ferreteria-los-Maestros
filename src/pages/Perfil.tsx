import React from "react";
import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";

export default function Perfil() {
  const { usuarioActivo } = useStore();

  if (!usuarioActivo) {
    return (
      <main className="container my-5 text-center py-5">
        <h3>No has iniciado sesión</h3>
        <p className="text-muted">
          Por favor inicia sesión para ver la información de tu perfil.
        </p>
        <Link to="/login" className="btn btn-warning mt-2 fw-bold">
          Iniciar Sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Mi Perfil 👤
      </h2>

      <div
        className="card shadow-sm p-4 border-secondary"
        style={{ maxWidth: "600px" }}
      >
        {/* Cabecera del Perfil */}
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div
            className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2"
            style={{ width: "65px", height: "65px", flexShrink: 0 }}
          >
            {usuarioActivo.nombreCompleto.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="mb-1 fw-bold">{usuarioActivo.nombreCompleto}</h4>
            <span className="badge bg-warning text-dark text-capitalize fw-bold">
              Rol: {usuarioActivo.rol}
            </span>
          </div>
        </div>

        {/* Detalles del Usuario */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="text-muted small d-block">
              Correo Electrónico
            </label>
            <span className="fw-semibold">{usuarioActivo.correo}</span>
          </div>

          <div className="col-md-6">
            <label className="text-muted small d-block">
              Fecha de Nacimiento
            </label>
            <span className="fw-semibold">
              {usuarioActivo.fechaNacimiento || "No especificada"}
            </span>
          </div>

          <div className="col-md-6">
            <label className="text-muted small d-block">Género</label>
            <span className="fw-semibold text-capitalize">
              {usuarioActivo.genero || "No especificado"}
            </span>
          </div>

          <div className="col-md-6">
            <label className="text-muted small d-block">Región</label>
            <span className="fw-semibold">
              {usuarioActivo.region || "No especificada"}
            </span>
          </div>

          <div className="col-12">
            <label className="text-muted small d-block">Dirección</label>
            <span className="fw-semibold">
              {usuarioActivo.direccion || "No especificada"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
