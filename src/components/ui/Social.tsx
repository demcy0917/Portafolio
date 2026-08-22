import { profile } from "@/content/profile";
import { TechIcon } from "./TechIcon";

/**
 * Iconos sociales. Solo aparecen los enlaces que estén llenos en
 * `profile.links`, así que dejar uno en "" lo quita del sitio sin tocar código.
 */

const ORDEN = [
  { clave: "github", icono: "github", etiqueta: "GitHub" },
  { clave: "linkedin", icono: "linkedin", etiqueta: "LinkedIn" },
  { clave: "x", icono: "x", etiqueta: "X" },
  { clave: "instagram", icono: "instagram", etiqueta: "Instagram" },
  { clave: "telegram", icono: "telegram", etiqueta: "Telegram" },
] as const;

export function Social({
  className = "",
  size = "h-[18px] w-[18px]",
  incluirCorreo = false,
}: {
  className?: string;
  size?: string;
  incluirCorreo?: boolean;
}) {
  const enlaces = ORDEN.filter((o) => profile.links[o.clave]);

  if (!enlaces.length && !incluirCorreo) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {enlaces.map((o) => (
        <a
          key={o.clave}
          href={profile.links[o.clave]}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={o.etiqueta}
          title={o.etiqueta}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/4 text-paper/70 transition hover:-translate-y-0.5 hover:border-neon/45 hover:text-neon"
        >
          <TechIcon name={o.icono} className={size} color={false} title={o.etiqueta} />
        </a>
      ))}

      {incluirCorreo && (
        <a
          href={`mailto:${profile.email}`}
          aria-label="Correo"
          title={profile.email}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-white/4 text-paper/70 transition hover:-translate-y-0.5 hover:border-neon/45 hover:text-neon"
        >
          <TechIcon name="gmail" className={size} color={false} title="Correo" />
        </a>
      )}
    </div>
  );
}
