import { GeneroUsuario, RolUsuario } from "../types";
import { calcularEdad } from "./format";

// ---------------------------------------------------------------
// Reglas de validación reutilizables por todos los formularios
// ---------------------------------------------------------------
export const EDAD_MINIMA = 14;

// Dominios de correo permitidos por regla de negocio
// (@ferreteria.cl corresponde a las cuentas internas del personal)
export const DOMINIOS_AUTORIZADOS = [
  "@duocuc.cl",
  "@profesor.duoc.cl",
  "@gmail.com",
  "@outlook.com",
  "@hotmail.com",
  "@ferreteria.cl",
];

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mínimo 8 caracteres, al menos una mayúscula y al menos un número
const REGEX_CONTRASENA = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const REGEX_TELEFONO = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

export const esCorreoValido = (correo: string): boolean =>
  REGEX_CORREO.test(correo.trim());

export const tieneDominioAutorizado = (correo: string): boolean =>
  DOMINIOS_AUTORIZADOS.some((d) => correo.trim().toLowerCase().endsWith(d));

export const esContrasenaSegura = (contrasena: string): boolean =>
  REGEX_CONTRASENA.test(contrasena);

const hoyISO = (): string => new Date().toISOString().slice(0, 10);

const esEntero = (texto: string): boolean =>
  texto.trim() !== "" && Number.isInteger(Number(texto));

// ---------------------------------------------------------------
// Usuario (registro, alta por vendedor/admin, edición y perfil)
// ---------------------------------------------------------------
export interface CamposUsuario {
  nombreCompleto: string;
  fechaNacimiento: string;
  correo: string;
  direccion: string;
  region: string;
  genero: GeneroUsuario | "";
  rol: RolUsuario;
  contrasena: string;
  confirmarContrasena: string;
  aceptaTerminos: boolean;
}

export type ErroresUsuario = Partial<Record<keyof CamposUsuario, string>>;

export interface OpcionesValidacionUsuario {
  exigirContrasena: boolean;
  exigirTerminos: boolean;
}

export function validarUsuario(
  f: CamposUsuario,
  op: OpcionesValidacionUsuario,
): ErroresUsuario {
  const e: ErroresUsuario = {};

  if (!f.nombreCompleto.trim()) {
    e.nombreCompleto = "Ingresa el nombre completo.";
  } else if (f.nombreCompleto.trim().length < 3) {
    e.nombreCompleto = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!f.fechaNacimiento) {
    e.fechaNacimiento = "Selecciona la fecha de nacimiento.";
  } else if (f.fechaNacimiento > hoyISO()) {
    e.fechaNacimiento = "La fecha de nacimiento no puede ser futura.";
  } else if (calcularEdad(f.fechaNacimiento) < EDAD_MINIMA) {
    e.fechaNacimiento = `Debes tener al menos ${EDAD_MINIMA} años de edad.`;
  }

  if (!f.correo.trim()) {
    e.correo = "Ingresa el correo electrónico.";
  } else if (!esCorreoValido(f.correo)) {
    e.correo = "El formato del correo no es válido.";
  } else if (!tieneDominioAutorizado(f.correo)) {
    e.correo = `El correo debe pertenecer a un dominio autorizado: ${DOMINIOS_AUTORIZADOS.join(", ")}.`;
  }

  if (!f.direccion.trim()) e.direccion = "Ingresa la dirección de domicilio.";
  if (!f.region) e.region = "Selecciona una región.";
  if (!f.genero) e.genero = "Selecciona una opción de género.";

  if (op.exigirContrasena || f.contrasena) {
    if (!f.contrasena) {
      e.contrasena = "Ingresa una contraseña.";
    } else if (!esContrasenaSegura(f.contrasena)) {
      e.contrasena =
        "Debe tener al menos 8 caracteres, una mayúscula y un número.";
    } else if (f.contrasena !== f.confirmarContrasena) {
      e.confirmarContrasena = "Las contraseñas no coinciden.";
    }
  }

  if (op.exigirTerminos && !f.aceptaTerminos) {
    e.aceptaTerminos = "Debes aceptar los términos y condiciones.";
  }

  return e;
}

