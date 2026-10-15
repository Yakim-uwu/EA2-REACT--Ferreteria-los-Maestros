import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Producto, Categoria, Usuario, RolUsuario } from "../types";
import { productosSemilla } from "../data/productos";
import { leer, guardar } from "../utils/storage";
import { precioEfectivo, calcularEdad } from "../utils/format";

export interface ItemCarrito {
  idProducto: string;
  nombre: string;
  precioUnitario: number;
  imagen: string;
  cantidad: number;
}

// Categorías iniciales por defecto si no existen en storage
const categoriasSemilla: Categoria[] = [
  {
    id: "cat-1",
    nombre: "Herramientas Manuales",
    descripcion: "Martillos, destornilladores, llaves",
  },
  {
    id: "cat-2",
    nombre: "Pinturas y Esfaltos",
    descripcion: "Esmaltes, látex y accesorios",
  },
  {
    id: "cat-3",
    nombre: "Materiales de Construcción",
    descripcion: "Cemento, maderas y fijaciones",
  },
  {
    id: "cat-4",
    nombre: "Gasitería y Tubos",
    descripcion: "Tuberías y conexiones de PVC/Cobre",
  },
];

interface RespuestaOperacion {
  ok: boolean;
  mensaje: string | null;
}

interface StoreContextType {
  productos: Producto[];
  categorias: Categoria[];
  carrito: ItemCarrito[];
  usuarios: Usuario[];
  usuarioActivo: Usuario | null;
  setUsuarioActivo: React.Dispatch<React.SetStateAction<Usuario | null>>;

  totalItems: number;
  totalCompra: number;

  // Carrito
  agregarAlCarrito: (
    idProducto: string,
    cantidadDeseada?: number,
  ) => RespuestaOperacion;
  modificarCantidad: (
    index: number,
    nuevaCantidad: number | string,
  ) => RespuestaOperacion;
  eliminarItem: (index: number) => void;
  vaciarCarrito: () => void;
  finalizarCompra: () => void;

  // Operaciones de Productos (Administrador / Vendedor)
  crearProducto: (nuevoProd: Omit<Producto, "id">) => RespuestaOperacion;
  actualizarProducto: (prodActualizado: Producto) => RespuestaOperacion;
  eliminarProducto: (id: string) => RespuestaOperacion;
  modificarStockProducto: (
    idProducto: string,
    nuevoStock: number,
  ) => RespuestaOperacion;

  // Operaciones de Categorías (Administrador)
  crearCategoria: (nuevaCat: Omit<Categoria, "id">) => RespuestaOperacion;
  actualizarCategoria: (catActualizada: Categoria) => RespuestaOperacion;
  eliminarCategoria: (id: string) => RespuestaOperacion;

