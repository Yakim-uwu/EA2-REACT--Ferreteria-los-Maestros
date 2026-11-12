import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Vendedor from "./pages/Vendedor";
import AccesoDenegado from "./pages/AccesoDenegado";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas públicas */}
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="detalle/:id" element={<Detalle />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="registro" element={<Registro />} />
            <Route path="login" element={<Login />} />
            <Route path="acceso-denegado" element={<AccesoDenegado />} />

            {/* Requiere sesión iniciada (cualquier rol) */}
            <Route element={<RutaProtegida />}>
              <Route path="perfil" element={<Perfil />} />
            </Route>

            {/* Panel de vendedor: vendedor y administrador */}
            <Route
              element={<RutaProtegida roles={["vendedor", "administrador"]} />}
            >
              <Route path="vendedor" element={<Vendedor />} />
            </Route>

            {/* Panel de administración: solo administrador */}
            <Route element={<RutaProtegida roles={["administrador"]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
