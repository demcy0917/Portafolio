/**
 * Datos del setup que el HUD necesita conocer sin cargar la escena.
 *
 * Viven fuera de `Room.tsx` a propósito: el HUD del POV usa estos textos, y si
 * los importara desde ahí arrastraría Three.js al bundle inicial — justamente
 * lo que la carga diferida de la escena intenta evitar.
 */
export const MONITORES = [
  { id: 0, x: -2.62, rotY: 0.3, titulo: "Editor", sub: "demcy-bot · núcleo del bot en TypeScript" },
  { id: 1, x: 0, rotY: 0, titulo: "Terminal", sub: "wrangler deploy · a producción en 4 s" },
  { id: 2, x: 2.62, rotY: -0.3, titulo: "Analítica", sub: "conversaciones, conversión y latencia" },
] as const;

/**
 * Modos de iluminación del teclado. El orden es el del ciclo: cada clic sobre
 * el teclado pasa al siguiente.
 */
export const MODOS_TECLADO = ["Ola de color", "Teal de marca", "Reactivo al cursor"] as const;
