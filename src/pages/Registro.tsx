import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { useRedireccion } from "../hooks/useRedireccion";
import { DatosUsuario, RespuestaOperacion } from "../types";
import Alerta from "../components/Alerta";
import FormularioUsuario from "../components/FormularioUsuario";

export default function Registro() {
  const { registrarse } = useStore();
  const { alerta, mostrarRespuesta } = useAlerta(0);
  const redirigir = useRedireccion();

  const handleGuardar = async (datos: DatosUsuario): Promise<RespuestaOperacion> => {
    const res = await registrarse(datos);
    if (res.ok) {
      mostrarRespuesta({
        ok: true,
        mensaje: "¡Registro exitoso! Redirigiendo a Iniciar Sesión...",
      });
      redirigir("/login", 1500);
    } else {
      mostrarRespuesta(res);
    }
    return res;
  };

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

        <FormularioUsuario
          modo="registro"
          rolFijo="cliente"
          textoBoton="Registrarme como Cliente"
          onGuardar={handleGuardar}
        />

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
