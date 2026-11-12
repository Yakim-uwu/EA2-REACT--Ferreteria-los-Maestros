# Ferretería Los Maestros — React + TypeScript

Tienda virtual (React 18, TypeScript, Vite, React Router 6 y Bootstrap 5) con tres perfiles: **administrador**, **vendedor** y **cliente**. Los datos se guardan en `localStorage`.

## Uso
```bash
npm install
npm run dev        # desarrollo
npm run typecheck  # revisión de tipos (tsc --noEmit)
npm run build      # producción (carpeta dist/)
```

## Cuentas de demostración
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@ferreteria.cl | 123456 |
| Vendedor | vendedor@ferreteria.cl | 123456 |
| Cliente | cliente@ferreteria.cl | 123456 |

En la pantalla de Login hay un botón por rol que completa el formulario.

## Estructura
```
src/
├─ types/        Interfaces y tipos (Usuario, Producto, Pedido, FiltrosProductos, ...)
├─ data/         Datos semilla (productos, categorías, usuarios, regiones, imágenes)
├─ utils/        format · validaciones · filtros · permisos · storage
├─ hooks/        useLocalStorage · useAlerta · useRedireccion · useAgregarAlCarrito
│                useCatalogo · useUsuarios · useCarrito   (lógica de negocio por dominio)
├─ context/      StoreContext: compone los tres hooks de dominio y los entrega con useStore()
├─ components/   Piezas reutilizables (Alerta, CampoFormulario, FormularioUsuario, ProductCard,
│                FiltrosCatalogo, TablaPedidos, Pestanas, InputCantidad, RutaProtegida, ...)
│  └─ admin/     AdminUsuarios · AdminProductos · AdminCategorias
└─ pages/        Home, Catalogo, Detalle, Carrito, Login, Registro, Perfil, Admin, Vendedor, 403, 404
```

## Reglas de negocio principales
- **Rutas protegidas** (`RutaProtegida`): `/perfil` exige sesión; `/vendedor` vendedor o administrador; `/admin` solo administrador. Sin permiso → `/acceso-denegado`.
- **Compras**: se puede armar el carrito sin sesión, pero solo un **cliente** con sesión finaliza la compra (`ROLES_QUE_COMPRAN` en `utils/permisos.ts`). Se revalida el stock, se descuenta y se guarda un **pedido**.
- **Vendedor**: consulta/actualiza stock, registra **solo clientes** y ve las ventas.
- **Administrador**: CRUD de usuarios (asigna roles), productos (con precio oferta e imagen) y categorías, más el listado de ventas.
- **Protecciones**: no se puede eliminar la cuenta propia ni al último administrador, nadie cambia su propio rol, el correo es único, una categoría con productos no se elimina y al renombrarla se actualizan sus productos.
- **Registro/validaciones**: edad mínima 14 años, dominios de correo autorizados, contraseña de 8+ caracteres con mayúscula y número, términos obligatorios.
