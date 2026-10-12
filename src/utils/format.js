export const clp = (n) => n.toLocaleString("es-CL");

// Las imágenes viven en /public/IMG; encodeURI maneja nombres con espacios
export const imgSrc = (ruta) => import.meta.env.BASE_URL + encodeURI(ruta);

export const precioEfectivo = (p) => p.precioOferta || p.precio;
