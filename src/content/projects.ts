/**
 * PROYECTOS — Fuente única de verdad.
 *
 * Mismos proyectos del portafolio, con campos extra para esta página:
 *   categorias  → alimentan el filtro lateral y sus contadores
 *   chips       → las píldoras de tecnología de la card
 *   mock        → qué maqueta se dibuja en la portada de la card
 *   portada     → si algún día tenés captura real, poné la ruta acá y gana sobre el mock
 *
 * Para agregar un proyecto: copiá un bloque y cambiá el `slug`.
 */

export type Categoria =
  | "Aplicaciones Web"
  | "APIs & Backend"
  | "Automatización & IA"
  | "Herramientas";

export type MockTipo = "tienda" | "chat" | "escritorio" | "video";

export type Proyecto = {
  slug: string;
  nombre: string;
  etiqueta?: string;
  /** Una línea. Aparece en la card. */
  resumen: string;
  /** Stack corto para la card. Máximo 4 píldoras. */
  chips: string[];
  categorias: Categoria[];
  mock: MockTipo;
  /** Captura real. Si está, gana sobre `mock` en la card y en la ficha. */
  portada?: string;
  /**
   * Video de muestra. Gana sobre `portada`.
   *   bucle    → clip corto y mudo que se reproduce solo en la card
   *   completo → el video entero, con controles, dentro de la ficha
   *   poster   → primer fotograma, se ve mientras el video carga
   */
  video?: { bucle: string; completo?: string; poster?: string };
  /** Archivo descargable. Si está vacío, la ficha muestra "próximamente". */
  descarga?: { href: string; etiqueta: string; peso?: string };
  año: string;
  /** Enlaces. Dejá "" y el botón no se muestra. */
  demo: string;
  repo: string;

  // ── Contenido de la ficha completa ──
  /** El problema del cliente o la razón de existir del proyecto. */
  problema: string;
  /** Qué construiste, en párrafos. Usá **negritas**. */
  solucion: string[];
  /** Decisiones técnicas con su porqué. Esto es lo que lee un CTO. */
  decisiones: { titulo: string; texto: string }[];
  /** Stack completo, agrupado. */
  stack: { grupo: string; items: string[] }[];
  /** Resultado o estado actual. */
  resultado: string;
};

