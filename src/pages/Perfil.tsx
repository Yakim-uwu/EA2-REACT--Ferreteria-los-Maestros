import React, { useMemo } from "react";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { DatosUsuario, RespuestaOperacion } from "../types";
import { ETIQUETA_ROL, ROLES_QUE_COMPRAN } from "../utils/permisos";
import Alerta from "../components/Alerta";
import FormularioUsuario from "../components/FormularioUsuario";
import TablaPedidos from "../components/TablaPedidos";
import TituloPagina from "../components/TituloPagina";

export default function Perfil() {
  const { usuarioActivo, actualizarPerfil, pedidos } = useStore();
  const { alerta, mostrarRespuesta, limpiar } = useAlerta();

  const misPedidos = useMemo(
    () => pedidos.filter((p) => p.idCliente === usuarioActivo?.id),
    [pedidos, usuarioActivo],
  );

  // La ruta está protegida, pero se mantiene la guarda por seguridad de tipos
  if (!usuarioActivo) return null;

  const handleGuardar = async (datos: DatosUsuario): Promise<RespuestaOperacion> => {
    // El rol nunca se envía al store desde el perfil
    const { rol, ...datosPerfil } = datos;
    const res = await actualizarPerfil(datosPerfil);
    mostrarRespuesta(res);
    return res;
  };

  return (
    <main className="container my-4" style={{ maxWidth: "800px" }}>
      <TituloPagina>Mi Perfil 👤</TituloPagina>

      <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />

      <div className="card shadow-sm p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0">{usuarioActivo.nombreCompleto}</h4>
            <span className="badge bg-warning text-dark fw-bold text-uppercase mt-2">
              Rol: {ETIQUETA_ROL[usuarioActivo.rol]}
            </span>
          </div>
          <div className="text-end text-muted">
            <span className="fw-semibold">Edad calculada:</span>
            <div className="fs-5 fw-bold text-dark">{usuarioActivo.edad} años</div>
          </div>
        </div>

        <FormularioUsuario
          key={usuarioActivo.id}
          modo="edicion"
          usuarioInicial={usuarioActivo}
          rolFijo={usuarioActivo.rol}
          textoBoton="💾 Guardar Cambios"
          onGuardar={handleGuardar}
        />

        <div className="form-text text-muted bg-light p-2 rounded border small mt-3">
          ℹ️ <strong>Nota de Seguridad:</strong> Tu rol (
          <code>{usuarioActivo.rol}</code>) no se puede modificar desde este
          formulario. Solo un Administrador puede cambiar los roles en el Panel
          Admin.
        </div>
      </div>

      {ROLES_QUE_COMPRAN.includes(usuarioActivo.rol) && (
        <div className="card shadow-sm p-4">
          <h5 className="fw-bold mb-3">Mis Compras 🧾</h5>
          <TablaPedidos
            pedidos={misPedidos}
            mensajeVacio="Todavía no has realizado compras."
          />
        </div>
      )}
    </main>
  );
}
