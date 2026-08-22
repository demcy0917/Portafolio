import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CircleCheckBig, Download, Lightbulb, X } from "lucide-react";
import type { Proyecto } from "@/content/projects";
import { RichText } from "@/components/ui/RichText";
import { TechIcon } from "@/components/ui/TechIcon";
import { ProjectPreview } from "./ProjectPreview";

/**
 * Ficha completa del proyecto.
 *
 * Es lo que en el portafolio era una página `/proyectos/[slug]`. Acá el sitio
 * es de una sola página, así que el mismo contenido se abre en una capa: se
 * mantiene el contexto del scroll y no hay navegación que perder.
 */
export function ProjectModal({
  proyecto,
  onCerrar,
}: {
  proyecto: Proyecto | null;
  onCerrar: () => void;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!proyecto) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Enfocar el botón de cerrar: el teclado entra directo a la capa
    const t = window.setTimeout(() => cerrarRef.current?.focus(), 60);

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !contenedor.current) return;

      // Trampa de foco: la capa no deja escapar el tabulador al fondo
      const focoables = contenedor.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focoables.length) return;
      const primero = focoables[0];
      const ultimo = focoables[focoables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", alPresionar);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = previo;
    };
  }, [proyecto, onCerrar]);

  return (
    <AnimatePresence>
      {proyecto && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain p-0 sm:p-6 lg:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Proyecto ${proyecto.nombre}`}
        >
          <div
            className="fixed inset-0 bg-ink-950/88 backdrop-blur-md"
            onClick={onCerrar}
            aria-hidden
          />

          <motion.div
            ref={contenedor}
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="panel relative my-0 w-full max-w-4xl overflow-hidden rounded-none sm:my-auto sm:rounded-2xl"
          >
            {/* ── Cabecera ─────────────────────────────────────────────── */}
            <div className="relative">
              <div
                className={`relative overflow-hidden ${
                  proyecto.video ? "aspect-[4/5] sm:aspect-[16/10]" : "aspect-[16/7] sm:aspect-[16/6]"
                }`}
              >
                <ProjectPreview proyecto={proyecto} variante="ficha" />
                {/* Sobre un video no se pone velo: taparía los controles */}
                {!proyecto.video && (
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,17,22,1)_0%,rgba(8,17,22,0.99)_26%,rgba(8,17,22,0.5)_54%,transparent_88%)]" />
                )}
              </div>

              <button
                ref={cerrarRef}
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar ficha del proyecto"
                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-ink-950/70 text-paper/80 backdrop-blur transition hover:border-neon/50 hover:text-neon"
              >
                <X className="h-5 w-5" />
              </button>

              <div
                className={
                  proyecto.video
                    ? "px-6 pt-5 sm:px-9"
                    : "absolute inset-x-0 bottom-0 px-6 pb-5 sm:px-9"
                }
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {proyecto.etiqueta && (
                    <span className="rounded-full border border-neon/35 bg-neon/10 px-2.5 py-1 font-medium text-neon">
                      {proyecto.etiqueta}
                    </span>
                  )}
                  <span className="text-paper/50">{proyecto.año}</span>
                  <span className="text-paper/25">·</span>
                  <span className="text-paper/50">{proyecto.categorias.join(" · ")}</span>
                </div>
                <h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {proyecto.nombre}
                </h3>
              </div>
            </div>

            {/* ── Cuerpo ───────────────────────────────────────────────── */}
            <div className="max-h-none space-y-10 px-6 py-8 sm:px-9 sm:py-10">
              <Bloque titulo="El problema">
                <p className="text-[16.5px] leading-[1.78] text-paper/70">{proyecto.problema}</p>
              </Bloque>

              <Bloque titulo="La solución">
                <div className="space-y-4">
                  {proyecto.solucion.map((p, i) => (
                    <RichText key={i} className="text-[16.5px] leading-[1.78] text-paper/70">
                      {p}
                    </RichText>
                  ))}
                </div>
              </Bloque>

              <Bloque titulo="Decisiones técnicas">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {proyecto.decisiones.map((d) => (
                    <li
                      key={d.titulo}
                      className="rounded-xl border border-white/7 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-neon" strokeWidth={2} />
                        <div>
                          <h5 className="text-[15px] leading-snug font-semibold">{d.titulo}</h5>
                          <p className="mt-2 text-sm leading-relaxed text-paper/60">{d.texto}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Bloque>

              <Bloque titulo="Stack completo">
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {proyecto.stack.map((g) => (
                    <div key={g.grupo}>
                      <h5 className="text-xs font-semibold tracking-[0.18em] text-paper/40 uppercase">
                        {g.grupo}
                      </h5>
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {g.items.map((it) => (
                          <li key={it} className="chip">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Bloque>

              <div className="flex items-start gap-3 rounded-xl border border-neon/22 bg-neon/[0.07] p-5">
                <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-neon" strokeWidth={2} />
                <div>
                  <h5 className="text-xs font-semibold tracking-[0.18em] text-neon uppercase">
                    Resultado
                  </h5>
                  <p className="mt-1.5 text-[15.5px] leading-relaxed text-paper/80">
                    {proyecto.resultado}
                  </p>
                </div>
              </div>

              {(proyecto.demo || proyecto.repo || proyecto.descarga) && (
                <div className="flex flex-wrap items-center gap-3 border-t border-white/7 pt-2">
                  {proyecto.descarga &&
                    (proyecto.descarga.href ? (
                      <a href={proyecto.descarga.href} download className="btn-solid text-sm">
                        <Download className="h-4 w-4" />
                        {proyecto.descarga.etiqueta}
                        {proyecto.descarga.peso && (
                          <span className="opacity-70">· {proyecto.descarga.peso}</span>
                        )}
                      </a>
                    ) : (
                      // Sin archivo todavía: se reserva el lugar en vez de
                      // esconder la acción, para que se vea que existe.
                      <span
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-white/15 px-5 py-2.5 text-sm text-paper/40"
                        title="El instalador todavía no está publicado"
                      >
                        <Download className="h-4 w-4" />
                        {proyecto.descarga.etiqueta} · próximamente
                      </span>
                    ))}

                  {proyecto.demo && (
                    <a
                      href={proyecto.demo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-solid text-sm"
                    >
                      Ver en vivo
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {proyecto.repo && (
                    <a
                      href={proyecto.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-ghost text-sm"
                    >
                      <TechIcon name="github" className="h-4 w-4" color={false} />
                      Código
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-neon uppercase">
        {titulo}
        <span className="h-px flex-1 bg-[linear-gradient(to_right,rgba(47,228,228,0.32),transparent)]" />
      </h4>
      <div className="mt-4">{children}</div>
    </section>
  );
}
