import type { Proyecto } from "@/content/projects";
import { ProjectMock } from "./ProjectMock";

/**
 * Portada de un proyecto. Decide qué mostrar, en este orden:
 *
 *   1. `video`   — un clip real de lo que hace la herramienta
 *   2. `portada` — captura de la interfaz
 *   3. `mock`    — maqueta dibujada, cuando todavía no hay material
 *
 * En la card el video va mudo y en bucle; en la ficha se cambia por el video
 * completo con controles.
 */
export function ProjectPreview({
  proyecto,
  variante,
  className = "",
}: {
  proyecto: Proyecto;
  variante: "card" | "ficha";
  className?: string;
}) {
  const { video, portada, nombre, mock } = proyecto;

  if (video) {
    const enFicha = variante === "ficha";
    const fuente = enFicha ? (video.completo ?? video.bucle) : video.bucle;

    return (
      <div className={`relative h-full w-full overflow-hidden bg-ink-950 ${className}`}>
        {/* El video es vertical y el hueco horizontal: se difumina una copia
            de fondo para llenar los costados en vez de dejar barras negras. */}
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl saturate-125"
          style={{ backgroundImage: video.poster ? `url(${video.poster})` : undefined }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-ink-950/72" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,8,11,0.75))]"
          aria-hidden
        />

        <video
          key={fuente}
          poster={video.poster}
          className="relative mx-auto h-full w-auto max-w-full object-contain"
          // En la card se reproduce sola y muda (es lo único que los
          // navegadores permiten sin gesto del usuario). En la ficha manda
          // la persona: controles, con audio y sin descargar hasta que le dé play.
          autoPlay={!enFicha}
          loop={!enFicha}
          muted={!enFicha}
          playsInline
          controls={enFicha}
          preload={enFicha ? "none" : "metadata"}
          aria-label={`Video de ${nombre}`}
        >
          <source src={fuente} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (portada) {
    return (
      <img
        src={portada}
        alt={`Captura de ${nombre}`}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <ProjectMock tipo={mock} />
    </div>
  );
}
