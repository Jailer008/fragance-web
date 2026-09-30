# The Sons · Perfumes

Catálogo web de perfumes con pedidos por WhatsApp. Es un sitio 100 % estático: no necesita servidor, base de datos ni pasarela de pagos.

## Cómo agregar, quitar o editar perfumes

Todo el catálogo está en **`data/perfumes.json`**. Cada perfume es un bloque `{ ... }`:

```json
{
  "id": "karpos-ahli",
  "nombre": "Karpos",
  "marca": "Ahli",
  "genero": "Hombre",
  "tamano": "60 ml",
  "concentracion": "Eau de Parfum",
  "precio": 394250,
  "precioAnterior": 485000,
  "familias": ["Especiado", "Amaderado", "Cítrico"],
  "ocasiones": ["Día", "Noche", "Fiesta"],
  "clima": ["Frío"],
  "estilo": "Nicho",
  "imagenes": ["https://..."],
  "masVendido": true,
  "oferta": false,
  "disponible": true
}
```

- **Quitar un perfume:** borra su bloque completo (desde `{` hasta `},`). Cuida que el último bloque de la lista no termine en coma.
- **Agregar uno:** copia un bloque existente, pégalo y cambia los datos. El `id` debe ser único (solo minúsculas, números y guiones).
- **Marcar agotado sin borrarlo:** `"disponible": false`.
- **Precio tachado / descuento:** pon el precio anterior en `precioAnterior` (o `null` para no mostrar descuento).
- **Secciones especiales:** `"masVendido": true` lo muestra en "Los más vendidos" y en la portada; `"oferta": true` lo incluye en "Oferta del día" (rota cada día).
- **Familias válidas** (cada una tiene su color): Amaderado, Cítrico, Floral, Frutal, Gourmand, Oriental, Especiado, Aromático, Acuático, Cuero.
- **Descripción propia (opcional):** agrega `"descripcion": "..."`. Si no hay, se genera una a partir de la familia y la ocasión.

Los textos de la página (número de WhatsApp, preguntas frecuentes, garantías, reseñas, redes sociales) están en **`data/sitio.json`**. La sección de reseñas solo aparece cuando agregas reseñas reales:

```json
"resenas": [
  { "nombre": "Laura", "ciudad": "Medellín", "texto": "Me llegó rapidísimo y es original.", "estrellas": 5 }
]
```

Una vez que el sitio esté conectado al hosting (ver abajo), cualquier cambio que guardes en GitHub se publica solo en 1–2 minutos. Puedes editar los JSON directamente desde github.com con el lápiz ✏️, sin instalar nada.

### Regenerar el catálogo desde el proveedor

```bash
npm run importar-catalogo
```

Descarga el catálogo público del proveedor y **sobrescribe** `data/perfumes.json` (se perderían tus ediciones manuales). Para compararlo antes: `node scripts/importar-catalogo.mjs --salida data/nuevo.json`.

## Probar en tu computador

Requiere Node.js 24.

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + tipos + compilación final en out/
```

## Publicar gratis (Cloudflare Pages)

1. Sube este proyecto a un repositorio de GitHub.
2. Crea una cuenta gratuita en [Cloudflare](https://dash.cloudflare.com/sign-up) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** y elige el repositorio.
3. Configuración de compilación:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Guardar y desplegar. Obtendrás una dirección gratuita del tipo `the-sons.pages.dev`.

Alternativa equivalente: [Netlify](https://www.netlify.com/) (mismo comando de compilación y carpeta `out`).
