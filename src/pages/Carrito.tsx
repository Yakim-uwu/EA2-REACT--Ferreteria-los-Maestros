import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { clp, imgSrc } from "../utils/format";
import Alerta, { useAlerta } from "../components/Alerta";

interface CantidadInputProps {
  valor: number;
  onCommit: (nuevoValor: string) => void;
}

/** Input numérico que confirma el cambio al salir del campo o presionar Enter. */
function CantidadInput({ valor, onCommit }: CantidadInputProps) {
  const [draft, setDraft] = useState<string>(String(valor));

  useEffect(() => {
    setDraft(String(valor));
  }, [valor]);

  const confirmar = () => {
    onCommit(draft);
    setDraft(String(valor));
  };

  return (
    <input
      type="number"
      min="1"
      value={draft}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setDraft(e.target.value)
      }
      onBlur={confirmar}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className="form-control form-control-sm"
      style={{ width: 70 }}
    />
  );
}

export default function Carrito() {
  const {
    carrito,
    totalCompra,
    modificarCantidad,
    eliminarItem,
    vaciarCarrito,
    finalizarCompra,
  } = useStore();
  const { alerta, mostrar, limpiar } = useAlerta();
  const navigate = useNavigate();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const cambiarCantidad = (index: number, valor: string) => {
    const r = modificarCantidad(index, valor);
    if (r.ok) {
      limpiar();
    } else if (r.mensaje) {
      mostrar(r.mensaje, true);
    }
  };

  const vaciar = () => {
    vaciarCarrito();
    mostrar("El carrito de compras fue vaciado.", false);
  };

  const finalizar = () => {
    finalizarCompra();
    mostrar(
      "¡Compra realizada con éxito! Redirigiendo a la página principal...",
      false,
    );
    timer.current = window.setTimeout(() => navigate("/"), 2000);
  };

  return (
    <main className="container my-5">
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Carrito de Compras
      </h2>

      <Alerta alerta={alerta} />

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
                {carrito.map((item, index) => (
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
                      <CantidadInput
                        valor={item.cantidad}
                        onCommit={(v) => cambiarCantidad(index, v)}
                      />
                    </td>
                    <td className="fw-bold">
                      ${clp(item.precioUnitario * item.cantidad)}
                    </td>
                    <td>
                      <button
                        onClick={() => eliminarItem(index)}
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
            <div className="d-flex justify-content-end gap-2">
              <button
                onClick={vaciar}
                className="btn btn-outline-danger fw-bold"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={finalizar}
                className="btn btn-warning fw-bold px-4"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
