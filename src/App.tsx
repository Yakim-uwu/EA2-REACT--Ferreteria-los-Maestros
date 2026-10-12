import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Detalle from "./pages/Detalle";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Vendedor from "./pages/Vendedor";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="detalle/:id" element={<Detalle />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="registro" element={<Registro />} />
            <Route path="login" element={<Login />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="admin" element={<Admin />} />
            <Route path="vendedor" element={<Vendedor />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
