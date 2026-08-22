/**
 * HABILIDADES — Fuente única de verdad del stack.
 *
 * `icono` es la clave que resuelve `src/components/ui/TechIcon.tsx`.
 * Si agregás una tecnología nueva, registrá su ícono ahí también.
 *
 * `span` controla cuántas columnas ocupa el grupo en la grilla de escritorio.
 */

export type Tech = {
  nombre: string;
  icono: string;
  /** Línea corta bajo el nombre. Opcional: sin ella la tarjeta queda compacta. */
  nota?: string;
};

export type GrupoSkill = {
  id: string;
  titulo: string;
  icono: string;
  items: Tech[];
  /** Ancho en columnas de la grilla de 12. */
  span: number;
  /** Orden dentro de la grilla. */
  destacado?: boolean;
};

export const grupos: GrupoSkill[] = [
  {
    id: "ia",
    titulo: "IA & Asistentes",
    icono: "sparkles",
    span: 6,
    destacado: true,
    items: [
      { nombre: "Claude Code", icono: "claude", nota: "Asistente de IA para desarrollo y análisis." },
      { nombre: "Codex", icono: "codex", nota: "IA para generación de código y tareas." },
    ],
  },
  {
    id: "frontend",
    titulo: "Frontend",
    icono: "code",
    span: 4,
    items: [
      { nombre: "React", icono: "react" },
      { nombre: "Next.js", icono: "nextjs" },
    ],
  },
  {
    id: "backend",
    titulo: "Backend",
    icono: "server",
    span: 4,
    items: [
      { nombre: "NestJS", icono: "nestjs" },
      { nombre: "Hono", icono: "hono" },
      { nombre: "Node.js", icono: "nodejs" },
    ],
  },
  {
    id: "datos",
    titulo: "Base de datos",
    icono: "database",
    span: 4,
    items: [
      { nombre: "PostgreSQL", icono: "postgresql" },
      { nombre: "Supabase", icono: "supabase" },
    ],
  },
  {
    id: "nube",
    titulo: "Nube & Infraestructura",
    icono: "cloud",
    span: 12,
    items: [
      { nombre: "Railway", icono: "railway" },
      { nombre: "Cloudflare", icono: "cloudflare" },
      { nombre: "Cloudflare Workers", icono: "workers" },
      { nombre: "AWS", icono: "aws" },
    ],
  },
  {
    id: "automatizacion",
    titulo: "Automatizaciones",
    icono: "bot",
    span: 5,
    items: [
      { nombre: "Cloudflare Workers + Claude Code", icono: "workers", nota: "Agentes que corren solos en el borde." },
      { nombre: "n8n", icono: "n8n", nota: "Automatización de flujos." },
    ],
  },
  {
    id: "lenguajes",
    titulo: "Lenguajes & Herramientas",
    icono: "terminal",
    span: 7,
    items: [
      { nombre: "Python", icono: "python" },
      { nombre: "TypeScript", icono: "typescript" },
      { nombre: "Git", icono: "git" },
    ],
  },
  {
    id: "dev",
    titulo: "Herramientas de desarrollo",
    icono: "wrench",
    span: 12,
    items: [
      { nombre: "GitHub", icono: "github", nota: "Control de versiones y colaboración." },
      { nombre: "Docker", icono: "docker", nota: "Contenedores y entornos aislados." },
      { nombre: "Postman", icono: "postman", nota: "Pruebas y consumo de APIs." },
      { nombre: "VS Code", icono: "vscode", nota: "Editor de código principal." },
      { nombre: "CLI & Terminal", icono: "cli", nota: "Automatización y flujo de trabajo." },
    ],
  },
];
