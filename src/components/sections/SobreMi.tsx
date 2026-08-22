import { ArrowRight, Briefcase, Calendar, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const DATOS = [
  { icono: MapPin, label: "Ubicación", valor: profile.ubicacion },
  { icono: Calendar, label: "Experiencia", valor: profile.experiencia },
  { icono: Briefcase, label: "Disponibilidad", valor: profile.disponibilidad },
  { icono: Mail, label: "Email", valor: profile.email, href: `mailto:${profile.email}` },
];

export function SobreMi() {
  return (
    <section id="sobre-mi" className="relative py-24 sm:py-32">
      <Fondo />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <Reveal>
          <p className="eyebrow">Sobre mí</p>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* ── Columna de texto ─────────────────────────────────────────── */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] font-bold tracking-tight">
                <span className="block text-paper/92">{profile.about.saludo}</span>
                <span className="neon-text block">{profile.nombre.split(" ")[0]}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-4 flex items-center gap-3 text-xl font-medium text-neon/90 sm:text-2xl">
                <span className="h-7 w-[3px] rounded-full bg-neon shadow-[0_0_12px_1px_rgba(47,228,228,0.7)]" />
                {profile.rol}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-7 max-w-lg text-[17px] leading-[1.75] text-paper/70">
                {profile.about.parrafo}
              </p>
              <p className="mt-4 max-w-lg text-[17px] leading-[1.75] text-paper/55">
                {profile.about.parrafoExtra}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <dl className="panel mt-9 grid max-w-lg grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
                {DATOS.map(({ icono: Ico, label, valor, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-neon/20 bg-neon/8 text-neon">
                      <Ico className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[13px] text-paper/50">{label}</dt>
                      <dd className="truncate font-medium">
                        {href ? (
                          <a href={href} className="transition hover:text-neon" title={valor}>
                            {valor}
                          </a>
                        ) : (
                          valor
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.3}>
              <a href="#contacto" className="btn-solid group mt-8">
                {profile.about.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* ── Tarjeta con foto y enfoque ───────────────────────────────── */}
          <Reveal delay={0.16} className="lg:pt-4">
            <div className="panel overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={profile.foto.src}
                  alt={`${profile.nombre}, ${profile.rol.toLowerCase()}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{
                    transform: `scale(${profile.foto.zoom})`,
                    objectPosition: profile.foto.posicion,
                  }}
                />
                {/* Duotono: `mix-blend-color` conserva la luminancia de la foto
                    y le cambia solo el tono, así entra en la paleta del sitio
                    sin volverse una mancha plana. */}
                <div
                  className="absolute inset-0 bg-[#0E5C66] mix-blend-color"
                  style={{ opacity: profile.foto.duotono }}
                />
                {/* Solo lo justo para que la foto se funda con el borde de la tarjeta */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,12,16,0.72),rgba(6,12,16,0.08)_46%,transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(4,8,11,0.32))]" />
                <div className="absolute inset-0 ring-1 ring-neon/10 ring-inset" />
              </div>

              <div className="p-7">
                <h3 className="text-lg font-semibold text-neon">Mi enfoque</h3>
                <div className="mt-2 h-0.5 w-9 rounded-full bg-neon/60" />

                <ul className="mt-6 flex flex-col gap-5">
                  {profile.about.enfoque.map((e) => (
                    <li key={e.titulo} className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon/18 bg-neon/7 text-neon">
                        <Icon name={e.icono} className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="font-semibold">{e.titulo}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-paper/60">{e.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Franja de métricas ─────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <ul className="panel mt-12 grid grid-cols-2 divide-white/8 lg:grid-cols-4 lg:divide-x">
            {profile.about.stats.map((s) => (
              <li key={s.label} className="flex items-center gap-4 px-6 py-7 sm:px-8">
                <Icon name={s.icono} className="h-8 w-8 shrink-0 text-neon" strokeWidth={1.5} />
                <div>
                  <div className="text-3xl font-bold tracking-tight sm:text-[2rem]">
                    {s.valor}
                    <span className="text-neon">{s.sufijo}</span>
                  </div>
                  <div className="text-[13px] leading-tight whitespace-pre-line text-paper/55">
                    {s.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Fondo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(47,228,228,0.07),transparent_66%)] blur-2xl" />
      <div className="absolute top-1/3 -right-52 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(47,228,228,0.05),transparent_66%)] blur-2xl" />
    </div>
  );
}
