import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import Alerta, { useAlerta } from "../components/Alerta";

export default function Perfil() {
  const { usuarioActivo, actualizarPerfil } = useStore();
  const { alerta, mostrar } = useAlerta();

  const [formPerfil, setFormPerfil] = useState({
    nombreCompleto: "",
    correo: "",
    fechaNacimiento: "",
    direccion: "",
    region: "Metropolitana",
    genero: "otro",
    contrasena: "",
  });

  // Cargar datos actuales del usuario al cargar la página o cambiar de usuario
  useEffect(() => {
    if (usuarioActivo) {
      setFormPerfil({
        nombreCompleto: usuarioActivo.nombreCompleto || "",
        correo: usuarioActivo.correo || "",
        fechaNacimiento: usuarioActivo.fechaNacimiento || "",
        direccion: usuarioActivo.direccion || "",
        region: usuarioActivo.region || "Metropolitana",
        genero: usuarioActivo.genero || "otro",
        contrasena: usuarioActivo.contrasena || "",
      });
    }
  }, [usuarioActivo]);

  // Si no hay sesión activa
  if (!usuarioActivo) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-warning d-inline-block px-4 py-3 shadow-sm">
          ⚠️ Debes iniciar sesión para poder ver y editar tu perfil.
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formPerfil.nombreCompleto.trim()) {
      mostrar("El nombre completo es obligatorio.", true);
      return;
    }

    if (!formPerfil.correo.trim()) {
      mostrar("El correo electrónico es obligatorio.", true);
      return;
    }

    // Ejecutar actualización en StoreContext
    const res = actualizarPerfil({
      nombreCompleto: formPerfil.nombreCompleto.trim(),
      correo: formPerfil.correo.trim(),
      fechaNacimiento: formPerfil.fechaNacimiento,
      direccion: formPerfil.direccion.trim(),
      region: formPerfil.region,
      genero: formPerfil.genero as any,
      contrasena: formPerfil.contrasena,
    });

    mostrar(res.mensaje || "Perfil actualizado", !res.ok);
  };

  return (
    <main className="container my-4" style={{ maxWidth: "750px" }}>
      <h2 className="border-bottom border-warning border-3 d-inline-block pb-1 mb-4">
        Mi Perfil 👤
      </h2>

      <Alerta alerta={alerta} className="mb-3" />

      <div className="card shadow-sm p-4">
        {/* Cabecera del Perfil */}
        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0">{usuarioActivo.nombreCompleto}</h4>
            <span className="badge bg-warning text-dark fw-bold text-uppercase mt-2">
              Rol: {usuarioActivo.rol}
            </span>
          </div>
          <div className="text-end text-muted">
            <span className="fw-semibold">Edad calculada:</span>
            <div className="fs-5 fw-bold text-dark">
              {usuarioActivo.edad} años
            </div>
          </div>
        </div>

        {/* Formulario de Edición */}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">
                Nombre Completo
              </label>
              <input
                type="text"
                className="form-control"
                value={formPerfil.nombreCompleto}
                onChange={(e) =>
                  setFormPerfil({
                    ...formPerfil,
                    nombreCompleto: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control"
                value={formPerfil.correo}
                onChange={(e) =>
                  setFormPerfil({ ...formPerfil, correo: e.target.value })
                }
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                className="form-control"
                value={formPerfil.fechaNacimiento}
                onChange={(e) =>
                  setFormPerfil({
                    ...formPerfil,
                    fechaNacimiento: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Género</label>
              <select
                className="form-select"
                value={formPerfil.genero}
                onChange={(e) =>
                  setFormPerfil({ ...formPerfil, genero: e.target.value })
                }
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro / Prefiero no decir</option>
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label fw-semibold small">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={formPerfil.direccion}
                onChange={(e) =>
                  setFormPerfil({ ...formPerfil, direccion: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small">Región</label>
              <select
                className="form-select"
                value={formPerfil.region}
                onChange={(e) =>
                  setFormPerfil({ ...formPerfil, region: e.target.value })
                }
              >
                <option value="Metropolitana">Metropolitana</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Biobío">Biobío</option>
                <option value="Araucanía">Araucanía</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={formPerfil.contrasena}
                onChange={(e) =>
                  setFormPerfil({ ...formPerfil, contrasena: e.target.value })
                }
              />
            </div>

            <div className="col-12 mt-3">
              <div className="form-text text-muted bg-light p-2 rounded border small">
                ℹ️ <strong>Nota de Seguridad:</strong> Tu rol (
                <code>{usuarioActivo.rol}</code>) no se puede modificar desde
                este formulario. Solo un Administrador puede cambiar los roles
                en el Panel Admin.
              </div>
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-warning fw-bold w-100 py-2"
              >
                💾 Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
