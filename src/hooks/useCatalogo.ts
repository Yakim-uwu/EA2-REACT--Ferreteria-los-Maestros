import { useCallback, useEffect, useState } from "react";
import { Categoria, Producto, RespuestaOperacion } from "../types";
import { productoService } from "../services/productoService";
import { categoriaService } from "../services/categoriaService";
import { mensajeDeError } from "../utils/errores";

/**
 * Productos y categorías. Los datos viven en el backend (MySQL): este hook los lee y
 * envía las operaciones por la API. Las reglas de negocio (nombres únicos, stock, ofertas,
 * categorías con productos) las valida el backend y sus mensajes se muestran tal cual.
 */
export function useCatalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState<boolean>(true);
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null);

  // Lee productos y categorías desde el backend. "silencioso" refresca sin mostrar el spinner.
  const cargarCatalogo = useCallback(
    async (silencioso: boolean): Promise<void> => {
      if (!silencioso) {
        setCargandoCatalogo(true);
        setErrorCatalogo(null);
      }
      try {
        const [listaProductos, listaCategorias] = await Promise.all([
          productoService.obtenerTodos(),
          categoriaService.obtenerTodas(),
        ]);
        setProductos(listaProductos);
        setCategorias(listaCategorias);
      } catch (error) {
        if (!silencioso) setErrorCatalogo(mensajeDeError(error));
      } finally {
        if (!silencioso) setCargandoCatalogo(false);
      }
    },
    [],
  );

  const recargarCatalogo = useCallback(
    () => cargarCatalogo(false),
    [cargarCatalogo],
  );
  const refrescarCatalogo = useCallback(
    () => cargarCatalogo(true),
    [cargarCatalogo],
  );

  useEffect(() => {
    void cargarCatalogo(false);
  }, [cargarCatalogo]);

  // El formulario de productos trabaja con el nombre de la categoría; la API pide su id
  const idDeCategoria = useCallback(
    (nombre: string): number | null => {
      const categoria = categorias.find((c) => c.nombre === nombre);
      return categoria ? Number(categoria.id) : null;
    },
    [categorias],
  );

  // --- Productos ---
  const crearProducto = useCallback(
    async (nuevo: Omit<Producto, "id">): Promise<RespuestaOperacion> => {
      const idCategoria = idDeCategoria(nuevo.categoria);
      if (idCategoria === null) {
        return { ok: false, mensaje: "La categoría seleccionada no existe." };
      }
      try {
        const creado = await productoService.crear(nuevo, idCategoria);
        setProductos((prev) => [...prev, creado]);
        return { ok: true, mensaje: "Producto creado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [idDeCategoria],
  );

  const actualizarProducto = useCallback(
    async (actualizado: Producto): Promise<RespuestaOperacion> => {
      const idCategoria = idDeCategoria(actualizado.categoria);
      if (idCategoria === null) {
        return { ok: false, mensaje: "La categoría seleccionada no existe." };
      }
      try {
        const { id, ...datos } = actualizado;
        const guardado = await productoService.actualizar(
          id,
          datos,
          idCategoria,
        );
        setProductos((prev) => prev.map((p) => (p.id === id ? guardado : p)));
        return { ok: true, mensaje: "Producto actualizado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [idDeCategoria],
  );

  const eliminarProducto = useCallback(
    async (id: string): Promise<RespuestaOperacion> => {
      try {
        await productoService.eliminar(id);
        setProductos((prev) => prev.filter((p) => p.id !== id));
        return { ok: true, mensaje: "Producto eliminado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  const modificarStockProducto = useCallback(
    async (
      idProducto: string,
      nuevoStock: number,
    ): Promise<RespuestaOperacion> => {
      if (!Number.isInteger(nuevoStock) || nuevoStock < 0) {
        return {
          ok: false,
          mensaje: "El stock debe ser un número entero igual o mayor a 0.",
        };
      }
      try {
        const actualizado = await productoService.actualizarStock(
          idProducto,
          nuevoStock,
        );
        setProductos((prev) =>
          prev.map((p) => (p.id === idProducto ? actualizado : p)),
        );
        return { ok: true, mensaje: "Stock actualizado correctamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  // --- Categorías ---
  const crearCategoria = useCallback(
    async (nueva: Omit<Categoria, "id">): Promise<RespuestaOperacion> => {
      try {
        const creada = await categoriaService.crear(nueva);
        setCategorias((prev) => [...prev, creada]);
        return { ok: true, mensaje: "Categoría creada exitosamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  const actualizarCategoria = useCallback(
    async (actualizada: Categoria): Promise<RespuestaOperacion> => {
      try {
        const { id, ...datos } = actualizada;
        const guardada = await categoriaService.actualizar(id, datos);
        setCategorias((prev) => prev.map((c) => (c.id === id ? guardada : c)));
        // Los productos muestran el nombre de su categoría: se refrescan para ver el cambio
        await cargarCatalogo(true);
        return { ok: true, mensaje: "Categoría actualizada exitosamente." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [cargarCatalogo],
  );

  const eliminarCategoria = useCallback(
    async (id: string): Promise<RespuestaOperacion> => {
      try {
        await categoriaService.eliminar(id);
        setCategorias((prev) => prev.filter((c) => c.id !== id));
        return { ok: true, mensaje: "Categoría eliminada." };
      } catch (error) {
        return { ok: false, mensaje: mensajeDeError(error) };
      }
    },
    [],
  );

  return {
    productos,
    categorias,
    cargandoCatalogo,
    errorCatalogo,
    recargarCatalogo,
    refrescarCatalogo,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    modificarStockProducto,

    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}
