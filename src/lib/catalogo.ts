import perfumesJson from "../../data/perfumes.json";
import sitioJson from "../../data/sitio.json";

export type Genero = "Hombre" | "Mujer" | "Unisex";

export interface Perfume {
  id: string;
  nombre: string;
  marca: string;
  genero: Genero;
  tamano: string;
  concentracion: string;
  precio: number;
  precioAnterior?: number | null;
  familias: string[];
  ocasiones: string[];
  clima?: string[];
  estilo?: string;
  imagenes: string[];
  masVendido?: boolean;
  oferta?: boolean;
  disponible?: boolean;
  descripcion?: string;
}

export interface Sitio {
  marca: string;
  lema: string;
  whatsapp: string;
  whatsappVisible: string;
  mensajeGeneral: string;
  barraSuperior: string[];
  barraEnvio: string;
  hero: {
    antetitulo: string;
    titulo: string;
    subtitulo: string;
    botonQuiz: string;
    notaQuiz: string;
    botonCatalogo: string;
  };
  garantias: { icono: string; titulo: string; texto: string }[];
  pasos: { titulo: string; texto: string }[];
  valor: { titulo: string; texto: string };
  faq: { pregunta: string; respuesta: string }[];
  resenas: { nombre: string; ciudad?: string; texto: string; estrellas?: number }[];
  instagram?: string;
  tiktok?: string;
}

export const perfumes = perfumesJson as Perfume[];
export const sitio = sitioJson as Sitio;

// Color de cada familia olfativa: define la clasificación por color de chips, puntos y filtros.
export const FAMILIAS: Record<string, { color: string; descripcion: string }> = {
  Amaderado: { color: "#9A6A43", descripcion: "Cedro, sándalo, vetiver" },
  "Cítrico": { color: "#E3B21C", descripcion: "Bergamota, limón, mandarina" },
  Floral: { color: "#D9738F", descripcion: "Rosa, jazmín, azahar" },
  Frutal: { color: "#E0563B", descripcion: "Manzana, pera, frutos rojos" },
  Gourmand: { color: "#C98B4E", descripcion: "Vainilla, caramelo, tonka" },
  Oriental: { color: "#9B4A74", descripcion: "Ámbar, incienso, resinas" },
  Especiado: { color: "#B8502F", descripcion: "Pimienta, canela, cardamomo" },
  "Aromático": { color: "#6E9A55", descripcion: "Lavanda, menta, salvia" },
  "Acuático": { color: "#3F93C6", descripcion: "Notas marinas y frescas" },
  Cuero: { color: "#7B5E4E", descripcion: "Cuero, gamuza, ahumados" },
};

export const colorFamilia = (familia: string) => FAMILIAS[familia]?.color ?? "#A39B8F";

const formato = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
export const precioCOP = (n: number) => `$${formato.format(n)}`;

export const descuento = (p: Perfume) =>
  p.precioAnterior && p.precioAnterior > p.precio
    ? Math.round((1 - p.precio / p.precioAnterior) * 100)
    : 0;

export const enlaceWhatsApp = (mensaje: string) =>
  `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const mensajePerfume = (p: Perfume) =>
  `Hola ${sitio.marca}, me interesa este perfume:\n\n• ${p.marca} ${p.nombre} (${p.tamano}, ${p.concentracion}) — ${precioCOP(p.precio)}\n\n¿Está disponible?`;

export const mensajePedido = (items: { perfume: Perfume; cantidad: number }[]) => {
  const lineas = items.map(
    ({ perfume: p, cantidad }) =>
      `• ${cantidad} x ${p.marca} ${p.nombre} (${p.tamano}) — ${precioCOP(p.precio * cantidad)}`,
  );
  const total = items.reduce((s, i) => s + i.perfume.precio * i.cantidad, 0);
  return `Hola ${sitio.marca}, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${precioCOP(total)}\n\n¿Me confirman disponibilidad y envío?`;
};

// Descripción corta generada a partir de los atributos, si el JSON no trae una propia.
export const descripcionPerfume = (p: Perfume) => {
  if (p.descripcion) return p.descripcion;
  const fams = p.familias.map((f) => f.toLowerCase());
  const lista = fams.length > 1 ? `${fams.slice(0, -1).join(", ")} y ${fams.at(-1)}` : fams[0];
  const ocasion = p.ocasiones.length
    ? ` Ideal para ${p.ocasiones.map((o) => o.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " y $1")}.`
    : "";
  return `${p.concentracion} de carácter ${lista ?? "único"}, de ${p.marca}.${ocasion}`;
};

export const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
