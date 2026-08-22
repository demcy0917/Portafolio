import { useEffect, useState, type RefObject } from "react";

/**
 * Detección de capacidades del dispositivo.
 *
 * La escena 3D es lo más caro del sitio, así que antes de montarla hay que
 * saber si el navegador puede con ella y con cuánta calidad.
 */

export type Calidad = "alta" | "baja" | "ninguna";

let cacheWebGL: boolean | null = null;

/** ¿El navegador puede crear un contexto WebGL2 o WebGL? */
export function soportaWebGL(): boolean {
  if (cacheWebGL !== null) return cacheWebGL;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cacheWebGL = Boolean(ctx);
    // Liberar el contexto de prueba: los navegadores limitan cuántos hay vivos.
    const perder = (ctx as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context");
    perder?.loseContext();
  } catch {
    cacheWebGL = false;
  }
  return cacheWebGL;
}

function calcularCalidad(): Calidad {
  if (typeof window === "undefined") return "ninguna";
  if (!soportaWebGL()) return "ninguna";

  const finoGrueso = window.matchMedia("(pointer: coarse)").matches;
  const angosto = window.innerWidth < 900;
  const nucleos = navigator.hardwareConcurrency ?? 4;
  const memoria = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  // Móviles y equipos flojos: se dibuja igual, pero sin bloom ni antialias
  // y con dpr 1. Prefiero la escena degradada antes que una imagen muerta.
  if ((finoGrueso && angosto) || nucleos <= 4 || memoria <= 4) return "baja";
  return "alta";
}

/** Calidad de render decidida al montar. No cambia con el resize. */
export function useCalidad(): Calidad {
  const [calidad, setCalidad] = useState<Calidad>("ninguna");
  useEffect(() => setCalidad(calcularCalidad()), []);
  return calidad;
}

/** ¿El sistema pide reducir el movimiento? */
export function usePrefiereQuieto(): boolean {
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alCambiar = () => setQuieto(mq.matches);
    alCambiar();
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  return quieto;
}

/**
 * ¿El elemento está a la vista?
 *
 * Se usa para apagar el bucle de render 3D mientras el usuario lee las
 * secciones de abajo: sin esto el canvas sigue dibujando 60 veces por segundo
 * algo que nadie está mirando.
 */
export function useEnVista<T extends Element>(ref: RefObject<T | null>, margen = "180px") {
  const [enVista, setEnVista] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), {
      rootMargin: margen,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, margen]);

  return enVista;
}

/** Ancho de viewport reactivo, con umbral. */
export function useEsAngosto(umbral = 768): boolean {
  const [angosto, setAngosto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${umbral - 1}px)`);
    const alCambiar = () => setAngosto(mq.matches);
    alCambiar();
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, [umbral]);

  return angosto;
}
