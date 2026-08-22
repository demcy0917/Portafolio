import type { MockTipo } from "@/content/projects";
import { TechIcon } from "@/components/ui/TechIcon";

/**
 * Portadas de los proyectos.
 *
 * No hay capturas reales todavía, así que cada proyecto se representa con una
 * maqueta abstracta de su interfaz — hecha con divs, sin imágenes. En cuanto
 * pongas una ruta en `portada`, la card usa la foto y esto deja de dibujarse.
 */

export function ProjectMock({ tipo }: { tipo: MockTipo }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(150deg,#0A1620,#060D12_60%)]">
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(47,228,228,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(47,228,228,0.09)_1px,transparent_1px)] [background-size:22px_22px]" />
      {tipo === "tienda" && <Tienda />}
      {tipo === "chat" && <Chat />}
      {tipo === "escritorio" && <Escritorio />}
      {tipo === "video" && <Video />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(47,228,228,0.14),transparent_58%)]" />
    </div>
  );
}

/** Cromo de ventana de navegador. */
function Cromo({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-2.5 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#E06C75]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#E5C07B]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#4FC98A]" />
      <span className="ml-1 truncate rounded bg-black/35 px-2 py-0.5 text-[8px] text-paper/40">
        {url}
      </span>
    </div>
  );
}

function Tienda() {
  return (
    <div className="absolute inset-4 overflow-hidden rounded-lg border border-white/10 bg-ink-900/80 shadow-2xl">
      <Cromo url="detallesjutiapa.com" />
      <div className="p-3">
        {/* Encabezado del catálogo */}
        <div className="flex items-center justify-between">
          <div className="h-2 w-16 rounded-full bg-[#E8899F]/70" />
          <div className="flex gap-1.5">
            {[10, 10, 10].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/15" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Rejilla de productos */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="overflow-hidden rounded-md border border-white/8 bg-white/4">
              <div
                className="aspect-[4/3]"
                style={{
                  background:
                    i % 3 === 0
                      ? "linear-gradient(140deg,#3C1A24,#7A2B41)"
                      : i % 3 === 1
                        ? "linear-gradient(140deg,#1F2E22,#3E6B45)"
                        : "linear-gradient(140deg,#33202C,#8A4560)",
                }}
              />
              <div className="space-y-1 p-1.5">
                <div className="h-1 w-full rounded-full bg-white/18" />
                <div className="h-1 w-2/3 rounded-full bg-neon/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chat() {
  const burbujas = [
    { yo: false, w: "62%" },
    { yo: true, w: "78%" },
    { yo: false, w: "48%" },
    { yo: true, w: "70%" },
  ];

  return (
    <div className="absolute inset-4 flex overflow-hidden rounded-lg border border-white/10 bg-ink-900/80 shadow-2xl">
      {/* Barra lateral de conversaciones */}
      <div className="hidden w-1/4 shrink-0 flex-col gap-1.5 border-r border-white/8 bg-black/25 p-2 sm:flex">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 rounded p-1 ${i === 0 ? "bg-neon/12" : ""}`}
          >
            <span className="h-3 w-3 shrink-0 rounded-full bg-white/15" />
            <span className="h-1 flex-1 rounded-full bg-white/12" />
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-1.5 border-b border-white/8 pb-2">
          <TechIcon name="telegram" className="h-4 w-4 shrink-0" />
          <span className="truncate text-[9px] font-semibold text-paper/70">@demcybot</span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#4FC98A]" />
        </div>

        <div className="mt-2.5 flex flex-1 flex-col justify-end gap-2">
          {burbujas.map((b, i) => (
            <div key={i} className={`flex ${b.yo ? "justify-start" : "justify-end"}`}>
              <div
                className={`space-y-1 rounded-lg px-2 py-1.5 ${
                  b.yo
                    ? "rounded-bl-sm border border-neon/25 bg-neon/12"
                    : "rounded-br-sm bg-white/8"
                }`}
                style={{ width: b.w }}
              >
                <div className={`h-1 rounded-full ${b.yo ? "bg-neon/60" : "bg-white/25"} w-full`} />
                <div className={`h-1 rounded-full ${b.yo ? "bg-neon/35" : "bg-white/15"} w-3/5`} />
              </div>
            </div>
          ))}

          {/* Confirmación de reunión agendada */}
          <div className="flex items-center gap-1.5 rounded-md border border-[#4FC98A]/35 bg-[#4FC98A]/10 px-2 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#4FC98A]" />
            <span className="h-1 w-20 rounded-full bg-[#4FC98A]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Escritorio() {
  return (
    <div className="absolute inset-4 overflow-hidden rounded-lg border border-white/10 bg-ink-900/80 shadow-2xl">
      <Cromo url="WhisperFlow — escuchando" />
      <div className="flex h-[calc(100%-26px)] flex-col justify-center gap-3 p-4">
        {/* Onda de audio */}
        <div className="flex h-10 items-center justify-center gap-[3px]">
          {Array.from({ length: 34 }, (_, i) => {
            const h = 8 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.31)) * 30;
            return (
              <span
                key={i}
                className="w-[3px] rounded-full bg-neon"
                style={{ height: h, opacity: 0.35 + (h / 38) * 0.65 }}
              />
            );
          })}
        </div>

        {/* Texto transcrito */}
        <div className="space-y-1.5 rounded-md border border-white/8 bg-black/30 p-2.5">
          <div className="h-1.5 w-full rounded-full bg-white/22" />
          <div className="h-1.5 w-11/12 rounded-full bg-white/16" />
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1/2 rounded-full bg-white/12" />
            <span className="h-2.5 w-[2px] animate-caret bg-neon" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[8px] text-paper/40">
          <span className="rounded border border-neon/30 px-1.5 py-0.5 text-neon">CTRL mantenido</span>
          <span>100% local</span>
        </div>
      </div>
    </div>
  );
}

function Video() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4">
      {/* Tres fotogramas verticales */}
      <div className="flex items-end justify-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-md border shadow-xl ${
              i === 1 ? "w-[52px] border-neon/45" : "w-[42px] border-white/12 opacity-70"
            }`}
            style={{ aspectRatio: "9 / 16" }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  i === 1
                    ? "linear-gradient(165deg,#0E3B44,#123A2E 55%,#0A1620)"
                    : i === 0
                      ? "linear-gradient(165deg,#1C2340,#0C1420)"
                      : "linear-gradient(165deg,#3A2438,#0E1018)",
              }}
            >
              <div className="flex h-full flex-col justify-end gap-1 p-1.5">
                <div className="h-1 w-full rounded-full bg-white/35" />
                <div className="h-1 w-2/3 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Línea de tiempo */}
      <div className="w-full max-w-[80%] space-y-1">
        {[
          { c: "bg-neon/55", w: "72%" },
          { c: "bg-[#C792EA]/45", w: "88%" },
          { c: "bg-[#E5C07B]/40", w: "56%" },
        ].map((p, i) => (
          <div key={i} className="h-1.5 w-full rounded-full bg-white/6">
            <div className={`h-full rounded-full ${p.c}`} style={{ width: p.w }} />
          </div>
        ))}
      </div>
    </div>
  );
}
