import { Producto } from "../types";

export const categorias: string[] = [
  "Herramientas Manuales",
  "Pinturas y Esfaltos",
  "Materiales de Construcción",
  "Gasitería y Tubos",
];

export const productosSemilla: Producto[] = [
  {
    id: "prod-1",
    nombre: "Taladro Percutor 750W",
    descripcion:
      "Taladro percutor de alta potencia con velocidad variable y empuñadura ergonómica.",
    precio: 45990,
    precioOferta: 39990,
    stock: 15,
    categoria: "Herramientas Manuales",
    imagen: "/IMG/taladro.jpg",
  },
  {
    id: "prod-2",
    nombre: "Juego de Llaves Combinadas 12 Pzas",
    descripcion:
      "Set de llaves de cromo vanadio de alta resistencia en organizador plástico.",
    precio: 19990,
    stock: 25,
    categoria: "Herramientas Manuales",
    imagen: "/IMG/llaves.jpg",
  },
  {
    id: "prod-3",
    nombre: "Pintura Látex Extra Cubriente 5 Gal",
    descripcion:
      "Pintura látex lavable de alto rendimiento para interiores y exteriores.",
    precio: 34990,
    precioOferta: 29990,
    stock: 10,
    categoria: "Pinturas y Esfaltos",
    imagen: "/IMG/pintura latex.jpg",
  },
  {
    id: "prod-4",
    nombre: "Esmalte Sintético Blanco 1 Gal",
    descripcion: "Esmalte anticorrosivo acabado brillante de secado rápido.",
    precio: 18990,
    stock: 18,
    categoria: "Pinturas y Esfaltos",
    imagen: "/IMG/esmalte.jpg",
  },
  {
    id: "prod-5",
    nombre: "Saco Cemento Polpaico 25 kg",
    descripcion:
      "Cemento especial para albañilería y hormigón de alta durabilidad.",
    precio: 4990,
    stock: 50,
    categoria: "Materiales de Construcción",
    imagen: "/IMG/polpaico.jpg",
  },
  {
    id: "prod-6",
    nombre: "Pino Oregón 2x4 3.2m",
    descripcion: "Madera de pino cepillada y seca en cámara para estructuras.",
    precio: 6490,
    stock: 40,
    categoria: "Materiales de Construcción",
    imagen: "/IMG/pino.jpg",
  },
  {
    id: "prod-7",
    nombre: "Tubo PVC Hidráulico 25mm 6m",
    descripcion: "Tubo de PVC para conducción de agua potable a presión.",
    precio: 3290,
    stock: 30,
    categoria: "Gasitería y Tubos",
    imagen: "/IMG/tubo.jpg",
  },
  {
    id: "prod-8",
    nombre: "Cable Eléctrico EVA 2.5mm2 100m",
    descripcion:
      "Rollos de cable eléctrico libre de halógenos para instalaciones domiciliarias.",
    precio: 28990,
    precioOferta: 24990,
    stock: 12,
    categoria: "Gasitería y Tubos",
    imagen: "/IMG/cable.jpg",
  },
];
