import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { calcularEdad } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";
import { GeneroUsuario } from "../types";

export default function Registro() {
  const { registrarUsuario } = useStore();
  const { alerta, mostrar } = useAlerta();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    correo: "",
    direccion: "",
    region: "",
    genero: "" as GeneroUsuario,
    contrasena: "",
    confirmarContrasena: "",
    aceptaTerminos: false,
  });

  // Lista de dominios de correo permitidos por regla de negocio
  const dominiosAutorizados = [
    "@duocuc.cl",
    "@profesor.duoc.cl",
    "@gmail.com",
    "@outlook.com",
    "@hotmail.com",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm({ ...form, [target.name]: value });
  };

  const validarFormulario = (): boolean => {
    // 1. Campos obligatorios
    if (
      !form.nombreCompleto.trim() ||
      !form.fechaNacimiento ||
      !form.correo.trim() ||
      !form.direccion.trim() ||
      !form.region ||
      !form.genero ||
      !form.contrasena ||
      !form.confirmarContrasena
    ) {
      mostrar("Todos los campos marcados con (*) son obligatorios.");
      return false;
    }

    // 2. Edad mínima de 14 años
    const edadCalculada = calcularEdad(form.fechaNacimiento);
    if (edadCalculada < 14) {
      mostrar("Debes tener al menos 14 años de edad para registrarte.");
      return false;
    }

    // 3. Dominio de correo autorizado
    const correoMinusculas = form.correo.trim().toLowerCase();
    const dominioValido = dominiosAutorizados.some((dom) =>
      correoMinusculas.endsWith(dom),
    );
    if (!dominioValido) {
      mostrar(
        `El correo debe pertenecer a un dominio autorizado: ${dominiosAutorizados.join(", ")}`,
      );
      return false;
    }

    // 4. Selección válida de región
    if (!form.region || form.region === "") {
      mostrar("Selecciona una región válida de la lista.");
      return false;
    }

    // 5. Selección de género
    if (!form.genero) {
      mostrar("Debes seleccionar una opción de género.");
      return false;
    }

    // 6. Requisitos de seguridad y formato de contraseña
    // Requisito: Mínimo 8 caracteres, al menos una letra mayúscula y al menos un número
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexPassword.test(form.contrasena)) {
      mostrar(
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y al menos un número.",
      );
      return false;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      mostrar("Las contraseñas no coinciden.");
      return false;
    }

    // 7. Aceptación de condiciones de registro
    if (!form.aceptaTerminos) {
      mostrar("Debes aceptar los términos y condiciones de registro.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const res = registrarUsuario({
      nombreCompleto: form.nombreCompleto.trim(),
      fechaNacimiento: form.fechaNacimiento,
      correo: form.correo.trim().toLowerCase(),
      direccion: form.direccion.trim(),
      region: form.region,
      genero: form.genero,
      rol: "cliente",
      contrasena: form.contrasena,
    });

    if (res.ok) {
      mostrar("¡Registro exitoso! Redirigiendo a Iniciar Sesión...", false);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      mostrar(res.mensaje || "Error al registrar el usuario.");
    }
  };

  const edadActual = form.fechaNacimiento
    ? calcularEdad(form.fechaNacimiento)
    : 0;

  return (
    <main className="container my-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold text-center mb-1 text-warning">
          Crear Cuenta de Cliente
        </h3>
        <p className="text-center text-muted small mb-4">
          Ingresa tus datos para registrarte en Ferretería Los Maestros
        </p>

        <Alerta alerta={alerta} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Nombre Completo */}
            <div className="col-12">
              <label
                htmlFor="nombreCompleto"
                className="form-label fw-semibold"
              >
                Nombre Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                className="form-control"
                placeholder="Ej: Juan Pérez González"
                value={form.nombreCompleto}
                onChange={handleChange}
              />
            </div>

            {/* Fecha de Nacimiento y Edad Derivada */}
            <div className="col-md-6">
              <label
                htmlFor="fechaNacimiento"
                className="form-label fw-semibold"
              >
                Fecha de Nacimiento <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                className="form-control"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
              <small className="text-muted">
                Edad mínima requerida: 14 años.
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Edad Calculada</label>
              <input
                type="text"
                className="form-control bg-light"
                value={
                  form.fechaNacimiento ? `${edadActual} años` : "Por definir"
                }
                disabled
              />
            </div>

            {/* Correo Electrónico */}
            <div className="col-12">
              <label htmlFor="correo" className="form-label fw-semibold">
                Correo Electrónico <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="form-control"
                placeholder="usuario@duocuc.cl / usuario@gmail.com"
                value={form.correo}
                onChange={handleChange}
              />
              <small className="text-muted">
                Dominios aceptados: @duocuc.cl, @profesor.duoc.cl, @gmail.com,
                @outlook.com, @hotmail.com
              </small>
            </div>

            {/* Dirección */}
            <div className="col-md-7">
              <label htmlFor="direccion" className="form-label fw-semibold">
                Dirección de Domicilio <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                className="form-control"
                placeholder="Av. Concha y Toro 1234"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Selección de Región */}
            <div className="col-md-5">
              <label htmlFor="region" className="form-label fw-semibold">
                Región <span className="text-danger">*</span>
              </label>
              <select
                id="region"
                name="region"
                className="form-select"
                value={form.region}
                onChange={handleChange}
              >
                <option value="">-- Selecciona Región --</option>
                <option value="Metropolitana">Región Metropolitana</option>
                <option value="Valparaíso">Región de Valparaíso</option>
                <option value="Biobío">Región del Biobío</option>
                <option value="Coquimbo">Región de Coquimbo</option>
                <option value="Araucanía">Región de la Araucanía</option>
                <option value="Otra">Otra Región</option>
              </select>
            </div>

            {/* Selección de Género */}
            <div className="col-12">
              <label className="form-label fw-semibold d-block">
                Género <span className="text-danger">*</span>
              </label>
              <div className="d-flex flex-wrap gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="genMasculino"
                    value="masculino"
                    checked={form.genero === "masculino"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="genMasculino">
                    Masculino
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="genFemenino"
                    value="femenino"
                    checked={form.genero === "femenino"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="genFemenino">
                    Femenino
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="genOtro"
                    value="otro"
                    checked={form.genero === "otro"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="genOtro">
                    Otro
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="genNoDecir"
                    value="prefiero_no_decir"
                    checked={form.genero === "prefiero_no_decir"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="genNoDecir">
                    Prefiero no decir
                  </label>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div className="col-md-6">
              <label htmlFor="contrasena" className="form-label fw-semibold">
                Contraseña <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                className="form-control"
                placeholder="Mín. 8 caract., 1 mayúscula, 1 número"
                value={form.contrasena}
                onChange={handleChange}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="col-md-6">
              <label
                htmlFor="confirmarContrasena"
                className="form-label fw-semibold"
              >
                Confirmar Contraseña <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                className="form-control"
                placeholder="Repite tu contraseña"
                value={form.confirmarContrasena}
                onChange={handleChange}
              />
            </div>

            {/* Términos y Condiciones */}
            <div className="col-12 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="aceptaTerminos"
                  name="aceptaTerminos"
                  checked={form.aceptaTerminos}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label text-muted small"
                  htmlFor="aceptaTerminos"
                >
                  Acepto las condiciones de registro y las políticas de uso de
                  Ferretería Los Maestros <span className="text-danger">*</span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-warning fw-bold w-100 mt-4 py-2"
          >
            Registrarme como Cliente
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-warning fw-bold">
              Inicia Sesión aquí
            </Link>
          </small>
        </div>
      </div>
    </main>
  );
}
