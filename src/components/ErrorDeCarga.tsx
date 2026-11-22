import React from "react";

interface ErrorDeCargaProps {
  mensaje: string;
  onReintentar: () => void;
}

/** Mensaje de error cuando falla una petición, con un botón para volver a intentar. */
export default function ErrorDeCarga({ mensaje, onReintentar }: ErrorDeCargaProps) {
  return (
    <div
      className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2"
      role="alert"
    >
      <span>{mensaje}</span>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={() => onReintentar()}
      >
        Reintentar
      </button>
    </div>
  );
}
