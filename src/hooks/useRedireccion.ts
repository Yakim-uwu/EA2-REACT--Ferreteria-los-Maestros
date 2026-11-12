import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/** Navega a una ruta tras un retardo y cancela el temporizador al desmontar el componente. */
export function useRedireccion() {
  const navigate = useNavigate();
  const temporizador = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (temporizador.current) window.clearTimeout(temporizador.current);
    };
  }, []);

  return useCallback(
    (ruta: string, retardoMs: number = 1500) => {
      if (temporizador.current) window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(
        () => navigate(ruta),
        retardoMs,
      );
    },
    [navigate],
  );
}
