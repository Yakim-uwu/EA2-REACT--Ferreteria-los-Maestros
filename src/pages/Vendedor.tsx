import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { GeneroUsuario } from "../types";
import { clp } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Vendedor() {
  const { usuarioActivo, productos, modificarStockProducto, registrarUsuario } =
    useStore();

  const { alerta, mostrar } = useAlerta();

  // Registro exclusivo de cliente con todos los campos requeridos por la interfaz Usuario
  const [clienteForm, setClienteForm] = useState({
    nombreCompleto: "",
    correo: "",
    fechaNacimiento: "2000-01-01",
    direccion: "Sin Dirección",
    region: "Metropolitana",
    genero: "prefiero_no_decir" as GeneroUsuario, // Campo requerido por la interfaz Usuario
    contrasena: "123456",
  });

  if (
    !usuarioActivo ||
    (usuarioActivo.rol !== "vendedor" && usuarioActivo.rol !== "administrador")
  ) {
    return <Navigate to="/404" replace />;
  }

  const handleCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteForm.nombreCompleto.trim() || !clienteForm.correo.trim()) {
      mostrar("Completa el nombre y correo del cliente.");
      return;
    }

    // Restricción explícita: el vendedor crea exclusivamente rol 'cliente'
    const res = registrarUsuario({
      ...clienteForm,
      rol: "cliente",
    });

    mostrar(res.mensaje || "", !res.ok);
    if (res.ok) {
      setClienteForm({
        ...clienteForm,
        nombreCompleto: "",
        correo: "",
      });
    }
  };

  const handleStockChange = (id: string, nuevoStockStr: string) => {
    const num = parseInt(nuevoStockStr, 10);
    if (!isNaN(num) && num >= 0) {
      modificarStockProducto(id, num);
    }
  };

  return (
    <main className="container my-5">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Panel de Gestión de Ventas 📦
      </h2>

      <Alerta alerta={alerta} />

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <div className="card shadow-sm p-3">
            <h5 className="fw-bold mb-3">Registrar Nuevo Cliente</h5>
            <small className="text-muted d-block mb-3">
              Nota: Como vendedor solo puedes registrar cuentas con rol Cliente.
            </small>

            <form onSubmit={handleCrearCliente}>
              <div className="mb-2">
                <label className="form-label small">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={clienteForm.nombreCompleto}
                  onChange={(e) =>
                    setClienteForm({
                      ...clienteForm,
                      nombreCompleto: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={clienteForm.correo}
                  onChange={(e) =>
                    setClienteForm({ ...clienteForm, correo: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-bold">
                Registrar Cliente
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm p-3 table-responsive">
            <h5 className="fw-bold mb-3">Consulta y Actualización de Stock</h5>
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock Actual</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="fw-semibold">{p.nombre}</span>
                      <br />
                      <small className="text-muted">{p.categoria}</small>
                    </td>
                    <td>${clp(p.precio)}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-control-sm"
                        style={{ width: "90px" }}
                        defaultValue={p.stock}
                        onBlur={(e) => handleStockChange(p.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        Modificar en casilla
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
