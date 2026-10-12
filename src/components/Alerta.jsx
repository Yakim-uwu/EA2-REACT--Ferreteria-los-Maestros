import { useState } from "react";

/** Hook: { alerta, mostrar(mensaje, esError), limpiar } */
export function useAlerta() {
  const [alerta, setAlerta] = useState(null);
  const mostrar = (mensaje, esError = true) => setAlerta({ mensaje, esError });
  const limpiar = () => setAlerta(null);
  return { alerta, mostrar, limpiar };
}

export default function Alerta({ alerta, className = "mt-3" }) {
  if (!alerta) return null;
  return (
    <div className={`alert ${alerta.esError ? "alert-danger" : "alert-success"} ${className}`} role="alert">
      {alerta.mensaje}
    </div>
  );
}
