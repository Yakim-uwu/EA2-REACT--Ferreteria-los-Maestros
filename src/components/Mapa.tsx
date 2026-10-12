import React from "react";

interface MapaProps {
  titulo?: string;
  direccion?: string;
  horario?: string;
  telefono?: string;
}

export default function Mapa({
  titulo = "Nuestra Sucursal Principal",
  direccion = "Av. Concha y Toro 1234, Puente Alto, Región Metropolitana",
  horario = "Lunes a Viernes: 08:30 - 19:00 hrs | Sábados: 09:00 - 14:00 hrs",
  telefono = "+56 2 2345 6789",
}: MapaProps) {
  return (
    <div className="card shadow-sm p-4 my-4">
      <h3 className="fw-bold text-warning border-bottom border-warning border-2 pb-2 mb-3">
        📍 {titulo}
      </h3>
      <div className="row g-4 align-items-center">
        <div className="col-lg-5">
          <div className="mb-3">
            <h6 className="fw-bold mb-1">Dirección:</h6>
            <p className="text-muted mb-0">{direccion}</p>
          </div>
          <div className="mb-3">
            <h6 className="fw-bold mb-1">Horario de Atención:</h6>
            <p className="text-muted mb-0">{horario}</p>
          </div>
          <div className="mb-3">
            <h6 className="fw-bold mb-1">Teléfono de Contacto:</h6>
            <p className="text-muted mb-0">{telefono}</p>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
            <iframe
              title="Ubicación Ferretería Los Maestros"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.58287512345!2d-70.578!3d-33.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM2JzM2LjAiUyA3MMKwMzQnNDAuOCJX!5e0!3m2!1ses!2scl!4v1620000000000!5m2!1ses!2scl"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
