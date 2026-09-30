"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  colorFamilia,
  descripcionPerfume,
  descuento,
  enlaceWhatsApp,
  mensajePedido,
  mensajePerfume,
  perfumes,
  precioCOP,
  sitio,
} from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { useTienda } from "./estado";
import { IconoWhatsApp } from "./iconos";
import { TarjetaPerfume } from "./tarjeta-perfume";

function useBloquearScroll(activo: boolean, cerrar: () => void) {
  useEffect(() => {
    if (!activo) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", tecla);
    };
  }, [activo, cerrar]);
}

export function DetallePerfume() {
  const { perfumeAbierto: p, abrirPerfume, agregar } = useTienda();
  const [foto, setFoto] = useState(0);
  const cerrar = () => abrirPerfume(null);
  useBloquearScroll(!!p, cerrar);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- vuelve a la primera foto al cambiar de perfume
  useEffect(() => setFoto(0), [p?.id]);
  if (!p) return null;

  const pct = descuento(p);
  const similares = perfumes
    .filter((o) => o.id !== p.id && o.disponible !== false && o.genero === p.genero && o.familias[0] === p.familias[0])
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal aria-label={p.nombre}>
      <div className="aparecer absolute inset-0 bg-noche/75 backdrop-blur-sm" onClick={cerrar} />
      <div className="aparecer relative max-h-[94dvh] w-full max-w-[980px] overflow-y-auto rounded-t-[14px] bg-crema-2 md:rounded-[4px]">
        <button type="button" onClick={cerrar} className="sticky top-3 right-3 z-10 float-right mr-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
        <div className="grid md:grid-cols-2">
          <div className="bg-white p-6 md:p-10">
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imagenes[foto] ?? p.imagenes[0]} alt={`${p.marca} ${p.nombre}`} className="h-full w-full object-contain" />
            </div>
            {p.imagenes.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {p.imagenes.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setFoto(i)}
                    className={cn("h-16 w-16 overflow-hidden rounded-[2px] border-2 bg-white", foto === i ? "border-vino" : "border-transparent opacity-60")}
                    aria-label={`Foto ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-10">
            <p className="antetitulo !text-vino">{p.marca}</p>
            <h2 className="mt-2 font-serif text-[1.9rem] leading-tight font-semibold md:text-[2.3rem]">{p.nombre}</h2>
            <p className="mt-2 text-[0.86rem] text-tinta-2">
              {p.tamano} · {p.concentracion} · {p.genero}
              {p.estilo ? ` · ${p.estilo}` : ""}
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3">
              <span className="text-[1.75rem] font-bold tracking-tight">{precioCOP(p.precio)}</span>
              {pct > 0 && p.precioAnterior && (
                <>
                  <span className="text-tinta-2 line-through">{precioCOP(p.precioAnterior)}</span>
                  <span className="rounded-[2px] bg-vino px-2 py-0.5 text-[0.72rem] font-bold text-crema">−{pct}%</span>
                </>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-tinta-2">{descripcionPerfume(p)}</p>

            <div className="mt-6 space-y-4 border-y border-tinta/10 py-5">
              <div>
                <p className="antetitulo !text-tinta-2">Familia olfativa</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.familias.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.78rem] font-semibold" style={{ background: `${colorFamilia(f)}1f`, color: colorFamilia(f) }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: colorFamilia(f) }} />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              {(p.ocasiones.length > 0 || (p.clima?.length ?? 0) > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {p.ocasiones.length > 0 && (
                    <div>
                      <p className="antetitulo !text-tinta-2">Ocasión</p>
                      <p className="mt-1.5 text-[0.9rem]">{p.ocasiones.join(" · ")}</p>
                    </div>
                  )}
                  {(p.clima?.length ?? 0) > 0 && (
                    <div>
                      <p className="antetitulo !text-tinta-2">Clima</p>
                      <p className="mt-1.5 text-[0.9rem]">{p.clima?.join(" · ")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <a href={enlaceWhatsApp(mensajePerfume(p))} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <IconoWhatsApp className="h-5 w-5" /> Pedir por WhatsApp
              </a>
              <button type="button" onClick={() => agregar(p)} disabled={p.disponible === false} className="btn btn-linea text-tinta hover:!bg-tinta hover:!text-crema disabled:opacity-40">
                <ShoppingBag className="h-4 w-4" /> Agregar a mi pedido
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[0.78rem] text-tinta-2">
              <Check className="h-4 w-4 text-vino" /> Original · Te confirmamos disponibilidad por WhatsApp
            </p>
          </div>
        </div>

        {similares.length > 0 && (
          <div className="border-t border-tinta/10 p-6 md:p-10">
            <p className="font-serif text-xl font-semibold">También te pueden gustar</p>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {similares.map((s) => (
                <TarjetaPerfume key={s.id} perfume={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Pedido() {
  const { pedido, pedidoAbierto, setPedidoAbierto, cambiarCantidad, vaciar, abrirPerfume } = useTienda();
  useBloquearScroll(pedidoAbierto, () => setPedidoAbierto(false));
  const total = pedido.reduce((s, i) => s + i.perfume.precio * i.cantidad, 0);

  return (
    <>
      <div
        className={cn("fixed inset-0 z-[65] bg-noche/60 transition-opacity", pedidoAbierto ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setPedidoAbierto(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[66] flex w-full max-w-[420px] flex-col bg-crema-2 shadow-2xl transition-transform duration-300",
          pedidoAbierto ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mi pedido"
        aria-hidden={!pedidoAbierto}
        inert={!pedidoAbierto}
      >
        <div className="flex items-center justify-between bg-noche px-5 py-4 text-crema">
          <p className="font-serif text-xl font-semibold">Mi pedido</p>
          <button type="button" onClick={() => setPedidoAbierto(false)} className="grid h-10 w-10 place-items-center" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {pedido.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="h-10 w-10 text-tinta/25" strokeWidth={1.2} />
            <p className="mt-4 font-serif text-xl">Tu lista está vacía</p>
            <p className="mt-2 text-[0.88rem] text-tinta-2">Agrega perfumes con el botón + y envíanos tu pedido completo por WhatsApp.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-tinta/8 overflow-y-auto px-5">
              {pedido.map(({ perfume: p, cantidad }) => (
                <li key={p.id} className="flex gap-3 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPedidoAbierto(false);
                      abrirPerfume(p);
                    }}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-[2px] bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagenes[0]} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.62rem] font-bold tracking-[0.16em] text-vino uppercase">{p.marca}</p>
                    <p className="truncate font-serif font-semibold">{p.nombre}</p>
                    <p className="text-[0.74rem] text-tinta-2">{p.tamano}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-[2px] border border-tinta/15">
                        <button type="button" onClick={() => cambiarCantidad(p.id, cantidad - 1)} className="grid h-8 w-8 place-items-center" aria-label="Quitar uno">
                          {cantidad === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                        </button>
                        <span className="w-6 text-center text-[0.85rem] font-semibold tabular-nums">{cantidad}</span>
                        <button type="button" onClick={() => cambiarCantidad(p.id, cantidad + 1)} className="grid h-8 w-8 place-items-center" aria-label="Agregar uno">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-bold">{precioCOP(p.precio * cantidad)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-tinta/10 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.8rem] tracking-[0.14em] uppercase">Total estimado</span>
                <span className="text-2xl font-bold">{precioCOP(total)}</span>
              </div>
              <p className="mt-1 text-[0.74rem] text-tinta-2">El envío y la forma de pago se confirman por WhatsApp.</p>
              <a href={enlaceWhatsApp(mensajePedido(pedido))} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-4 w-full">
                <IconoWhatsApp className="h-5 w-5" /> Enviar pedido por WhatsApp
              </a>
              <button type="button" onClick={vaciar} className="mt-3 w-full text-[0.76rem] text-tinta-2 underline underline-offset-4">
                Vaciar lista
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function WhatsAppFlotante() {
  const { aviso, setPedidoAbierto } = useTienda();
  return (
    <>
      <a
        href={enlaceWhatsApp(sitio.mensajeGeneral)}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed right-4 bottom-4 z-50 flex h-14 items-center gap-2 rounded-full bg-wa pr-4 pl-3.5 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.7)] transition-transform hover:-translate-y-0.5 md:right-6 md:bottom-6"
        aria-label="Escríbenos por WhatsApp"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-wa/40 [animation-duration:2.6s]" />
        <IconoWhatsApp className="h-7 w-7" />
        <span className="text-[0.8rem] font-bold max-sm:hidden">¿Te asesoramos?</span>
      </a>
      {aviso && (
        <button
          type="button"
          onClick={() => setPedidoAbierto(true)}
          className="aparecer fixed bottom-22 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-noche px-5 py-3 text-[0.82rem] text-crema shadow-2xl md:bottom-8"
        >
          <Check className="h-4 w-4 text-oro" />
          <span className="max-w-[60vw] truncate">{aviso}</span>
          <span className="font-bold text-oro underline underline-offset-2">Ver</span>
        </button>
      )}
    </>
  );
}
