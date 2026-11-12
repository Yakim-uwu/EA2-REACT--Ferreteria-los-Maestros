import { Producto } from "../types";

export const clp = (n: number): string => (n ?? 0).toLocaleString("es-CL");

// Las imágenes viven en /public/IMG; encodeURI maneja nombres con espacios
export const imgSrc = (ruta: string): string => {
  const origen = ruta || "/IMG/taladro.jpg";

  // Si es una URL externa completa, la devuelve tal cual
  if (origen.startsWith("http://") || origen.startsWith("https://")) {
    return origen;
  }

  // Quita el slash inicial si ya lo trae para evitar la doble barra (//)
  const rutaLimpia = origen.startsWith("/") ? origen.slice(1) : origen;
  const baseUrl = import.meta.env.BASE_URL || "/";
  const baseLimpia = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return encodeURI(`${baseLimpia}${rutaLimpia}`);
};

export const tieneOferta = (
  p: Pick<Producto, "precio" | "precioOferta">,
): boolean => p.precioOferta !== undefined && p.precioOferta > 0;

export const precioEfectivo = (
  p: Pick<Producto, "precio" | "precioOferta">,
): number => (tieneOferta(p) ? (p.precioOferta as number) : p.precio);

// Edad derivada a partir de fechaNacimiento (yyyy-mm-dd).
// Se separa la fecha a mano para evitar el desfase de zona horaria de new Date("yyyy-mm-dd").
export const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
  if (!anio || !mes || !dia) return 0;

  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  if (mesActual < mes || (mesActual === mes && hoy.getDate() < dia)) {
    edad--;
  }
  return edad < 0 ? 0 : edad;
};

export const formatearFecha = (iso: string): string =>
  new Date(iso).toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
