import { Usuario } from "../types";
import { calcularEdad } from "../utils/format";

// Usuarios iniciales: uno por cada rol del sistema.
// La edad se deriva de la fecha de nacimiento para que nunca quede desactualizada.
const base = (
  u: Omit<Usuario, "edad">,
): Usuario => ({ ...u, edad: calcularEdad(u.fechaNacimiento) });

export const usuariosSemilla: Usuario[] = [
  base({
    id: "usr-admin",
    nombreCompleto: "Carlos Administrador",
    correo: "admin@ferreteria.cl",
    contrasena: "123456",
    rol: "administrador",
    fechaNacimiento: "1985-05-15",
    direccion: "Av. Principal 123",
    region: "Metropolitana",
    genero: "masculino",
  }),
  base({
    id: "usr-vendedor",
    nombreCompleto: "Valeria Vendedora",
    correo: "vendedor@ferreteria.cl",
    contrasena: "123456",
    rol: "vendedor",
    fechaNacimiento: "1992-08-20",
    direccion: "Calle Comercial 456",
    region: "Metropolitana",
    genero: "femenino",
  }),
  base({
    id: "usr-cliente",
    nombreCompleto: "Claudio Cliente",
    correo: "cliente@ferreteria.cl",
    contrasena: "123456",
    rol: "cliente",
    fechaNacimiento: "1998-11-10",
    direccion: "Pasaje Los Rosales 789",
    region: "Metropolitana",
    genero: "masculino",
  }),
];
