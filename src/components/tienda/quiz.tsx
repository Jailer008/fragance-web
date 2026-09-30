"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import { perfumes, type Perfume } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { useTienda } from "./estado";

interface Opcion {
  etiqueta: string;
  detalle?: string;
  puntaje: (p: Perfume) => number;
}

const PREGUNTAS: { pregunta: string; opciones: Opcion[] }[] = [
  {
    pregunta: "¿Para quién es el perfume?",
    opciones: [
      { etiqueta: "Para él", puntaje: (p) => (p.genero === "Hombre" ? 4 : p.genero === "Unisex" ? 2 : -20) },
      { etiqueta: "Para ella", puntaje: (p) => (p.genero === "Mujer" ? 4 : p.genero === "Unisex" ? 2 : -20) },
      { etiqueta: "Sin etiquetas", detalle: "Unisex", puntaje: (p) => (p.genero === "Unisex" ? 4 : 0) },
    ],
  },
  {
    pregunta: "¿Qué tipo de aroma te atrae?",
    opciones: [
      { etiqueta: "Fresco", detalle: "Cítrico, acuático, aromático", puntaje: (p) => cuenta(p, ["Cítrico", "Acuático", "Aromático"]) },
      { etiqueta: "Dulce", detalle: "Vainilla, frutas, caramelo", puntaje: (p) => cuenta(p, ["Gourmand", "Frutal"]) },
      { etiqueta: "Floral", detalle: "Rosa, jazmín, flores blancas", puntaje: (p) => cuenta(p, ["Floral"]) },
      { etiqueta: "Intenso", detalle: "Maderas, ámbar, especias, cuero", puntaje: (p) => cuenta(p, ["Amaderado", "Oriental", "Especiado", "Cuero"]) },
    ],
  },
  {
    pregunta: "¿Cuándo lo vas a usar más?",
    opciones: [
      { etiqueta: "De día", detalle: "Oficina, universidad, diario", puntaje: (p) => (p.ocasiones.includes("Día") ? 2 : 0) + (p.clima?.includes("Calor") ? 1 : 0) },
      { etiqueta: "De noche", detalle: "Citas, cenas", puntaje: (p) => (p.ocasiones.includes("Noche") ? 2 : 0) },
      { etiqueta: "De fiesta", detalle: "Que se note al llegar", puntaje: (p) => (p.ocasiones.includes("Fiesta") ? 2 : 0) + (/Extrait|Parfum|Elixir/.test(p.concentracion) ? 1 : 0) },
      { etiqueta: "Todo el tiempo", detalle: "Uno versátil", puntaje: (p) => p.ocasiones.length },
    ],
  },
  {
    pregunta: "¿Qué estilo prefieres?",
    opciones: [
      { etiqueta: "Diseñador", detalle: "Las grandes casas de moda", puntaje: (p) => (p.estilo === "Diseñador" ? 3 : 0) },
      { etiqueta: "Nicho", detalle: "Exclusivos y diferentes", puntaje: (p) => (p.estilo === "Nicho" ? 3 : 0) },
      { etiqueta: "Árabe", detalle: "Intensos y de gran duración", puntaje: (p) => (p.estilo === "Árabe" ? 3 : 0) },
      { etiqueta: "Sorpréndeme", puntaje: (p) => (p.masVendido ? 2 : 0) },
    ],
  },
  {
    pregunta: "¿Cuál es tu presupuesto?",
    opciones: [
      { etiqueta: "Hasta $200.000", puntaje: (p) => rango(p, 0, 200000) },
      { etiqueta: "$200.000 – $350.000", puntaje: (p) => rango(p, 200000, 350000) },
      { etiqueta: "$350.000 – $550.000", puntaje: (p) => rango(p, 350000, 550000) },
      { etiqueta: "Más de $550.000", puntaje: (p) => rango(p, 550000, Infinity) },
    ],
  },
];

function cuenta(p: Perfume, familias: string[]) {
  // La familia principal (primera) pesa más que las secundarias.
  return p.familias.reduce((s, f, i) => s + (familias.includes(f) ? 3 - i : 0), 0);
}

function rango(p: Perfume, min: number, max: number) {
  if (p.precio >= min && p.precio < max) return 4;
  const distancia = p.precio < min ? (min - p.precio) / 100000 : (p.precio - max) / 100000;
  return -Math.min(8, distancia * 3);
}

export function Quiz() {
  const { quizAbierto, setQuizAbierto, irAlCatalogo } = useTienda();
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Opcion[]>([]);

  useEffect(() => {
    if (!quizAbierto) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el test al abrirlo
    setPaso(0);
    setRespuestas([]);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quizAbierto]);

  if (!quizAbierto) return null;

  const responder = (o: Opcion) => {
    const nuevas = [...respuestas.slice(0, paso), o];
    if (paso < PREGUNTAS.length - 1) {
      setRespuestas(nuevas);
      setPaso(paso + 1);
      return;
    }
    const recomendados = perfumes
      .filter((p) => p.disponible !== false)
      .map((p) => ({ id: p.id, s: nuevas.reduce((acc, r) => acc + r.puntaje(p), 0) + (p.masVendido ? 0.5 : 0) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.id);
    setQuizAbierto(false);
    irAlCatalogo({ recomendados });
  };

  const actual = PREGUNTAS[paso];

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-3" role="dialog" aria-modal aria-label="Encuentra tu fragancia">
      <div className="aparecer absolute inset-0 bg-noche/80 backdrop-blur-sm" onClick={() => setQuizAbierto(false)} />
      <div className="aparecer relative w-full max-w-[560px] overflow-hidden rounded-[4px] bg-noche text-crema ring-1 ring-oro/25">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(200,169,106,.25),transparent_65%)]" />
        <div className="relative flex items-center justify-between px-5 pt-5">
          <button
            type="button"
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
            className={cn("grid h-10 w-10 place-items-center", paso === 0 && "invisible")}
            aria-label="Pregunta anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="antetitulo">
            Pregunta {paso + 1} de {PREGUNTAS.length}
          </p>
          <button type="button" onClick={() => setQuizAbierto(false)} className="grid h-10 w-10 place-items-center" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mx-5 mt-3 h-[2px] bg-white/10">
          <div className="h-full bg-oro transition-[width] duration-500" style={{ width: `${((paso + 1) / PREGUNTAS.length) * 100}%` }} />
        </div>

        <div key={paso} className="aparecer relative px-6 pt-8 pb-8 md:px-9">
          <Sparkles className="h-6 w-6 text-oro" />
          <h2 className="mt-3 font-serif text-[1.8rem] leading-tight font-medium">{actual.pregunta}</h2>
          <div className="mt-7 grid gap-2.5">
            {actual.opciones.map((o) => (
              <button
                key={o.etiqueta}
                type="button"
                onClick={() => responder(o)}
                className={cn(
                  "group flex items-center justify-between gap-4 rounded-[3px] border px-5 py-4 text-left transition-colors hover:border-oro hover:bg-white/5",
                  respuestas[paso] === o ? "border-oro bg-white/5" : "border-white/12",
                )}
              >
                <span>
                  <span className="block font-semibold">{o.etiqueta}</span>
                  {o.detalle && <span className="mt-0.5 block text-[0.8rem] text-crema/55">{o.detalle}</span>}
                </span>
                <span className="h-4 w-4 shrink-0 rounded-full border border-white/30 transition-colors group-hover:border-oro group-hover:bg-oro" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
