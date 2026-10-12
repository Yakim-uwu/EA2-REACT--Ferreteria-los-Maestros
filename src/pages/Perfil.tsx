import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { calcularEdad } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Perfil() {
  const { usuarioActivo, actualizarPerfil } = useStore();
  const { alerta, mostrar } = useAlerta();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    correo: "",
    direccion: "",
    region: "Metropolitana",
    avatar: "",
  });

  useEffect(() => {
    if (!usuarioActivo) {
      navigate("/login");
      return;
    }
    setForm({
      nombreCompleto: usuarioActivo.nombreCompleto || "",
      fechaNacimiento: usuarioActivo.fechaNacimiento || "",
      correo: usuarioActivo.correo || "",
      direccion: usuarioActivo.direccion || "",
      region: usuarioActivo.region || "Metropolitana",
      avatar: usuarioActivo.avatar || "",
    });
  }, [usuarioActivo, navigate]);

  if (!usuarioActivo) return null;

  const edadActual = calcularEdad(form.fechaNacimiento);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombreCompleto.trim()) {
      mostrar("El nombre completo es obligatorio.");
      return;
    }
    if (!form.fechaNacimiento) {
      mostrar("La fecha de nacimiento es obligatoria.");
      return;
    }
    if (!form.correo.trim() || !form.correo.includes("@")) {
      mostrar("Ingresa un correo electrónico válido.");
      return;
    }

    const res = actualizarPerfil({
      nombreCompleto: form.nombreCompleto,
      fechaNacimiento: form.fechaNacimiento,
      correo: form.correo,
      direccion: form.direccion,
      region: form.region,
      avatar: form.avatar,
    });

    if (res.ok) {
      mostrar("Perfil actualizado con éxito.", false);
    } else {
      mostrar(res.mensaje || "Error al actualizar perfil.");
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-sm p-4">
        <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-4">
          <div
            className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold fs-3"
            style={{ width: "64px", height: "64px" }}
          >
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="Avatar"
                className="rounded-circle w-100 h-100 object-fit-cover"
              />
            ) : (
              usuarioActivo.nombreCompleto.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="fw-bold mb-0">{usuarioActivo.nombreCompleto}</h3>
            <span className="badge bg-secondary text-capitalize me-2">
              {usuarioActivo.rol}
            </span>
            <small className="text-muted">Edad: {edadActual} años</small>
          </div>
        </div>

        <Alerta alerta={alerta} />

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nombre Completo</label>
              <input
                type="text"
                name="nombreCompleto"
                className="form-control"
                value={form.nombreCompleto}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                className="form-control"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Edad Calculada</label>
              <input
                type="text"
                className="form-control bg-light"
                value={`${edadActual} años`}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Rol Asignado</label>
              <input
                type="text"
                className="form-control bg-light text-capitalize fw-bold"
                value={usuarioActivo.rol}
                disabled
              />
              <small className="text-muted fs-7">
                El rol no se puede editar desde el perfil propio.
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                className="form-control"
                value={form.correo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Región</label>
              <select
                name="region"
                className="form-select"
                value={form.region}
                onChange={handleChange}
              >
                <option value="Metropolitana">Región Metropolitana</option>
                <option value="Valparaíso">Región de Valparaíso</option>
                <option value="Biobío">Región del Biobío</option>
                <option value="Coquimbo">Región de Coquimbo</option>
                <option value="Araucanía">Región de la Araucanía</option>
                <option value="Otra">Otra Región</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Dirección</label>
              <input
                type="text"
                name="direccion"
                className="form-control"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                URL Avatar Genérico (Opcional)
              </label>
              <input
                type="text"
                name="avatar"
                className="form-control"
                placeholder="https://ejemplo.com/avatar.jpg"
                value={form.avatar}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-warning fw-bold w-100 mt-4 py-2"
          >
            Guardar Cambios de Perfil
          </button>
        </form>
      </div>
    </main>
  );
}
