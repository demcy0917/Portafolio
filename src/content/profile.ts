/**
 * PERFIL — Fuente única de verdad de tus datos personales.
 * Editá SOLO este archivo para cambiar nombre, enlaces y textos del sitio.
 */

export const profile = {
  nombre: "David Melgar",
  marca: "demcy.ia",
  rol: "AI Systems Architect",
  ubicacion: "Guatemala",
  zonaHoraria: "GMT-6",
  disponibilidad: "Freelance",
  experiencia: "+3 años",

  email: "davidmelgar28115@gmail.com",

  /**
   * Encuadre de la foto de perfil (`public/media/perfil/fotoperfil.jpeg`).
   *
   * La foto actual es un plano general vertical, y la tarjeta la muestra en
   * horizontal (16:10). Estos valores recortan del gorro a las manos.
   *
   * zoom 1 = sin acercar. posicion = el punto que queda fijo al acercar.
   * Si la cambiás por un retrato: zoom 1 y posicion "50% 35%".
   *
   * `duotono` tiñe la foto de teal. Está en 0: la foto se ve con su color real.
   * Subilo hasta 0.6 si algún día ponés una que choque con la paleta.
   */
  foto: {
    src: "/media/perfil/fotoperfil.jpeg",
    zoom: 1.2,
    posicion: "50% 70%",
    duotono: 0,
  },

  cv: "/cv.pdf",

  /** Enlaces sociales. Dejá "" y el ícono desaparece del sitio. */
  links: {
    github: "https://github.com/demcy0917",
    linkedin: "https://www.linkedin.com/in/david-melgar-833974337",
    instagram: "https://www.instagram.com/demcy.ia",
    x: "",
    telegram: "",
  },

  // ── HERO / INICIO ─────────────────────────────────────────────────────────
  hero: {
    titulo: ["Construyo", "soluciones"],
    tituloAcento: "digitales.",
    subtitulo: "Desarrollo, automatización y\ntecnología para un futuro mejor.",
    cta: "Ver mis proyectos",
    pilares: [
      { icono: "code", titulo: "Desarrollo", sub: "Web & Apps" },
      { icono: "layers", titulo: "Automatización", sub: "y DevOps" },
      { icono: "cloud", titulo: "Tecnología", sub: "en la nube" },
    ],
    scrollHint: "Desliza para descubrir más",
    // Pista que aparece sobre la silla en la escena 3D.
    hint3d: "Clic en la silla para sentarte",
    hintSalir: "Clic afuera o Esc para salir",
  },

  // ── SOBRE MÍ ──────────────────────────────────────────────────────────────
  about: {
    saludo: "Hola, soy",
    parrafo:
      "Me apasiona construir soluciones digitales que combinan diseño elegante con código limpio y eficiente. Disfruto convertir ideas complejas en experiencias simples, útiles e impactantes.",
    parrafoExtra:
      "Trabajo de punta a punta — diseño la interfaz, escribo el API, defino el esquema de la base de datos y hago el deploy. Eso significa que entiendo el costo real de cada decisión, porque me toca vivir con todas.",
    cta: "Trabajemos juntos",
    enfoque: [
      {
        icono: "brain",
        titulo: "Pensamiento lógico",
        texto: "Me enfoco en entender los problemas a fondo para crear soluciones efectivas.",
      },
      {
        icono: "target",
        titulo: "Atención al detalle",
        texto: "Cuido cada línea de código y cada interacción de usuario.",
      },
      {
        icono: "code",
        titulo: "Aprendizaje constante",
        texto: "Siempre estoy explorando nuevas tecnologías y mejores prácticas.",
      },
    ],
    /**
     * Métricas verificables contra tu trabajo real.
     * TODO(David): subí los números cuando tengas más proyectos publicados.
     */
    stats: [
      { icono: "code", valor: "4", sufijo: "", label: "Productos\nen producción" },
      { icono: "calendar", valor: "3", sufijo: "+", label: "Años\nconstruyendo" },
      { icono: "layers", valor: "20", sufijo: "+", label: "Tecnologías\nen el stack" },
      { icono: "coffee", valor: "∞", sufijo: "", label: "Tazas de café\ny contando" },
    ],
  },

  // ── HABILIDADES ───────────────────────────────────────────────────────────
  habilidades: {
    titulo: ["Las herramientas", "que uso para crear"],
    tituloAcento: "soluciones reales.",
    descripcion:
      "Tecnologías, herramientas y automatizaciones que me permiten diseñar, desarrollar y escalar proyectos modernos y eficientes.",
  },

  // ── CONTACTO ──────────────────────────────────────────────────────────────
  contacto: {
    titulo: "Conectemos,",
    tituloAcento: "trabajemos juntos.",
    descripcion:
      "Si tienes un proyecto, una oportunidad o simplemente quieres saludar, estaré encantado de leerte.",
    nota: "Abierto a posiciones remotas y presenciales en Guatemala.",
    formTitulo: "Envíame un mensaje",
    /**
     * Canales de contacto. `valor: ""` oculta la tarjeta entera.
     * `id` decide el ícono (ver IconoCanal en Contacto.tsx).
     */
    canales: [
      {
        id: "gmail",
        etiqueta: "Gmail",
        valor: "davidmelgar28115@gmail.com",
        href: "mailto:davidmelgar28115@gmail.com",
      },
      {
        id: "whatsapp",
        etiqueta: "WhatsApp",
        valor: "+502 5874-4495",
        href: "https://wa.me/qr/HZL6O343HCWNN1",
      },
      {
        id: "whatsapp-demcy",
        etiqueta: "WhatsApp · demcy.ia",
        valor: "Escribile al negocio",
        href: "https://wa.me/message/F5XFOQ32KCI7O1",
      },
      {
        id: "github",
        etiqueta: "GitHub",
        valor: "@demcy0917",
        href: "https://github.com/demcy0917",
      },
      {
        id: "linkedin",
        etiqueta: "LinkedIn",
        valor: "David Melgar",
        href: "https://www.linkedin.com/in/david-melgar-833974337",
      },
      {
        id: "telefono",
        etiqueta: "Teléfono",
        valor: "+502 5874-4495",
        href: "tel:+50258744495",
      },
      {
        id: "instagram",
        etiqueta: "Instagram",
        valor: "@demcy.ia",
        href: "https://www.instagram.com/demcy.ia",
      },
    ],
  },

  footer: {
    lema: "Code. Build. Repeat.",
  },
} as const;

export type Perfil = typeof profile;
