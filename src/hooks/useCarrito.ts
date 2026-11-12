import { useCallback, useEffect, useMemo } from "react";
import {
  ItemCarrito,
  Pedido,
  Producto,
  RespuestaOperacion,
  Usuario,
} from "../types";
import { precioEfectivo } from "../utils/format";
import { ETIQUETA_ROL, puedeComprar } from "../utils/permisos";
import { useLocalStorage } from "./useLocalStorage";

interface ParametrosCarrito {
  productos: Producto[];
  usuarioActivo: Usuario | null;
  descontarStock: (items: ItemCarrito[]) => void;
}

/** Carrito de compras e historial de pedidos. */
export function useCarrito({
  productos,
  usuarioActivo,
  descontarStock,
}: ParametrosCarrito) {
  const [carrito, setCarrito] = useLocalStorage<ItemCarrito[]>("carrito", []);
  const [pedidos, setPedidos] = useLocalStorage<Pedido[]>("pedidos", []);

  const totalItems = useMemo(
    () => carrito.reduce((suma, i) => suma + i.cantidad, 0),
    [carrito],
  );
  const totalCompra = useMemo(
    () => carrito.reduce((suma, i) => suma + i.precioUnitario * i.cantidad, 0),
    [carrito],
  );

  // Mantiene el carrito coherente con el catálogo: si un producto se elimina,
  // se agota o cambia de precio/stock, el carrito se actualiza solo.
  useEffect(() => {
    setCarrito((prev) => {
      let huboCambios = false;
      const siguiente: ItemCarrito[] = [];

      for (const item of prev) {
        const prod = productos.find((p) => p.id === item.idProducto);
        if (!prod || prod.stock <= 0) {
          huboCambios = true;
          continue;
        }
        const cantidad = Math.min(item.cantidad, prod.stock);
        const precio = precioEfectivo(prod);
        const sinCambios =
          cantidad === item.cantidad &&
          precio === item.precioUnitario &&
          prod.nombre === item.nombre &&
          prod.imagen === item.imagen;

        if (sinCambios) {
          siguiente.push(item);
        } else {
          huboCambios = true;
          siguiente.push({
            ...item,
            cantidad,
            precioUnitario: precio,
            nombre: prod.nombre,
            imagen: prod.imagen,
          });
        }
      }
      return huboCambios ? siguiente : prev;
    });
  }, [productos, setCarrito]);

  const agregarAlCarrito = useCallback(
    (idProducto: string, cantidadDeseada: number = 1): RespuestaOperacion => {
      if (usuarioActivo && !puedeComprar(usuarioActivo.rol)) {
        return {
          ok: false,
          mensaje: `Tu perfil de ${ETIQUETA_ROL[usuarioActivo.rol].toLowerCase()} no realiza compras. Ingresa con una cuenta de cliente.`,
        };
      }
      if (!Number.isInteger(cantidadDeseada) || cantidadDeseada <= 0) {
        return { ok: false, mensaje: "Ingresa una cantidad entera mayor a 0." };
      }

      const prod = productos.find((p) => p.id === idProducto);
      if (!prod) return { ok: false, mensaje: "Producto no encontrado." };
      if (prod.stock <= 0) return { ok: false, mensaje: "Producto agotado." };

      const cantidadActual =
        carrito.find((i) => i.idProducto === idProducto)?.cantidad ?? 0;

      if (cantidadActual + cantidadDeseada > prod.stock) {
        return {
          ok: false,
          mensaje: `No hay suficiente stock disponible (${prod.stock}). Ya tienes ${cantidadActual} en el carrito.`,
        };
      }

      setCarrito((prev) => {
        const existe = prev.some((i) => i.idProducto === idProducto);
        if (existe) {
          return prev.map((i) =>
            i.idProducto === idProducto
              ? { ...i, cantidad: i.cantidad + cantidadDeseada }
              : i,
          );
        }
        return [
          ...prev,
          {
            idProducto: prod.id,
            nombre: prod.nombre,
            precioUnitario: precioEfectivo(prod),
            imagen: prod.imagen,
            cantidad: cantidadDeseada,
          },
        ];
      });

      return { ok: true, mensaje: `¡"${prod.nombre}" agregado al carrito!` };
    },
    [productos, carrito, usuarioActivo, setCarrito],
  );

  const modificarCantidad = useCallback(
    (idProducto: string, nuevaCantidad: number | string): RespuestaOperacion => {
      const cantidad =
        typeof nuevaCantidad === "string"
          ? Number(nuevaCantidad)
          : nuevaCantidad;
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        return { ok: false, mensaje: "Ingresa una cantidad entera mayor a 0." };
      }

      const prod = productos.find((p) => p.id === idProducto);
      if (prod && cantidad > prod.stock) {
        return {
          ok: false,
          mensaje: `El stock máximo disponible para este producto es de ${prod.stock} unidades.`,
        };
      }

      setCarrito((prev) =>
        prev.map((i) => (i.idProducto === idProducto ? { ...i, cantidad } : i)),
      );
      return { ok: true, mensaje: null };
    },
    [productos, setCarrito],
  );

  const eliminarItem = useCallback(
    (idProducto: string) =>
      setCarrito((prev) => prev.filter((i) => i.idProducto !== idProducto)),
    [setCarrito],
  );

  const vaciarCarrito = useCallback(() => setCarrito([]), [setCarrito]);

  const finalizarCompra = useCallback((): RespuestaOperacion => {
    if (carrito.length === 0) {
      return { ok: false, mensaje: "Tu carrito de compras está vacío." };
    }
    if (!usuarioActivo) {
      return {
        ok: false,
        mensaje: "Debes iniciar sesión para finalizar la compra.",
      };
    }
    if (!puedeComprar(usuarioActivo.rol)) {
      return {
        ok: false,
        mensaje: `Tu perfil de ${ETIQUETA_ROL[usuarioActivo.rol].toLowerCase()} no realiza compras. Ingresa con una cuenta de cliente.`,
      };
    }

    // Se revalida el stock justo antes de confirmar la compra
    for (const item of carrito) {
      const prod = productos.find((p) => p.id === item.idProducto);
      if (!prod || prod.stock < item.cantidad) {
        return {
          ok: false,
          mensaje: `No hay stock suficiente de "${item.nombre}".`,
        };
      }
    }

    const pedido: Pedido = {
      id: `ped-${Date.now()}`,
      fecha: new Date().toISOString(),
      idCliente: usuarioActivo.id,
      nombreCliente: usuarioActivo.nombreCompleto,
      items: carrito,
      total: totalCompra,
    };

    descontarStock(carrito);
    setPedidos((prev) => [pedido, ...prev]);
    setCarrito([]);
    return {
      ok: true,
      mensaje: "¡Compra realizada con éxito! Revisa el detalle en tu perfil.",
    };
  }, [
    carrito,
    productos,
    usuarioActivo,
    totalCompra,
    descontarStock,
    setPedidos,
    setCarrito,
  ]);

  return {
    carrito,
    pedidos,
    totalItems,
    totalCompra,
    agregarAlCarrito,
    modificarCantidad,
    eliminarItem,
    vaciarCarrito,
    finalizarCompra,
  };
}
