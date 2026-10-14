/**
 * UN DÍA DE DEPLOY — la sección de video que avanza con el scroll.
 *
 * Cada momento es un clip de 8 s: el scroll lo recorre de principio a fin.
 * El último cuadro de un clip es el primero del siguiente, así que se ven
 * como una sola toma continua.
 *
 * Archivos en `public/media/dia/`:
 *   d0–d3.mp4  → escritorio (16:9)     d0–d3.webp → su primer cuadro
 *   m0–m3.mp4  → celular (9:16)        m0–m3.webp → su primer cuadro
 */

export const dia = {
  titulo: "Un día de deploy",
  // Hora que marca el reloj al inicio y al final del recorrido.
  horaInicio: 6,
  horaFin: 22,

  momentos: [
    {
      etiqueta: "Amanecer",
      titulo: "Antes del código,",
      acento: "el problema.",
      texto: "Entender qué duele, bocetar la interfaz y decidir el esquema antes de escribir una línea.",
      clip: "/media/dia/d0.mp4",
      clipMovil: "/media/dia/m0.mp4",
      poster: "/media/dia/d0.webp",
      posterMovil: "/media/dia/m0.webp",
    },
    {
      etiqueta: "Mediodía",
      titulo: "Frontend, API y base de datos.",
      acento: "Una sola cabeza.",
      texto: "La luz más dura del día para la parte más larga: construir de punta a punta.",
      clip: "/media/dia/d1.mp4",
      clipMovil: "/media/dia/m1.mp4",
      poster: "/media/dia/d1.webp",
      posterMovil: "/media/dia/m1.webp",
    },
    {
      etiqueta: "Atardecer",
      titulo: "Lo que falla hoy",
      acento: "no llega a producción.",
      texto: "Tests, casos borde y el checkout que no calculaba bien el envío.",
      clip: "/media/dia/d2.mp4",
      clipMovil: "/media/dia/m2.mp4",
      poster: "/media/dia/d2.webp",
      posterMovil: "/media/dia/m2.webp",
    },
    {
      etiqueta: "Noche",
      titulo: "Se esconde el sol.",
      acento: "Sale el deploy.",
      texto: "Un comando a Cloudflare Workers, y la ciudad sigue encendida.",
      clip: "/media/dia/d3.mp4",
      clipMovil: "/media/dia/m3.mp4",
      poster: "/media/dia/d3.webp",
      posterMovil: "/media/dia/m3.webp",
    },
  ],
} as const;
