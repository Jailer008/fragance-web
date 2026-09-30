"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { FAMILIAS, perfumes, precioCOP, sitio } from "@/lib/catalogo";
import { useTienda } from "./estado";
import { ICONOS_GARANTIA } from "./iconos";
import { TarjetaPerfume } from "./tarjeta-perfume";

const disponibles = perfumes.filter((p) => p.disponible !== false);
const masVendidos = disponibles.filter((p) => p.masVendido);
const estrella = masVendidos[0] ?? disponibles[0];

// Selección determinista por día: la "oferta del día" cambia cada 24 h sin backend.
function delDia<T>(lista: T[], n: number) {
  const hoy = new Date();
  let semilla = hoy.getFullYear() * 1000 + Math.floor((hoy.getTime() - new Date(hoy.getFullYear(), 0, 0).getTime()) / 864e5);
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    semilla = (semilla * 9301 + 49297) % 233280;
    const j = Math.floor((semilla / 233280) * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

export function Hero() {
  const { setQuizAbierto, irAlCatalogo, abrirPerfume } = useTienda();
  const { hero } = sitio;

  return (
    <section className="relative overflow-hidden bg-noche text-crema">
      <div className="grano pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(200,169,106,.22),transparent_62%)]" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-15%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(140,28,43,.35),transparent_65%)]" />

      <div className="contenedor relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
        <div className="max-w-[620px]">
          <p className="antetitulo aparecer">{hero.antetitulo}</p>
          <h1 className="aparecer mt-5 font-serif text-[2.6rem] leading-[1.02] font-medium tracking-[-0.015em] [animation-delay:.1s] sm:text-[3.4rem] lg:text-[4.3rem]">
            {hero.titulo.split(" ").map((palabra, i, arr) =>
              i >= arr.length - 2 ? (
                <em key={i} className="text-oro-2 not-italic">
                  <span className="italic">{palabra}</span>{" "}
                </em>
              ) : (
                <span key={i}>{palabra} </span>
              ),
            )}
          </h1>
          <p className="aparecer mt-6 max-w-[520px] text-[1rem] leading-relaxed text-crema/72 [animation-delay:.2s] md:text-[1.08rem]">{hero.subtitulo}</p>
          <div className="aparecer mt-9 flex flex-col gap-3 [animation-delay:.3s] sm:flex-row">
            <button type="button" onClick={() => setQuizAbierto(true)} className="btn btn-oro">
              <Sparkles className="h-4 w-4" /> {hero.botonQuiz}
            </button>
            <button type="button" onClick={() => irAlCatalogo()} className="btn btn-linea">
              {hero.botonCatalogo} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="aparecer mt-3 text-[0.76rem] text-crema/50 [animation-delay:.35s]">{hero.notaQuiz}</p>

          <dl className="aparecer mt-10 grid max-w-[460px] grid-cols-3 border-t border-white/10 pt-6 [animation-delay:.45s]">
            {[
              [`${perfumes.length}+`, "fragancias"],
              [`${new Set(perfumes.map((p) => p.marca)).size}`, "casas"],
              ["100%", "originales"],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="font-serif text-2xl text-oro-2 md:text-3xl">{n}</dt>
                <dd className="mt-1 text-[0.66rem] tracking-[0.18em] text-crema/55 uppercase">{t}</dd>
              </div>
            ))}
          </dl>
        </div>

        {estrella && (
          <button type="button" onClick={() => abrirPerfume(estrella)} className="group relative mx-auto w-full max-w-[440px]" aria-label={`Ver ${estrella.nombre}`}>
            <div className="absolute inset-x-6 top-4 bottom-0 rounded-t-[999px] border border-oro/35" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[linear-gradient(180deg,#2a241e,#141110)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(227,204,151,.28),transparent_60%)]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={estrella.imagenes[0]}
                alt={`${estrella.marca} ${estrella.nombre}`}
                className="frasco-flotante absolute inset-0 m-auto h-[78%] w-[78%] rounded-[50%] object-contain mix-blend-normal drop-shadow-[0_30px_40px_rgba(0,0,0,.55)]"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 w-[86%] -translate-x-1/2 bg-crema px-5 py-4 text-left text-tinta shadow-2xl transition-transform group-hover:-translate-y-1">
              <p className="antetitulo !text-vino">El más vendido</p>
              <p className="mt-1 font-serif text-lg leading-tight font-semibold">
                {estrella.marca} {estrella.nombre}
              </p>
              <p className="mt-1 text-sm font-bold">{precioCOP(estrella.precio)}</p>
            </div>
          </button>
        )}
      </div>
      <div className="h-10" />
    </section>
  );
}

export function Garantias() {
  return (
    <section className="border-b border-tinta/6 bg-crema">
      <div className="contenedor grid grid-cols-2 gap-y-7 py-9 md:grid-cols-4 md:py-11">
        {sitio.garantias.map((g, i) => {
          const Icono = ICONOS_GARANTIA[g.icono] ?? ICONOS_GARANTIA.sello;
          return (
            <div key={g.titulo} className="revelar flex flex-col items-center px-2 text-center" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-vino/25 text-vino">
                <Icono className="h-[22px] w-[22px]" strokeWidth={1.6} />
              </span>
              <p className="mt-3 font-serif text-[1.02rem] font-semibold">{g.titulo}</p>
              <p className="mt-0.5 text-[0.78rem] text-tinta-2">{g.texto}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function useCuentaRegresiva() {
  const [resto, setResto] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => {
      const ahora = new Date();
      const fin = new Date(ahora);
      fin.setHours(24, 0, 0, 0);
      const s = Math.max(0, Math.floor((fin.getTime() - ahora.getTime()) / 1000));
      const dos = (n: number) => String(n).padStart(2, "0");
      setResto(`${dos(Math.floor(s / 3600))}:${dos(Math.floor((s % 3600) / 60))}:${dos(s % 60)}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return resto;
}

export function OfertaDelDia() {
  const { irAlCatalogo } = useTienda();
  const resto = useCuentaRegresiva();
  // Se calcula en el cliente para que la selección sea la del día del visitante.
  const [ofertas, setOfertas] = useState(() => disponibles.filter((p) => p.oferta).slice(0, 8));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de la fecha local del visitante
    setOfertas(delDia(disponibles.filter((p) => p.oferta), 8));
  }, []);
  if (!ofertas.length) return null;

  return (
    <section id="ofertas" className="bg-crema py-16 md:py-24">
      <div className="contenedor">
        <div className="revelar mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="antetitulo !text-vino">Solo por hoy</p>
            <h2 className="titulo-seccion mt-2">Oferta del día</h2>
          </div>
          <div className="flex items-center gap-3 rounded-[2px] bg-noche px-4 py-2.5 text-crema">
            <span className="h-2 w-2 animate-brillo rounded-full bg-vino-2" />
            <span className="text-[0.7rem] tracking-[0.16em] uppercase">Termina en</span>
            <span className="font-mono text-[1.05rem] font-semibold tabular-nums">{resto ?? "--:--:--"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {ofertas.map((p, i) => (
            <div key={p.id} className="revelar" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <TarjetaPerfume perfume={p} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button type="button" onClick={() => irAlCatalogo({ soloOfertas: true })} className="btn btn-vino">
            Ver todas las ofertas <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function PorFamilia() {
  const { irAlCatalogo } = useTienda();
  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    perfumes.forEach((p) => p.familias.forEach((f) => (c[f] = (c[f] ?? 0) + 1)));
    return c;
  }, []);

  return (
    <section className="relative overflow-hidden bg-noche py-16 text-crema md:py-24">
      <div className="grano pointer-events-none absolute inset-0" />
      <div className="contenedor relative">
        <div className="revelar mx-auto max-w-[640px] text-center">
          <p className="antetitulo">Clasificadas por color</p>
          <h2 className="titulo-seccion mt-2">Compra por familia olfativa</h2>
          <p className="mt-3 text-[0.92rem] text-crema/60">Cada color es una familia de aromas. Toca una para ver sus perfumes.</p>
        </div>
        <div className="mt-11 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
          {Object.entries(FAMILIAS).map(([nombre, { color, descripcion }], i) => (
            <button
              key={nombre}
              type="button"
              onClick={() => irAlCatalogo({ familia: nombre })}
              className="revelar group relative overflow-hidden rounded-[3px] border border-white/8 bg-panel p-4 text-left transition-colors hover:border-white/25 md:p-5"
              style={{ transitionDelay: `${(i % 5) * 60}ms` }}
            >
              <span
                className="absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-35 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: color }}
              />
              <span className="relative flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-full ring-4 ring-white/5" style={{ background: color }} />
                <span className="font-serif text-[1.08rem] font-semibold">{nombre}</span>
              </span>
              <span className="relative mt-2 block text-[0.74rem] leading-snug text-crema/55">{descripcion}</span>
              <span className="relative mt-3 flex items-center justify-between text-[0.68rem] tracking-[0.14em] uppercase" style={{ color }}>
                {conteo[nombre] ?? 0} perfumes
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 transition-transform group-hover:translate-x-0" />
              </span>
              <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: color }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MasVendidos() {
  const pista = useRef<HTMLDivElement>(null);
  const mover = (dir: number) => pista.current?.scrollBy({ left: dir * pista.current.clientWidth * 0.8, behavior: "smooth" });
  if (!masVendidos.length) return null;

  return (
    <section className="bg-noche pb-16 text-crema md:pb-24">
      <div className="contenedor">
        <div className="revelar mb-8 flex items-end justify-between gap-4 border-t border-white/10 pt-14">
          <div>
            <p className="antetitulo">Favoritos de nuestros clientes</p>
            <h2 className="titulo-seccion mt-2">Los más vendidos</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => mover(d)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-oro hover:text-oro"
                aria-label={d < 0 ? "Anteriores" : "Siguientes"}
              >
                {d < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={pista} className="sin-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 md:gap-5 md:scroll-px-7 md:px-7 xl:px-[max(28px,calc((100vw-1144px)/2))]">
        {masVendidos.slice(0, 16).map((p) => (
          <div key={p.id} className="w-[64%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-[23%]">
            <TarjetaPerfume perfume={p} oscura />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Marcas() {
  const { irAlCatalogo } = useTienda();
  const top = useMemo(() => {
    const c: Record<string, number> = {};
    perfumes.forEach((p) => (c[p.marca] = (c[p.marca] ?? 0) + 1));
    return Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([m]) => m);
  }, []);

  return (
    <section className="overflow-hidden border-y border-tinta/8 bg-crema-2 py-7" aria-label="Marcas">
      <div className="flex w-max animate-marquesina hover:[animation-play-state:paused]">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center" aria-hidden={copia === 1}>
            {top.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => irAlCatalogo({ marca: m })}
                tabIndex={copia === 1 ? -1 : 0}
                className="flex items-center gap-10 pr-10 font-serif text-[1.35rem] whitespace-nowrap text-tinta/55 italic transition-colors hover:text-vino md:text-[1.6rem]"
              >
                {m}
                <span className="h-1.5 w-1.5 rotate-45 bg-oro" />
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
