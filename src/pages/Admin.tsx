import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { RolUsuario, Producto, Usuario, Categoria } from "../types";
import { clp } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Admin() {
  const {
    usuarios,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    productos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    categorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useStore();

  const [pestanaActiva, setPestanaActiva] = useState<
    "usuarios" | "productos" | "categorias"
  >("usuarios");

  const { alerta, mostrar } = useAlerta();

  // ==========================================
  // ESTADOS Y HANDLERS: USUARIOS
  // ==========================================
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formUsuario, setFormUsuario] = useState({
    nombreCompleto: "",
    correo: "",
    rol: "cliente" as RolUsuario,
  });

  const handleSeleccionarEditarUsuario = (u: Usuario) => {
    setUsuarioEditando(u);
    setFormUsuario({
      nombreCompleto: u.nombreCompleto,
      correo: u.correo,
      rol: u.rol,
    });
  };

  const handleCancelarEditarUsuario = () => {
    setUsuarioEditando(null);
    setFormUsuario({ nombreCompleto: "", correo: "", rol: "cliente" });
  };

  const handleGuardarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsuario.nombreCompleto || !formUsuario.correo) {
      mostrar("Ingresa el nombre y el correo", true);
      return;
    }

    if (usuarioEditando) {
      // Editar existente usando actualizarUsuario
      actualizarUsuario({
        ...usuarioEditando,
        nombreCompleto: formUsuario.nombreCompleto,
        correo: formUsuario.correo,
        rol: formUsuario.rol,
      });
      mostrar("Usuario actualizado correctamente.");
    } else {
      // Crear nuevo usando registrarUsuario
      const res = registrarUsuario({
        nombreCompleto: formUsuario.nombreCompleto,
        correo: formUsuario.correo,
        rol: formUsuario.rol,
        fechaNacimiento: "1990-01-01",
        direccion: "Dirección Admin",
        region: "Metropolitana",
        genero: "otro",
        contrasena: "123456",
      });
      mostrar(res.mensaje || "Usuario registrado", !res.ok);
    }

    handleCancelarEditarUsuario();
  };

  const handleEliminarUsuario = (id: string) => {
    const res = eliminarUsuario(id);
    mostrar(res.mensaje || "", !res.ok);
  };

  // ==========================================
  // ESTADOS Y HANDLERS: PRODUCTOS
  // ==========================================
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 1000,
    stock: 10,
    categoria: categorias[0]?.nombre || "Herramientas Manuales",
    imagen: "/IMG/taladro.jpg",
  });

  const handleSeleccionarEditarProducto = (p: Producto) => {
    setProductoEditando(p);
    setFormProducto({
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      precio: p.precio,
      stock: p.stock,
      categoria: p.categoria,
      imagen: p.imagen || "/IMG/taladro.jpg",
    });
  };

  const handleCancelarEditarProducto = () => {
    setProductoEditando(null);
    setFormProducto({
      nombre: "",
      descripcion: "",
      precio: 1000,
      stock: 10,
      categoria: categorias[0]?.nombre || "Herramientas Manuales",
      imagen: "/IMG/taladro.jpg",
    });
  };

  const handleGuardarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar que el nombre no esté vacío
    if (!formProducto.nombre.trim()) {
      mostrar("Ingresa el nombre del producto", true);
      return;
    }

    // 2. Validar que el precio no sea negativo
    if (formProducto.precio < 0) {
      mostrar("El precio no puede ser un valor negativo", true);
      return;
    }

    // 3. Validar que el stock no sea negativo
    if (formProducto.stock < 0) {
      mostrar("El stock no puede ser un valor negativo", true);
      return;
    }

    if (productoEditando) {
      const res = actualizarProducto({
        ...productoEditando,
        nombre: formProducto.nombre,
        descripcion: formProducto.descripcion,
        precio: formProducto.precio,
        stock: formProducto.stock,
        categoria: formProducto.categoria,
        imagen: formProducto.imagen,
      });
      mostrar(res.mensaje || "", !res.ok);
    } else {
      const res = crearProducto({
        nombre: formProducto.nombre,
        descripcion: formProducto.descripcion,
        precio: formProducto.precio,
        stock: formProducto.stock,
        categoria: formProducto.categoria,
        imagen: formProducto.imagen,
      });
      mostrar(res.mensaje || "", !res.ok);
    }

    handleCancelarEditarProducto();
  };

  const handleEliminarProducto = (id: string) => {
    const res = eliminarProducto(id);
    mostrar(res.mensaje || "", !res.ok);
  };

  // ==========================================
  // ESTADOS Y HANDLERS: CATEGORÍAS
  // ==========================================
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null,
  );
  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSeleccionarEditarCategoria = (c: Categoria) => {
    setCategoriaEditando(c);
    setFormCategoria({
      nombre: c.nombre,
      descripcion: c.descripcion || "",
    });
  };

  const handleCancelarEditarCategoria = () => {
    setCategoriaEditando(null);
    setFormCategoria({ nombre: "", descripcion: "" });
  };

  const handleGuardarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoria.nombre.trim()) {
      mostrar("Ingresa el nombre de la categoría", true);
      return;
    }

    if (categoriaEditando) {
      const res = actualizarCategoria({
        ...categoriaEditando,
        nombre: formCategoria.nombre.trim(),
        descripcion: formCategoria.descripcion.trim(),
      });
      mostrar(res.mensaje || "", !res.ok);
    } else {
      const res = crearCategoria({
        nombre: formCategoria.nombre.trim(),
        descripcion: formCategoria.descripcion.trim(),
      });
      mostrar(res.mensaje || "", !res.ok);
    }

    handleCancelarEditarCategoria();
  };

  const handleEliminarCategoria = (id: string) => {
    const res = eliminarCategoria(id);
    mostrar(res.mensaje || "", !res.ok);
  };

  return (
    <main className="container my-4">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Panel de Administración ⚙️
      </h2>

      <Alerta alerta={alerta} className="mb-3" />

      {/* Navegación por pestañas */}
      <ul className="nav nav-tabs mb-4 fw-bold">
        <li className="nav-item">
          <button
            className={`nav-link ${pestanaActiva === "usuarios" ? "active text-dark bg-white border-bottom-0" : "text-primary"}`}
            onClick={() => setPestanaActiva("usuarios")}
          >
            Usuarios y Roles
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${pestanaActiva === "productos" ? "active text-dark bg-white border-bottom-0" : "text-primary"}`}
            onClick={() => setPestanaActiva("productos")}
          >
            Gestión de Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${pestanaActiva === "categorias" ? "active text-dark bg-white border-bottom-0" : "text-primary"}`}
            onClick={() => setPestanaActiva("categorias")}
          >
            Gestión de Categorías
          </button>
        </li>
      </ul>

      {/* PESTAÑA 1: USUARIOS */}
      {pestanaActiva === "usuarios" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">
                {usuarioEditando
                  ? "✏️ Editar Usuario"
                  : "Crear Usuario / Asignar Rol"}
              </h5>
              <form onSubmit={handleGuardarUsuario}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formUsuario.nombreCompleto}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        nombreCompleto: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formUsuario.correo}
                    onChange={(e) =>
                      setFormUsuario({ ...formUsuario, correo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Rol a Asignar
                  </label>
                  <select
                    className="form-select"
                    value={formUsuario.rol}
                    onChange={(e) =>
                      setFormUsuario({
                        ...formUsuario,
                        rol: e.target.value as RolUsuario,
                      })
                    }
                  >
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold w-100"
                  >
                    {usuarioEditando ? "Actualizar Usuario" : "Crear Usuario"}
                  </button>
                  {usuarioEditando && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelarEditarUsuario}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">Usuarios Registrados</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nombreCompleto}</td>
                        <td className="small">{u.correo}</td>
                        <td>
                          <span className="badge bg-secondary text-capitalize">
                            {u.rol}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => handleSeleccionarEditarUsuario(u)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminarUsuario(u.id)}
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
        </div>
      )}

      {/* PESTAÑA 2: PRODUCTOS */}
      {pestanaActiva === "productos" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">
                {productoEditando ? "✏️ Editar Producto" : "Nuevo Producto"}
              </h5>
              <form onSubmit={handleGuardarProducto}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formProducto.nombre}
                    onChange={(e) =>
                      setFormProducto({
                        ...formProducto,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formProducto.descripcion}
                    onChange={(e) =>
                      setFormProducto({
                        ...formProducto,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formProducto.precio}
                      onChange={(e) =>
                        setFormProducto({
                          ...formProducto,
                          precio: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Stock Inicial
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formProducto.stock}
                      onChange={(e) =>
                        setFormProducto({
                          ...formProducto,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Categoría
                  </label>
                  <select
                    className="form-select"
                    value={formProducto.categoria}
                    onChange={(e) =>
                      setFormProducto({
                        ...formProducto,
                        categoria: e.target.value,
                      })
                    }
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold w-100"
                  >
                    {productoEditando
                      ? "Actualizar Producto"
                      : "Guardar Producto"}
                  </button>
                  {productoEditando && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelarEditarProducto}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">Catálogo Existente</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td>${clp(p.precio)}</td>
                        <td>{p.stock}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => handleSeleccionarEditarProducto(p)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminarProducto(p.id)}
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
        </div>
      )}

      {/* PESTAÑA 3: CATEGORÍAS */}
      {pestanaActiva === "categorias" && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">
                {categoriaEditando ? "✏️ Editar Categoría" : "Nueva Categoría"}
              </h5>
              <form onSubmit={handleGuardarCategoria}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Nombre de Categoría
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formCategoria.nombre}
                    onChange={(e) =>
                      setFormCategoria({
                        ...formCategoria,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formCategoria.descripcion}
                    onChange={(e) =>
                      setFormCategoria({
                        ...formCategoria,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold w-100"
                  >
                    {categoriaEditando
                      ? "Actualizar Categoría"
                      : "Agregar Categoría"}
                  </button>
                  {categoriaEditando && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelarEditarCategoria}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">Categorías Registradas</h5>
              <ul className="list-group">
                {categorias.map((cat) => (
                  <li
                    key={cat.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span className="fw-bold d-block">{cat.nombre}</span>
                      {cat.descripcion && (
                        <small className="text-muted">{cat.descripcion}</small>
                      )}
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-primary btn-sm me-1"
                        onClick={() => handleSeleccionarEditarCategoria(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEliminarCategoria(cat.id)}
                      >
                        Eliminar
                      </button>
                    </div>
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
