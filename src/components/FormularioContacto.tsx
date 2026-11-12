import React, { useState } from "react";
import Alerta from "./Alerta";
import CampoFormulario, { claseControl } from "./CampoFormulario";
import { useAlerta } from "../hooks/useAlerta";
import {
  CamposContacto,
  ErroresContacto,
  validarContacto,
} from "../utils/validaciones";

const FORMULARIO_VACIO: CamposContacto = {
  nombre: "",
  correo: "",
  telefono: "",
  asunto: "consulta",
  mensaje: "",
};

export default function FormularioContacto() {
  const { alerta, mostrar, limpiar } = useAlerta();
  const [form, setForm] = useState<CamposContacto>(FORMULARIO_VACIO);
  const [errores, setErrores] = useState<ErroresContacto>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name as keyof CamposContacto]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const erroresEncontrados = validarContacto(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) {
      mostrar("Revisa los campos marcados en rojo.");
      return;
    }

    limpiar();
    mostrar(
      "¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente.",
      false,
    );
    setForm(FORMULARIO_VACIO);
  };

  return (
    <div className="card shadow-sm p-4 my-4">
      <h3 className="fw-bold text-warning border-bottom border-warning border-2 pb-2 mb-3">
        ✉️ Formulario de Contacto y Consultas
      </h3>

      <Alerta alerta={alerta} onCerrar={limpiar} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <CampoFormulario
            id="contacto-nombre"
            etiqueta="Nombre Completo"
            obligatorio
            error={errores.nombre}
            className="col-md-6"
          >
            <input
              type="text"
              id="contacto-nombre"
              name="nombre"
              className={claseControl("form-control", errores.nombre)}
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: María González"
            />
          </CampoFormulario>

          <CampoFormulario
            id="contacto-correo"
            etiqueta="Correo Electrónico"
            obligatorio
            error={errores.correo}
            className="col-md-6"
          >
            <input
              type="email"
              id="contacto-correo"
              name="correo"
              className={claseControl("form-control", errores.correo)}
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </CampoFormulario>

          <CampoFormulario
            id="contacto-telefono"
            etiqueta="Teléfono de Contacto"
            error={errores.telefono}
            className="col-md-6"
          >
            <input
              type="tel"
              id="contacto-telefono"
              name="telefono"
              className={claseControl("form-control", errores.telefono)}
              value={form.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
          </CampoFormulario>

          <CampoFormulario
            id="contacto-asunto"
            etiqueta="Motivo de Contacto"
            className="col-md-6"
          >
            <select
              id="contacto-asunto"
              name="asunto"
              className="form-select"
              value={form.asunto}
              onChange={handleChange}
            >
              <option value="consulta">Consulta General</option>
              <option value="cotizacion">Solicitud de Cotización</option>
              <option value="despacho">Estado de Despacho</option>
              <option value="reclamo">Reclamo o Sugerencia</option>
            </select>
          </CampoFormulario>

          <CampoFormulario
            id="contacto-mensaje"
            etiqueta="Mensaje o Consulta"
            obligatorio
            error={errores.mensaje}
            className="col-12"
          >
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              rows={4}
              className={claseControl("form-control", errores.mensaje)}
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Escribe aquí los detalles de tu consulta..."
            ></textarea>
          </CampoFormulario>

          <div className="col-12">
            <button type="submit" className="btn btn-warning fw-bold px-4 py-2">
              Enviar Mensaje 🚀
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
