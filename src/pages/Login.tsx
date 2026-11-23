import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { useRedireccion } from "../hooks/useRedireccion";
import { rutaInicialPorRol } from "../utils/permisos";
import {
  CamposLogin,
  ErroresLogin,
  validarLogin,
} from "../utils/validaciones";
import Alerta from "../components/Alerta";
import CampoFormulario, { claseControl } from "../components/CampoFormulario";

// Cuentas de demostración (una por rol): al pulsarlas se completa el formulario,
// pero el ingreso sigue pasando por la validación y la autenticación normales.
const CUENTAS_DEMO: { rol: string; correo: string; contrasena: string }[] = [
  { rol: "Administrador", correo: "admin@ferreteria.cl", contrasena: "123456" },
  { rol: "Vendedor", correo: "vendedor@ferreteria.cl", contrasena: "123456" },
  { rol: "Cliente", correo: "cliente@ferreteria.cl", contrasena: "123456" },
];

export default function Login() {
  const { iniciarSesion } = useStore();
  const { alerta, mostrarRespuesta } = useAlerta(0);
  const redirigir = useRedireccion();
  const location = useLocation();
  const desde = (location.state as { desde?: string } | null)?.desde;

  const [form, setForm] = useState<CamposLogin>({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [enviando, setEnviando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name as keyof CamposLogin]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const erroresEncontrados = validarLogin(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    setEnviando(true);
    const res = await iniciarSesion(form.correo, form.contrasena);
    setEnviando(false);
    mostrarRespuesta(res);
    if (res.ok && res.usuario) {
      // Vuelve a la página que se intentó abrir; si no hubo una, va al inicio del rol
      redirigir(desde ?? rutaInicialPorRol(res.usuario.rol), 1000);
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow-sm p-4">
        <h2 className="text-center fw-bold text-warning mb-4">
          Iniciar Sesión 🔑
        </h2>

        <Alerta alerta={alerta} />

        <form onSubmit={handleLogin} noValidate>
          <CampoFormulario
            id="login-correo"
            etiqueta="Correo Electrónico"
            error={errores.correo}
            className="mb-3"
          >
            <input
              id="login-correo"
              name="correo"
              type="email"
              autoComplete="username"
              className={claseControl("form-control", errores.correo)}
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </CampoFormulario>

          <CampoFormulario
            id="login-contrasena"
            etiqueta="Contraseña"
            error={errores.contrasena}
            className="mb-4"
          >
            <input
              id="login-contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              className={claseControl("form-control", errores.contrasena)}
              value={form.contrasena}
              onChange={handleChange}
            />
          </CampoFormulario>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold py-2 mb-3"
            disabled={enviando}
          >
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-center mb-0">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>

        <hr className="my-4" />
        <p className="small text-muted mb-2 text-center">
          Cuentas de demostración (clic para completar el formulario):
        </p>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          {CUENTAS_DEMO.map((c) => (
            <button
              key={c.rol}
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setForm({ correo: c.correo, contrasena: c.contrasena });
                setErrores({});
              }}
            >
              {c.rol}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
