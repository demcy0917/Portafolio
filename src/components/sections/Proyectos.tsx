import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronDown,
  LayoutGrid,
  Rocket,
  Search,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { categorias, proyectos, type Categoria, type Proyecto } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import { ProjectModal } from "./ProjectModal";
import { ProjectPreview } from "./ProjectPreview";

const ICONO_CATEGORIA: Record<Categoria, LucideIcon> = {
  "Aplicaciones Web": LayoutGrid,
  "APIs & Backend": Server,
  "Automatización & IA": Bot,
  Herramientas: Wrench,
};

const ORDENES = [
  { id: "recientes", label: "Más recientes" },
  { id: "antiguos", label: "Más antiguos" },
  { id: "alfabetico", label: "A · Z" },
] as const;

type Orden = (typeof ORDENES)[number]["id"];

export function Proyectos() {
  const [filtro, setFiltro] = useState<Categoria | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("recientes");
  const [abierto, setAbierto] = useState<Proyecto | null>(null);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    const filtrados = proyectos.filter((p) => {
      const porCategoria = !filtro || p.categorias.includes(filtro);
      const porTexto =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.resumen.toLowerCase().includes(q) ||
        p.chips.some((c) => c.toLowerCase().includes(q)) ||
        p.categorias.some((c) => c.toLowerCase().includes(q));
      return porCategoria && porTexto;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "alfabetico") return a.nombre.localeCompare(b.nombre, "es");
      const diff = Number(b.año) - Number(a.año);
      return orden === "recientes" ? diff : -diff;
    });
  }, [filtro, busqueda, orden]);

  return (
    <section id="proyectos" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(47,228,228,0.28),transparent)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-12 xl:grid-cols-[21rem_1fr]">
          {/* ── Panel lateral ───────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <p className="eyebrow">Proyectos</p>

              <h2 className="mt-6 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.15] font-bold tracking-tight text-balance">
                Aquí hay algunos de los <span className="neon-text">proyectos</span> en los que he
                trabajado
              </h2>

              <p className="mt-5 text-[16px] leading-relaxed text-paper/60">
                Cada proyecto representa un desafío único y una oportunidad para crear soluciones que
                marcan la diferencia.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="panel mt-8 flex flex-col gap-0.5 p-2">
                <li>
                  <BotonFiltro
                    icono={LayoutGrid}
                    label="Todos los proyectos"
                    total={proyectos.length}
                    activo={filtro === null}
                    onClick={() => setFiltro(null)}
                  />
                </li>
                {categorias.map((c) => (
                  <li key={c.nombre}>
                    <BotonFiltro
                      icono={ICONO_CATEGORIA[c.nombre]}
                      label={c.nombre}
                      total={c.total}
                      activo={filtro === c.nombre}
                      onClick={() => setFiltro(filtro === c.nombre ? null : c.nombre)}
                    />
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="panel mt-5 p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon/20 bg-neon/8 text-neon">
                    <Rocket className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="leading-snug font-semibold">¿Tienes un proyecto en mente?</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/60">
                      Me encantaría ayudarte a hacerlo realidad.
                    </p>
                    <a
                      href="#contacto"
                      className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neon"
                    >
                      Contáctame
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Buscador y rejilla ──────────────────────────────────────── */}
          <div>
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-paper/35" />
                  <input
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar proyecto…"
                    aria-label="Buscar proyecto"
                    className="field"
                  />
                </div>

                <div className="relative shrink-0">
                  <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as Orden)}
                    aria-label="Ordenar proyectos"
                    className="field cursor-pointer appearance-none py-[0.9rem] pr-10 pl-4 sm:w-52"
                  >
                    {ORDENES.map((o) => (
                      <option key={o.id} value={o.id} className="bg-ink-850">
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-paper/45" />
                </div>
              </div>
            </Reveal>

            <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visibles.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.42, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Card proyecto={p} onAbrir={() => setAbierto(p)} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            {visibles.length === 0 && (
              <div className="panel mt-6 px-6 py-14 text-center">
                <p className="text-paper/65">
                  No hay proyectos que coincidan con{" "}
                  <span className="font-semibold text-paper">
                    {busqueda ? `“${busqueda}”` : filtro}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setFiltro(null);
                  }}
                  className="btn-ghost mt-5 text-sm"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProjectModal proyecto={abierto} onCerrar={() => setAbierto(null)} />
    </section>
  );
}

function BotonFiltro({
  icono: Ico,
  label,
  total,
  activo,
  onClick,
}: {
  icono: LucideIcon;
  label: string;
  total: number;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] transition ${
        activo
          ? "bg-neon/10 font-medium text-neon"
          : "text-paper/70 hover:bg-white/4 hover:text-paper"
      }`}
    >
      <Ico className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
      <span className="flex-1 truncate">{label}</span>
      <span className={`text-sm tabular-nums ${activo ? "text-neon/80" : "text-paper/35"}`}>
        {total}
      </span>
    </button>
  );
}

function Card({ proyecto, onAbrir }: { proyecto: Proyecto; onAbrir: () => void }) {
  const Ico = ICONO_CATEGORIA[proyecto.categorias[0]];

  return (
    <article className="panel panel-hover group flex h-full flex-col overflow-hidden">
      {/* Portada */}
      <button
        type="button"
        onClick={onAbrir}
        aria-label={`Ver ficha de ${proyecto.nombre}`}
        className="relative block aspect-[16/10] w-full overflow-hidden"
      >
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]">
          <ProjectPreview proyecto={proyecto} variante="card" />
        </div>

        {/* Un degradado bajo el borde inferior: las capturas reales son
            claras y sin esto la card se parte en dos. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(11,22,28,0.95),transparent)]" />

        <span className="absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-lg border border-neon/25 bg-ink-950/75 text-neon backdrop-blur">
          <Ico className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>

        {proyecto.etiqueta && (
          <span className="absolute top-3 right-3 rounded-full border border-white/12 bg-ink-950/75 px-2.5 py-1 text-[11px] font-medium text-paper/70 backdrop-blur">
            {proyecto.etiqueta}
          </span>
        )}
      </button>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold tracking-tight">{proyecto.nombre}</h3>
        <p className="mt-1 text-sm font-medium text-neon/85">{proyecto.categorias[0]}</p>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-paper/60">{proyecto.resumen}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {proyecto.chips.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-white/7 pt-4">
          <button
            type="button"
            onClick={onAbrir}
            className="group/v inline-flex items-center gap-2 text-sm font-semibold text-neon"
          >
            Ver proyecto
            <ArrowRight className="h-4 w-4 transition-transform group-hover/v:translate-x-1" />
          </button>

          <div className="flex items-center gap-1">
            {proyecto.repo && (
              <a
                href={proyecto.repo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Código de ${proyecto.nombre}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-paper/45 transition hover:bg-white/6 hover:text-neon"
              >
                <TechIcon name="github" className="h-[17px] w-[17px]" color={false} />
              </a>
            )}
            {proyecto.demo && (
              <a
                href={proyecto.demo}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Abrir ${proyecto.nombre}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-paper/45 transition hover:bg-white/6 hover:text-neon"
              >
                <ArrowUpRight className="h-[17px] w-[17px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
