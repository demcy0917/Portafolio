# demcy.ia — portfolio 3D

Sitio personal de David Melgar. Una sola página con hero 3D interactivo:
al hacer clic en la silla la cámara entra al POV del escritorio, donde los
monitores muestran código real y son clickeables.

**Stack:** Vite · React 19 · TypeScript · React Three Fiber · Tailwind CSS v4 · Framer Motion
**Deploy:** Cloudflare Pages

---

## Arrancar

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Chequeo de tipos + build a `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run deploy` | Build y publica en Cloudflare Pages |
| `npm run shot` | Capturas de todas las secciones en `capturas/` |
| `npm run iconos` | Regenera los logos de tecnologías |

---

## Qué editar y dónde

**Todo el contenido vive en `src/content/`. No hace falta tocar componentes.**

| Archivo | Contiene |
|---|---|
| `src/content/profile.ts` | Nombre, rol, correo, redes, textos de todas las secciones, métricas |
| `src/content/projects.ts` | Los proyectos: resumen, problema, solución, decisiones técnicas, stack |
| `src/content/skills.ts` | Las tecnologías de la sección Habilidades |

### Pendientes marcados en el código

Buscá `TODO(David)` para encontrarlos:

- **Instagram** — `profile.links.instagram` y el canal `instagram` de
  `profile.contacto.canales`: están vacíos, así que ni el ícono ni la tarjeta
  aparecen. Con pegar la URL vuelven solos.
- **Repositorios** — `repo` de cada proyecto: vacío. Al llenarlo aparece el
  botón "Código" en la card y en la ficha.
- **Instalador de WhisperFlow** — ver `public/descargas/LEEME.md`.
- **Métricas** — `profile.about.stats`: hoy dicen 4 productos, +3 años,
  20+ tecnologías. Subilos cuando corresponda.

### Portadas de proyecto

Cada card elige qué mostrar, en este orden:

1. **`video`** — un clip de la herramienta funcionando. En la card va mudo y en
   bucle; en la ficha se cambia por el video completo con controles.
2. **`portada`** — una captura de la interfaz.
3. **`mock`** — una maqueta abstracta dibujada con divs (`ProjectMock.tsx`),
   para los proyectos que todavía no tienen material.

Para agregar una captura: dejala en `public/media/proyectos/<slug>/portada.jpg`
y poné esa ruta en `portada`. Para un video:

```ts
video: {
  bucle: "/media/proyectos/<slug>/preview.mp4",     // clip corto, mudo
  completo: "/media/proyectos/<slug>/completo.mp4", // opcional
  poster: "/media/proyectos/<slug>/poster.jpg",
},
```

Los videos hay que comprimirlos antes: el original de *Creador de contenido*
pesaba 31 MB y quedó en 2,9 MB sin pérdida visible. Con el ffmpeg que ya trae
Remotion en `01 - Proyectos/Creador de contenido/remotion-video/node_modules/`:

```bash
ffmpeg -i entrada.mp4 -vf "scale=720:-2:in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -profile:v main -color_range tv -colorspace bt709 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart completo.mp4
ffmpeg -ss 3 -t 12 -i entrada.mp4 -an -vf "scale=460:-2:in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -profile:v main -color_range tv -crf 31 -preset slow -movflags +faststart preview.mp4
ffmpeg -ss 5 -i entrada.mp4 -frames:v 1 -vf "scale=540:-2" -q:v 4 poster.jpg
```

**No omitas la conversión de rango.** Si el original viene en `yuvj420p`
—rango completo, lo que sale de muchos renderizadores— y solo pasás
`-pix_fmt yuv420p`, ffmpeg puede conservar la variante J. Chrome la reproduce
igual, pero Firefox y Safari cortan con «No video with supported format and MIME
type found». Comprobalo después de convertir:

```bash
ffprobe -v error -show_entries stream=pix_fmt,color_range -of default=noprint_wrappers=1 completo.mp4
```

Tiene que decir `pix_fmt=yuv420p` y `color_range=tv`.

### Cambiar la foto de perfil

Reemplazá `public/media/perfil/fotoperfil.jpeg` y ajustá `profile.foto`:
`zoom` (1 = sin recorte), `posicion` (el punto que queda centrado) y `duotono`
(un tinte teal, hoy en 0 para que la foto conserve su color original; subilo
hasta 0,6 si alguna vez ponés una que choque con la paleta).

---

## Cómo está armado

```
src/
├── content/           ← lo único que se edita para cambiar el sitio
├── components/
│   ├── hero/
│   │   ├── Hero.tsx      Sección, textos y HUD del POV
│   │   ├── Scene.tsx     Canvas, luces, postproceso y cámara
│   │   ├── Room.tsx      Toda la geometría del cuarto
│   │   ├── textures.ts   Texturas dibujadas con Canvas 2D
│   │   └── setup.ts      Textos de los monitores y modos del teclado
│   ├── sections/      Sobre mí, Proyectos, Habilidades, Contacto
│   └── ui/            Piezas compartidas (íconos, Reveal, redes)
└── lib/
    ├── device.ts      Detección de WebGL, calidad y visibilidad
    └── brandIcons.ts  Trazos SVG de logos (generado)
```

