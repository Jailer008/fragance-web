"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { FAMILIAS, normalizar, perfumes, type Genero } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { FILTROS_INICIALES, useTienda, type Orden } from "./estado";
import { TarjetaPerfume } from "./tarjeta-perfume";

const POR_PAGINA = 24;
const GENEROS: Genero[] = ["Hombre", "Mujer", "Unisex"];
const ESTILOS = ["Diseñador", "Nicho", "Árabe"];
const MARCAS = [...new Set(perfumes.map((p) => p.marca))].sort((a, b) => a.localeCompare(b));
const INDICE = perfumes.map((p) => normalizar(`${p.marca} ${p.nombre} ${p.familias.join(" ")} ${p.concentracion} ${p.genero}`));

export function Catalogo() {
  const { filtros, setFiltros } = useTienda();
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [panel, setPanel] = useState(false);

  const resultado = useMemo(() => {
    const terminos = normalizar(filtros.texto).split(/\s+/).filter(Boolean);
    const lista = perfumes.filter(
      (p, i) =>
        (!filtros.recomendados || filtros.recomendados.includes(p.id)) &&
        (!filtros.genero || p.genero === filtros.genero) &&
        (!filtros.familia || p.familias.includes(filtros.familia)) &&
        (!filtros.marca || p.marca === filtros.marca) &&
        (!filtros.estilo || p.estilo === filtros.estilo) &&
        (!filtros.soloOfertas || p.oferta || (p.precioAnterior ?? 0) > p.precio) &&
        terminos.every((t) => INDICE[i].includes(t)),
    );
    const orden: Record<Orden, (a: (typeof lista)[0], b: (typeof lista)[0]) => number> = {
      destacados: (a, b) =>
        (filtros.recomendados ? filtros.recomendados.indexOf(a.id) - filtros.recomendados.indexOf(b.id) : 0) ||
        Number(b.disponible !== false) - Number(a.disponible !== false) ||
        Number(!!b.masVendido) - Number(!!a.masVendido),
      "precio-asc": (a, b) => a.precio - b.precio,
      "precio-desc": (a, b) => b.precio - a.precio,
      nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    };
    return [...lista].sort(orden[filtros.orden]);
  }, [filtros]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia la paginación al cambiar filtros
  useEffect(() => setVisibles(POR_PAGINA), [filtros]);

  const activos = [
    filtros.recomendados && { k: "recomendados", t: "Tu recomendación" },
    filtros.genero && { k: "genero", t: filtros.genero },
    filtros.familia && { k: "familia", t: filtros.familia },
    filtros.marca && { k: "marca", t: filtros.marca },
    filtros.estilo && { k: "estilo", t: filtros.estilo },
    filtros.soloOfertas && { k: "soloOfertas", t: "Ofertas" },
    filtros.texto && { k: "texto", t: `“${filtros.texto}”` },
  ].filter(Boolean) as { k: keyof typeof FILTROS_INICIALES; t: string }[];

  const chip = (activo: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[0.76rem] font-semibold transition-colors",
      activo ? "border-tinta bg-tinta text-crema" : "border-tinta/15 bg-white hover:border-tinta/40",
    );

  const filtrosExtra = (
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="block">
        <span className="antetitulo !text-tinta-2">Marca</span>
        <select
          value={filtros.marca}
          onChange={(e) => setFiltros({ marca: e.target.value })}
          className="mt-2 h-11 w-full rounded-[2px] border border-tinta/15 bg-white px-3 text-[0.88rem]"
        >
          <option value="">Todas las marcas</option>
          {MARCAS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <div>
        <span className="antetitulo !text-tinta-2">Estilo</span>
        <div className="mt-2 flex gap-1.5">
          {ESTILOS.map((e) => (
            <button key={e} type="button" onClick={() => setFiltros({ estilo: filtros.estilo === e ? "" : e })} className={chip(filtros.estilo === e)}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="antetitulo !text-tinta-2">Ordenar</span>
        <select
          value={filtros.orden}
          onChange={(e) => setFiltros({ orden: e.target.value as Orden })}
          className="mt-2 h-11 w-full rounded-[2px] border border-tinta/15 bg-white px-3 text-[0.88rem]"
        >
          <option value="destacados">Destacados</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A–Z)</option>
        </select>
      </label>
    </div>
  );

  return (
    <section id="catalogo" className="bg-crema-2 py-16 md:py-24">
      <div className="contenedor">
        <div className="revelar flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="antetitulo !text-vino">Catálogo completo</p>
            <h2 className="titulo-seccion mt-2">Todas nuestras fragancias</h2>
          </div>
          <label className="relative w-full md:w-[340px]">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-tinta-2" />
            <input
              value={filtros.texto}
              onChange={(e) => setFiltros({ texto: e.target.value })}
              placeholder="Buscar perfume o marca"
              className="h-12 w-full rounded-[2px] border border-tinta/15 bg-white pr-3 pl-10 text-[0.92rem] outline-none focus:border-vino"
            />
          </label>
        </div>

        {/* Género + familias por color */}
        <div className="sticky top-[60px] z-20 -mx-4 mt-8 border-y border-tinta/8 bg-crema-2/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
          <div className="sin-scrollbar flex gap-2 overflow-x-auto">
            <button type="button" onClick={() => setFiltros({ genero: "" })} className={chip(!filtros.genero)}>
              Todos
            </button>
            {GENEROS.map((g) => (
              <button key={g} type="button" onClick={() => setFiltros({ genero: filtros.genero === g ? "" : g })} className={chip(filtros.genero === g)}>
                {g}
              </button>
            ))}
            <span className="mx-1 w-px shrink-0 bg-tinta/12" />
            {Object.entries(FAMILIAS).map(([f, { color }]) => {
              const activo = filtros.familia === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFiltros({ familia: activo ? "" : f })}
                  className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[0.76rem] font-semibold transition-colors"
                  style={activo ? { background: color, borderColor: color, color: "#fff" } : { borderColor: `${color}66`, background: `${color}14`, color: "#141210" }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: activo ? "#fff" : color }} />
                  {f}
                </button>
              );
            })}
            <button type="button" onClick={() => setPanel((v) => !v)} className={cn(chip(panel), "md:hidden")}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Más
            </button>
          </div>
        </div>

        <div className={cn("mt-5", panel ? "block" : "hidden md:block")}>{filtrosExtra}</div>

        <div className="mt-6 flex min-h-9 flex-wrap items-center gap-2">
          <p className="mr-2 text-[0.82rem] text-tinta-2">
            <strong className="text-tinta">{resultado.length}</strong> {resultado.length === 1 ? "perfume" : "perfumes"}
          </p>
          {activos.map((a) => (
            <button
              key={a.k}
              type="button"
              onClick={() => setFiltros({ [a.k]: FILTROS_INICIALES[a.k] })}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-arena px-3 text-[0.74rem] font-semibold hover:bg-tinta hover:text-crema"
            >
              {a.k === "recomendados" && <Sparkles className="h-3 w-3" />}
              {a.t} <X className="h-3 w-3" />
            </button>
          ))}
          {activos.length > 1 && (
            <button type="button" onClick={() => setFiltros(FILTROS_INICIALES)} className="text-[0.74rem] font-semibold text-vino underline underline-offset-4">
              Limpiar todo
            </button>
          )}
        </div>

        {resultado.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {resultado.slice(0, visibles).map((p) => (
              <div key={p.id} className="aparecer">
                <TarjetaPerfume perfume={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[3px] border border-dashed border-tinta/20 px-6 py-16 text-center">
            <p className="font-serif text-xl">No encontramos perfumes con esos filtros</p>
            <button type="button" onClick={() => setFiltros(FILTROS_INICIALES)} className="btn btn-vino mt-6">
              Ver todo el catálogo
            </button>
          </div>
        )}

        {visibles < resultado.length && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-[0.78rem] text-tinta-2">
              Mostrando {visibles} de {resultado.length}
            </p>
            <div className="h-[3px] w-48 overflow-hidden rounded-full bg-arena">
              <div className="h-full bg-vino transition-[width]" style={{ width: `${(visibles / resultado.length) * 100}%` }} />
            </div>
            <button type="button" onClick={() => setVisibles((v) => v + POR_PAGINA)} className="btn btn-linea mt-2 text-tinta hover:!bg-tinta hover:!text-crema">
              Ver más perfumes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
