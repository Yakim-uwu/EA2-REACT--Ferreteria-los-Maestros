import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { RolUsuario } from "../types";
import CargandoDatos from "./CargandoDatos";

interface RutaProtegidaProps {
  /** Roles autorizados. Si se omite, basta con haber iniciado sesión. */
  roles?: RolUsuario[];
}

/** Ruta de layout: solo renderiza sus rutas hijas si el usuario tiene sesión y el rol requerido. */
export default function RutaProtegida({ roles }: RutaProtegidaProps) {
  const { usuarioActivo, cargandoSesion } = useStore();
  const location = useLocation();

  // Al recargar la página la sesión se verifica con el backend: se espera antes de decidir,
  // para no mandar al login a un usuario que sí tiene sesión.
  if (cargandoSesion) {
    return <CargandoDatos mensaje="Verificando sesión..." />;
  }
  if (!usuarioActivo) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (roles && !roles.includes(usuarioActivo.rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }
  return <Outlet />;
}
