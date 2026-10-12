import React, { useState } from "react";

export interface TipoAlerta {
  mensaje: string;
  esError: boolean;
}

/** Hook: { alerta, mostrar(mensaje, esError), limpiar } */
export function useAlerta() {
  const [alerta, setAlerta] = useState<TipoAlerta | null>(null);

  const mostrar = (mensaje: string, esError: boolean = true) => {
    setAlerta({ mensaje, esError });
  };

  const limpiar = () => setAlerta(null);

  return { alerta, mostrar, limpiar };
}

interface AlertaProps {
  alerta: TipoAlerta | null;
  className?: string;
}

export default function Alerta({ alerta, className = "mt-3" }: AlertaProps) {
  if (!alerta) return null;

  return (
    <div
      className={`alert ${alerta.esError ? "alert-danger" : "alert-success"} ${className}`}
      role="alert"
    >
      {alerta.mensaje}
    </div>
  );
}
