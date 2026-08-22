import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Tag,
  User,
} from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { Social } from "@/components/ui/Social";
import { TechIcon } from "@/components/ui/TechIcon";

/** Icono de cada canal, según el `id` que trae `profile.contacto.canales`. */
const ICONO_CANAL: Record<string, string> = {
  gmail: "gmail",
  instagram: "instagram",
  whatsapp: "whatsapp",
  "whatsapp-demcy": "whatsapp",
  github: "github",
  linkedin: "linkedin",
  telegram: "telegram",
};

function IconoCanal({ id }: { id: string }) {
  const icono = ICONO_CANAL[id];
  if (!icono) return <Phone className="h-5 w-5" strokeWidth={1.8} />;
  return <TechIcon name={icono} className="h-5 w-5" color={false} />;
}

export function Contacto() {
  // Solo se muestran los canales que tienen dato. Los vacíos en profile.ts
  // desaparecen del sitio sin dejar huecos.
  const canales = profile.contacto.canales.filter((c) => c.valor && c.href);

  return (
    <section id="contacto" className="relative py-24 sm:py-32">
      <Fondo />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <Reveal>
          <p className="eyebrow">Contacto</p>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* ── Columna izquierda ───────────────────────────────────────── */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.06] font-bold tracking-tight">
                <span className="block">{profile.contacto.titulo}</span>
                <span className="neon-text block">{profile.contacto.tituloAcento}</span>
              </h2>

              <p className="mt-6 max-w-md text-[17px] leading-[1.75] text-paper/65">
                {profile.contacto.descripcion}
              </p>
            </Reveal>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {canales.map((c, i) => (
                <Reveal
                  key={c.id}
                  delay={0.08 + i * 0.05}
                  as="li"
                  // El correo lleva la línea más larga: ocupa el ancho completo
                  // para que no se corte a la mitad.
                  className={c.id === "gmail" ? "sm:col-span-2" : undefined}
                >
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="panel panel-hover group flex h-full items-center gap-3.5 p-4"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon/20 bg-neon/8 text-neon">
                      <IconoCanal id={c.id} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold">{c.etiqueta}</div>
                      <div className="truncate text-[13px] text-paper/55">{c.valor}</div>
                    </div>
                    <ArrowRight className="h-[18px] w-[18px] shrink-0 text-paper/30 transition group-hover:translate-x-1 group-hover:text-neon" />
                  </a>
                </Reveal>
              ))}

              {/* Datos que no son un enlace, pero que un reclutador busca */}
              <Reveal delay={0.08 + canales.length * 0.05} as="li" className="sm:col-span-2">
                <div className="panel grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/4 text-paper/60">
                      <MapPin className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="text-[13px] text-paper/50">Ubicación</div>
                      <div className="text-sm font-medium">
                        {profile.ubicacion} · {profile.zonaHoraria}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/4 text-paper/60">
                      <Briefcase className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="text-[13px] text-paper/50">Disponibilidad</div>
                      <div className="text-sm font-medium">{profile.disponibilidad}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </ul>

            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CopiarCorreo />
                <Social />
              </div>
              <p className="mt-5 text-sm text-paper/45">{profile.contacto.nota}</p>
            </Reveal>
          </div>

          {/* ── Formulario ──────────────────────────────────────────────── */}
          <Reveal delay={0.14}>
            <Formulario />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CopiarCorreo() {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles: el enlace mailto sigue disponible arriba.
      setCopiado(false);
    }
  };

  return (
    <button type="button" onClick={copiar} className="btn-ghost px-4 py-2 text-sm">
      {copiado ? (
        <>
          <Check className="h-4 w-4 text-neon" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar correo
        </>
      )}
    </button>
  );
}

/**
 * El formulario abre el cliente de correo con todo prellenado.
 *
 * No hay backend a propósito: un endpoint para tres mensajes al mes es
 * infraestructura que hay que mantener y vigilar. Si algún día hace falta,
 * se cambia `enviar` por un `fetch` y el resto del componente no se toca.
 */
function Formulario() {
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);

    const nombre = String(datos.get("nombre") ?? "").trim();
    const correo = String(datos.get("correo") ?? "").trim();
    const asunto = String(datos.get("asunto") ?? "").trim();
    const mensaje = String(datos.get("mensaje") ?? "").trim();

    const cuerpo = [mensaje, "", "—", nombre, correo].join("\n");
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(
      asunto || `Contacto desde el sitio — ${nombre}`,
    )}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = url;
    setEnviado(true);
    window.setTimeout(() => setEnviado(false), 6000);
  };

  return (
    <form onSubmit={enviar} className="panel p-6 sm:p-8">
      <h3 className="flex items-center gap-3 text-xl font-semibold">
        <Send className="h-5 w-5 text-neon" strokeWidth={1.9} />
        {profile.contacto.formTitulo}
      </h3>

      <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
        <Campo icono={<User className="h-[18px] w-[18px]" />}>
          <input
            name="nombre"
            required
            autoComplete="name"
            placeholder="Nombre"
            aria-label="Nombre"
            className="field"
          />
        </Campo>

        <Campo icono={<Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />}>
          <input
            name="correo"
            type="email"
            required
            autoComplete="email"
            placeholder="Correo"
            aria-label="Correo"
            className="field"
          />
        </Campo>

        <div className="sm:col-span-2">
          <Campo icono={<Tag className="h-[18px] w-[18px]" />}>
            <input name="asunto" placeholder="Asunto" aria-label="Asunto" className="field" />
          </Campo>
        </div>

        <div className="sm:col-span-2">
          <Campo icono={<MessageCircle className="h-[18px] w-[18px]" />} arriba>
            <textarea
              name="mensaje"
              required
              rows={6}
              placeholder="Mensaje"
              aria-label="Mensaje"
              className="field resize-y"
            />
          </Campo>
        </div>
      </div>

      <button type="submit" className="btn-solid mt-6 w-full">
        <Send className="h-4 w-4" />
        Enviar mensaje
      </button>

      <AnimatePresence>
        {enviado && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-neon"
          >
            <Check className="h-4 w-4" />
            Abrí tu cliente de correo con el mensaje listo para enviar.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function Campo({
  icono,
  children,
  arriba = false,
}: {
  icono: React.ReactNode;
  children: React.ReactNode;
  arriba?: boolean;
}) {
  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute left-4 text-paper/40 ${
          arriba ? "top-4" : "top-1/2 -translate-y-1/2"
        }`}
      >
        {icono}
      </span>
      {children}
    </div>
  );
}

function Fondo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -bottom-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(47,228,228,0.07),transparent_66%)] blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(47,228,228,0.24),transparent)]" />
    </div>
  );
}
