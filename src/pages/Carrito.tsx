import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAlerta } from "../hooks/useAlerta";
import { useRedireccion } from "../hooks/useRedireccion";
import { clp, imgSrc } from "../utils/format";
import Alerta from "../components/Alerta";
import InputCantidad from "../components/InputCantidad";
import TituloPagina from "../components/TituloPagina";

export default function Carrito() {
  const {
    carrito,
    totalCompra,
    usuarioActivo,
    modificarCantidad,
    eliminarItem,
    vaciarCarrito,
    finalizarCompra,
  } = useStore();
  const { alerta, mostrar, mostrarRespuesta, limpiar } = useAlerta(0);
  const redirigir = useRedireccion();
  const navigate = useNavigate();

  const cambiarCantidad = (idProducto: string, valor: string) => {
    const res = modificarCantidad(idProducto, valor);
    if (res.ok) limpiar();
    else mostrarRespuesta(res);
  };

  const vaciar = () => {
    vaciarCarrito();
    mostrar("El carrito de compras fue vaciado.", false);
  };

  const finalizar = () => {
    // Regla de negocio: para comprar hay que haber iniciado sesión
    if (!usuarioActivo) {
      navigate("/login", { state: { desde: "/carrito" } });
      return;
    }
    const res = finalizarCompra();
    mostrarRespuesta(res);
    if (res.ok) redirigir("/perfil", 2000);
  };

  return (
    <main className="container my-5">
      <TituloPagina>Carrito de Compras</TituloPagina>

      <Alerta alerta={alerta} onCerrar={limpiar} />

      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">Tu carrito de compras está vacío 🛒</h3>
          <p>Explora nuestras ofertas y agrega productos.</p>
          <Link to="/catalogo" className="btn btn-warning fw-bold mt-2">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive card shadow-sm mb-4">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.idProducto}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={imgSrc(item.imagen)}
                          alt={item.nombre}
                          className="rounded"
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                        <span className="fw-semibold">{item.nombre}</span>
                      </div>
                    </td>
                    <td>${clp(item.precioUnitario)}</td>
                    <td>
                      <InputCantidad
                        valor={item.cantidad}
                        etiqueta={`Cantidad de ${item.nombre}`}
                        ancho={70}
                        onConfirmar={(v) => cambiarCantidad(item.idProducto, v)}
                      />
                    </td>
                    <td className="fw-bold">
                      ${clp(item.precioUnitario * item.cantidad)}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => eliminarItem(item.idProducto)}
                        className="btn btn-sm btn-danger"
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card shadow-sm p-4 text-end">
            <h3 className="fw-bold mb-3">
              Total Compra: $
              <span className="text-danger">{clp(totalCompra)}</span>
            </h3>
            {!usuarioActivo && (
              <p className="text-muted small">
                Debes iniciar sesión para finalizar tu compra. Tu carrito se
                conserva.
              </p>
            )}
            <div className="d-flex justify-content-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={vaciar}
                className="btn btn-outline-danger fw-bold"
              >
                Vaciar Carrito
              </button>
              <button
                type="button"
                onClick={finalizar}
                className="btn btn-warning fw-bold px-4"
              >
                {usuarioActivo ? "Finalizar Compra" : "Iniciar Sesión para Comprar"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
