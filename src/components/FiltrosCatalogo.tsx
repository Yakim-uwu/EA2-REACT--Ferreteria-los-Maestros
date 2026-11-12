import React from "react";
import { FiltrosProductos, OrdenProductos } from "../types";
import { clp } from "../utils/format";

interface FiltrosCatalogoProps {
  filtros: FiltrosProductos;
  categorias: string[];
  precioTope: number;
  totalResultados: number;
  onChange: (cambios: Partial<FiltrosProductos>) => void;
  onLimpiar: () => void;
}

export default function FiltrosCatalogo({
  filtros,
  categorias,
  precioTope,
  totalResultados,
  onChange,
  onLimpiar,
}: FiltrosCatalogoProps) {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label htmlFor="filterTexto" className="form-label fw-bold">
            Buscar
          </label>
          <input
            id="filterTexto"
            type="search"
            className="form-control"
            placeholder="Nombre o descripción..."
            value={filtros.texto}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ texto: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="filterCat" className="form-label fw-bold">
            Categoría
          </label>
          <select
            id="filterCat"
            className="form-select"
            value={filtros.categoria}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChange({ categoria: e.target.value })
            }
          >
            <option value="TODAS">Todas las Categorías</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="filterOrden" className="form-label fw-bold">
            Ordenar por
          </label>
          <select
            id="filterOrden"
            className="form-select"
            value={filtros.orden}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChange({ orden: e.target.value as OrdenProductos })
            }
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre (A-Z)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="filterPrice" className="form-label fw-bold">
            Precio Máximo: ${clp(filtros.precioMax)}
          </label>
          <input
            type="range"
            className="form-range"
            id="filterPrice"
            min={0}
            max={precioTope}
            step={1000}
            value={filtros.precioMax}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ precioMax: Number(e.target.value) })
            }
          />
        </div>

        <div className="col-md-3">
          <div className="form-check form-switch">
            <input
              id="filterOfertas"
              type="checkbox"
              className="form-check-input"
              checked={filtros.soloOfertas}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ soloOfertas: e.target.checked })
              }
            />
            <label htmlFor="filterOfertas" className="form-check-label fw-bold">
              Solo ofertas
            </label>
          </div>
        </div>

        <div className="col-md-3 d-flex align-items-center justify-content-md-end gap-3">
          <small className="text-muted">{totalResultados} producto(s)</small>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onLimpiar}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
