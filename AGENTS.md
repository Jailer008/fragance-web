<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Sons — catálogo de perfumes

Sitio estático (Next.js 16, `output: "export"`, Tailwind v4). Sin pagos ni backend: los pedidos se envían por WhatsApp.

- `data/perfumes.json` — catálogo (fuente única de productos). Se importa en build.
- `data/sitio.json` — textos, número de WhatsApp, FAQ, reseñas.
- `src/lib/catalogo.ts` — tipos, colores de familias olfativas, helpers de precio/WhatsApp.
- `src/components/tienda/` — secciones y capas (detalle, pedido, test).
- `scripts/importar-catalogo.mjs` — regenera `perfumes.json` desde el Shopify del proveedor.

Comandos: `npm run dev`, `npm run check` (lint + tipos + build → `out/`).
