import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrada suave al aparecer en pantalla.
 *
 * `whileInView` con `once` evita que el contenido baile al hacer scroll hacia
 * arriba, y `prefers-reduced-motion` lo desactiva solo: framer-motion respeta
 * la preferencia del sistema sin configuración extra.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
}) {
  const Componente = motion[as];

  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Componente>
  );
}
