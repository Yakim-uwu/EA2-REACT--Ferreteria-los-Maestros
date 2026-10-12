import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { totalItems } = useStore();
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);
  const claseLink = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/" onClick={cerrar}>
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
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink end to="/" className={claseLink} onClick={cerrar}>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={claseLink} onClick={cerrar}>Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/registro" className={claseLink} onClick={cerrar}>Registro</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login" className={claseLink} onClick={cerrar}>Iniciar Sesión</NavLink>
            </li>
            <li className="nav-item ms-lg-2">
              <Link to="/carrito" className="btn btn-warning position-relative fw-bold" onClick={cerrar}>
                🛒 Carrito <span className="badge bg-danger rounded-pill">{totalItems}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
