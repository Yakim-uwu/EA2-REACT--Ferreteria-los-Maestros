import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import Alerta, { useAlerta } from "../components/Alerta";

const DOMINIOS_PERMITIDOS = ["@duoc.cl"];
const EDAD_MINIMA = 14;

const formInicial = {
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  email: "",
  password: "",
  confirmPassword: "",
  direccion: "",
  region: "",
  genero: "",
  terminos: false,
};

export default function Registro() {
  const { usuarios, registrarUsuario } = useStore();
  const [form, setForm] = useState(formInicial);
  const { alerta, mostrar, limpiar } = useAlerta();
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const enviar = (e) => {
    e.preventDefault();
    limpiar();

    const email = form.email.trim();
    const fechaNac = new Date(form.fechaNacimiento);

    // Dominio permitido
    if (!DOMINIOS_PERMITIDOS.some((d) => email.toLowerCase().endsWith(d))) {
      mostrar("Error de validación: El correo debe pertenecer a un dominio permitido (@duoc.cl).", true);
      return;
    }

    // Edad mínima
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

    if (edad < EDAD_MINIMA) {
      mostrar(`Error de validación: Debes tener al menos ${EDAD_MINIMA} años para registrarte.`, true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      mostrar("Error de validación: Las contraseñas ingresadas no coinciden.", true);
      return;
    }

    if (usuarios.some((u) => u.email === email)) {
      mostrar("El correo ya se encuentra registrado en el sistema.", true);
      return;
    }

    registrarUsuario({
      nombre: form.nombre,
      apellido: form.apellido,
      fechaNacimiento: fechaNac.toISOString().split("T")[0],
      email,
      password: form.password,
      direccion: form.direccion,
      region: form.region,
      genero: form.genero,
      intentosFallidos: 0,
      bloqueado: false,
    });

    mostrar("Usuario registrado correctamente. Redirigiendo...", false);
    timer.current = setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-3 text-dark fw-bold border-bottom border-warning border-3 d-inline-block pb-1">
                Registro de Usuario
              </h3>

              <form onSubmit={enviar}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nombre *</label>
                    <input name="nombre" className="form-control" value={form.nombre} onChange={cambiar} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Apellido *</label>
                    <input name="apellido" className="form-control" value={form.apellido} onChange={cambiar} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Fecha de Nacimiento *</label>
                    <input type="date" name="fechaNacimiento" className="form-control" value={form.fechaNacimiento} onChange={cambiar} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Correo electrónico *</label>
                    <input type="email" name="email" className="form-control" placeholder="ejemplo@duoc.cl" value={form.email} onChange={cambiar} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Contraseña *</label>
                    <input type="password" name="password" className="form-control" value={form.password} onChange={cambiar} required minLength={6} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Confirmar Contraseña *</label>
                    <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={cambiar} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Dirección *</label>
                  <input name="direccion" className="form-control" value={form.direccion} onChange={cambiar} required />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Región *</label>
                    <select name="region" className="form-select" value={form.region} onChange={cambiar} required>
                      <option value="">Seleccione Región</option>
                      <option value="RM">Región Metropolitana</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Género *</label>
                    <select name="genero" className="form-select" value={form.genero} onChange={cambiar} required>
                      <option value="">Seleccione Género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="terminos" name="terminos" checked={form.terminos} onChange={cambiar} required />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto las condiciones de registro *
                  </label>
                </div>

                <button type="submit" className="btn btn-warning w-100 fw-bold">Registrarse</button>
                <Alerta alerta={alerta} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
