import { useEffect, useState } from "react";
import { leer, guardar } from "../utils/storage";

/** useState que se inicializa desde localStorage y se sincroniza en cada cambio. */
export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => leer<T>(clave, valorInicial));

  useEffect(() => {
    guardar(clave, valor);
  }, [clave, valor]);

  return [valor, setValor] as const;
}
