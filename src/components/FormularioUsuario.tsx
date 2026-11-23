import React, { useState } from "react";
import {
  DatosUsuario,
  GeneroUsuario,
  RespuestaOperacion,
  RolUsuario,
  Usuario,
} from "../types";
import { REGIONES } from "../data/regiones";
import { calcularEdad } from "../utils/format";
import { ETIQUETA_ROL } from "../utils/permisos";
import {
  CamposUsuario,
  DOMINIOS_AUTORIZADOS,
  EDAD_MINIMA,
  ErroresUsuario,
  validarUsuario,
} from "../utils/validaciones";
import CampoFormulario, { claseControl } from "./CampoFormulario";

/**
 * - registro: autoregistro de un cliente (exige aceptar términos)
 * - alta:     un vendedor/administrador crea una cuenta
 * - edicion:  se modifica un usuario existente (la contraseña es opcional)
 */
export type ModoFormularioUsuario = "registro" | "alta" | "edicion";

interface FormularioUsuarioProps {
  modo: ModoFormularioUsuario;
  usuarioInicial?: Usuario | null;
  /** Si se entrega, el rol queda fijo y no se muestra el selector. */
  rolFijo?: RolUsuario;
  textoBoton: string;
  /** El padre ejecuta la operación del store y muestra el mensaje; el formulario solo valida. */
  onGuardar: (datos: DatosUsuario) => RespuestaOperacion | Promise<RespuestaOperacion>;
  onCancelar?: () => void;
}

const OPCIONES_GENERO: { valor: GeneroUsuario; etiqueta: string }[] = [
  { valor: "masculino", etiqueta: "Masculino" },
  { valor: "femenino", etiqueta: "Femenino" },
  { valor: "otro", etiqueta: "Otro" },
  { valor: "prefiero_no_decir", etiqueta: "Prefiero no decir" },
];

const ROLES: RolUsuario[] = ["cliente", "vendedor", "administrador"];

const crearEstadoInicial = (
  usuario: Usuario | null | undefined,
  rol: RolUsuario,
): CamposUsuario => ({
  nombreCompleto: usuario?.nombreCompleto ?? "",
  fechaNacimiento: usuario?.fechaNacimiento ?? "",
  correo: usuario?.correo ?? "",
  direccion: usuario?.direccion ?? "",
  region: usuario?.region ?? "",
  genero: usuario?.genero ?? "",
  rol: usuario?.rol ?? rol,
  contrasena: "",
  confirmarContrasena: "",
  aceptaTerminos: false,
});

