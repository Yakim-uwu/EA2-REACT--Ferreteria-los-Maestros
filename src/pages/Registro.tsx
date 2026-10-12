import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Registro() {
  const { registrarUsuario } = useStore();
  const { alerta, mostrar } = useAlerta();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    correo: "",
    direccion: "",
    region: "Metropolitana",
    contrasena: "",
    confirmarContrasena: "",
  });

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
    if (!form.direccion.trim()) {
      mostrar("La dirección es obligatoria.");
      return;
    }
    if (form.contrasena.length < 6) {
      mostrar("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.contrasena !== form.confirmarContrasena) {
      mostrar("Las contraseñas no coinciden.");
      return;
    }

    // Registro asigna exclusivamente el rol 'cliente'
    const res = registrarUsuario({
      nombreCompleto: form.nombreCompleto,
      fechaNacimiento: form.fechaNacimiento,
      correo: form.correo,
      direccion: form.direccion,
      region: form.region,
      rol: "cliente",
      contrasena: form.contrasena,
    });

    if (res.ok) {
      mostrar("¡Registro exitoso! Redirigiendo a Iniciar Sesión...", false);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      mostrar(res.mensaje || "Error al registrar usuario.");
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm p-4">
        <h2 className="text-center fw-bold text-warning mb-4">
          Registro de Cliente 📝
        </h2>

        <Alerta alerta={alerta} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre Completo</label>
            <input
              type="text"
              name="nombreCompleto"
              className="form-control"
              value={form.nombreCompleto}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez González"
            />
          </div>

          <div className="mb-3">
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

          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
              placeholder="juan.perez@correo.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Av. Principal 123, Depto 45"
            />
          </div>

          <div className="mb-3">
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

          <div className="row g-2 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                className="form-control"
                value={form.contrasena}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmarContrasena"
                className="form-control"
                value={form.confirmarContrasena}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold py-2 mb-3"
          >
            Crear Cuenta de Cliente
          </button>

          <p className="text-center mb-0">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión aquí</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
