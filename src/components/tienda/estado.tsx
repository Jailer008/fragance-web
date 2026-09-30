"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { perfumes, type Genero, type Perfume } from "@/lib/catalogo";

export type Orden = "destacados" | "precio-asc" | "precio-desc" | "nombre";

export interface Filtros {
  texto: string;
  genero: Genero | "";
  familia: string;
  marca: string;
  estilo: string;
  soloOfertas: boolean;
  orden: Orden;
  // Ids recomendados por el test; si existe, el catálogo muestra solo esos.
  recomendados: string[] | null;
}

export const FILTROS_INICIALES: Filtros = {
  texto: "",
  genero: "",
  familia: "",
  marca: "",
  estilo: "",
  soloOfertas: false,
  orden: "destacados",
  recomendados: null,
};

interface ItemPedido {
  id: string;
  cantidad: number;
}

interface Estado {
  pedido: { perfume: Perfume; cantidad: number }[];
  totalUnidades: number;
  agregar: (p: Perfume) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
  pedidoAbierto: boolean;
  setPedidoAbierto: (v: boolean) => void;
  perfumeAbierto: Perfume | null;
  abrirPerfume: (p: Perfume | null) => void;
  filtros: Filtros;
  setFiltros: (f: Partial<Filtros>) => void;
  irAlCatalogo: (f?: Partial<Filtros>) => void;
  quizAbierto: boolean;
  setQuizAbierto: (v: boolean) => void;
  aviso: string | null;
}

const Ctx = createContext<Estado | null>(null);
const CLAVE = "thesons-pedido";
const porId = new Map(perfumes.map((p) => [p.id, p]));

export function TiendaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [perfumeAbierto, setPerfumeAbierto] = useState<Perfume | null>(null);
  const [filtros, setFiltrosState] = useState<Filtros>(FILTROS_INICIALES);
  const [quizAbierto, setQuizAbierto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // La lista de pedido vive en el navegador: si falla el almacenamiento, simplemente no se recuerda.
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) ?? "[]") as ItemPedido[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage
      setItems(guardado.filter((i) => porId.has(i.id)));
    } catch {}
  }, []);

  const guardar = useCallback((nuevos: ItemPedido[]) => {
    setItems(nuevos);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(nuevos));
    } catch {}
  }, []);

  // Enlaces compartibles: /#perfume=<id> abre el detalle directamente.
  useEffect(() => {
    const leerHash = () => {
      const m = /perfume=([^&]+)/.exec(location.hash);
      setPerfumeAbierto(m ? (porId.get(decodeURIComponent(m[1])) ?? null) : null);
    };
    leerHash();
    window.addEventListener("hashchange", leerHash);
    return () => window.removeEventListener("hashchange", leerHash);
  }, []);

  const abrirPerfume = useCallback((p: Perfume | null) => {
    setPerfumeAbierto(p);
    const url = p ? `#perfume=${encodeURIComponent(p.id)}` : location.pathname + location.search;
    history.replaceState(null, "", url);
  }, []);

  const agregar = useCallback(
    (p: Perfume) => {
      const existe = items.find((i) => i.id === p.id);
      guardar(
        existe
          ? items.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i))
          : [...items, { id: p.id, cantidad: 1 }],
      );
      setAviso(`${p.nombre} se agregó a tu pedido`);
      setTimeout(() => setAviso(null), 2600);
    },
    [items, guardar],
  );

  const cambiarCantidad = useCallback(
    (id: string, cantidad: number) =>
      guardar(cantidad <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, cantidad } : i))),
    [items, guardar],
  );

  const setFiltros = useCallback((f: Partial<Filtros>) => setFiltrosState((prev) => ({ ...prev, ...f })), []);

  const irAlCatalogo = useCallback((f?: Partial<Filtros>) => {
    if (f) setFiltrosState({ ...FILTROS_INICIALES, ...f });
    requestAnimationFrame(() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  const valor = useMemo<Estado>(() => {
    const pedido = items.flatMap((i) => {
      const perfume = porId.get(i.id);
      return perfume ? [{ perfume, cantidad: i.cantidad }] : [];
    });
    return {
      pedido,
      totalUnidades: pedido.reduce((s, i) => s + i.cantidad, 0),
      agregar,
      cambiarCantidad,
      vaciar: () => guardar([]),
      pedidoAbierto,
      setPedidoAbierto,
      perfumeAbierto,
      abrirPerfume,
      filtros,
      setFiltros,
      irAlCatalogo,
      quizAbierto,
      setQuizAbierto,
      aviso,
    };
  }, [items, agregar, cambiarCantidad, guardar, pedidoAbierto, perfumeAbierto, abrirPerfume, filtros, setFiltros, irAlCatalogo, quizAbierto, aviso]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useTienda() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTienda debe usarse dentro de TiendaProvider");
  return v;
}

// Añade la clase `visible` a los elementos `.revelar` cuando entran en pantalla.
export function useRevelar() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observar = () => document.querySelectorAll(".revelar:not(.visible)").forEach((el) => io.observe(el));
    observar();
    // Las secciones que cambian su contenido (oferta del día, filtros) agregan nodos nuevos.
    const mo = new MutationObserver(observar);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
