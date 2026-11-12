import { useCallback, useEffect, useState } from "react";
import { RespuestaOperacion, TipoAlerta } from "../types";

/**
 * Estado de una alerta de Bootstrap.
 * Se oculta sola después de `duracionMs` (0 = permanece hasta que se cierre).
 */
export function useAlerta(duracionMs: number = 5000) {
  const [alerta, setAlerta] = useState<TipoAlerta | null>(null);

  const limpiar = useCallback(() => setAlerta(null), []);

  const mostrar = useCallback((mensaje: string, esError: boolean = true) => {
    setAlerta({ mensaje, esError });
  }, []);

  /** Muestra el mensaje de una RespuestaOperacion (si trae uno). */
  const mostrarRespuesta = useCallback((res: RespuestaOperacion) => {
    if (res.mensaje) setAlerta({ mensaje: res.mensaje, esError: !res.ok });
  }, []);

  useEffect(() => {
    if (!alerta || duracionMs <= 0) return;
    const temporizador = window.setTimeout(() => setAlerta(null), duracionMs);
    return () => window.clearTimeout(temporizador);
  }, [alerta, duracionMs]);

  return { alerta, mostrar, mostrarRespuesta, limpiar };
}
