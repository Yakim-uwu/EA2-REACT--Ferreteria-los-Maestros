import React, { useMemo, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useAlerta } from "../../hooks/useAlerta";
import { Producto } from "../../types";
import { IMAGENES_DISPONIBLES } from "../../data/imagenes";
import { clp, imgSrc, tieneOferta } from "../../utils/format";
import {
  CamposProducto,
  ErroresProducto,
  validarProducto,
} from "../../utils/validaciones";
import Alerta from "../Alerta";
import CampoFormulario, { claseControl } from "../CampoFormulario";

const formularioVacio = (categoria: string): CamposProducto => ({
  nombre: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  stock: "",
  categoria,
  imagen: IMAGENES_DISPONIBLES[0].ruta,
});

export default function AdminProductos() {
  const {
    productos,
    categorias,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
  } = useStore();
  const { alerta, mostrar, mostrarRespuesta, limpiar } = useAlerta();

  const categoriaInicial = categorias[0]?.nombre ?? "";
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<CamposProducto>(() =>
    formularioVacio(categoriaInicial),
  );
  const [errores, setErrores] = useState<ErroresProducto>({});
  const [busqueda, setBusqueda] = useState<string>("");

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        texto === "" ||
        `${p.nombre} ${p.categoria}`.toLowerCase().includes(texto),
    );
  }, [productos, busqueda]);

  // Si el producto usa una imagen que no está en la lista, igual se ofrece como opción
  const opcionesImagen = IMAGENES_DISPONIBLES.some((i) => i.ruta === form.imagen)
    ? IMAGENES_DISPONIBLES
    : [{ ruta: form.imagen, etiqueta: "Imagen actual" }, ...IMAGENES_DISPONIBLES];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name as keyof CamposProducto]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const reiniciarFormulario = () => {
    setEditando(null);
    setForm(formularioVacio(categoriaInicial));
    setErrores({});
  };

  const seleccionarEditar = (p: Producto) => {
    setEditando(p);
    setErrores({});
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? "",
      precio: String(p.precio),
      precioOferta: tieneOferta(p) ? String(p.precioOferta) : "",
      stock: String(p.stock),
      categoria: p.categoria,
      imagen: p.imagen,
    });
  };

  const handleGuardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const erroresEncontrados = validarProducto(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      mostrar("Revisa los campos marcados en rojo.");
      return;
    }

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      precioOferta:
        form.precioOferta.trim() === "" ? undefined : Number(form.precioOferta),
      stock: Number(form.stock),
      categoria: form.categoria,
      imagen: form.imagen,
    };

    const res = editando
      ? actualizarProducto({ ...editando, ...datos })
      : crearProducto(datos);
    mostrarRespuesta(res);
    if (res.ok) reiniciarFormulario();
  };

  const handleEliminar = (p: Producto) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) return;
    mostrarRespuesta(eliminarProducto(p.id));
    if (editando?.id === p.id) reiniciarFormulario();
  };

  return (
    <>
      <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">
              {editando ? "✏️ Editar Producto" : "Nuevo Producto"}
            </h5>
            <form onSubmit={handleGuardar} noValidate>
              <div className="row g-3">
                <CampoFormulario
                  id="prod-nombre"
                  etiqueta="Nombre"
                  obligatorio
                  error={errores.nombre}
                  className="col-12"
                >
                  <input
                    id="prod-nombre"
                    name="nombre"
                    type="text"
                    className={claseControl("form-control", errores.nombre)}
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="prod-descripcion"
                  etiqueta="Descripción"
                  className="col-12"
                >
                  <input
                    id="prod-descripcion"
                    name="descripcion"
                    type="text"
                    className="form-control"
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="prod-precio"
                  etiqueta="Precio ($)"
                  obligatorio
                  error={errores.precio}
                  className="col-sm-4"
                >
                  <input
                    id="prod-precio"
                    name="precio"
                    type="number"
                    min={1}
                    className={claseControl("form-control", errores.precio)}
                    value={form.precio}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="prod-oferta"
                  etiqueta="Precio Oferta ($)"
                  error={errores.precioOferta}
                  className="col-sm-4"
                >
                  <input
                    id="prod-oferta"
                    name="precioOferta"
                    type="number"
                    min={1}
                    placeholder="Opcional"
                    className={claseControl("form-control", errores.precioOferta)}
                    value={form.precioOferta}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="prod-stock"
                  etiqueta="Stock"
                  obligatorio
                  error={errores.stock}
                  className="col-sm-4"
                >
                  <input
                    id="prod-stock"
                    name="stock"
                    type="number"
                    min={0}
                    className={claseControl("form-control", errores.stock)}
                    value={form.stock}
                    onChange={handleChange}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="prod-categoria"
                  etiqueta="Categoría"
                  obligatorio
                  error={errores.categoria}
                  className="col-12"
                >
                  <select
                    id="prod-categoria"
                    name="categoria"
                    className={claseControl("form-select", errores.categoria)}
                    value={form.categoria}
                    onChange={handleChange}
                  >
                    <option value="">-- Selecciona categoría --</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

                <CampoFormulario
                  id="prod-imagen"
                  etiqueta="Imagen"
                  obligatorio
                  error={errores.imagen}
                  className="col-12"
                >
                  <div className="d-flex gap-3 align-items-center">
                    <select
                      id="prod-imagen"
                      name="imagen"
                      className={claseControl("form-select", errores.imagen)}
                      value={form.imagen}
                      onChange={handleChange}
                    >
                      {opcionesImagen.map((img) => (
                        <option key={img.ruta} value={img.ruta}>
                          {img.etiqueta}
                        </option>
                      ))}
                    </select>
                    <img
                      src={imgSrc(form.imagen)}
                      alt="Vista previa del producto"
                      className="rounded border"
                      style={{ width: 56, height: 56, objectFit: "cover" }}
                    />
                  </div>
                </CampoFormulario>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-warning fw-bold w-100">
                  {editando ? "Actualizar Producto" : "Guardar Producto"}
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
            <h5 className="fw-bold mb-3">Catálogo Existente</h5>
            <input
              type="search"
              className="form-control form-control-sm mb-3"
              placeholder="Buscar por nombre o categoría..."
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBusqueda(e.target.value)
              }
            />
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
                  {visibles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        No hay productos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    visibles.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="fw-semibold">{p.nombre}</span>
                          <br />
                          <small className="text-muted">{p.categoria}</small>
                        </td>
                        <td className="text-nowrap">
                          ${clp(tieneOferta(p) ? (p.precioOferta as number) : p.precio)}
                          {tieneOferta(p) && (
                            <>
                              {" "}
                              <del className="text-muted small">${clp(p.precio)}</del>
                            </>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${p.stock <= 5 ? "bg-danger" : "bg-success"}`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => seleccionarEditar(p)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminar(p)}
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
