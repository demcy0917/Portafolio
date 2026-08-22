import { profile } from "@/content/profile";
import { grupos, type GrupoSkill, type Tech } from "@/content/skills";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { TechIcon, techColor } from "@/components/ui/TechIcon";

/**
 * Rejilla tipo bento: cada grupo del stack ocupa el ancho que le toca según
 * `span` en `src/content/skills.ts`. Agregar una tecnología es editar ese
 * archivo, no este componente.
 */

const COLSPAN: Record<number, string> = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  12: "lg:col-span-12",
};

export function Habilidades() {
  const [primero, ...resto] = grupos;

  return (
    <section id="habilidades" className="relative py-24 sm:py-32">
      <Fondo />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Encabezado, ocupa la mitad izquierda */}
          <div className="lg:col-span-6 lg:pr-8">
            <Reveal>
              <p className="eyebrow">Habilidades</p>

              <h2 className="mt-6 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.08] font-bold tracking-tight">
                {profile.habilidades.titulo.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                <span className="neon-text block">{profile.habilidades.tituloAcento}</span>
              </h2>

              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-paper/60">
                {profile.habilidades.descripcion}
              </p>
            </Reveal>
          </div>

          {/* Primer grupo (IA), al lado del título */}
          <Reveal delay={0.08} className={`${COLSPAN[primero.span]} lg:col-start-7 lg:self-end`}>
            <Tarjeta grupo={primero} />
          </Reveal>

          {/* Resto de la rejilla */}
          {resto.map((g, i) => (
            <Reveal key={g.id} delay={0.04 * (i % 3)} className={COLSPAN[g.span] ?? "lg:col-span-6"}>
              <Tarjeta grupo={g} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tarjeta({ grupo }: { grupo: GrupoSkill }) {
  // Los grupos anchos reparten sus items en fila; los angostos, en rejilla de 2
  const ancho = grupo.span >= 12;
  const conNota = grupo.items.some((i) => i.nota);

  return (
    <div className="panel panel-hover h-full p-5 sm:p-6">
      <h3 className="flex items-center gap-2.5 text-[15px] font-semibold text-neon">
        <Icon name={grupo.icono} className="h-[18px] w-[18px]" />
        {grupo.titulo}
      </h3>

      <ul
        className={`mt-5 grid gap-2.5 ${
          ancho
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            : conNota
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {grupo.items.map((t) => (
          <li key={t.nombre}>
            <Ficha tech={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ficha({ tech }: { tech: Tech }) {
  const color = techColor(tech.icono);

  return (
    <div className="group/f flex h-full flex-col items-center gap-2.5 rounded-xl border border-white/7 bg-white/[0.022] px-3 py-4 text-center transition duration-300 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.05]">
      <span className="relative grid h-11 w-11 place-items-center">
        {/* Halo del color de la marca, solo al pasar el cursor */}
        <span
          className="absolute inset-0 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover/f:opacity-45"
          style={{ background: color }}
        />
        <TechIcon name={tech.icono} className="relative h-8 w-8" />
      </span>

      <span className="text-[13.5px] leading-tight font-medium">{tech.nombre}</span>

      {tech.nota && (
        <span className="text-[12px] leading-snug text-paper/50 text-pretty">{tech.nota}</span>
      )}
    </div>
  );
}

function Fondo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-24 -right-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(47,228,228,0.06),transparent_66%)] blur-2xl" />
      {/* Guiño al letrero de neón del cuarto */}
      <div
        className="absolute top-20 right-16 hidden flex-col gap-1 text-right font-display text-4xl font-bold opacity-[0.07] xl:flex"
        style={{ color: "#2FE4E4" }}
        aria-hidden
      >
        <span>Code.</span>
        <span>Build.</span>
        <span>Repeat.</span>
      </div>
    </div>
  );
}
