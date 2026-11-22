import React from "react";

interface CargandoDatosProps {
  mensaje?: string;
}

/** Indicador de carga (spinner de Bootstrap) mientras se espera la respuesta del backend. */
export default function CargandoDatos({ mensaje = "Cargando..." }: CargandoDatosProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center gap-3 py-4"
      role="status"
    >
      <div className="spinner-border text-warning" aria-hidden="true" />
      <span>{mensaje}</span>
    </div>
  );
}
