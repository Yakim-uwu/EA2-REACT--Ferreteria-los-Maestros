# Ferretería Los Maestros — React

Migración de la tienda (HTML + Bootstrap + JS vanilla) a React con Vite.

## Uso
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción (carpeta dist/)
```

## Estructura
- `src/context/StoreContext.jsx` — estado global (productos, carrito, usuarios, sesión) sincronizado con `localStorage` (mismas claves que antes).
- `src/pages/` — Home, Catalogo, Detalle (`/detalle/:id`), Carrito, Login, Registro.
- `src/components/` — Navbar, Footer, Layout, ProductCard, Alerta.
- `src/data/productos.js` — semilla de productos y categorías.
- `public/IMG/` — imágenes.
