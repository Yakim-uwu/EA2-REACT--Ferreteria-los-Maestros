import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { RolUsuario, Usuario } from "../types";

export default function Navbar() {
  const {
    usuarioActivo,
    setUsuarioActivo,
    carrito,
    cerrarSesion,
    usuarios,
    registrarUsuario,
  } = useStore();
  const navigate = useNavigate();

  const totalItemsCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );

  const handleCambiarRolRapido = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seleccion = e.target.value;

    if (seleccion === "invitado") {
      cerrarSesion();
      navigate("/");
      return;
    }

    const rolDeseado = seleccion as RolUsuario;

    // 1. Buscar si ya existe un usuario registrado con ese rol
    let usuarioExistente = usuarios.find((u) => u.rol === rolDeseado);

    // 2. Si no existe en LocalStorage, lo creamos automáticamente
    if (!usuarioExistente) {
      const nuevosUsuariosDemo: Record<
        RolUsuario,
        Omit<Usuario, "id" | "edad">
      > = {
        administrador: {
          nombreCompleto: "Carlos Administrador",
          fechaNacimiento: "1990-05-15",
          correo: "admin@ferreteria.cl",
          direccion: "Av. Central 123",
          region: "Metropolitana",
          genero: "masculino",
          rol: "administrador",
          contrasena: "123456",
        },
        vendedor: {
          nombreCompleto: "Valeria Vendedora",
          fechaNacimiento: "1995-08-20",
          correo: "vendedor@ferreteria.cl",
          direccion: "Calle Comercio 456",
          region: "Metropolitana",
          genero: "femenino",
          rol: "vendedor",
          contrasena: "123456",
        },
        cliente: {
          nombreCompleto: "Claudio Cliente",
          fechaNacimiento: "2000-01-10",
          correo: "cliente@ferreteria.cl",
          direccion: "Pasaje Los Olivos 789",
          region: "Metropolitana",
          genero: "masculino",
          rol: "cliente",
          contrasena: "123456",
        },
      };

      const datosNuevo = nuevosUsuariosDemo[rolDeseado];
      registrarUsuario(datosNuevo);
      usuarioExistente = { ...datosNuevo, id: `demo-${rolDeseado}`, edad: 30 };
    }

    // 3. Establecer el usuario activo
    if (setUsuarioActivo) {
      setUsuarioActivo(usuarioExistente);
    }

    if (rolDeseado === "administrador") navigate("/admin");
    else if (rolDeseado === "vendedor") navigate("/vendedor");
    else navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom border-warning border-3 shadow-sm">
      <div className="container">
        {/* Marca */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-warning d-flex align-items-center gap-2"
        >
          <span>🔨</span> Ferretería Los Maestros
        </Link>

        {/* Botón Toggler Móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Enlaces Principales de Navegación */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                }
              >
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/catalogo"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                }
              >
                Catálogo
              </NavLink>
            </li>

            {/* 👤 Enlace a Mi Perfil (Visible para cualquier usuario autenticado) */}
            {usuarioActivo && (
              <li className="nav-item">
                <NavLink
                  to="/perfil"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                  }
                >
                  👤 Mi Perfil
                </NavLink>
              </li>
            )}

            {/* ⚙️ Panel de Administración (Solo Administrador) */}
            {usuarioActivo?.rol === "administrador" && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                  }
                >
                  ⚙️ Panel Admin
                </NavLink>
              </li>
            )}

            {/* 📦 Gestión de Ventas (Solo Vendedor) */}
            {usuarioActivo?.rol === "vendedor" && (
              <li className="nav-item">
                <NavLink
                  to="/vendedor"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                  }
                >
                  📦 Gestión Ventas
                </NavLink>
              </li>
            )}
          </ul>

          {/* Selector Rápido de Rol */}
          <div className="d-flex align-items-center gap-2 my-2 my-lg-0 me-lg-3 bg-secondary bg-opacity-25 p-1 px-2 rounded border border-secondary">
            <small
              className="text-warning fw-bold text-nowrap"
              style={{ fontSize: "0.8rem" }}
            >
              🎭 Cambio de Rol:
            </small>
            <select
              className="form-select form-select-sm bg-dark text-light border-warning"
              style={{ fontSize: "0.85rem", cursor: "pointer" }}
              value={usuarioActivo ? usuarioActivo.rol : "invitado"}
              onChange={handleCambiarRolRapido}
            >
              <option value="invitado">🚫 Invitado (Sin sesión)</option>
              <option value="cliente">👤 Cliente</option>
              <option value="vendedor">📦 Vendedor</option>
              <option value="administrador">⚙️ Administrador</option>
            </select>
          </div>

          {/* Carrito y Botón de Perfil/Cerrar Sesión */}
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/carrito"
              className="btn btn-outline-warning position-relative me-2"
            >
              🛒 Carrito
              {totalItemsCarrito > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItemsCarrito}
                </span>
              )}
            </Link>

            {usuarioActivo ? (
              <div className="d-flex align-items-center gap-2">
                {/* Al hacer clic en el nombre va directo a /perfil */}
                <Link
                  to="/perfil"
                  className="btn btn-warning fw-bold text-capitalize"
                >
                  👤 {usuarioActivo.nombreCompleto.split(" ")[0]} (
                  {usuarioActivo.rol})
                </Link>
                <button
                  onClick={() => {
                    cerrarSesion();
                    navigate("/login");
                  }}
                  className="btn btn-outline-danger btn-sm fw-bold"
                  title="Cerrar Sesión"
                >
                  Salir
                </button>
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
