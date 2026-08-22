import { useId } from "react";
import { brandIcons } from "@/lib/brandIcons";

/**
 * Logo de una tecnología, en su color de marca.
 *
 * La mayoría sale de `brandIcons` (generado desde simple-icons). Las que no
 * están ahí por restricciones de marca —AWS, Codex, VS Code, LinkedIn— y las
 * genéricas —CLI— se dibujan acá abajo.
 *
 * Dos ajustes sobre el color que trae simple-icons:
 *
 * 1. Marcas negras. GitHub (#181717), Railway (#0B0D0E), Next.js y Vercel
 *    (#000000) son ilegibles sobre un fondo oscuro. Sus propias guías de marca
 *    piden la versión clara en fondos oscuros, así que se sustituyen.
 * 2. Marcas de dos colores. simple-icons entrega un único trazo monocromo, y
 *    logos como el de Python pierden su segunda mitad. Para esos se pinta el
 *    mismo trazo con un degradado de corte duro, que reproduce la división
 *    real del logo.
 */

type Props = {
  name: string;
  className?: string;
  /** Pinta el logo en color de marca. Con `false` hereda `currentColor`. */
  color?: boolean;
  title?: string;
};

/** Color para marcas cuyo negro oficial no se ve sobre fondo oscuro. */
const CLARO = "#E8F2F4";

/**
 * Degradados de corte duro para logos de dos colores.
 * El eje va de una esquina a la otra; el corte al 50 % separa las dos mitades.
 */
const DEGRADADOS: Record<
  string,
  { desde: string; hasta: string; eje: [number, number, number, number]; duro?: boolean }
> = {
  // El logo de Python son dos serpientes entrelazadas: la azul ocupa la mitad
  // superior izquierda y la amarilla la inferior derecha, partidas por la
  // diagonal. Un corte duro sobre esa misma diagonal las recupera.
  python: { desde: "#4B8BBE", hasta: "#FFD43B", eje: [0, 0, 1, 1], duro: true },
  // La llama de Hono va de naranja encendido arriba a rojizo abajo.
  hono: { desde: "#FF8A3D", hasta: "#DE4B08", eje: [0, 0, 0, 1] },
};

/** Luminancia relativa, para decidir si un color es demasiado oscuro. */
function luminancia(hex: string) {
  const canal = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(0) + 0.7152 * canal(1) + 0.0722 * canal(2);
}

function colorDeMarca(hex: string) {
  return luminancia(hex) < 0.06 ? CLARO : hex;
}

/** Logos dibujados a mano: no existen en simple-icons. */
const custom: Record<string, { t: string; h: string; render: (c: string) => React.ReactNode }> = {
  aws: {
    t: "AWS",
    h: "#FF9900",
    render: (c) => (
      <>
        <text
          x="12"
          y="10.6"
          textAnchor="middle"
          fontFamily="Sora, Inter, sans-serif"
          fontWeight="700"
          fontSize="8.6"
          fill={c}
          letterSpacing="-0.3"
        >
          aws
        </text>
        <path
          d="M3.4 15.4c4.6 2.9 12.6 2.9 17.2 0"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18.6 13.4l2.9 2-2.4 1.6"
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  codex: {
    t: "Codex",
    h: "#E8F2F4",
    render: (c) => (
      <>
        <path
          d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z"
          fill="none"
          stroke={c}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.7 9.4 7.3 12l2.4 2.6M14.3 9.4 16.7 12l-2.4 2.6"
          fill="none"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  vscode: {
    t: "VS Code",
    h: "#3EA0E8",
    render: (c) => (
      <>
        <path
          d="M17.2 2.4 8.6 10.6 4.6 7.5 2.4 8.6v6.8l2.2 1.1 4-3.1 8.6 8.2 4.4-2.1V4.5l-4.4-2.1Z"
          fill="none"
          stroke={c}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M17.2 6.6v10.8L10.4 12l6.8-5.4Z" fill={c} />
      </>
    ),
  },
  linkedin: {
    t: "LinkedIn",
    h: "#3B9BE0",
    render: (c) => (
      <>
        <rect
          x="2.2"
          y="2.2"
          width="19.6"
          height="19.6"
          rx="3.4"
          fill="none"
          stroke={c}
          strokeWidth="1.7"
        />
        <circle cx="7.2" cy="7.3" r="1.5" fill={c} />
        <path d="M6.2 10.6h2v7.2h-2z" fill={c} />
        <path
          d="M11 17.8v-7.2h1.9v1a2.9 2.9 0 0 1 2.5-1.2c1.9 0 2.9 1.2 2.9 3.4v4h-2v-3.7c0-1.1-.4-1.8-1.4-1.8s-1.6.7-1.6 1.8v3.7H11Z"
          fill={c}
        />
      </>
    ),
  },
  cli: {
    t: "CLI & Terminal",
    h: "#2FE4E4",
    render: (c) => (
      <>
        <rect
          x="2.2"
          y="3.6"
          width="19.6"
          height="16.8"
          rx="2.6"
          fill="none"
          stroke={c}
          strokeWidth="1.7"
        />
        <path
          d="m6.6 9.4 2.6 2.6-2.6 2.6M12.4 15.2h5"
          fill="none"
          stroke={c}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  whisper: {
    t: "Whisper",
    h: "#7CF5F0",
    render: (c) => (
      <>
        <path
          d="M3 12h1.8M7 8.4v7.2M10.4 5.6v12.8M13.8 8v8M17.2 10v4M20.6 11.2v1.6"
          fill="none"
          stroke={c}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </>
    ),
  },
};

export function TechIcon({ name, className = "h-6 w-6", color = true, title }: Props) {
  // Los ids de degradado tienen que ser únicos por instancia: si dos logos
  // comparten id, el segundo hereda el degradado del primero.
  const gradId = useId();

  const brand = brandIcons[name];
  const hecho = custom[name];
  const etiqueta = title ?? brand?.t ?? hecho?.t ?? name;

  if (brand) {
    const degradado = color ? DEGRADADOS[name] : undefined;
    const tono = color ? colorDeMarca(brand.h) : "currentColor";
    const [x1, y1, x2, y2] = degradado?.eje ?? [0, 0, 1, 1];

    return (
      <svg viewBox="0 0 24 24" className={className} role="img" aria-label={etiqueta}>
        <title>{etiqueta}</title>
        {degradado && (
          <defs>
            <linearGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
              <stop offset={degradado.duro ? "50%" : "0%"} stopColor={degradado.desde} />
              <stop offset={degradado.duro ? "50%" : "100%"} stopColor={degradado.hasta} />
            </linearGradient>
          </defs>
        )}
        <path d={brand.p} fill={degradado ? `url(#${gradId})` : tono} />
      </svg>
    );
  }

  if (hecho) {
    return (
      <svg viewBox="0 0 24 24" className={className} role="img" aria-label={etiqueta}>
        <title>{etiqueta}</title>
        {hecho.render(color ? hecho.h : "currentColor")}
      </svg>
    );
  }

  // Sin logo registrado: inicial dentro de un cuadro. Nunca rompe el layout.
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={etiqueta}>
      <title>{etiqueta}</title>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity=".5"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="Sora, Inter, sans-serif"
        fontWeight="700"
        fontSize="10"
        fill="currentColor"
      >
        {etiqueta.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}

/** Color de marca de una tecnología, para halos y bordes. */
export function techColor(name: string): string {
  const brand = brandIcons[name];
  if (brand) return DEGRADADOS[name]?.desde ?? colorDeMarca(brand.h);
  return custom[name]?.h ?? "#2FE4E4";
}
