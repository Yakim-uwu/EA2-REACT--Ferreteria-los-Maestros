import React, { createContext, useContext } from "react";
import { useCatalogo } from "../hooks/useCatalogo";
import { useUsuarios } from "../hooks/useUsuarios";
import { useCarrito } from "../hooks/useCarrito";

// El store se compone de tres hooks con responsabilidades separadas:
//   useCatalogo  -> productos y categorías
//   useUsuarios  -> usuarios, sesión, roles y permisos
//   useCarrito   -> carrito y pedidos
type StoreContextType = ReturnType<typeof useCatalogo> &
  ReturnType<typeof useUsuarios> &
  ReturnType<typeof useCarrito>;

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const catalogo = useCatalogo();
  const sesion = useUsuarios();
  const compras = useCarrito({
    productos: catalogo.productos,
    catalogoCargado:
      !catalogo.cargandoCatalogo && catalogo.errorCatalogo === null,
    usuarioActivo: sesion.usuarioActivo,
    refrescarCatalogo: catalogo.refrescarCatalogo,
  });

  const value: StoreContextType = { ...catalogo, ...sesion, ...compras };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error("useStore debe usarse dentro de un <StoreProvider>");
  return ctx;
}
