import { Fragment } from "react";

/**
 * Renderiza **negritas** dentro de un párrafo de texto plano.
 *
 * Los archivos de contenido se escriben a mano, así que se acepta esta única
 * marca de Markdown en vez de arrastrar un parser completo al bundle.
 */
export function RichText({ children, className }: { children: string; className?: string }) {
  const partes = children.split(/(\*\*[^*]+\*\*)/g);

  return (
    <p className={className}>
      {partes.map((parte, i) =>
        parte.startsWith("**") && parte.endsWith("**") ? (
          <strong key={i} className="font-semibold text-paper">
            {parte.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </p>
  );
}
