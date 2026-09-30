"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { enlaceWhatsApp, perfumes, sitio, type Genero } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { useTienda, type Filtros } from "./estado";
import { IconoWhatsApp, Monograma } from "./iconos";

const NAV: { etiqueta: string; filtro: Partial<Filtros> }[] = [
  { etiqueta: "Hombre", filtro: { genero: "Hombre" as Genero } },
  { etiqueta: "Mujer", filtro: { genero: "Mujer" as Genero } },
  { etiqueta: "Unisex", filtro: { genero: "Unisex" as Genero } },
  { etiqueta: "Árabes", filtro: { estilo: "Árabe" } },
  { etiqueta: "Nicho", filtro: { estilo: "Nicho" } },
  { etiqueta: "Ofertas", filtro: { soloOfertas: true } },
];

export function Cabecera() {
  const { totalUnidades, setPedidoAbierto, irAlCatalogo } = useTienda();
  const [mensaje, setMensaje] = useState(0);
  const [menu, setMenu] = useState(false);
  const [busqueda, setBusqueda] = useState(false);
  const [texto, setTexto] = useState("");
  const [compacta, setCompacta] = useState(false);

  const marcas = useMemo(() => [...new Set(perfumes.map((p) => p.marca))].sort((a, b) => a.localeCompare(b)), []);

  useEffect(() => {
    const t = setInterval(() => setMensaje((m) => (m + 1) % sitio.barraSuperior.length), 4000);
    const alScroll = () => setCompacta(window.scrollY > 40);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", alScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const ir = (f: Partial<Filtros>) => {
    setMenu(false);
    irAlCatalogo(f);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBusqueda(false);
    irAlCatalogo({ texto });
  };

  return (
    <>
      <div className="relative z-50 bg-vino text-crema">
        <div className="contenedor flex h-9 items-center justify-center overflow-hidden text-[0.7rem] font-semibold tracking-[0.16em] uppercase">
          <p key={mensaje} className="aparecer truncate">
            {sitio.barraSuperior[mensaje]}
          </p>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-white/8 bg-noche/95 text-crema backdrop-blur-md transition-[padding] duration-300",
          compacta ? "py-2" : "py-3.5 md:py-5",
        )}
      >
        <div className="contenedor grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setMenu(true)} className="-ml-2 grid h-11 w-11 place-items-center lg:hidden" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
              {NAV.slice(0, 4).map((n) => (
                <button
                  key={n.etiqueta}
                  type="button"
                  onClick={() => ir(n.filtro)}
                  className="relative text-[0.72rem] font-semibold tracking-[0.16em] uppercase after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-oro after:transition-all hover:text-oro-2 hover:after:w-full"
                >
                  {n.etiqueta}
                </button>
              ))}
            </nav>
          </div>

          <a href="#" className="flex items-center gap-2.5" aria-label={`${sitio.marca}, inicio`}>
            <Monograma className={cn("text-oro transition-all", compacta ? "h-8 w-8" : "h-9 w-9 md:h-11 md:w-11")} />
            <span className="leading-none">
              <span className={cn("block font-serif font-semibold tracking-[0.08em] transition-all", compacta ? "text-xl" : "text-[1.4rem] md:text-[1.9rem]")}>
                {sitio.marca.toUpperCase()}
              </span>
              <span className="mt-1 hidden text-[0.52rem] tracking-[0.42em] text-oro uppercase sm:block">Parfums</span>
            </span>
          </a>

          <div className="flex items-center justify-end gap-0.5">
            <nav className="mr-4 hidden items-center gap-6 lg:flex" aria-label="Secundaria">
              {NAV.slice(4).map((n) => (
                <button
                  key={n.etiqueta}
                  type="button"
                  onClick={() => ir(n.filtro)}
                  className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase hover:text-oro-2"
                >
                  {n.etiqueta}
                </button>
              ))}
            </nav>
            <button type="button" onClick={() => setBusqueda((v) => !v)} className="grid h-11 w-11 place-items-center hover:text-oro" aria-label="Buscar">
              <Search className="h-[19px] w-[19px]" />
            </button>
            <a
              href={enlaceWhatsApp(sitio.mensajeGeneral)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 w-11 place-items-center hover:text-wa sm:grid"
              aria-label="Escríbenos por WhatsApp"
            >
              <IconoWhatsApp className="h-5 w-5" />
            </a>
            <button type="button" onClick={() => setPedidoAbierto(true)} className="relative -mr-2 grid h-11 w-11 place-items-center hover:text-oro" aria-label="Ver mi pedido">
              <ShoppingBag className="h-[19px] w-[19px]" />
              {totalUnidades > 0 && (
                <span key={totalUnidades} className="aparecer absolute top-1.5 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-oro px-1 text-[0.62rem] font-bold text-noche">
                  {totalUnidades}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className={cn("grid transition-[grid-template-rows] duration-300", busqueda ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <form onSubmit={buscar} className="contenedor flex items-center gap-3 pt-3 pb-1">
              <Search className="h-4 w-4 shrink-0 text-oro" />
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Busca por perfume, marca o nota…"
                className="h-11 flex-1 border-b border-white/20 bg-transparent text-[0.95rem] outline-none placeholder:text-crema/40 focus:border-oro"
                tabIndex={busqueda ? 0 : -1}
              />
              <button type="submit" className="btn btn-oro min-h-10 px-4 text-[0.66rem]" tabIndex={busqueda ? 0 : -1}>
                Buscar
              </button>
            </form>
          </div>
        </div>

        <div className="h-8 border-t border-white/6 text-center text-[0.72rem] leading-8 text-crema/70 max-sm:hidden">{sitio.barraEnvio}</div>
      </header>

      {/* Panel lateral del menú (móvil) */}
      <div
        className={cn("fixed inset-0 z-[60] bg-black/60 transition-opacity lg:hidden", menu ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setMenu(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-[360px] flex-col bg-panel text-crema transition-transform duration-300 lg:hidden",
          menu ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!menu}
        inert={!menu}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-serif text-lg font-semibold">Menú</span>
          <button type="button" onClick={() => setMenu(false)} className="grid h-10 w-10 place-items-center" aria-label="Cerrar menú">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {NAV.map((n) => (
            <button
              key={n.etiqueta}
              type="button"
              onClick={() => ir(n.filtro)}
              className="block w-full border-b border-white/6 py-3.5 text-left text-[0.8rem] font-semibold tracking-[0.16em] uppercase"
            >
              {n.etiqueta}
            </button>
          ))}
          <p className="antetitulo mt-7 mb-3">Marcas</p>
          <div className="grid grid-cols-2 gap-x-4">
            {marcas.map((m) => (
              <button key={m} type="button" onClick={() => ir({ marca: m })} className="truncate py-2 text-left text-[0.84rem] text-crema/75 hover:text-oro-2">
                {m}
              </button>
            ))}
          </div>
        </div>
        <a href={enlaceWhatsApp(sitio.mensajeGeneral)} target="_blank" rel="noopener noreferrer" className="btn btn-wa m-5">
          <IconoWhatsApp className="h-5 w-5" /> Escríbenos
        </a>
      </aside>
    </>
  );
}
