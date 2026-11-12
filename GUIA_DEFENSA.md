# Guía de defensa — Ferretería Los Maestros

Apoyo para los criterios **D1–D4** de la rúbrica. Cada punto indica qué decir y en qué archivo mostrarlo.

---

## D1 · Estructura, componentes, reutilización y props (21 %)

**Idea central:** cada archivo tiene una sola responsabilidad y lo que se repite es un componente o un hook.

- **Páginas** (`pages/`): una por ruta; arman la pantalla combinando componentes.
- **Componentes reutilizables** (`components/`), con ejemplos de reutilización:
  - `CampoFormulario` envuelve etiqueta + input + error. Lo usan Registro, Login, Contacto, Perfil y los tres paneles de Admin.
  - `FormularioUsuario` es **un solo formulario** para cuatro usos: registro de cliente (`modo="registro"`), alta por vendedor (`modo="alta"` + `rolFijo="cliente"`), alta/edición por administrador (selector de rol) y perfil (`modo="edicion"`).
  - `ProductCard` se usa en Home (`variante="destacado"`) y Catálogo (`variante="catalogo"`).
  - `Alerta`, `TituloPagina`, `Pestanas`, `InputCantidad` (Carrito y stock del vendedor), `TablaPedidos` (Perfil y Ventas), `PanelVentas` (Admin y Vendedor).
- **Hooks propios**: `useAlerta`, `useRedireccion`, `useLocalStorage`, `useAgregarAlCarrito` (antes estaba copiado en Home y Catálogo).
- **Store dividido**: `StoreContext` solo compone `useCatalogo`, `useUsuarios` y `useCarrito`.
- **Props de ejemplo** (`ProductCard`): `producto` (datos), `variante` (apariencia) y `onAgregar` (función que sube el evento al padre). Datos hacia abajo, eventos hacia arriba.

## D2 · Estados, eventos y renderizado dinámico (12 %)

- **Estado global**: `useState` dentro de `useCatalogo/useUsuarios/useCarrito`, persistido con `useLocalStorage` (`useState` + `useEffect`).
- **Estado local**: filtros del catálogo (`Catalogo.tsx`), formularios (`FormularioUsuario.tsx`), pestaña activa (`Admin.tsx`).
- **Eventos**: `onChange` actualiza el estado, `onSubmit` valida, `onBlur`/Enter confirman cantidad (`InputCantidad`), `onClick` agrega al carrito.
- **Renderizado dinámico**: listas con `.map` y `key`, condicionales (`&&`, ternarios) para vacío/agotado/oferta, y `useMemo` para el filtrado.
- **Demo sugerida**: en Catálogo escribe "taladro", cambia categoría, mueve el precio, activa "Solo ofertas", ordena; el contador de resultados cambia en vivo. Luego agrega al carrito y mira el contador del navbar.
- **Dato a destacar**: el usuario activo no se guarda duplicado; se guarda solo su `id` y el usuario se **deriva** de la lista. Si el administrador cambia un rol, los permisos se actualizan al instante.

## D3 · TypeScript, navegación, Bootstrap y responsividad (12 %)

- **Tipos** (`types/index.ts`): `RolUsuario` y `GeneroUsuario` son uniones de literales; `Usuario`, `Producto`, `Categoria`, `ItemCarrito`, `Pedido`; `DatosUsuario = Omit<Usuario, "id" | "edad">`; `RespuestaOperacion` es el resultado estándar de toda operación.
- **Props tipadas**: cada componente declara su `interface ...Props`. `Pestanas<T extends string>` es un componente **genérico**.
- **Hooks tipados**: `useLocalStorage<T>`; el tipo del contexto se obtiene con `ReturnType<typeof useCatalogo> & ...`.
- **Navegación** (`App.tsx`): React Router con rutas anidadas bajo `Layout`, parámetro `detalle/:id`, `NavLink` activo, `useNavigate`, y `RutaProtegida` (ruta de layout con `<Outlet />`) para perfil, vendedor y admin. El login devuelve a la página que se intentó abrir.
- **Bootstrap 5**: grilla `row-cols-1 row-cols-sm-2 row-cols-lg-4`, `navbar-expand-lg` colapsable, `table-responsive`, `card`, `form-control`/`is-invalid`/`invalid-feedback`, `nav-tabs`, `dropdown`, `alert`. Pruébalo con F12 → modo móvil.

## D4 · Funcionalidades, roles y justificación técnica (15 %) — el criterio más débil, ensáyalo

**Guion de demo (5 min):**
1. **Invitado**: catálogo y filtros, agrega al carrito, "Iniciar sesión para comprar" → lo envía al login y vuelve al carrito.
2. **Cliente** (`cliente@ferreteria.cl`): finaliza la compra; baja el stock, aparece en **Mi Perfil → Mis Compras**. Intenta abrir `/admin` → **403**.
3. **Vendedor**: pestaña Stock (cambia un stock y escribe uno negativo → error), registra un cliente nuevo, mira Ventas. No ve el panel Admin.
4. **Administrador**: crea un producto con precio oferta (aparece en Ofertas de Home), crea/edita una categoría, asigna un rol a un usuario.
5. **Reglas que demuestran criterio**: intenta eliminar tu propia cuenta o cambiar tu propio rol, eliminar una categoría con productos, registrar un correo repetido, comprar como admin → cada una muestra un mensaje explicativo.

**Justificaciones técnicas que puedes dar:**
- *¿Por qué Context y no Redux?* El estado es pequeño y compartido; Context + hooks evita una dependencia. Se dividió en tres hooks para no tener un archivo gigante.
- *¿Por qué `localStorage`?* No hay backend en el alcance; simula persistencia.
- *¿Dónde está la regla de permisos?* En un solo lugar (`utils/permisos.ts`) más `RutaProtegida`, y las operaciones sensibles se vuelven a validar en los hooks, no solo se ocultan botones.
- *¿Qué limitaciones tiene?* Contraseñas en texto plano en `localStorage` y permisos solo del lado cliente: en producción irían en un backend con hash y autenticación real.
- *Decisión tomada:* solo el rol cliente finaliza compras (`ROLES_QUE_COMPRAN`); si quieren permitir otros roles se cambia en un solo arreglo.
