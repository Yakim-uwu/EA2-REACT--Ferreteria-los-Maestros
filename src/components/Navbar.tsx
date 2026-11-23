import React, { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { ETIQUETA_ROL, puedeComprar } from "../utils/permisos";

const claseEnlace = ({ isActive }: { isActive: boolean }): string =>
  `nav-link ${isActive ? "active text-warning fw-bold" : ""}`;

interface EnlaceNavProps {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}

function EnlaceNav({ to, end, children }: EnlaceNavProps) {
  return (
    <li className="nav-item">
      <NavLink to={to} end={end} className={claseEnlace}>
        {children}
      </NavLink>
    </li>
  );
}

export default function Navbar() {
  const { usuarioActivo, totalItems, cerrarSesion, cargandoSesion } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // En móvil, el menú colapsable se cierra al navegar a otra página
  useEffect(() => {
    document.getElementById("navbarContent")?.classList.remove("show");
  }, [pathname]);

  const mostrarCarrito = puedeComprar(usuarioActivo?.rol);

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-warning border-3 shadow-sm">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold text-warning d-flex align-items-center gap-2"
        >
          <span>🔨</span> Ferretería Los Maestros
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Mostrar u ocultar la navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <EnlaceNav to="/" end>
              Inicio
            </EnlaceNav>
            <EnlaceNav to="/catalogo">Catálogo</EnlaceNav>

            {/* Enlaces visibles solo para el rol que corresponde */}
            {usuarioActivo?.rol === "administrador" && (
              <EnlaceNav to="/admin">⚙️ Panel Admin</EnlaceNav>
            )}
            {(usuarioActivo?.rol === "vendedor" ||
              usuarioActivo?.rol === "administrador") && (
              <EnlaceNav to="/vendedor">📦 Gestión Ventas</EnlaceNav>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {mostrarCarrito && (
              <Link
                to="/carrito"
                className="btn btn-outline-warning position-relative me-2"
              >
                🛒 Carrito
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {cargandoSesion ? (
              <div
                className="spinner-border spinner-border-sm text-warning"
                role="status"
                aria-label="Verificando sesión"
              />
            ) : usuarioActivo ? (
              <div className="dropdown">
                <button
                  className="btn btn-warning dropdown-toggle fw-bold"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  👤 {usuarioActivo.nombreCompleto.split(" ")[0]} (
                  {ETIQUETA_ROL[usuarioActivo.rol]})
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <Link to="/perfil" className="dropdown-item">
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleCerrarSesion}
                      className="dropdown-item text-danger fw-bold"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm fw-semibold"
                >
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-warning btn-sm fw-bold">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
