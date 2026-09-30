"use client";

import { Plus } from "lucide-react";
import { colorFamilia, descuento, enlaceWhatsApp, mensajePerfume, precioCOP, type Perfume } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { useTienda } from "./estado";
import { IconoWhatsApp } from "./iconos";

export function TarjetaPerfume({ perfume: p, oscura = false }: { perfume: Perfume; oscura?: boolean }) {
  const { agregar, abrirPerfume } = useTienda();
  const pct = descuento(p);
  const agotado = p.disponible === false;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[3px] transition-shadow duration-300",
        oscura ? "bg-panel text-crema ring-1 ring-white/8 hover:ring-oro/40" : "bg-white ring-1 ring-tinta/6 hover:shadow-[0_18px_40px_-22px_rgba(20,18,16,.45)]",
      )}
    >
      <button
        type="button"
        onClick={() => abrirPerfume(p)}
        className={cn("relative block aspect-square w-full overflow-hidden", oscura ? "bg-white/95" : "bg-crema-2")}
        aria-label={`Ver detalle de ${p.marca} ${p.nombre}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imágenes del CDN del proveedor */}
        <img
          src={p.imagenes[0]}
          alt={`${p.marca} ${p.nombre}`}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-contain p-3 transition duration-700 ease-out group-hover:scale-[1.06]",
            p.imagenes[1] && "group-hover:opacity-0",
            agotado && "grayscale",
          )}
        />
        {p.imagenes[1] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imagenes[1]}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.04] object-contain p-3 opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <span className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1">
          {p.masVendido && (
            <span className="rounded-[2px] bg-noche px-2 py-1 text-[0.6rem] font-bold tracking-[0.14em] text-oro-2 uppercase">Más vendido</span>
          )}
          {pct > 0 && (
            <span className="rounded-[2px] bg-vino px-2 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-crema">−{pct}%</span>
          )}
          {agotado && (
            <span className="rounded-[2px] bg-tinta-2 px-2 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-crema uppercase">Agotado</span>
          )}
        </span>
        <span className="absolute right-2.5 bottom-2.5 flex gap-1" aria-hidden>
          {p.familias.map((f) => (
            <span key={f} className="h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: colorFamilia(f) }} />
          ))}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <p className={cn("text-[0.62rem] font-bold tracking-[0.18em] uppercase", oscura ? "text-oro" : "text-vino")}>{p.marca}</p>
        <h3 className="mt-1 font-serif text-[0.98rem] leading-snug font-semibold md:text-[1.06rem]">
          <button type="button" onClick={() => abrirPerfume(p)} className="text-left hover:underline hover:decoration-oro hover:underline-offset-4">
            {p.nombre}
          </button>
        </h3>
        <p className={cn("mt-1 text-[0.72rem]", oscura ? "text-crema/60" : "text-tinta-2")}>
          {p.tamano} · {p.concentracion}
        </p>
        {p.ocasiones.length > 0 && (
          <p className={cn("mt-0.5 text-[0.72rem] italic", oscura ? "text-crema/50" : "text-tinta-2/80")}>{p.ocasiones.join(" · ")}</p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {p.familias.slice(0, 2).map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.64rem] font-semibold"
              style={{ background: `${colorFamilia(f)}${oscura ? "33" : "1f"}`, color: oscura ? "#f6f1e7" : colorFamilia(f) }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: colorFamilia(f) }} />
              {f}
            </span>
          ))}
        </div>

        <div className={cn("mt-auto pt-3", oscura ? "border-white/10" : "border-tinta/8")}>
          <div className={cn("mb-3 h-px w-full", oscura ? "bg-white/10" : "bg-tinta/8")} />
          <div className="flex flex-wrap items-baseline gap-x-2">
            {pct > 0 && p.precioAnterior && (
              <span className={cn("text-[0.75rem] line-through", oscura ? "text-crema/40" : "text-tinta-2/70")}>{precioCOP(p.precioAnterior)}</span>
            )}
            <span className="text-[1.08rem] font-bold tracking-tight">{precioCOP(p.precio)}</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            <a
              href={enlaceWhatsApp(mensajePerfume(p))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa min-h-[42px] flex-1 px-2 text-[0.66rem] tracking-[0.08em]"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Pedir
            </a>
            <button
              type="button"
              onClick={() => agregar(p)}
              disabled={agotado}
              className={cn(
                "grid min-h-[42px] w-[42px] place-items-center rounded-[2px] border transition-colors disabled:opacity-40",
                oscura ? "border-white/20 hover:border-oro hover:text-oro" : "border-tinta/15 hover:border-vino hover:text-vino",
              )}
              aria-label={`Agregar ${p.nombre} a mi pedido`}
              title="Agregar a mi pedido"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
