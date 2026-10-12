import React, { useState } from "react";
import Alerta, { useAlerta } from "./Alerta";

interface ContactoForm {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export default function FormularioContacto() {
  const { alerta, mostrar, limpiar } = useAlerta();

  const [form, setForm] = useState<ContactoForm>({
    nombre: "",
    correo: "",
    telefono: "",
    asunto: "consulta",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      mostrar("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!form.correo.trim() || !form.correo.includes("@")) {
      mostrar("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (!form.mensaje.trim()) {
      mostrar("Por favor, escribe tu mensaje o consulta.");
      return;
    }

    limpiar();
    mostrar(
      "¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente.",
      false,
    );

    setForm({
      nombre: "",
      correo: "",
      telefono: "",
      asunto: "consulta",
      mensaje: "",
    });
  };

  return (
    <div className="card shadow-sm p-4 my-4">
      <h3 className="fw-bold text-warning border-bottom border-warning border-2 pb-2 mb-3">
        ✉️ Formulario de Contacto y Consultas
      </h3>

      <Alerta alerta={alerta} />

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Nombre Completo <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: María González"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="correo" className="form-label fw-semibold">
              Correo Electrónico <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="telefono" className="form-label fw-semibold">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="form-control"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="asunto" className="form-label fw-semibold">
              Motivo de Contacto
            </label>
            <select
              id="asunto"
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
          </div>

          <div className="col-12">
            <label htmlFor="mensaje" className="form-label fw-semibold">
              Mensaje o Consulta <span className="text-danger">*</span>
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              className="form-control"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Escribe aquí los detalles de tu consulta..."
            ></textarea>
          </div>

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
