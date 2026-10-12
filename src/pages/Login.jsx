import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Login() {
  const { usuarios, actualizarUsuario, setUsuarioActivo } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { alerta, mostrar, limpiar } = useAlerta();
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const enviar = (e) => {
    e.preventDefault();
    limpiar();

    const usuario = usuarios.find((u) => u.email === email.trim());

    if (!usuario) {
      mostrar("Credenciales incorrectas o usuario no registrado.", true);
      return;
    }

    // Regla de bloqueo por 3 intentos fallidos consecutivos
    if (usuario.bloqueado) {
      mostrar("CUENTA BLOQUEADA: Has alcanzado el máximo de 3 intentos fallidos consecutivos.", true);
      return;
    }

    if (usuario.password === password) {
      const actualizado = { ...usuario, intentosFallidos: 0 };
      actualizarUsuario(actualizado);
      setUsuarioActivo(actualizado);
      mostrar(`¡Bienvenido ${usuario.nombre}! Redirigiendo...`, false);
      timer.current = setTimeout(() => navigate("/"), 1200);
    } else {
      const intentos = (usuario.intentosFallidos || 0) + 1;
      if (intentos >= 3) {
        actualizarUsuario({ ...usuario, intentosFallidos: intentos, bloqueado: true });
        mostrar("Cuenta bloqueada: Se ha alcanzado el límite de 3 intentos fallidos.", true);
      } else {
        actualizarUsuario({ ...usuario, intentosFallidos: intentos });
        mostrar(`Contraseña incorrecta. Intentos fallidos: ${intentos} de 3.`, true);
      }
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 text-dark fw-bold border-bottom border-warning border-3 d-inline-block pb-1">
                Iniciar Sesión
              </h3>

              <form onSubmit={enviar}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="usuario@duoc.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-warning w-100 fw-bold">Entrar</button>
                <Alerta alerta={alerta} />
              </form>

              <p className="text-center mt-3 mb-0 small text-muted">
                ¿Aún no posees una cuenta?{" "}
                <Link to="/registro" className="text-warning fw-bold text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
