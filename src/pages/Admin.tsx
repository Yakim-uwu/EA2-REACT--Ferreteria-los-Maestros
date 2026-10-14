import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { RolUsuario, Producto, Categoria, GeneroUsuario } from "../types";
import { clp } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Admin() {
  const {
    usuarioActivo,
    usuarios,
    registrarUsuario,
    eliminarUsuario,
    productos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    categorias,
    crearCategoria,
    eliminarCategoria,
  } = useStore();

  const { alerta, mostrar } = useAlerta();
  const [pestana, setPestana] = useState<
    "usuarios" | "productos" | "categorias"
  >("usuarios");

  // Formularios locales
  const [userForm, setUserForm] = useState({
    nombreCompleto: "",
    correo: "",
    fechaNacimiento: "1995-01-01",
    direccion: "Av. Central 100",
    region: "Metropolitana",
    genero: "prefiero_no_decir" as GeneroUsuario,
    rol: "cliente" as RolUsuario,
    contrasena: "123456",
  });

  const [prodForm, setProdForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 1000,
    stock: 10,
    categoria: "Herramientas Manuales",
    imagen: "/IMG/taladro.jpg",
  });

  const [catNombre, setCatNombre] = useState("");

  if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
    return <Navigate to="/404" replace />;
  }

  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.nombreCompleto || !userForm.correo) {
      mostrar("Nombre y correo son obligatorios.");
      return;
    }
    const res = registrarUsuario(userForm);
    if (res.ok) {
      mostrar("Usuario creado correctamente.", false);
      setUserForm({ ...userForm, nombreCompleto: "", correo: "" });
    } else {
      mostrar(res.mensaje || "Error al crear usuario.");
    }
  };

  const handleCrearProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.nombre) {
      mostrar("El nombre del producto es obligatorio.");
      return;
    }
    const res = crearProducto(prodForm);
    mostrar(res.mensaje || "", !res.ok);
    if (res.ok) setProdForm({ ...prodForm, nombre: "", descripcion: "" });
  };

  const handleCrearCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNombre.trim()) return;
    const res = crearCategoria({ nombre: catNombre });
    mostrar(res.mensaje || "", !res.ok);
    if (res.ok) setCatNombre("");
  };

  return (
    <main className="container my-5">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Panel de Administración ⚙️
      </h2>

      <Alerta alerta={alerta} />

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${pestana === "usuarios" ? "active" : ""}`}
            onClick={() => setPestana("usuarios")}
          >
            Usuarios y Roles
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${pestana === "productos" ? "active" : ""}`}
            onClick={() => setPestana("productos")}
          >
            Gestión de Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${pestana === "categorias" ? "active" : ""}`}
            onClick={() => setPestana("categorias")}
          >
            Gestión de Categorías
          </button>
        </li>
      </ul>

      {/* PESTAÑA USUARIOS */}
      {pestana === "usuarios" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold mb-3">Crear Usuario / Asignar Rol</h5>
              <form onSubmit={handleCrearUsuario}>
                <div className="mb-2">
                  <label className="form-label small">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userForm.nombreCompleto}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        nombreCompleto: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={userForm.correo}
                    onChange={(e) =>
                      setUserForm({ ...userForm, correo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Rol a Asignar
                  </label>
                  <select
                    className="form-select"
                    value={userForm.rol}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        rol: e.target.value as RolUsuario,
                      })
                    }
                  >
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  Crear Usuario
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-3 table-responsive">
              <h5 className="fw-bold mb-3">Usuarios Registrados</h5>
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombreCompleto}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => eliminarUsuario(u.id)}
                          className="btn btn-sm btn-outline-danger"
                          disabled={u.id === usuarioActivo.id}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA PRODUCTOS */}
      {pestana === "productos" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold mb-3">Nuevo Producto</h5>
              <form onSubmit={handleCrearProducto}>
                <div className="mb-2">
                  <label className="form-label small">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={prodForm.nombre}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={prodForm.descripcion}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, descripcion: e.target.value })
                    }
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small">Precio ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={prodForm.precio}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          precio: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Stock Inicial</label>
                    <input
                      type="number"
                      className="form-control"
                      value={prodForm.stock}
                      onChange={(e) =>
                        setProdForm({
                          ...prodForm,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small">Categoría</label>
                  <select
                    className="form-select"
                    value={prodForm.categoria}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, categoria: e.target.value })
                    }
                  >
                    {categorias.map((c) => (
                      <option key={c.id || c.nombre} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  Guardar Producto
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-3 table-responsive">
              <h5 className="fw-bold mb-3">Catálogo Existente</h5>
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>${clp(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          onClick={() => eliminarProducto(p.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA CATEGORÍAS */}
      {pestana === "categorias" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold mb-3">Nueva Categoría</h5>
              <form onSubmit={handleCrearCategoria}>
                <div className="mb-3">
                  <label className="form-label small">
                    Nombre de Categoría
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={catNombre}
                    onChange={(e) => setCatNombre(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  Agregar Categoría
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold mb-3">Categorías Registradas</h5>
              <ul className="list-group">
                {categorias.map((c) => (
                  <li
                    key={c.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {c.nombre}
                    <button
                      onClick={() => eliminarCategoria(c.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
