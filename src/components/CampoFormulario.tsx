import React from "react";

interface CampoFormularioProps {
  id: string;
  etiqueta: string;
  obligatorio?: boolean;
  error?: string;
  ayuda?: string;
  className?: string;
  /** Úsalo para grupos de radios/checkbox, donde la etiqueta no apunta a un único input. */
  grupo?: boolean;
  children: React.ReactNode;
}

/** Añade la clase `is-invalid` de Bootstrap cuando el campo tiene un error. */
export const claseControl = (base: string, error?: string): string =>
  error ? `${base} is-invalid` : base;

/** Envoltorio común de los campos: etiqueta, control y mensaje de error o ayuda. */
export default function CampoFormulario({
  id,
  etiqueta,
  obligatorio = false,
  error,
  ayuda,
  className = "",
  grupo = false,
  children,
}: CampoFormularioProps) {
  const contenidoEtiqueta = (
    <>
      {etiqueta}
      {obligatorio && <span className="text-danger"> *</span>}
    </>
  );

  return (
    <div className={className}>
      {grupo ? (
        <span className="form-label fw-semibold small d-block">
          {contenidoEtiqueta}
        </span>
      ) : (
        <label htmlFor={id} className="form-label fw-semibold small">
          {contenidoEtiqueta}
        </label>
      )}
      {children}
      {error ? (
        <div className="invalid-feedback d-block">{error}</div>
      ) : (
        ayuda && <small className="text-muted">{ayuda}</small>
      )}
    </div>
  );
}
