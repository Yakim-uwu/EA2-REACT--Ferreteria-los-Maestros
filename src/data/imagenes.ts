// Imágenes disponibles en /public/IMG para asignar a los productos
export interface OpcionImagen {
  ruta: string;
  etiqueta: string;
}

export const IMAGENES_DISPONIBLES: OpcionImagen[] = [
  { ruta: "/IMG/taladro.jpg", etiqueta: "Taladro" },
  { ruta: "/IMG/llaves.jpg", etiqueta: "Llaves" },
  { ruta: "/IMG/pintura latex.jpg", etiqueta: "Pintura látex" },
  { ruta: "/IMG/esmalte.jpg", etiqueta: "Esmalte" },
  { ruta: "/IMG/polpaico.jpg", etiqueta: "Cemento" },
  { ruta: "/IMG/pino.jpg", etiqueta: "Madera de pino" },
  { ruta: "/IMG/tubo.jpg", etiqueta: "Tubo PVC" },
  { ruta: "/IMG/cable.jpg", etiqueta: "Cable eléctrico" },
  { ruta: "/IMG/mascarilla.jpg", etiqueta: "Mascarilla" },
  { ruta: "/IMG/melon.jpg", etiqueta: "Melón" },
];
