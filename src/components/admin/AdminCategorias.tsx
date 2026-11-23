import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useAlerta } from "../../hooks/useAlerta";
import { Categoria } from "../../types";
import {
  CamposCategoria,
  ErroresCategoria,
  validarCategoria,
} from "../../utils/validaciones";
import Alerta from "../Alerta";
import CampoFormulario, { claseControl } from "../CampoFormulario";

const FORMULARIO_VACIO: CamposCategoria = { nombre: "", descripcion: "" };

export default function AdminCategorias() {
  const {
    categorias,
    productos,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useStore();
  const { alerta, mostrar, mostrarRespuesta, limpiar } = useAlerta();

  const [editando, setEditando] = useState<Categoria | null>(null);
  const [form, setForm] = useState<CamposCategoria>(FORMULARIO_VACIO);
  const [errores, setErrores] = useState<ErroresCategoria>({});
  const [enviando, setEnviando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name as keyof CamposCategoria]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const reiniciarFormulario = () => {
    setEditando(null);
    setForm(FORMULARIO_VACIO);
    setErrores({});
  };

  const seleccionarEditar = (c: Categoria) => {
    setEditando(c);
    setErrores({});
    setForm({ nombre: c.nombre, descripcion: c.descripcion ?? "" });
  };

  const handleGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const erroresEncontrados = validarCategoria(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      mostrar("Revisa los campos marcados en rojo.");
      return;
    }

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
    };
    setEnviando(true);
    const res = await (editando
      ? actualizarCategoria({ ...editando, ...datos })
      : crearCategoria(datos));
    setEnviando(false);
    mostrarRespuesta(res);
    if (res.ok) reiniciarFormulario();
  };

  const handleEliminar = async (c: Categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    const res = await eliminarCategoria(c.id);
    mostrarRespuesta(res);
    if (res.ok && editando?.id === c.id) reiniciarFormulario();
  };

  return (
    <>
      <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">
              {editando ? "✏️ Editar Categoría" : "Nueva Categoría"}
            </h5>
            <form onSubmit={handleGuardar} noValidate>
              <div className="row g-3">
                <CampoFormulario
                  id="cat-nombre"
                  etiqueta="Nombre de Categoría"
                  obligatorio
                  error={errores.nombre}
                  className="col-12"
                >
                  <input
                    id="cat-nombre"
                    name="nombre"
                    type="text"
                    className={claseControl("form-control", errores.nombre)}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="cat-descripcion"
                  etiqueta="Descripción"
                  error={errores.descripcion}
                  className="col-12"
                >
                  <input
                    id="cat-descripcion"
                    name="descripcion"
                    type="text"
                    className={claseControl("form-control", errores.descripcion)}
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                </CampoFormulario>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-warning fw-bold w-100"
                  disabled={enviando}
                >
                  {enviando
                    ? "Guardando..."
                    : editando
                      ? "Actualizar Categoría"
                      : "Agregar Categoría"}
                </button>
                {editando && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={reiniciarFormulario}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">Categorías Registradas</h5>
            <ul className="list-group">
              {categorias.map((cat) => {
                const cantidad = productos.filter(
                  (p) => p.categoria === cat.nombre,
                ).length;
                return (
                  <li
                    key={cat.id}
                    className="list-group-item d-flex justify-content-between align-items-center gap-2"
                  >
                    <div>
                      <span className="fw-bold d-block">
                        {cat.nombre}{" "}
                        <span className="badge bg-secondary ms-1">
                          {cantidad} producto(s)
                        </span>
                      </span>
                      {cat.descripcion && (
                        <small className="text-muted">{cat.descripcion}</small>
                      )}
                    </div>
                    <div className="text-nowrap">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-1"
                        onClick={() => seleccionarEditar(cat)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEliminar(cat)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
