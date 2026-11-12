import { useCallback } from "react";
import { Categoria, ItemCarrito, Producto, RespuestaOperacion } from "../types";
import { productosSemilla } from "../data/productos";
import { categoriasSemilla } from "../data/categorias";
import { useLocalStorage } from "./useLocalStorage";

const normalizar = (texto: string): string => texto.trim().toLowerCase();

/** Productos y categorías: estado, persistencia y reglas de negocio del catálogo. */
export function useCatalogo() {
  const [productos, setProductos] = useLocalStorage<Producto[]>(
    "productos",
    productosSemilla,
  );
  const [categorias, setCategorias] = useLocalStorage<Categoria[]>(
    "categorias",
    categoriasSemilla,
  );

  // --- Productos ---
  const crearProducto = useCallback(
    (nuevo: Omit<Producto, "id">): RespuestaOperacion => {
      setProductos((prev) => [...prev, { ...nuevo, id: `prod-${Date.now()}` }]);
      return { ok: true, mensaje: "Producto creado correctamente." };
    },
    [setProductos],
  );

  const actualizarProducto = useCallback(
    (actualizado: Producto): RespuestaOperacion => {
      setProductos((prev) =>
        prev.map((p) => (p.id === actualizado.id ? actualizado : p)),
      );
      return { ok: true, mensaje: "Producto actualizado correctamente." };
    },
    [setProductos],
  );

  const eliminarProducto = useCallback(
    (id: string): RespuestaOperacion => {
      setProductos((prev) => prev.filter((p) => p.id !== id));
      return { ok: true, mensaje: "Producto eliminado correctamente." };
    },
    [setProductos],
  );

  const modificarStockProducto = useCallback(
    (idProducto: string, nuevoStock: number): RespuestaOperacion => {
      if (!Number.isInteger(nuevoStock) || nuevoStock < 0) {
        return {
          ok: false,
          mensaje: "El stock debe ser un número entero igual o mayor a 0.",
        };
      }
      setProductos((prev) =>
        prev.map((p) =>
          p.id === idProducto ? { ...p, stock: nuevoStock } : p,
        ),
      );
      return { ok: true, mensaje: "Stock actualizado correctamente." };
    },
    [setProductos],
  );

  /** Descuenta del stock lo vendido (se usa al finalizar una compra). */
  const descontarStock = useCallback(
    (items: ItemCarrito[]): void => {
      setProductos((prev) =>
        prev.map((p) => {
          const item = items.find((i) => i.idProducto === p.id);
          return item
            ? { ...p, stock: Math.max(0, p.stock - item.cantidad) }
            : p;
        }),
      );
    },
    [setProductos],
  );

  // --- Categorías ---
  const crearCategoria = useCallback(
    (nueva: Omit<Categoria, "id">): RespuestaOperacion => {
      if (categorias.some((c) => normalizar(c.nombre) === normalizar(nueva.nombre))) {
        return {
          ok: false,
          mensaje: `Ya existe una categoría llamada "${nueva.nombre.trim()}".`,
        };
      }
      setCategorias((prev) => [...prev, { ...nueva, id: `cat-${Date.now()}` }]);
      return { ok: true, mensaje: "Categoría creada exitosamente." };
    },
    [categorias, setCategorias],
  );

  const actualizarCategoria = useCallback(
    (actualizada: Categoria): RespuestaOperacion => {
      const anterior = categorias.find((c) => c.id === actualizada.id);
      if (!anterior) return { ok: false, mensaje: "La categoría no existe." };

      const duplicada = categorias.some(
        (c) =>
          c.id !== actualizada.id &&
          normalizar(c.nombre) === normalizar(actualizada.nombre),
      );
      if (duplicada) {
        return {
          ok: false,
          mensaje: `Ya existe una categoría llamada "${actualizada.nombre.trim()}".`,
        };
      }

      setCategorias((prev) =>
        prev.map((c) => (c.id === actualizada.id ? actualizada : c)),
      );
      // Los productos guardan el nombre de su categoría: se mantienen sincronizados
      if (anterior.nombre !== actualizada.nombre) {
        setProductos((prev) =>
          prev.map((p) =>
            p.categoria === anterior.nombre
              ? { ...p, categoria: actualizada.nombre }
              : p,
          ),
        );
      }
      return { ok: true, mensaje: "Categoría actualizada exitosamente." };
    },
    [categorias, setCategorias, setProductos],
  );

  const eliminarCategoria = useCallback(
    (id: string): RespuestaOperacion => {
      const categoria = categorias.find((c) => c.id === id);
      if (!categoria) return { ok: false, mensaje: "La categoría no existe." };

      const enUso = productos.filter((p) => p.categoria === categoria.nombre).length;
      if (enUso > 0) {
        return {
          ok: false,
          mensaje: `No puedes eliminar "${categoria.nombre}": tiene ${enUso} producto(s) asociado(s).`,
        };
      }
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      return { ok: true, mensaje: "Categoría eliminada." };
    },
    [categorias, productos, setCategorias],
  );

  return {
    productos,
    categorias,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    modificarStockProducto,
    descontarStock,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}