export const proyectos: Proyecto[] = [
  {
    slug: "synq-corporation",
    nombre: "SynQ Corporation",
    etiqueta: "Producto propio",
    resumen:
      "Sitio de automatización e IA para negocios, con su API en un solo despliegue: asistente de IA en la web, formulario de contacto y límites de uso en el borde.",
    chips: ["React 18", "Hono", "Cloudflare Workers", "OpenAI"],
    categorias: ["Aplicaciones Web", "APIs & Backend", "Automatización & IA"],
    mock: "chat",
    portada: "/media/proyectos/synq-corporation/portada.jpg",
    año: "2026",
    demo: "https://aiflowgt.com/",
    repo: "",

    problema:
      "La marca necesitaba una cara pública, pero un sitio que solo explica qué hacés no sirve de mucho si el visitante llega a las once de la noche con una duda concreta y no tiene a quién preguntarle.",
    solucion: [
      "Una **landing en React** con un **asistente de IA integrado**: el visitante pregunta por servicios o precios en la misma página y recibe respuesta al momento, sin salir a otro canal.",
      "El sitio y su API viven en **un solo despliegue de Cloudflare Workers**. Un Worker con Hono atiende `/api/*` —el chat y el formulario de contacto— y todo lo demás lo sirve la SPA. Un `deploy` publica las dos cosas.",
      "El formulario de contacto llega por correo, así que ningún mensaje se queda esperando a que alguien revise un panel.",
    ],
    decisiones: [
      {
        titulo: "Un despliegue, no dos",
        texto:
          "El sitio estático y el API comparten proyecto usando el binding de assets con `run_worker_first` en `/api/*`. Sin esa línea el fallback de SPA se traga las rutas del API y devuelve el index. A cambio de una configuración algo fina, no hay dos despliegues que mantener sincronizados ni CORS que resolver.",
      },
      {
        titulo: "Límite de uso nativo del borde, no en base de datos",
        texto:
          "El chat permite 15 mensajes por minuto por IP y el formulario 3 envíos. Se resuelve con el rate limiting nativo de Cloudflare, no con contadores en KV: sin costo de escrituras ni latencia extra. Un asistente de IA abierto a internet sin techo es una factura esperando a pasar.",
      },
      {
        titulo: "Un modelo barato, no el más grande",
        texto:
          "Responder qué servicios hay y cuánto cuestan no necesita el modelo más caro. gpt-4o-mini cubre el caso con holgura y mantiene el costo por conversación en un rango que un negocio pequeño puede sostener.",
      },
    ],
    stack: [
      { grupo: "Frontend", items: ["React 18", "Vite", "TypeScript", "CSS Modules"] },
      { grupo: "Backend", items: ["Hono", "Cloudflare Workers", "TypeScript"] },
      { grupo: "IA", items: ["OpenAI gpt-4o-mini"] },
      { grupo: "Infraestructura", items: ["Wrangler", "Rate limiting nativo", "Correo transaccional"] },
    ],
    resultado: "En producción en aiflowgt.com, atendiendo consultas sin intervención manual.",
  },

  {
    slug: "demcy-bot",
    nombre: "@demcybot",
    etiqueta: "Producto propio",
    resumen:
      "Bot de Telegram que asesora prospectos, responde dudas de precios y agenda reuniones solo. Montado en Cloudflare Workers.",
    chips: ["Cloudflare Workers", "Hono", "OpenAI", "KV"],
    categorias: ["Automatización & IA", "APIs & Backend"],
    mock: "chat",
    portada: "/media/proyectos/demcy-bot/portada.png",
    año: "2026",
    demo: "https://t.me/demcybot",
    repo: "",

    problema:
      "Los negocios pequeños pierden prospectos por responder tarde. La conversación de venta es casi siempre la misma —qué hacen, cuánto cuesta, cuándo podemos hablar— pero exige a alguien pendiente del teléfono todo el día.",
    solucion: [
      "Un **bot asesor con IA en Telegram** que sostiene esa conversación completa: entiende el problema de negocio del prospecto, responde dudas de precios con información real, y cuando detecta intención de compra **captura los datos de la reunión y avisa**.",
      "Está montado en **Cloudflare Workers**: no hay servidor que mantener, escala solo y responde desde el borde de la red. El historial de cada conversación vive en **Cloudflare KV**, así que el bot recuerda de qué venían hablando.",
      "La lógica no sabe qué es Telegram. Está escrita contra interfaces —canal, proveedor de IA, almacén, notificador— así que **sumar WhatsApp es escribir un adaptador**, no reescribir el bot.",
    ],
    decisiones: [
      {
        titulo: "El núcleo no sabe qué es Telegram",
        texto:
          "`AdvisorService` depende de puertos, no de servicios concretos. Telegram entra por una capa delgada que traduce el webhook. Eso permite probar la conversación entera sin red y agregar un canal nuevo sin tocar el cerebro del bot — que es exactamente lo que la inversión de dependencias promete y casi nunca se cumple.",
      },
      {
        titulo: "Responder 200 antes de terminar",
        texto:
          "Telegram espera respuesta en pocos segundos y reintenta si tardás; el modelo puede tomar entre 3 y 8. Sin cuidado, el prospecto recibe la misma respuesta tres veces. El Worker contesta 200 de inmediato y sigue trabajando con `waitUntil()`.",
      },
      {
        titulo: "Tool calling en vez de buscar palabras clave",
        texto:
          "Para saber cuándo agendar, el modelo tiene una herramienta `agendar_reunion` y decide él cuándo llamarla, extrayendo los datos de toda la conversación. Buscar «quiero una reunión» con expresiones regulares falla con «dale», «me interesa» o «cuándo podemos hablar»: el modelo entiende intención, una regex entiende letras.",
      },
      {
        titulo: "KV y no Durable Objects, con los ojos abiertos",
        texto:
          "KV es más simple, gratis en el plan básico y no hay nada que administrar. La contra es que es eventualmente consistente: tres mensajes en el mismo segundo podrían pisarse. A ritmo de conversación humana no pasa, y si algún día pasa, se cambia el almacén por uno con Durable Objects sin que el núcleo se entere.",
      },
      {
        titulo: "Secreto en el webhook",
        texto:
          "Sin él, cualquiera que adivine la URL puede mandarle mensajes falsos al bot y consumir el saldo de OpenAI. Telegram firma cada llamada en una cabecera y el Worker rechaza con 401 lo que no coincida.",
      },
    ],
    stack: [
      { grupo: "Runtime", items: ["Cloudflare Workers", "Wrangler"] },
      { grupo: "Backend", items: ["Hono", "TypeScript"] },
      { grupo: "IA", items: ["OpenAI con tool calling", "Prompt de sistema versionado"] },
      { grupo: "Datos", items: ["Cloudflare KV"] },
      { grupo: "Canales", items: ["Telegram Bot API", "WhatsApp vía YCloud (preparado)"] },
    ],
    resultado:
      "En producción atendiendo prospectos reales en @demcybot. Cero infraestructura que mantener y costo casi nulo cuando no hay tráfico.",
  },

  {
    slug: "detalles-jutiapa",
    nombre: "Detalles Jutiapa",
    etiqueta: "Cliente",
    resumen:
      "Plataforma completa para una floristería: catálogo público, panel de administración y bot de pedidos.",
    chips: ["React", "NestJS", "Prisma", "Supabase"],
    categorias: ["Aplicaciones Web", "APIs & Backend"],
    mock: "tienda",
    portada: "/media/proyectos/detalles-jutiapa/portada.jpg",
    año: "2025",
    demo: "https://floristeria-jutiapa.com",
    repo: "",

    problema:
      "Una floristería en Jutiapa vendía por WhatsApp y anotaba los pedidos a mano. No tenían catálogo en línea, y cada cambio de precio o de producto significaba volver a mandar fotos una por una a cada cliente.",
    solucion: [
      "Construí una plataforma completa con dos caras: una **landing pública** donde los clientes ven el catálogo actualizado, y un **panel de administración** donde la dueña sube productos, cambia precios y gestiona el inventario sin tocar código.",
      "Las imágenes de productos se suben directo a Supabase Storage desde el panel, así que agregar un arreglo floral nuevo toma menos de un minuto.",
      "Sumé además un **bot** que atiende los pedidos entrantes y los canaliza al mismo sistema, cerrando el círculo entre la conversación y el inventario.",
    ],
    decisiones: [
      {
        titulo: "Prisma sobre Supabase, no el cliente de Supabase",
        texto:
          "Usé Supabase como base de datos Postgres administrada, pero accedo con Prisma desde NestJS. Gano tipado real de extremo a extremo y migraciones versionadas, sin quedar amarrado al SDK de Supabase si algún día hay que mudar la base.",
      },
      {
        titulo: "Autenticación propia con JWT + bcrypt",
        texto:
          "El panel lo usa una sola persona. Montar un proveedor de identidad completo era desproporcionado; un JWT firmado y contraseñas con bcrypt cubren el caso real sin agregar una dependencia externa que mantener.",
      },
      {
        titulo: "Storage separado de la base de datos",
        texto:
          "Las imágenes viven en Supabase Storage, no como blobs en Postgres. La base se mantiene liviana y las fotos se sirven desde CDN, que es donde tiene que estar el peso de un catálogo visual.",
      },
    ],
    stack: [
      { grupo: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS", "Vite"] },
      { grupo: "Backend", items: ["NestJS", "Prisma ORM", "TypeScript"] },
      { grupo: "Datos", items: ["Supabase PostgreSQL", "Supabase Storage"] },
      { grupo: "Auth", items: ["JWT", "bcrypt"] },
    ],
    resultado:
      "La floristería tiene catálogo en línea y administra su inventario sola. Los pedidos entran por el bot y quedan registrados en el mismo sistema.",
  },

  {
    slug: "whisperflow",
    nombre: "WhisperFlow",
    etiqueta: "Herramienta propia",
    resumen:
      "Dictado por voz local y privado. Nada sale de la computadora: transcribe, quita muletillas y escribe donde estés.",
    chips: ["Python", "Whisper", "Tkinter", "Windows"],
    categorias: ["Herramientas", "Automatización & IA"],
    // Se queda con la maqueta dibujada: no lleva captura ni video.
    mock: "escritorio",
    año: "2025",
    demo: "",
    repo: "",
    /**
     * TODO(David): dejá el instalador en `public/descargas/` y poné acá su
     * ruta, por ejemplo "/descargas/WhisperFlow-1.0-win64.zip".
     * Mientras esté vacío, la ficha muestra el botón como "próximamente".
     */
    descarga: { href: "", etiqueta: "Descargar para Windows", peso: "" },

    problema:
      "Las herramientas de dictado buenas son de pago y mandan tu voz a un servidor ajeno. Quería la misma experiencia —mantener una tecla, hablar, ver el texto aparecer— sin cuota mensual y sin que mis palabras salieran de la máquina.",
    solucion: [
      "Un programa de escritorio que corre **Whisper localmente**: mantenés presionada una tecla, hablás, la soltás, y el texto aparece en la ventana que tengas enfrente — Word, WhatsApp Web, el navegador, lo que sea.",
      "Limpia **muletillas** automáticamente con una lista que el usuario edita, y ofrece dos modos de escritura (pegar o simular teclado) porque algunas aplicaciones bloquean uno de los dos.",
      "**Cien por ciento offline.** Ningún audio toca internet.",
    ],
    decisiones: [
      {
        titulo: "Local por encima de la nube",
        texto:
          "Whisper en la máquina cuesta unos segundos más que una API, pero elimina la cuota mensual y el problema de privacidad de raíz. Para dictado personal, ese intercambio es obviamente favorable.",
      },
      {
        titulo: "Dos modos de escritura, expuestos al usuario",
        texto:
          "Pegar con Ctrl+V es rápido pero falla en apps que filtran el portapapeles; simular teclado funciona casi siempre pero es lento. En vez de adivinar, lo dejé como opción visible con la explicación de cuándo usar cada uno.",
      },
      {
        titulo: "Configuración en ventana, no en archivo",
        texto:
          "Un archivo JSON habría sido más rápido de programar. Una ventana de configuración hace que la herramienta la pueda usar alguien que no programa — que es lo que la convierte en producto y no en script.",
      },
    ],
    stack: [
      { grupo: "Núcleo", items: ["Python", "OpenAI Whisper (local)"] },
      { grupo: "Interfaz", items: ["Tkinter", "Hotkeys globales"] },
      { grupo: "Sistema", items: ["Windows", "Portapapeles y teclado simulado"] },
    ],
    resultado: "Lo uso a diario. Reemplazó por completo la necesidad de una suscripción de dictado.",
  },

  {
    slug: "creador-de-contenido",
    nombre: "Creador de contenido",
    etiqueta: "Herramienta propia",
    resumen:
      "Pipeline que convierte un guion en video vertical animado: voz, imágenes, música y render. Sin editor de video.",
    chips: ["Remotion", "React", "Node", "TTS"],
    categorias: ["Herramientas", "Automatización & IA"],
    mock: "video",
    video: {
      bucle: "/media/proyectos/creador-de-contenido/preview.mp4",
      completo: "/media/proyectos/creador-de-contenido/messi-futbol.mp4",
      poster: "/media/proyectos/creador-de-contenido/poster.jpg",
    },
    año: "2026",
    demo: "",
    repo: "",

    problema:
      "Producir un video corto explicativo toma horas de edición manual, y la mayor parte de ese tiempo es trabajo mecánico: cortar la narración, sincronizar imágenes con lo que se dice, exportar.",
    solucion: [
      "Un **pipeline automatizado** que toma un guion de texto y devuelve un video vertical terminado: genera la narración con voz sintética, consigue las imágenes, arma la animación y renderiza.",
      "El video se define como **código con Remotion**, así que el estilo visual es un componente reutilizable: cambiar la identidad de todos los videos es editar un archivo, no rehacer cada pieza.",
    ],
    decisiones: [
      {
        titulo: "Video como código, no como línea de tiempo",
        texto:
          "Remotion permite versionar el video en Git, reutilizar componentes entre piezas y regenerar todo con un cambio de estilo. Una línea de tiempo en un editor tradicional no se puede automatizar ni versionar.",
      },
      {
        titulo: "Cada etapa es reemplazable",
        texto:
          "Voz, imágenes y música son pasos independientes. Si aparece un proveedor mejor de voz, se cambia esa etapa sin tocar el resto del pipeline.",
      },
    ],
    stack: [
      { grupo: "Render", items: ["Remotion", "React", "Node"] },
      { grupo: "Audio", items: ["Text-to-speech", "Generación de música"] },
      { grupo: "Imágenes", items: ["Generación por IA", "Búsqueda de fotos"] },
    ],
    resultado: "De guion a video terminado sin abrir un editor de video.",
  },
];

/** Categorías con su conteo real, calculadas de los proyectos de arriba. */
export const categorias: { nombre: Categoria; total: number }[] = (
  ["Aplicaciones Web", "APIs & Backend", "Automatización & IA", "Herramientas"] as Categoria[]
).map((nombre) => ({
  nombre,
  total: proyectos.filter((p) => p.categorias.includes(nombre)).length,
}));

export const getProyecto = (slug: string) => proyectos.find((p) => p.slug === slug);