// ---------------------------------------------------------------
// Producto (administrador)
// Los campos numéricos viajan como texto para poder validar campos vacíos.
// ---------------------------------------------------------------
export interface CamposProducto {
  nombre: string;
  descripcion: string;
  precio: string;
  precioOferta: string;
  stock: string;
  categoria: string;
  imagen: string;
}

export type ErroresProducto = Partial<Record<keyof CamposProducto, string>>;

export function validarProducto(f: CamposProducto): ErroresProducto {
  const e: ErroresProducto = {};

  if (!f.nombre.trim()) e.nombre = "Ingresa el nombre del producto.";
  else if (f.nombre.trim().length < 3)
    e.nombre = "El nombre debe tener al menos 3 caracteres.";

  if (!esEntero(f.precio) || Number(f.precio) <= 0) {
    e.precio = "El precio debe ser un número entero mayor a 0.";
  }

  if (f.precioOferta.trim() !== "") {
    if (!esEntero(f.precioOferta) || Number(f.precioOferta) <= 0) {
      e.precioOferta = "La oferta debe ser un número entero mayor a 0.";
    } else if (!e.precio && Number(f.precioOferta) >= Number(f.precio)) {
      e.precioOferta = "La oferta debe ser menor al precio normal.";
    }
  }

  if (!esEntero(f.stock) || Number(f.stock) < 0) {
    e.stock = "El stock debe ser un número entero igual o mayor a 0.";
  }

  if (!f.categoria) e.categoria = "Selecciona una categoría.";
  if (!f.imagen) e.imagen = "Selecciona una imagen.";

  return e;
}

// ---------------------------------------------------------------
// Categoría (administrador)
// ---------------------------------------------------------------
export interface CamposCategoria {
  nombre: string;
  descripcion: string;
}

export type ErroresCategoria = Partial<Record<keyof CamposCategoria, string>>;

export function validarCategoria(f: CamposCategoria): ErroresCategoria {
  const e: ErroresCategoria = {};
  if (!f.nombre.trim()) e.nombre = "Ingresa el nombre de la categoría.";
  else if (f.nombre.trim().length < 3)
    e.nombre = "El nombre debe tener al menos 3 caracteres.";
  if (f.descripcion.trim().length > 120)
    e.descripcion = "La descripción no puede superar los 120 caracteres.";
  return e;
}

// ---------------------------------------------------------------
// Contacto
// ---------------------------------------------------------------
export interface CamposContacto {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export type ErroresContacto = Partial<Record<keyof CamposContacto, string>>;

export function validarContacto(f: CamposContacto): ErroresContacto {
  const e: ErroresContacto = {};
  if (!f.nombre.trim()) e.nombre = "Ingresa tu nombre completo.";
  if (!f.correo.trim()) e.correo = "Ingresa tu correo electrónico.";
  else if (!esCorreoValido(f.correo))
    e.correo = "El formato del correo no es válido.";
  if (f.telefono.trim() && !REGEX_TELEFONO.test(f.telefono.trim()))
    e.telefono = "Usa un celular chileno, por ejemplo +56 9 1234 5678.";
  if (!f.mensaje.trim()) e.mensaje = "Escribe tu mensaje o consulta.";
  else if (f.mensaje.trim().length < 10)
    e.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  return e;
}

// ---------------------------------------------------------------
// Inicio de sesión
// ---------------------------------------------------------------
export interface CamposLogin {
  correo: string;
  contrasena: string;
}

export type ErroresLogin = Partial<Record<keyof CamposLogin, string>>;

export function validarLogin(f: CamposLogin): ErroresLogin {
  const e: ErroresLogin = {};
  if (!f.correo.trim()) e.correo = "Ingresa tu correo electrónico.";
  else if (!esCorreoValido(f.correo))
    e.correo = "El formato del correo no es válido.";
  if (!f.contrasena) e.contrasena = "Ingresa tu contraseña.";
  return e;
}
