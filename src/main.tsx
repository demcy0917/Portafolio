import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * El navegador restaura el scroll al recargar, pero lo hace antes de que el
 * hero 3D y las imágenes monten. En ese momento el documento mide bastante
 * menos de lo que medirá, así que la posición guardada se recorta al final
 * de la página: recargabas en el inicio y aparecías en Contacto.
 *
 * Se desactiva la restauración y se decide a mano: al ancla si la URL trae
 * una, arriba si no.
 */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const ancla = window.location.hash;

if (ancla && ancla.length > 1) {
  const irAlAncla = () =>
    document.querySelector(ancla)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });

  // Dos pasadas: la primera en cuanto React pinta, la segunda cuando las
  // imágenes terminaron de cargar y el documento ya no cambia de alto.
  requestAnimationFrame(() => requestAnimationFrame(irAlAncla));
  window.addEventListener("load", () => setTimeout(irAlAncla, 120), { once: true });
} else {
  window.scrollTo(0, 0);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