### La escena 3D

- **Sin assets.** El cuarto entero son primitivas de Three.js y las texturas
  —código de los monitores, ciudad de la ventana, madera, alfombra— se dibujan
  con Canvas 2D al cargar. No hay ni un `.glb` ni una imagen que descargar.
- **Carga diferida.** El motor 3D (~1 MB) vive en su propio chunk gracias a
  `lazy(() => import("./Scene"))`. La primera pintura no lo espera.
- **Se apaga sola.** Cuando el hero sale de pantalla el bucle de render se
  detiene (`frameloop="never"`), así el 3D no consume batería mientras leés
  el resto del sitio.
- **Degrada.** En equipos flojos o móviles se dibuja sin bloom ni antialias;
  sin WebGL cae a un hero plano con el mismo texto.
- **Se puede inspeccionar.** En desarrollo, `window.__escena` expone
  `{ gl, scene, camera, THREE }` para trastear desde la consola.

Para cambiar el código que se ve en los monitores, editá los arreglos `CODIGO`
y `CODIGO_B` en `textures.ts`.

**Qué se puede tocar dentro del POV:**

- **Los monitores** — clic en uno y el HUD dice qué corre en esa pantalla.
- **El teclado** — 65 teclas con luz RGB por tecla. Al pasar el cursor la tecla
  se hunde y se enciende; al hacer clic cambia el modo de iluminación (ola de
  color → teal de marca → reactivo al cursor) y sale una onda desde la tecla
  pulsada. Los modos están en `MODOS_TECLADO` (`setup.ts`).
- **El mouse** — aro de luz, rueda encendida y reflejo sobre la alfombrilla.
  Comparte el modo RGB con el teclado (el estado vive en `Perifericos`), así que
  los dos cambian a la vez y hacerle clic también cicla el modo.

Detalle a tener en cuenta si tocás el teclado: las teclas son dos
`instancedMesh` y **ninguna instancia puede tener escala cero**. Una matriz
singular produce normales NaN, y ese NaN se propaga por el desenfoque del bloom
hasta dejar toda la escena en negro. Por eso las columnas que se come la barra
espaciadora no se generan en vez de ocultarse con `scale = 0`.

### Los logos de tecnologías

Los trazos SVG salen de [simple-icons](https://simpleicons.org) pero se extraen
una sola vez a `src/lib/brandIcons.ts` — el paquete completo pesa 5 MB. Para
agregar un logo, sumá su clave en `scripts/gen-icons.mjs` y corré:

```bash
npm i -D simple-icons && npm run iconos && npm un simple-icons
```

`TechIcon.tsx` hace dos correcciones sobre lo que entrega simple-icons:

- **Marcas negras.** GitHub, Railway, Next.js y Vercel tienen un negro oficial
  que sobre este fondo no se ve. Se sustituyen por su versión clara, que es lo
  que sus propias guías de marca piden en fondos oscuros.
- **Marcas de dos colores.** simple-icons entrega un solo trazo monocromo, así
  que Python perdía su segunda serpiente. Se pinta con un degradado de corte
  duro en la diagonal, que reproduce la división real del logo. El mapa está en
  la constante `DEGRADADOS`.

AWS, OpenAI/Codex, VS Code y LinkedIn no están en simple-icons por restricciones
de marca; se dibujan a mano en el mismo archivo.

---

## Deploy a Cloudflare Pages

```bash
npm run deploy
```

O conectá el repositorio en el panel de Cloudflare con:

- **Build command:** `npm run build`
- **Output directory:** `dist`

El nombre del proyecto y la fecha de compatibilidad están en `wrangler.jsonc`.

---

## Decisiones que conviene conocer

- **El scroll al recargar.** El navegador restaura la posición antes de que el
  hero 3D y las imágenes monten, cuando el documento todavía mide mucho menos:
  la posición guardada se recortaba al final de la página y recargabas en el
  inicio para aparecer en Contacto. `main.tsx` desactiva `scrollRestoration` y
  decide a mano.
- **El desplazamiento de los anclas** lo pone `scroll-padding-top` en `<html>`,
  una sola vez. No agregues `scroll-mt-*` en las secciones: se suman y dejan un
  hueco del doble.
- **El formulario de contacto no tiene backend.** Abre el cliente de correo con
  todo prellenado. Si algún día hace falta, se cambia `enviar` en
  `Contacto.tsx` por un `fetch` y el resto del componente no se toca.

---

## Revisión visual

El hero es WebGL, así que no basta con leer el HTML para saber si algo quedó
donde debía. `npm run shot` levanta Chrome headless, recorre el sitio en
escritorio y móvil, entra al POV, abre una ficha de proyecto y deja las
capturas en `capturas/`. También reporta errores de consola.

Necesita que `npm run dev` esté corriendo. Para revisar el build de producción:

```bash
npm run preview
node scripts/shot.mjs ./capturas http://localhost:4173
```
