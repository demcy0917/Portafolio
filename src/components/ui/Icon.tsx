import {
  Bot,
  Brain,
  Calendar,
  Cloud,
  Code,
  CodeXml,
  Coffee,
  Database,
  Layers,
  Server,
  Sparkles,
  Target,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Puente entre las claves de texto que usan los archivos de `src/content`
 * y los componentes de ícono reales.
 *
 * Existe para que el contenido se pueda editar sin importar componentes:
 * en `profile.ts` escribís `icono: "brain"` y acá se resuelve.
 */
const registro: Record<string, LucideIcon> = {
  bot: Bot,
  brain: Brain,
  calendar: Calendar,
  cloud: Cloud,
  code: CodeXml,
  "code-simple": Code,
  coffee: Coffee,
  database: Database,
  layers: Layers,
  server: Server,
  sparkles: Sparkles,
  target: Target,
  terminal: Terminal,
  wrench: Wrench,
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.8,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Componente = registro[name] ?? CodeXml;
  return <Componente className={className} strokeWidth={strokeWidth} aria-hidden />;
}
