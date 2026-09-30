"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus, Star } from "lucide-react";
import { enlaceWhatsApp, FAMILIAS, sitio } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { useTienda } from "./estado";
import { IconoWhatsApp, Monograma } from "./iconos";

// Solo aparece si hay reseñas reales cargadas en data/sitio.json.
export function Resenas() {
  const [i, setI] = useState(0);
  const total = sitio.resenas.length;
  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);
  if (!total) return null;
  const r = sitio.resenas[i];

  return (
    <section className="bg-crema py-16 md:py-24">
      <div className="contenedor revelar max-w-[760px] text-center">
        <h2 className="titulo-seccion">Lo que dicen nuestros clientes</h2>
        <div key={i} className="aparecer mt-9">
          <div className="flex justify-center gap-1 text-oro">
            {Array.from({ length: r.estrellas ?? 5 }).map((_, k) => (
              <Star key={k} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="mt-5 font-serif text-[1.35rem] leading-relaxed italic md:text-[1.6rem]">“{r.texto}”</blockquote>
          <p className="mt-5 text-[0.78rem] font-semibold tracking-[0.16em] text-tinta-2 uppercase">
            {r.nombre}
            {r.ciudad ? `, ${r.ciudad}` : ""}
          </p>
        </div>
        {total > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {sitio.resenas.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)} className={cn("h-2 rounded-full transition-all", k === i ? "w-7 bg-vino" : "w-2 bg-tinta/20")} aria-label={`Reseña ${k + 1}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Pasos() {
  return (
    <section className="bg-crema py-16 md:py-24">
      <div className="contenedor">
        <div className="revelar text-center">
          <p className="antetitulo !text-vino">Así de fácil</p>
          <h2 className="titulo-seccion mt-2">Tu pedido, paso a paso</h2>
        </div>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-5">
          <span className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-oro),transparent)] md:block" />
          {sitio.pasos.map((p, i) => (
            <li key={p.titulo} className="revelar relative flex items-start gap-4 md:flex-col md:items-center md:text-center" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-oro bg-crema font-serif text-lg text-vino">{i + 1}</span>
              <span>
                <span className="block font-serif text-[1.12rem] font-semibold md:mt-2">{p.titulo}</span>
                <span className="mt-1 block text-[0.84rem] text-tinta-2">{p.texto}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Valor() {
  const { irAlCatalogo } = useTienda();
  return (
    <section className="relative overflow-hidden bg-vino text-crema">
      <div className="grano pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-20 -bottom-24 h-80 w-80 rounded-full border border-oro/25" />
      <div className="pointer-events-none absolute -right-8 -bottom-12 h-56 w-56 rounded-full border border-oro/20" />
      <div className="contenedor revelar relative grid gap-8 py-16 md:grid-cols-[auto_1fr] md:items-center md:gap-14 md:py-24">
        <Monograma className="h-20 w-20 text-oro-2 md:h-28 md:w-28" />
        <div className="max-w-[680px]">
          <h2 className="titulo-seccion">{sitio.valor.titulo}</h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-crema/80">{sitio.valor.texto}</p>
          <button type="button" onClick={() => irAlCatalogo()} className="btn btn-oro mt-8">
            Ver catálogo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <section className="bg-noche py-16 text-crema md:py-24">
      <div className="contenedor grid gap-10 md:grid-cols-[.8fr_1.2fr]">
        <div className="revelar">
          <p className="antetitulo">¿Dudas?</p>
          <h2 className="titulo-seccion mt-2">Preguntas frecuentes</h2>
          <p className="mt-4 max-w-[340px] text-[0.92rem] text-crema/60">Si no encuentras tu respuesta, escríbenos y te respondemos personalmente.</p>
          <a href={enlaceWhatsApp(sitio.mensajeGeneral)} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-7">
            <IconoWhatsApp className="h-5 w-5" /> Escríbenos
          </a>
        </div>
        <div className="revelar divide-y divide-white/10 border-y border-white/10">
          {sitio.faq.map((f, i) => {
            const abierto = abierta === i;
            return (
              <div key={f.pregunta}>
                <button
                  type="button"
                  onClick={() => setAbierta(abierto ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.1rem] md:text-[1.2rem]"
                  aria-expanded={abierto}
                >
                  {f.pregunta}
                  <Plus className={cn("h-5 w-5 shrink-0 text-oro transition-transform duration-300", abierto && "rotate-45")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300", abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <p className="overflow-hidden pr-10 text-[0.92rem] leading-relaxed text-crema/65">
                    <span className="block pb-5">{f.respuesta}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Pie() {
  const { irAlCatalogo } = useTienda();
  return (
    <footer className="border-t border-white/8 bg-noche pt-14 pb-24 text-crema md:pb-10">
      <div className="contenedor grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Monograma className="h-10 w-10 text-oro" />
            <span className="font-serif text-2xl font-semibold tracking-[0.08em]">{sitio.marca.toUpperCase()}</span>
          </div>
          <p className="mt-4 max-w-[300px] text-[0.88rem] text-crema/55">{sitio.lema}.</p>
        </div>
        <div>
          <p className="antetitulo">Comprar</p>
          <ul className="mt-4 space-y-2.5 text-[0.88rem] text-crema/70">
            {(["Hombre", "Mujer", "Unisex"] as const).map((g) => (
              <li key={g}>
                <button type="button" onClick={() => irAlCatalogo({ genero: g })} className="hover:text-oro-2">
                  Perfumes {g}
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => irAlCatalogo({ soloOfertas: true })} className="hover:text-oro-2">
                Ofertas
              </button>
            </li>
          </ul>
        </div>
        <div>
          <p className="antetitulo">Familias</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[0.88rem] text-crema/70 md:grid-cols-1">
            {Object.entries(FAMILIAS)
              .slice(0, 6)
              .map(([f, { color }]) => (
                <li key={f}>
                  <button type="button" onClick={() => irAlCatalogo({ familia: f })} className="flex items-center gap-2 hover:text-oro-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {f}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <p className="antetitulo">Contacto</p>
          <a href={enlaceWhatsApp(sitio.mensajeGeneral)} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-[0.92rem] hover:text-wa">
            <IconoWhatsApp className="h-5 w-5" /> {sitio.whatsappVisible}
          </a>
          <div className="mt-4 flex gap-4 text-[0.82rem] text-crema/60">
            {sitio.instagram && (
              <a href={sitio.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-oro-2">
                Instagram
              </a>
            )}
            {sitio.tiktok && (
              <a href={sitio.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-oro-2">
                TikTok
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="contenedor mt-12 border-t border-white/8 pt-6 text-[0.74rem] text-crema/40">
        © {new Date().getFullYear()} {sitio.marca}. Todos los derechos reservados. Las marcas mencionadas pertenecen a sus respectivos dueños.
      </div>
    </footer>
  );
}
