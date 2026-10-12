import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productosSemilla } from "../data/productos";
import { leer, guardar } from "../utils/storage";
import { precioEfectivo } from "../utils/format";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState(() => leer("productos", productosSemilla));
  const [carrito, setCarrito] = useState(() => leer("carrito", []));
  const [usuarios, setUsuarios] = useState(() => leer("usuarios", []));
  const [usuarioActivo, setUsuarioActivo] = useState(() => leer("usuarioActivo", null));

  // Persistencia en localStorage (mismas claves que la versión original)
  useEffect(() => guardar("productos", productos), [productos]);
  useEffect(() => guardar("carrito", carrito), [carrito]);
  useEffect(() => guardar("usuarios", usuarios), [usuarios]);
  useEffect(() => {
    if (usuarioActivo) guardar("usuarioActivo", usuarioActivo);
  }, [usuarioActivo]);

  const totalItems = useMemo(() => carrito.reduce((s, i) => s + i.cantidad, 0), [carrito]);
  const totalCompra = useMemo(
    () => carrito.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0),
    [carrito]
  );

  /** Agrega al carrito validando stock. Devuelve { ok, mensaje }. */
  const agregarAlCarrito = useCallback(
    (idProducto, cantidadDeseada = 1) => {
      const prod = productos.find((p) => p.id === idProducto);
      if (!prod) return { ok: false, mensaje: "Producto no encontrado." };

      const enCarrito = carrito.find((i) => i.idProducto === idProducto);
      const cantidadActual = enCarrito ? enCarrito.cantidad : 0;

      if (cantidadActual + cantidadDeseada > prod.stock) {
        return {
          ok: false,
          mensaje: `No hay suficiente stock. Stock disponible: ${prod.stock}. En el carrito ya tienes: ${cantidadActual}`,
        };
      }

      setCarrito((prev) => {
        const existe = prev.find((i) => i.idProducto === idProducto);
        if (existe) {
          return prev.map((i) =>
            i.idProducto === idProducto ? { ...i, cantidad: i.cantidad + cantidadDeseada } : i
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

      return { ok: true, mensaje: `¡"${prod.nombre}" fue agregado al carrito!` };
    },
    [productos, carrito]
  );

  /** Cambia la cantidad de un ítem. Devuelve { ok, mensaje } (mensaje solo si hay error de stock). */
  const modificarCantidad = useCallback(
    (index, nuevaCantidad) => {
      const qty = parseInt(nuevaCantidad, 10);
      if (isNaN(qty) || qty <= 0) return { ok: false, mensaje: null };

      const item = carrito[index];
      const prod = productos.find((p) => p.id === item.idProducto);
      if (prod && qty > prod.stock) {
        return {
          ok: false,
          mensaje: `Atención: El stock máximo disponible para este producto es de ${prod.stock} unidades.`,
        };
      }

      setCarrito((prev) => prev.map((it, i) => (i === index ? { ...it, cantidad: qty } : it)));
      return { ok: true, mensaje: null };
    },
    [carrito, productos]
  );

  const eliminarItem = useCallback(
    (index) => setCarrito((prev) => prev.filter((_, i) => i !== index)),
    []
  );

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  /** Descuenta stock y vacía el carrito. */
  const finalizarCompra = useCallback(() => {
    if (carrito.length === 0) return;
    setProductos((prev) =>
      prev.map((p) => {
        const item = carrito.find((i) => i.idProducto === p.id);
        return item ? { ...p, stock: p.stock - item.cantidad } : p;
      })
    );
    setCarrito([]);
  }, [carrito]);

  const registrarUsuario = useCallback((usuario) => setUsuarios((prev) => [...prev, usuario]), []);

  /** Reemplaza un usuario (por email): intentos fallidos / bloqueo. */
  const actualizarUsuario = useCallback(
    (usuario) => setUsuarios((prev) => prev.map((u) => (u.email === usuario.email ? usuario : u))),
    []
  );

  const value = {
    productos,
    carrito,
    usuarios,
    usuarioActivo,
    setUsuarioActivo,
    totalItems,
    totalCompra,
    agregarAlCarrito,
    modificarCantidad,
    eliminarItem,
    vaciarCarrito,
    finalizarCompra,
    registrarUsuario,
    actualizarUsuario,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
