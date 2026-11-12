import React, { useState } from "react";
import AdminUsuarios from "../components/admin/AdminUsuarios";
import AdminProductos from "../components/admin/AdminProductos";
import AdminCategorias from "../components/admin/AdminCategorias";
import PanelVentas from "../components/PanelVentas";
import Pestanas, { Pestana } from "../components/Pestanas";
import TituloPagina from "../components/TituloPagina";

type IdPestanaAdmin = "usuarios" | "productos" | "categorias" | "ventas";

const PESTANAS: Pestana<IdPestanaAdmin>[] = [
  { id: "usuarios", titulo: "Usuarios y Roles" },
  { id: "productos", titulo: "Gestión de Productos" },
  { id: "categorias", titulo: "Gestión de Categorías" },
  { id: "ventas", titulo: "Ventas" },
];

// El acceso por rol se controla en App.tsx con <RutaProtegida roles={["administrador"]} />
export default function Admin() {
  const [activa, setActiva] = useState<IdPestanaAdmin>("usuarios");

  return (
    <main className="container my-4">
      <TituloPagina>Panel de Administración ⚙️</TituloPagina>

      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={setActiva} />

      {activa === "usuarios" && <AdminUsuarios />}
      {activa === "productos" && <AdminProductos />}
      {activa === "categorias" && <AdminCategorias />}
      {activa === "ventas" && <PanelVentas />}
    </main>
  );
}
