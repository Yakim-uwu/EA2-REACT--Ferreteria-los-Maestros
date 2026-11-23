import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { DatosUsuario, RespuestaOperacion } from "../types";
import Alerta from "../components/Alerta";
import FormularioUsuario from "../components/FormularioUsuario";
import PanelStock from "../components/PanelStock";
import PanelVentas from "../components/PanelVentas";
import Pestanas, { Pestana } from "../components/Pestanas";
import TituloPagina from "../components/TituloPagina";

type IdPestanaVendedor = "stock" | "clientes" | "ventas";

const PESTANAS: Pestana<IdPestanaVendedor>[] = [
  { id: "stock", titulo: "Stock" },
  { id: "clientes", titulo: "Registrar Clientes" },
  { id: "ventas", titulo: "Ventas" },
];

// El acceso por rol se controla en App.tsx con <RutaProtegida roles={["vendedor", "administrador"]} />
export default function Vendedor() {
  const { usuarios, registrarUsuario } = useStore();
  const { alerta, mostrarRespuesta, limpiar } = useAlerta();
  const [activa, setActiva] = useState<IdPestanaVendedor>("stock");

  const clientes = usuarios.filter((u) => u.rol === "cliente");

  // Restricción de negocio: el vendedor crea exclusivamente cuentas con rol "cliente"
  const handleCrearCliente = async (
    datos: DatosUsuario,
  ): Promise<RespuestaOperacion> => {
    const res = await registrarUsuario({ ...datos, rol: "cliente" });
    mostrarRespuesta(res);
    return res;
  };

  return (
    <main className="container my-5">
      <TituloPagina>Panel de Gestión de Ventas 📦</TituloPagina>

      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={setActiva} />

      {activa === "stock" && <PanelStock />}

      {activa === "clientes" && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-1">Registrar Nuevo Cliente</h5>
              <small className="text-muted d-block mb-3">
                Como vendedor solo puedes registrar cuentas con rol Cliente.
              </small>
              <Alerta alerta={alerta} className="mb-3" onCerrar={limpiar} />
              <FormularioUsuario
                modo="alta"
                rolFijo="cliente"
                textoBoton="Registrar Cliente"
                onGuardar={handleCrearCliente}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">
                Clientes Registrados ({clientes.length})
              </h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Región</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nombreCompleto}</td>
                        <td className="small">{c.correo}</td>
                        <td className="small">{c.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activa === "ventas" && <PanelVentas />}
    </main>
  );
}
