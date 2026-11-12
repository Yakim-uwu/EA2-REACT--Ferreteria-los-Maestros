import { Categoria } from "../types";

// Categorías iniciales si todavía no existen en localStorage
export const categoriasSemilla: Categoria[] = [
  {
    id: "cat-1",
    nombre: "Herramientas Manuales",
    descripcion: "Martillos, destornilladores, llaves",
  },
  {
    id: "cat-2",
    nombre: "Pinturas y Asfaltos",
    descripcion: "Esmaltes, látex y accesorios",
  },
  {
    id: "cat-3",
    nombre: "Materiales de Construcción",
    descripcion: "Cemento, maderas y fijaciones",
  },
  {
    id: "cat-4",
    nombre: "Gasfitería y Tubos",
    descripcion: "Tuberías y conexiones de PVC/Cobre",
  },
  {
    id: "cat-5",
    nombre: "Seguridad",
    descripcion: "Guantes, mascarillas y antiparraz",
  },
];
