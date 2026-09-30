// Genera data/perfumes.json a partir del catálogo público del proveedor (Shopify).
//
//   node scripts/importar-catalogo.mjs            -> sobrescribe data/perfumes.json
//   node scripts/importar-catalogo.mjs --salida x -> escribe en otro archivo
//
// OJO: sobrescribe el archivo. Si ya editaste precios o quitaste perfumes a mano,
// usa --salida para generar una copia aparte y compara antes de reemplazar.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const PROVEEDOR = "https://perfumeriamillennio.com";
const args = process.argv.slice(2);
const salida = resolve(
  args.includes("--salida") ? args[args.indexOf("--salida") + 1] : "data/perfumes.json",
);

// Palabras clave (en las notas del proveedor) que definen cada familia olfativa.
const FAMILIAS = {
  Amaderado: ["cedro", "sandalo", "vetiver", "madera", "pachuli", "patchouli", "oud", "amaderad", "guayaco", "abedul"],
  "Cítrico": ["bergamota", "limon", "mandarina", "naranja", "pomelo", "toronja", "citric", "lima ", "neroli", "yuzu"],
  Floral: ["rosa", "jazmin", "flor", "iris", "tuberosa", "peonia", "violeta", "lirio", "azahar", "magnolia", "ylang", "gardenia", "orquidea", "fresia"],
  Frutal: ["manzana", "pera", "frutos", "frambuesa", "pina", "durazno", "melocoton", "cereza", "grosella", "lichi", "frutal", "mango", "fresa", "ciruela", "maracuya"],
  Gourmand: ["vainilla", "caramelo", "chocolate", "praline", "cafe", "miel", "tonka", "almendra", "cacao", "azucar", "malvavisco"],
  Oriental: ["ambar", "incienso", "resina", "benjui", "oriental", "mirra", "labdano", "ladano", "opopanax"],
  Especiado: ["pimienta", "canela", "cardamomo", "nuez moscada", "clavo", "jengibre", "azafran", "especia", "especiad"],
  "Aromático": ["lavanda", "salvia", "romero", "menta", "albahaca", "geranio", "aromatic", "tomillo", "artemisa"],
  "Acuático": ["marin", "acuatic", "oceano", "oceanic", "sal marina", "algas", "calone", "brisa", "agua de mar"],
  Cuero: ["cuero", "gamuza", "ante "],
};

const PALABRAS_MENORES = new Set(["de", "del", "la", "las", "le", "les", "el", "for", "pour", "by", "of", "and", "y", "en", "a", "the", "di", "da"]);
const SIEMPRE_MAYUS = new Set(["EDP", "EDT", "EDC", "VIP", "NYC", "CH", "CK", "II", "III", "IV", "XS", "CR7", "YSL", "DKNY", "JPG", "USA", "L.12.12", "K", "NY", "UV", "PM", "AM", "EDT."]);