export default function FormularioUsuario({
  modo,
  usuarioInicial,
  rolFijo,
  textoBoton,
  onGuardar,
  onCancelar,
}: FormularioUsuarioProps) {
  const rolPorDefecto: RolUsuario = rolFijo ?? "cliente";

  const [form, setForm] = useState<CamposUsuario>(() =>
    crearEstadoInicial(usuarioInicial, rolPorDefecto),
  );
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [enviando, setEnviando] = useState<boolean>(false);

  const esEdicion = modo === "edicion";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = e.target;
    const nuevoValor =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setForm((prev) => ({ ...prev, [name]: nuevoValor }));
    // Al corregir un campo se limpia su error
    if (errores[name as keyof CamposUsuario]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const erroresEncontrados = validarUsuario(form, {
      exigirContrasena: !esEdicion,
      exigirTerminos: modo === "registro",
    });
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    const datos: DatosUsuario = {
      nombreCompleto: form.nombreCompleto.trim(),
      fechaNacimiento: form.fechaNacimiento,
      correo: form.correo.trim().toLowerCase(),
      direccion: form.direccion.trim(),
      region: form.region,
      genero: form.genero as GeneroUsuario,
      rol: rolFijo ?? form.rol,
      // En edición, una contraseña vacía significa "mantener la actual"
      contrasena: form.contrasena || usuarioInicial?.contrasena || "",
    };

    setEnviando(true);
    // onGuardar puede ser síncrono (datos locales) o asíncrono (API): ambos se esperan igual
    const respuesta = await Promise.resolve(onGuardar(datos)).finally(() =>
      setEnviando(false),
    );
    if (!respuesta.ok) return;

    if (esEdicion) {
      setForm((prev) => ({ ...prev, contrasena: "", confirmarContrasena: "" }));
    } else {
      setForm(crearEstadoInicial(null, rolPorDefecto));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <CampoFormulario
          id="nombreCompleto"
          etiqueta="Nombre Completo"
          obligatorio
          error={errores.nombreCompleto}
          className="col-12"
        >
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            className={claseControl("form-control", errores.nombreCompleto)}
            placeholder="Ej: Juan Pérez González"
            value={form.nombreCompleto}
            onChange={handleChange}
          />
        </CampoFormulario>

        <CampoFormulario
          id="fechaNacimiento"
          etiqueta="Fecha de Nacimiento"
          obligatorio
          error={errores.fechaNacimiento}
          ayuda={`Edad mínima requerida: ${EDAD_MINIMA} años.`}
          className="col-md-6"
        >
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            className={claseControl("form-control", errores.fechaNacimiento)}
            value={form.fechaNacimiento}
            onChange={handleChange}
          />
        </CampoFormulario>

        <CampoFormulario
          id="edadCalculada"
          etiqueta="Edad Calculada"
          className="col-md-6"
        >
          <input
            type="text"
            id="edadCalculada"
            className="form-control bg-light"
            value={
              form.fechaNacimiento
                ? `${calcularEdad(form.fechaNacimiento)} años`
                : "Por definir"
            }
            disabled
          />
        </CampoFormulario>

        <CampoFormulario
          id="correo"
          etiqueta="Correo Electrónico"
          obligatorio
          error={errores.correo}
          ayuda={`Dominios aceptados: ${DOMINIOS_AUTORIZADOS.join(", ")}`}
          className="col-12"
        >
          <input
            type="email"
            id="correo"
            name="correo"
            className={claseControl("form-control", errores.correo)}
            placeholder="usuario@gmail.com"
            value={form.correo}
            onChange={handleChange}
          />
        </CampoFormulario>

        <CampoFormulario
          id="direccion"
          etiqueta="Dirección de Domicilio"
          obligatorio
          error={errores.direccion}
          className="col-md-7"
        >
          <input
            type="text"
            id="direccion"
            name="direccion"
            className={claseControl("form-control", errores.direccion)}
            placeholder="Av. Concha y Toro 1234"
            value={form.direccion}
            onChange={handleChange}
          />
        </CampoFormulario>

        <CampoFormulario
          id="region"
          etiqueta="Región"
          obligatorio
          error={errores.region}
          className="col-md-5"
        >
          <select
            id="region"
            name="region"
            className={claseControl("form-select", errores.region)}
            value={form.region}
            onChange={handleChange}
          >
            <option value="">-- Selecciona Región --</option>
            {REGIONES.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </CampoFormulario>

        <CampoFormulario
          id="genero"
          etiqueta="Género"
          obligatorio
          grupo
          error={errores.genero}
          className="col-12"
        >
          <div className="d-flex flex-wrap gap-3">
            {OPCIONES_GENERO.map((opcion) => (
              <div className="form-check" key={opcion.valor}>
                <input
                  className={claseControl("form-check-input", errores.genero)}
                  type="radio"
                  name="genero"
                  id={`genero-${opcion.valor}`}
                  value={opcion.valor}
                  checked={form.genero === opcion.valor}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`genero-${opcion.valor}`}
                >
                  {opcion.etiqueta}
                </label>
              </div>
            ))}
          </div>
        </CampoFormulario>

        {/* El selector de rol solo aparece cuando el rol no está fijado (panel del administrador) */}
        {!rolFijo && (
          <CampoFormulario id="rol" etiqueta="Rol a Asignar" className="col-12">
            <select
              id="rol"
              name="rol"
              className="form-select"
              value={form.rol}
              onChange={handleChange}
            >
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {ETIQUETA_ROL[rol]}
                </option>
              ))}
            </select>
          </CampoFormulario>
        )}

        <CampoFormulario
          id="contrasena"
          etiqueta={esEdicion ? "Nueva Contraseña" : "Contraseña"}
          obligatorio={!esEdicion}
          error={errores.contrasena}
          ayuda={
            esEdicion
              ? "Déjala en blanco para mantener la actual."
              : "Mín. 8 caracteres, 1 mayúscula y 1 número."
          }
          className="col-md-6"
        >
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            autoComplete="new-password"
            className={claseControl("form-control", errores.contrasena)}
            value={form.contrasena}
            onChange={handleChange}
          />
        </CampoFormulario>

        <CampoFormulario
          id="confirmarContrasena"
          etiqueta="Confirmar Contraseña"
          obligatorio={!esEdicion}
          error={errores.confirmarContrasena}
          className="col-md-6"
        >
          <input
            type="password"
            id="confirmarContrasena"
            name="confirmarContrasena"
            autoComplete="new-password"
            className={claseControl("form-control", errores.confirmarContrasena)}
            placeholder="Repite la contraseña"
            value={form.confirmarContrasena}
            onChange={handleChange}
          />
        </CampoFormulario>

        {modo === "registro" && (
          <div className="col-12 mt-3">
            <div className="form-check">
              <input
                className={claseControl("form-check-input", errores.aceptaTerminos)}
                type="checkbox"
                id="aceptaTerminos"
                name="aceptaTerminos"
                checked={form.aceptaTerminos}
                onChange={handleChange}
              />
              <label
                className="form-check-label text-muted small"
                htmlFor="aceptaTerminos"
              >
                Acepto las condiciones de registro y las políticas de uso de
                Ferretería Los Maestros <span className="text-danger">*</span>
              </label>
              {errores.aceptaTerminos && (
                <div className="invalid-feedback d-block">
                  {errores.aceptaTerminos}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="d-flex gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-warning fw-bold w-100 py-2"
          disabled={enviando}
        >
          {enviando ? "Guardando..." : textoBoton}
        </button>
        {onCancelar && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
