import { Gift, MessageCircleHeart, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

// Burbuja de chat con auricular: icono propio para los enlaces de WhatsApp.
export function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.2a9.8 9.8 0 0 0-8.5 14.7L2.3 21.7l4.9-1.2A9.8 9.8 0 1 0 12 2.2Zm0 1.8a8 8 0 1 1-4.2 14.8l-.3-.2-2.8.7.7-2.7-.2-.3A8 8 0 0 1 12 4Z" />
      <path d="M9.1 7.3c.2 0 .4 0 .6.4l.8 1.9c.1.2 0 .5-.1.7l-.6.7c-.1.2-.1.4 0 .6.5.9 1.3 1.8 2.3 2.4.3.2.5.3.7.1l.7-.8c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .6-.3 1.4-1 1.8-.8.5-1.9.5-3.6-.3a10 10 0 0 1-4.4-4.3c-.7-1.5-.5-2.7.3-3.6.3-.4.6-.5.8-.5h.6Z" />
    </svg>
  );
}

export const ICONOS_GARANTIA: Record<string, LucideIcon> = {
  sello: ShieldCheck,
  chat: MessageCircleHeart,
  envio: Truck,
  regalo: Gift,
};

// Monograma de The Sons: dos letras S entrelazadas dentro de un marco de frasco.
export function Monograma({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <rect x="9" y="8" width="22" height="28" rx="4" />
      <path d="M16 4h8v4h-8z" />
      <text x="20" y="27.5" textAnchor="middle" fontFamily="var(--font-playfair)" fontSize="13" fontStyle="italic" fill="currentColor" stroke="none">
        TS
      </text>
    </svg>
  );
}
