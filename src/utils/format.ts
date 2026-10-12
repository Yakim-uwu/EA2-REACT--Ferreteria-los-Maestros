import { Producto } from "../types";

export const clp = (n: number): string => (n ?? 0).toLocaleString("es-CL");

// Las imágenes viven en /public/IMG; encodeURI maneja nombres con espacios
export const imgSrc = (ruta: string): string =>
  import.meta.env.BASE_URL + encodeURI(ruta);

export const precioEfectivo = (
  p: Pick<Producto, "precio" | "precioOferta">,
): number => p.precioOferta || p.precio;

// Requerido por rúbrica: Cálculo de edad derivada a partir de fechaNacimiento
export const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad < 0 ? 0 : edad;
};
