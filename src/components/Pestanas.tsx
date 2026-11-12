import React from "react";

export interface Pestana<T extends string> {
  id: T;
  titulo: string;
}

interface PestanasProps<T extends string> {
  pestanas: Pestana<T>[];
  activa: T;
  onCambiar: (id: T) => void;
}

/** Navegación por pestañas con Bootstrap (nav-tabs) para los paneles de Admin y Vendedor. */
export default function Pestanas<T extends string>({
  pestanas,
  activa,
  onCambiar,
}: PestanasProps<T>) {
  return (
    <ul className="nav nav-tabs mb-4 fw-bold">
      {pestanas.map((p) => (
        <li className="nav-item" key={p.id}>
          <button
            type="button"
            className={`nav-link ${activa === p.id ? "active text-dark" : "text-secondary"}`}
            onClick={() => onCambiar(p.id)}
          >
            {p.titulo}
          </button>
        </li>
      ))}
    </ul>
  );
}