  // Operaciones de Usuarios y Roles
  registrarUsuario: (
    usuario: Omit<Usuario, "id" | "edad"> & { id?: string; edad?: number },
  ) => RespuestaOperacion;
  actualizarUsuario: (usuario: Usuario) => void;
  eliminarUsuario: (id: string) => RespuestaOperacion;
  actualizarPerfil: (
    datosPerfil: Partial<Omit<Usuario, "id" | "rol">>,
  ) => RespuestaOperacion;
  cerrarSesion: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>(() =>
    leer("productos", productosSemilla),
  );
  const [categorias, setCategorias] = useState<Categoria[]>(() =>
    leer("categorias", categoriasSemilla),
  );
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() =>
    leer("carrito", []),
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    leer("usuarios", usuariosSemilla),
  );
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(() =>
    leer("usuarioActivo", null),
  );

  // Persistencia en LocalStorage
  useEffect(() => guardar("productos", productos), [productos]);
  useEffect(() => guardar("categorias", categorias), [categorias]);
  useEffect(() => guardar("carrito", carrito), [carrito]);
  useEffect(() => guardar("usuarios", usuarios), [usuarios]);
  useEffect(() => guardar("usuarioActivo", usuarioActivo), [usuarioActivo]);

  const totalItems = useMemo(
    () => carrito.reduce((s, i) => s + i.cantidad, 0),
    [carrito],
  );
  const totalCompra = useMemo(
    () => carrito.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0),
    [carrito],
  );

  // --- CARRITO ---
  const agregarAlCarrito = useCallback(
    (idProducto: string, cantidadDeseada = 1): RespuestaOperacion => {
      const prod = productos.find((p) => p.id === idProducto);
      if (!prod) return { ok: false, mensaje: "Producto no encontrado." };

      const enCarrito = carrito.find((i) => i.idProducto === idProducto);
      const cantidadActual = enCarrito ? enCarrito.cantidad : 0;

      if (cantidadActual + cantidadDeseada > prod.stock) {
        return {
          ok: false,
          mensaje: `No hay suficiente stock disponible (${prod.stock}). Ya tienes ${cantidadActual} en el carrito.`,
        };
      }

      setCarrito((prev) => {
        const existe = prev.find((i) => i.idProducto === idProducto);
        if (existe) {
          return prev.map((i) =>
            i.idProducto === idProducto
              ? { ...i, cantidad: i.cantidad + cantidadDeseada }
              : i,
          );
        }
        return [
          ...prev,
          {
            idProducto: prod.id,
            nombre: prod.nombre,
            precioUnitario: precioEfectivo(prod),
            imagen: prod.imagen,
            cantidad: cantidadDeseada,
          },
        ];
      });

      return { ok: true, mensaje: `¡"${prod.nombre}" agregado al carrito!` };
    },
    [productos, carrito],
  );

  const modificarCantidad = useCallback(
    (index: number, nuevaCantidad: number | string): RespuestaOperacion => {
      const qty =
        typeof nuevaCantidad === "string"
          ? parseInt(nuevaCantidad, 10)
          : nuevaCantidad;
      if (isNaN(qty) || qty <= 0) return { ok: false, mensaje: null };

      const item = carrito[index];
      if (!item) return { ok: false, mensaje: "Ítem no encontrado." };

      const prod = productos.find((p) => p.id === item.idProducto);
      if (prod && qty > prod.stock) {
        return {
          ok: false,
          mensaje: `El stock máximo disponible para este producto es de ${prod.stock} unidades.`,
        };
      }

      setCarrito((prev) =>
        prev.map((it, i) => (i === index ? { ...it, cantidad: qty } : it)),
      );
      return { ok: true, mensaje: null };
    },
    [carrito, productos],
  );

  const eliminarItem = useCallback(
    (index: number) => setCarrito((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const finalizarCompra = useCallback(() => {
    if (carrito.length === 0) return;
    setProductos((prev) =>
      prev.map((p) => {
        const item = carrito.find((i) => i.idProducto === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p;
      }),
    );
    setCarrito([]);
  }, [carrito]);

  // --- ADMINISTRACIÓN DE PRODUCTOS ---
  const crearProducto = useCallback(
    (nuevoProd: Omit<Producto, "id">): RespuestaOperacion => {
      const id = `prod-${Date.now()}`;
      const productoCompleto: Producto = { ...nuevoProd, id };
      setProductos((prev) => [...prev, productoCompleto]);
      return { ok: true, mensaje: "Producto creado correctamente." };
    },
    [],
  );

  const actualizarProducto = useCallback(
    (prodActualizado: Producto): RespuestaOperacion => {
      setProductos((prev) =>
        prev.map((p) => (p.id === prodActualizado.id ? prodActualizado : p)),
      );
      return { ok: true, mensaje: "Producto actualizado correctamente." };
    },
    [],
  );

  const eliminarProducto = useCallback((id: string): RespuestaOperacion => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    return { ok: true, mensaje: "Producto eliminado correctamente." };
  }, []);

  const modificarStockProducto = useCallback(
    (idProducto: string, nuevoStock: number): RespuestaOperacion => {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === idProducto ? { ...p, stock: Math.max(0, nuevoStock) } : p,
        ),
      );
      return { ok: true, mensaje: "Stock actualizado correctamente." };
    },
    [],
  );

  // --- ADMINISTRACIÓN DE CATEGORÍAS ---
  const crearCategoria = useCallback(
    (nuevaCat: Omit<Categoria, "id">): RespuestaOperacion => {
      const id = `cat-${Date.now()}`;
      setCategorias((prev) => [...prev, { ...nuevaCat, id }]);
      return { ok: true, mensaje: "Categoría creada exitosamente." };
    },
    [],
  );

  const actualizarCategoria = useCallback(
    (catActualizada: Categoria): RespuestaOperacion => {
      setCategorias((prev) =>
        prev.map((c) => (c.id === catActualizada.id ? catActualizada : c)),
      );
      return { ok: true, mensaje: "Categoría actualizada exitosamente." };
    },
    [],
  );

  const eliminarCategoria = useCallback((id: string): RespuestaOperacion => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
    return { ok: true, mensaje: "Categoría eliminada." };
  }, []);

  // --- ADMINISTRACIÓN DE USUARIOS, PERFIL Y ROLES ---
  const registrarUsuario = useCallback(
    (
      datos: Omit<Usuario, "id" | "edad"> & { id?: string; edad?: number },
    ): RespuestaOperacion => {
      const existe = usuarios.some(
        (u) => u.correo.toLowerCase() === datos.correo.toLowerCase(),
      );
      if (existe) {
        return {
          ok: false,
          mensaje: "El correo electrónico ya se encuentra registrado.",
        };
      }

      const nuevoUsuario: Usuario = {
        ...datos,
        id: datos.id || `usr-${Date.now()}`,
        edad: calcularEdad(datos.fechaNacimiento),
        rol: datos.rol || "cliente", // Si no se pasa rol, se asigna 'cliente' por defecto
      };

      setUsuarios((prev) => [...prev, nuevoUsuario]);
      return { ok: true, mensaje: "Usuario registrado con éxito." };
    },
    [usuarios],
  );

  const actualizarUsuario = useCallback(
    (usuario: Usuario) => {
      const usuarioConEdad = {
        ...usuario,
        edad: calcularEdad(usuario.fechaNacimiento),
      };
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? usuarioConEdad : u)),
      );
      if (usuarioActivo?.id === usuario.id) {
        setUsuarioActivo(usuarioConEdad);
      }
    },
    [usuarioActivo],
  );

  const eliminarUsuario = useCallback(
    (id: string): RespuestaOperacion => {
      if (usuarioActivo?.id === id) {
        return {
          ok: false,
          mensaje: "No puedes eliminar tu propia cuenta activa.",
        };
      }
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      return { ok: true, mensaje: "Usuario eliminado." };
    },
    [usuarioActivo],
  );

  const actualizarPerfil = useCallback(
    (datosPerfil: Partial<Omit<Usuario, "id" | "rol">>): RespuestaOperacion => {
      if (!usuarioActivo)
        return { ok: false, mensaje: "No hay sesión activa." };

      const actualizado: Usuario = {
        ...usuarioActivo,
        ...datosPerfil,
        edad: datosPerfil.fechaNacimiento
          ? calcularEdad(datosPerfil.fechaNacimiento)
          : usuarioActivo.edad,
        // La rúbrica prohíbe explícitamente modificar el propio rol desde el perfil
        rol: usuarioActivo.rol,
      };

      setUsuarioActivo(actualizado);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === actualizado.id ? actualizado : u)),
      );
      return { ok: true, mensaje: "Perfil actualizado correctamente." };
    },
    [usuarioActivo],
  );

  const cerrarSesion = useCallback(() => {
    setUsuarioActivo(null);
    localStorage.removeItem("usuarioActivo");
  }, []);

  const value: StoreContextType = {
    productos,
    categorias,
    carrito,
    usuarios,
    usuarioActivo,
    setUsuarioActivo,
    totalItems,
    totalCompra,
    agregarAlCarrito,
    modificarCantidad,
    eliminarItem,
    vaciarCarrito,
    finalizarCompra,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    modificarStockProducto,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPerfil,
    cerrarSesion,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error("useStore debe usarse dentro de un <StoreProvider>");
  return ctx;
}
// En src/context/StoreContext.tsx (junto a categoriasSemilla)

const usuariosSemilla: Usuario[] = [
  {
    id: "usr-admin",
    nombreCompleto: "Carlos Administrador",
    correo: "admin@ferreteria.cl",
    contrasena: "123456",
    rol: "administrador",
    fechaNacimiento: "1985-05-15",
    edad: 39,
    direccion: "Av. Principal 123",
    region: "Metropolitana",
    genero: "masculino",
  },
  {
    id: "usr-vendedor",
    nombreCompleto: "Valeria Vendedora",
    correo: "vendedor@ferreteria.cl",
    contrasena: "123456",
    rol: "vendedor",
    fechaNacimiento: "1992-08-20",
    edad: 32,
    direccion: "Calle Comercial 456",
    region: "Metropolitana",
    genero: "femenino",
  },
  {
    id: "usr-cliente",
    nombreCompleto: "Claudio Cliente",
    correo: "cliente@ferreteria.cl",
    contrasena: "123456",
    rol: "cliente",
    fechaNacimiento: "1998-11-10",
    edad: 26,
    direccion: "Pasaje Los Rosales 789",
    region: "Metropolitana",
    genero: "masculino",
  },
];
