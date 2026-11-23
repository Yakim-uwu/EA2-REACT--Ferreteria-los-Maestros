import React, { useMemo, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useAlerta } from "../../hooks/useAlerta";
import {
  DatosUsuario,
  RespuestaOperacion,
  RolUsuario,
  Usuario,
} from "../../types";
import { ETIQUETA_ROL } from "../../utils/permisos";
import Alerta from "../Alerta";
import FormularioUsuario from "../FormularioUsuario";

export default function AdminUsuarios() {
  const {
    usuarios,
    usuarioActivo,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
  } = useStore();
  const { alerta, mostrarRespuesta, limpiar } = useAlerta();

  const [editando, setEditando] = useState<Usuario | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroRol, setFiltroRol] = useState<RolUsuario | "todos">("todos");

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return usuarios.filter(
      (u) =>
        (filtroRol === "todos" || u.rol === filtroRol) &&
        (texto === "" ||
          `${u.nombreCompleto} ${u.correo}`.toLowerCase().includes(texto)),
    );
  }, [usuarios, busqueda, filtroRol]);

  const handleGuardar = async (
    datos: DatosUsuario,
  ): Promise<RespuestaOperacion> => {
    const res = await (editando
      ? actualizarUsuario(editando.id, datos)
      : registrarUsuario(datos));
    mostrarRespuesta(res);
    if (res.ok) setEditando(null);
    return res;
  };

  const handleEliminar = async (u: Usuario) => {
    if (
      !window.confirm(
        `¿Eliminar a ${u.nombreCompleto}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    const res = await eliminarUsuario(u.id);
    mostrarRespuesta(res);
    if (res.ok && editando?.id === u.id) setEditando(null);
  };

  return (
    <>
      <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">
              {editando ? "✏️ Editar Usuario" : "Crear Usuario / Asignar Rol"}
            </h5>
            <FormularioUsuario
              key={editando?.id ?? "nuevo"}
              modo={editando ? "edicion" : "alta"}
              usuarioInicial={editando}
              textoBoton={editando ? "Actualizar Usuario" : "Crear Usuario"}
              onGuardar={handleGuardar}
              onCancelar={editando ? () => setEditando(null) : undefined}
            />
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">Usuarios Registrados</h5>

            <div className="row g-2 mb-3">
              <div className="col-sm-7">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Buscar por nombre o correo..."
                  aria-label="Buscar usuarios"
                  value={busqueda}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBusqueda(e.target.value)
                  }
                />
              </div>
              <div className="col-sm-5">
                <select
                  className="form-select form-select-sm"
                  aria-label="Filtrar por rol"
                  value={filtroRol}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFiltroRol(e.target.value as RolUsuario | "todos")
                  }
                >
                  <option value="todos">Todos los roles</option>
                  <option value="cliente">Clientes</option>
                  <option value="vendedor">Vendedores</option>
                  <option value="administrador">Administradores</option>
                </select>
              </div>
            </div>

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
                  {visibles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No hay usuarios que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    visibles.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nombreCompleto}</td>
                        <td className="small">{u.correo}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {ETIQUETA_ROL[u.rol]}
                          </span>
                        </td>
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => setEditando(u)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={u.id === usuarioActivo?.id}
                            title={
                              u.id === usuarioActivo?.id
                                ? "No puedes eliminar tu propia cuenta"
                                : undefined
                            }
                            onClick={() => handleEliminar(u)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
