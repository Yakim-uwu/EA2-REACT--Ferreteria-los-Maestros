import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { totalItems, usuarioActivo, cerrarSesion } = useStore();
  const [abierto, setAbierto] = useState<boolean>(false);

  const cerrar = () => setAbierto(false);

  const claseLink = ({ isActive }: { isActive: boolean }): string =>
    `nav-link${isActive ? " active" : ""}`;

  const handleCerrarSesion = () => {
    cerrarSesion();
    cerrar();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-warning"
          to="/"
          onClick={cerrar}
        >
          🔨 Ferretería Los Maestros
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Mostrar menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse${abierto ? " show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <NavLink end to="/" className={claseLink} onClick={cerrar}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={claseLink} onClick={cerrar}>
                Catálogo
              </NavLink>
            </li>

            {/* Opciones según si hay sesión iniciada y el rol del usuario */}
            {usuarioActivo ? (
              <>
                <li className="nav-item">
                  <NavLink to="/perfil" className={claseLink} onClick={cerrar}>
                    Mi Perfil
                  </NavLink>
                </li>

                {/* Opción exclusiva para Administrador */}
                {usuarioActivo.rol === "administrador" && (
                  <li className="nav-item">
                    <NavLink to="/admin" className={claseLink} onClick={cerrar}>
                      Panel Admin
                    </NavLink>
                  </li>
                )}

                {/* Opción exclusiva para Vendedor */}
                {usuarioActivo.rol === "vendedor" && (
                  <li className="nav-item">
                    <NavLink
                      to="/vendedor"
                      className={claseLink}
                      onClick={cerrar}
                    >
                      Gestión Ventas
                    </NavLink>
                  </li>
                )}

                <li className="nav-item ms-lg-2 my-2 my-lg-0 d-flex align-items-center gap-2">
                  <span className="badge bg-secondary text-capitalize px-2 py-1">
                    {usuarioActivo.rol}
                  </span>
                  <button
                    onClick={handleCerrarSesion}
                    className="btn btn-outline-light btn-sm"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/registro"
                    className={claseLink}
                    onClick={cerrar}
                  >
                    Registro
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className={claseLink} onClick={cerrar}>
                    Iniciar Sesión
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item ms-lg-2">
              <Link
                to="/carrito"
                className="btn btn-warning position-relative fw-bold"
                onClick={cerrar}
              >
                🛒 Carrito{" "}
                <span className="badge bg-danger rounded-pill ms-1">
                  {totalItems}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