const sinTildes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function titulo(texto) {
  return texto
    .trim()
    .split(/\s+/)
    .map((p, i) => {
      const up = p.toUpperCase();
      if (SIEMPRE_MAYUS.has(up) || /\d/.test(p)) return up;
      const low = p.toLowerCase();
      if (i > 0 && PALABRAS_MENORES.has(low)) return low;
      // Mantiene apóstrofes/guiones: "d'hermes" -> "D'Hermes"
      return low.replace(/(^|['’\-/.&])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
    })
    .join(" ");
}

function slug(s) {
  return sinTildes(s).replace(/&/g, " y ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function limpiarHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
}

function familias(p) {
  const texto = ` ${sinTildes(`${p.title} ${limpiarHtml(p.body_html)}`)} `;
  const puntos = {};
  for (const [fam, claves] of Object.entries(FAMILIAS)) {
    for (const k of claves) {
      const n = texto.split(k).length - 1;
      if (n) puntos[fam] = (puntos[fam] || 0) + n;
    }
  }
  const tags = p.tags.map(sinTildes);
  if (tags.includes("amaderado")) puntos.Amaderado = (puntos.Amaderado || 0) + 2;
  if (tags.includes("citrico")) puntos["Cítrico"] = (puntos["Cítrico"] || 0) + 2;
  if (tags.includes("dulce")) puntos.Gourmand = (puntos.Gourmand || 0) + 1;
  return Object.entries(puntos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f);
}

function concentracion(p) {
  const t = p.tags.join("|");
  const titulo = p.title.toUpperCase();
  if (/Extract de Parfum|Extrait/i.test(t) || /EXTRAIT/.test(titulo)) return "Extrait de Parfum";
  if (/Elixir/i.test(t) || /ELIXIR/.test(titulo)) return "Elixir";
  if (/\bEDT\b/.test(titulo) || /Eau de Toilette/.test(t)) return "Eau de Toilette";
  if (/\bEDC\b/.test(titulo)) return "Eau de Cologne";
  if (/\bEDP\b/.test(titulo) || /Eau de Parfum/.test(t)) return "Eau de Parfum";
  if (/\bParfum\b/.test(t) || /\bPARFUM\b/.test(titulo)) return "Parfum";
  return "Eau de Parfum";
}

function genero(tags) {
  const h = tags.includes("Hombre");
  const m = tags.includes("Mujer");
  if (tags.includes("Unisex") || (h && m)) return "Unisex";
  return m ? "Mujer" : "Hombre";
}

function mililitros(v) {
  const m = /(\d+(?:[.,]\d+)?)\s*ml/i.exec(v.title || "");
  return m ? parseFloat(m[1].replace(",", ".")) : 0;
}

function imagen(src) {
  // El CDN de Shopify redimensiona con ?width=; 800px basta para tarjeta y detalle.
  const url = new URL(src);
  url.searchParams.set("width", "800");
  return url.toString();
}

async function descargarProveedor() {
  const todos = [];
  for (let page = 1; page < 30; page++) {
    const res = await fetch(`${PROVEEDOR}/products.json?limit=250&page=${page}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`Proveedor respondió ${res.status}`);
    const { products } = await res.json();
    if (!products.length) break;
    todos.push(...products);
  }
  return todos;
}

const productos = await descargarProveedor();
const vistos = new Set();
const perfumes = [];

for (const p of productos) {
  if (/estuche|tester|combo|\bset\b|kit|crema|body|desodorante|splash/i.test(p.title)) continue;
  if (!p.images.length) continue;

  // Presentación principal: el frasco más grande que no sea muestra/decant.
  const frascos = p.variants
    .filter((v) => !/muestra|decant/i.test(v.title) && mililitros(v) >= 25)
    .sort((a, b) => mililitros(b) - mililitros(a));
  const v = frascos[0];
  if (!v) continue;

  const marca = titulo(p.vendor || "");
  const vendorRe = new RegExp(`\\b${(p.vendor || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  let nombre = p.title.replace(/^\s*perfume\s+/i, "").replace(vendorRe, "").replace(/\s{2,}/g, " ").trim();
  nombre = titulo(nombre || p.title);

  const id = slug(`${nombre}-${marca}`);
  if (vistos.has(id)) continue;
  vistos.add(id);

  const precio = Math.round(Number(v.price));
  const anterior = v.compare_at_price ? Math.round(Number(v.compare_at_price)) : null;
  const tags = p.tags;
  const tagsNorm = tags.map(sinTildes);

  perfumes.push({
    id,
    nombre,
    marca,
    genero: genero(tags),
    tamano: `${mililitros(v)} ml`,
    concentracion: concentracion(p),
    precio,
    precioAnterior: anterior && anterior > precio ? anterior : null,
    familias: familias(p),
    ocasiones: [
      tagsNorm.includes("dia") && "Día",
      tagsNorm.includes("noche") && "Noche",
      tagsNorm.includes("fiesta") && "Fiesta",
      tagsNorm.includes("playa") && "Playa",
    ].filter(Boolean),
    clima: [tagsNorm.includes("frio") && "Frío", tagsNorm.includes("calor") && "Calor"].filter(Boolean),
    estilo: tagsNorm.includes("arabe") ? "Árabe" : tagsNorm.includes("nicho") ? "Nicho" : "Diseñador",
    imagenes: p.images.slice(0, 2).map((i) => imagen(i.src)),
    masVendido: tagsNorm.includes("mas vendidos"),
    oferta: tagsNorm.some((t) => t.includes("oferta")),
    disponible: v.available,
  });
}

// Primero los más vendidos, luego por marca y nombre: así el JSON es fácil de recorrer a mano.
perfumes.sort(
  (a, b) => Number(b.masVendido) - Number(a.masVendido) || a.marca.localeCompare(b.marca) || a.nombre.localeCompare(b.nombre),
);

mkdirSync(dirname(salida), { recursive: true });
writeFileSync(salida, JSON.stringify(perfumes, null, 2) + "\n");
console.log(`${perfumes.length} perfumes -> ${salida}`);
