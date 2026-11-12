import { useCallback } from "react";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "./useAlerta";

/** Lógica compartida por Home, Catálogo y Detalle para agregar productos y avisar el resultado. */
export function useAgregarAlCarrito() {
  const { agregarAlCarrito } = useStore();
  const { alerta, mostrarRespuesta, limpiar } = useAlerta();

  const agregar = useCallback(
    (idProducto: string, cantidad: number = 1) => {
      mostrarRespuesta(agregarAlCarrito(idProducto, cantidad));
    },
    [agregarAlCarrito, mostrarRespuesta],
  );

  return { alerta, limpiar, agregar };
}
