import { RolUsuario } from "../types";

// Reglas de negocio de permisos, centralizadas en un solo lugar.

/** Roles que pueden finalizar una compra en la tienda. */
export const ROLES_QUE_COMPRAN: RolUsuario[] = ["cliente"];

export const ETIQUETA_ROL: Record<RolUsuario, string> = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};

export const puedeComprar = (rol?: RolUsuario): boolean =>
  rol === undefined || ROLES_QUE_COMPRAN.includes(rol);

/** Página a la que se envía a cada perfil después de iniciar sesión. */
export const rutaInicialPorRol = (rol: RolUsuario): string => {
  if (rol === "administrador") return "/admin";
  if (rol === "vendedor") return "/vendedor";
  return "/catalogo";
};
