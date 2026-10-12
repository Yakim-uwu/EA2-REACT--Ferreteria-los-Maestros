import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Login() {
  const { usuarios, setUsuarioActivo } = useStore();
  const { alerta, mostrar } = useAlerta();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !contrasena) {
      mostrar("Por favor ingresa tu correo y contraseña.");
      return;
    }

    const usuarioEncontrado = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === correo.trim().toLowerCase() &&
        u.contrasena === contrasena,
    );

    if (usuarioEncontrado) {
      setUsuarioActivo(usuarioEncontrado);
      mostrar(`¡Bienvenido/a ${usuarioEncontrado.nombreCompleto}!`, false);
      setTimeout(() => navigate("/perfil"), 1000);
    } else {
      mostrar("Credenciales incorrectas. Revisa el correo y la contraseña.");
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow-sm p-4">
        <h2 className="text-center fw-bold text-warning mb-4">
          Iniciar Sesión 🔑
        </h2>

        <Alerta alerta={alerta} />

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold py-2 mb-3"
          >
            Ingresar
          </button>

          <p className="text-center mb-0">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
