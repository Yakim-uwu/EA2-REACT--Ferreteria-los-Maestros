import { FiltrosProductos, Producto } from "../types";
import { precioEfectivo, tieneOferta } from "./format";

export const FILTROS_INICIALES = (precioTope: number): FiltrosProductos => ({
  texto: "",
  categoria: "TODAS",
  precioMax: precioTope,
  soloOfertas: false,
  orden: "relevancia",
});

/** Precio más alto del catálogo, redondeado hacia arriba a múltiplos de 1.000. */
export const calcularPrecioTope = (productos: Producto[]): number => {
  const maximo = Math.max(1000, ...productos.map(precioEfectivo));
  return Math.ceil(maximo / 1000) * 1000;
};

/** Aplica búsqueda, categoría, precio, ofertas y orden. No modifica el arreglo original. */
export const filtrarProductos = (
  productos: Producto[],
  filtros: FiltrosProductos,
): Producto[] => {
  const texto = filtros.texto.trim().toLowerCase();

  const resultado = productos.filter((p) => {
    const coincideTexto =
      texto === "" ||
      p.nombre.toLowerCase().includes(texto) ||
      (p.descripcion ?? "").toLowerCase().includes(texto);
    const coincideCategoria =
      filtros.categoria === "TODAS" ||
      p.categoria === filtros.categoria ||
      p.categoriaId === filtros.categoria;
    const coincidePrecio = precioEfectivo(p) <= filtros.precioMax;
    const coincideOferta = !filtros.soloOfertas || tieneOferta(p);
    return coincideTexto && coincideCategoria && coincidePrecio && coincideOferta;
  });

  switch (filtros.orden) {
    case "precio_asc":
      return [...resultado].sort((a, b) => precioEfectivo(a) - precioEfectivo(b));
    case "precio_desc":
      return [...resultado].sort((a, b) => precioEfectivo(b) - precioEfectivo(a));
    case "nombre":
      return [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    default:
      return resultado;
  }
};
