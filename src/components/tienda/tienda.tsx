"use client";

import { Cabecera } from "./cabecera";
import { DetallePerfume, Pedido, WhatsAppFlotante } from "./capas";
import { Catalogo } from "./catalogo";
import { TiendaProvider, useRevelar } from "./estado";
import { Quiz } from "./quiz";
import { Garantias, Hero, Marcas, MasVendidos, OfertaDelDia, PorFamilia } from "./secciones-inicio";
import { Pie, PreguntasFrecuentes, Pasos, Resenas, Valor } from "./secciones-final";

function Contenido() {
  useRevelar();
  return (
    <>
      <Cabecera />
      <main>
        <Hero />
        <Garantias />
        <OfertaDelDia />
        <PorFamilia />
        <MasVendidos />
        <Marcas />
        <Catalogo />
        <Resenas />
        <Pasos />
        <Valor />
        <PreguntasFrecuentes />
      </main>
      <Pie />
      <DetallePerfume />
      <Pedido />
      <Quiz />
      <WhatsAppFlotante />
    </>
  );
}

export function Tienda() {
  return (
    <TiendaProvider>
      <Contenido />
    </TiendaProvider>
  );
}
