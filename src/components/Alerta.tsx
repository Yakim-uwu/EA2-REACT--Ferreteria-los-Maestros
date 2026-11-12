import React from "react";
import { TipoAlerta } from "../types";

interface AlertaProps {
  alerta: TipoAlerta | null;
  className?: string;
  /** Si es true la alerta queda fija en la parte inferior de la pantalla. */
  flotante?: boolean;
  /** Si se entrega, la alerta muestra un botón para cerrarla. */
  onCerrar?: () => void;
}

export default function Alerta({
  alerta,
  className,
  flotante = false,
  onCerrar,
}: AlertaProps) {
  if (!alerta) return null;

  const clases = className ?? (flotante ? "shadow-lg border border-2 mb-0" : "mt-3");
  const tipo = alerta.esError ? "alert-danger" : "alert-success";

  const contenido = (
    <div
      className={`alert ${tipo} ${onCerrar ? "alert-dismissible" : ""} ${clases}`}
      role="alert"
    >
      {alerta.mensaje}
      {onCerrar && (
        <button
          type="button"
          className="btn-close"
          aria-label="Cerrar"
          onClick={onCerrar}
        ></button>
      )}
    </div>
  );

  if (!flotante) return contenido;

  return (
    <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-3 alerta-flotante">
      {contenido}
    </div>
  );
}
