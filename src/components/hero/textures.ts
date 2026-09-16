import * as THREE from "three";

/**
 * Texturas del cuarto 3D, dibujadas con Canvas 2D en tiempo de carga.
 *
 * No hay ni un solo archivo de imagen: todo se genera acá. Eso mantiene el
 * proyecto sin assets pesados y permite cambiar el código de los monitores
 * editando strings.
 *
 * Cada textura se memoriza: la escena monta y desmonta, pero el canvas se
 * dibuja una sola vez por sesión.
 */

const cache = new Map<string, THREE.CanvasTexture>();

function crear(clave: string, w: number, h: number, pintar: (ctx: CanvasRenderingContext2D) => void) {
  const guardada = cache.get(clave);
  if (guardada) return guardada;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  pintar(ctx);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  cache.set(clave, tex);
  return tex;
}

/** Libera todas las texturas. Se llama al desmontar la escena. */
export function limpiarTexturas() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}

// ── Paleta del "editor" ──────────────────────────────────────────────────────
const SINTAXIS = {
  fondo: "#0A1420",
  fondoBarra: "#0D1B29",
  numero: "#2E4A5C",
  texto: "#C8D6DF",
  clave: "#C792EA", // export, const, await
  tipo: "#7CD9F5",
  cadena: "#B8E986",
  funcion: "#82D8FF",
  comentario: "#3F5F70",
  simbolo: "#7FA3B5",
};

const CODIGO = [
  "// demcy-bot · núcleo agnóstico del canal",
  "import { Hono } from 'hono'",
  "import { asesor } from './agente'",
  "",
  "type Mensaje = {",
  "  canal: 'telegram' | 'whatsapp'",
  "  texto: string",
  "  autor: string",
  "}",
  "",
  "const app = new Hono<{ Bindings: Env }>()",
  "",
  "app.post('/webhook/:canal', async (c) => {",
  "  const adaptador = adaptadores[c.req.param('canal')]",
  "  const mensaje = adaptador.traducir(await c.req.json())",
  "",
  "  const respuesta = await asesor.responder(mensaje, {",
  "    precios: c.env.PRECIOS,",
  "    tono: c.env.TONO,",
  "  })",
  "",
  "  if (respuesta.intencion === 'agendar') {",
  "    await agenda.reservar(respuesta.slot)",
  "    await notificar(c.env, respuesta)",
  "  }",
  "",
  "  return adaptador.responder(c, respuesta)",
  "})",
  "",
  "export default app",
];

const CODIGO_B = [
  "// detalles-jutiapa · catálogo",
  "@Injectable()",
  "export class ProductosService {",
  "  constructor(private prisma: PrismaService) {}",
  "",
  "  async listar(filtro: FiltroDto) {",
  "    return this.prisma.producto.findMany({",
  "      where: {",
  "        activo: true,",
  "        categoria: filtro.categoria,",
  "      },",
  "      include: { imagenes: true },",
  "      orderBy: { destacado: 'desc' },",
  "    })",
  "  }",
  "",
  "  async publicar(dto: CrearProductoDto) {",
  "    const url = await this.storage.subir(dto.foto)",
  "    return this.prisma.producto.create({",
  "      data: { ...dto, portada: url },",
  "    })",
  "  }",
  "}",
];

const PALABRAS_CLAVE =
  /\b(import|export|from|const|let|await|async|return|type|class|new|default|if|extends|implements|private|constructor|function|interface)\b/g;
const TIPOS = /\b(Hono|Env|Mensaje|Injectable|ProductosService|PrismaService|FiltroDto|CrearProductoDto|string|true|desc)\b/g;

function pintarLinea(ctx: CanvasRenderingContext2D, linea: string, x: number, y: number) {
  // Comentario completo
  if (linea.trimStart().startsWith("//")) {
    ctx.fillStyle = SINTAXIS.comentario;
    ctx.fillText(linea, x, y);
    return;
  }

  // Se tokeniza por tramos coloreados y se dibuja carácter a carácter con el
  // color que corresponde. Es más simple que un parser y basta para decorar.
  const colores = new Array<string>(linea.length).fill(SINTAXIS.texto);

  const marcar = (re: RegExp, color: string) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(linea))) {
      for (let i = m.index; i < m.index + m[0].length; i++) colores[i] = color;
    }
  };

  marcar(/[{}()[\].,:;=<>|&?]/g, SINTAXIS.simbolo);
  marcar(PALABRAS_CLAVE, SINTAXIS.clave);
  marcar(TIPOS, SINTAXIS.tipo);
  marcar(/'[^']*'/g, SINTAXIS.cadena);
  marcar(/\b[a-zA-Z_$][\w$]*(?=\()/g, SINTAXIS.funcion);
  marcar(/\/\/.*$/g, SINTAXIS.comentario);

  let cursor = x;
  let i = 0;
  while (i < linea.length) {
    const color = colores[i];
    let j = i;
    while (j < linea.length && colores[j] === color) j++;
    const tramo = linea.slice(i, j);
    ctx.fillStyle = color;
    ctx.fillText(tramo, cursor, y);
    cursor += ctx.measureText(tramo).width;
    i = j;
  }
}

function barraVentana(ctx: CanvasRenderingContext2D, w: number, titulo: string) {
  ctx.fillStyle = SINTAXIS.fondoBarra;
  ctx.fillRect(0, 0, w, 34);
  const puntos = ["#E06C75", "#E5C07B", "#4FC98A"];
  puntos.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(22 + i * 20, 17, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  ctx.fillStyle = "#4E6B7D";
  ctx.font = "500 15px ui-monospace, Consolas, monospace";
  ctx.fillText(titulo, 96, 22);
}

/** Monitor con editor de código. */
export function texturaEditor(variante: "a" | "b") {
  return crear(`editor-${variante}`, 1024, 640, (ctx) => {
    const lineas = variante === "a" ? CODIGO : CODIGO_B;

    ctx.fillStyle = SINTAXIS.fondo;
    ctx.fillRect(0, 0, 1024, 640);
    barraVentana(ctx, 1024, variante === "a" ? "src/index.ts — demcy-bot" : "productos.service.ts");

    // Barra lateral tipo explorador
    ctx.fillStyle = "#08111B";
    ctx.fillRect(0, 34, 62, 606);
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i === 2 ? "#2FE4E4" : "#1B2E3D";
      ctx.fillRect(16, 60 + i * 30, 30, 5);
    }

    ctx.font = "400 16px ui-monospace, Consolas, 'Courier New', monospace";
    ctx.textBaseline = "middle";

    const alto = 21;
    lineas.forEach((linea, i) => {
      const y = 56 + i * alto;
      if (y > 620) return;
      ctx.fillStyle = SINTAXIS.numero;
      ctx.fillText(String(i + 1).padStart(2, " "), 74, y);
      pintarLinea(ctx, linea, 112, y);
    });

    // Resplandor de la pantalla hacia los bordes
    const halo = ctx.createRadialGradient(512, 320, 120, 512, 320, 700);
    halo.addColorStop(0, "rgba(47,228,228,0.05)");
    halo.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 1024, 640);
  });
}

/** Monitor con terminal y un deploy corriendo. */
export function texturaTerminal() {
  return crear("terminal", 1024, 640, (ctx) => {
    ctx.fillStyle = "#060E15";
    ctx.fillRect(0, 0, 1024, 640);
    barraVentana(ctx, 1024, "wrangler — deploy");

    const lineas: [string, string][] = [
      ["#2FE4E4", "➜  demcy.ia  npm run deploy"],
      ["#4E6B7D", ""],
      ["#C8D6DF", "vite v8.2.2 building for production..."],
      ["#4FC98A", "✓ 412 modules transformed."],
      ["#C8D6DF", "dist/index.html                 1.84 kB"],
      ["#C8D6DF", "dist/assets/index-4f21c.css    22.61 kB"],
      ["#C8D6DF", "dist/assets/three-9ab30.js    612.40 kB"],
      ["#4FC98A", "✓ built in 4.19s"],
      ["#4E6B7D", ""],
      ["#2FE4E4", "➜  wrangler pages deploy dist"],
      ["#C8D6DF", "Uploading... (18/18 archivos)"],
      ["#4FC98A", "✨ Deployment complete!"],
      ["#7CD9F5", "   https://demcy-ia.pages.dev"],
      ["#4E6B7D", ""],
      ["#2FE4E4", "➜  _"],
    ];

    ctx.font = "400 17px ui-monospace, Consolas, 'Courier New', monospace";
    ctx.textBaseline = "middle";
    lineas.forEach(([color, texto], i) => {
      ctx.fillStyle = color;
      ctx.fillText(texto, 40, 70 + i * 27);
    });

    const halo = ctx.createRadialGradient(512, 320, 100, 512, 320, 680);
    halo.addColorStop(0, "rgba(47,228,228,0.04)");
    halo.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 1024, 640);
  });
}

/** Monitor con un tablero de análisis de datos. */
export function texturaPanel() {
  return crear("panel", 1024, 640, (ctx) => {
    const TEAL = "#2FE4E4";
    const VERDE = "#4FC98A";
    const AMBAR = "#E5A34B";

    /** Tarjeta base del tablero. */
    const tarjeta = (x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = "#0A1822";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(47,228,228,0.14)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const rotulo = (texto: string, x: number, y: number, color = "#4E6B7D", tam = 12) => {
      ctx.fillStyle = color;
      ctx.font = `600 ${tam}px ui-monospace, Consolas, monospace`;
      ctx.fillText(texto, x, y);
    };

    ctx.fillStyle = "#07121A";
    ctx.fillRect(0, 0, 1024, 640);
    barraVentana(ctx, 1024, "analítica · últimos 30 días");

    // ── Fila de indicadores, cada uno con su variación y su miniserie ──
    const kpis: [string, string, string, string, number][] = [
      ["CONVERSACIONES", "1,284", "+12.4%", VERDE, 0.9],
      ["CONVERSIÓN", "7.6%", "+2.1 pp", VERDE, 1.7],
      ["LATENCIA p95", "184 ms", "-38 ms", TEAL, 2.4],
      ["COSTO / CONV.", "$0.011", "-6.2%", VERDE, 3.1],
    ];

    kpis.forEach(([label, valor, delta, colorDelta, semilla], i) => {
      const x = 40 + i * 240;
      tarjeta(x, 62, 224, 106);

      rotulo(label, x + 16, 86, "#4E6B7D", 11);
      ctx.fillStyle = "#E8F2F4";
      ctx.font = "700 30px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(valor, x + 16, 122);

      // Chip de variación
      ctx.font = "600 11px ui-monospace, Consolas, monospace";
      const anchoChip = ctx.measureText(delta).width + 16;
      ctx.fillStyle = colorDelta + "22";
      ctx.beginPath();
      ctx.roundRect(x + 16, 134, anchoChip, 20, 6);
      ctx.fill();
      ctx.fillStyle = colorDelta;
      ctx.fillText(delta, x + 24, 148);

      // Miniserie
      ctx.beginPath();
      for (let k = 0; k <= 18; k++) {
        const t = k / 18;
        const v = 0.5 + 0.42 * Math.sin(t * 7 + semilla) * Math.cos(t * 3.3 + semilla);
        const px = x + 118 + t * 88;
        const py = 148 - v * 34;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.strokeStyle = colorDelta + "99";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // ── Serie temporal con dos líneas y su rejilla ──
    tarjeta(40, 184, 616, 224);
    rotulo("VOLUMEN POR DÍA", 60, 210);
    rotulo("● entrantes   ● agendadas", 60, 230, "#3A5464", 11);

    const gx = 74;
    const gy = 244;
    const gw = 556;
    const gh = 130;

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let k = 0; k <= 4; k++) {
      const y = gy + (gh / 4) * k;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx + gw, y);
      ctx.stroke();
      rotulo(String(120 - k * 30), 44, y + 4, "#2E4553", 10);
    }

    const serie = (fase: number, amplitud: number, base: number, color: string, relleno: boolean) => {
      const puntos: [number, number][] = [];
      for (let k = 0; k <= 30; k++) {
        const t = k / 30;
        const v = base + amplitud * (Math.sin(t * 6.2 + fase) * 0.5 + Math.sin(t * 2.1) * 0.35) + t * 0.18;
        puntos.push([gx + t * gw, gy + gh - Math.min(0.98, Math.max(0.04, v)) * gh]);
      }

      if (relleno) {
        ctx.beginPath();
        ctx.moveTo(puntos[0][0], gy + gh);
        puntos.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(puntos[puntos.length - 1][0], gy + gh);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, gy, 0, gy + gh);
        g.addColorStop(0, "rgba(47,228,228,0.34)");
        g.addColorStop(1, "rgba(47,228,228,0.02)");
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.beginPath();
      puntos.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = relleno ? 2.6 : 2;
      ctx.stroke();
    };

    serie(0, 0.42, 0.44, TEAL, true);
    serie(1.6, 0.2, 0.2, VERDE, false);

    ["L", "M", "M", "J", "V", "S", "D"].forEach((d, k) => {
      rotulo(d, gx + 26 + k * (gw / 7), gy + gh + 20, "#2E4553", 11);
    });

    // ── Distribución por canal, en anillo ──
    tarjeta(672, 184, 312, 224);
    rotulo("POR CANAL", 692, 210);

    const cx = 780;
    const cy = 310;
    const segmentos: [number, string][] = [
      [0.58, TEAL],
      [0.27, VERDE],
      [0.15, AMBAR],
    ];
    let angulo = -Math.PI / 2;
    segmentos.forEach(([parte, color]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 56, angulo, angulo + parte * Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 18;
      ctx.stroke();
      angulo += parte * Math.PI * 2;
    });
    ctx.fillStyle = "#E8F2F4";
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("58%", cx, cy + 8);
    ctx.textAlign = "left";

    [
      ["Telegram", TEAL],
      ["Web", VERDE],
      ["Otros", AMBAR],
    ].forEach(([texto, color], k) => {
      const y = 268 + k * 30;
      ctx.fillStyle = color as string;
      ctx.beginPath();
      ctx.roundRect(858, y - 8, 10, 10, 3);
      ctx.fill();
      rotulo(texto as string, 876, y, "#7E97A6", 12);
    });

    // ── Consultas más frecuentes, en barras ──
    tarjeta(40, 424, 616, 176);
    rotulo("CONSULTAS MÁS FRECUENTES", 60, 450);

    const filas: [string, number][] = [
      ["precios", 1],
      ["tiempos de entrega", 0.72],
      ["integraciones", 0.51],
      ["soporte", 0.34],
    ];
    filas.forEach(([texto, parte], k) => {
      const y = 470 + k * 30;
      rotulo(texto, 60, y + 13, "#7E97A6", 12);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.roundRect(230, y, 396, 16, 8);
      ctx.fill();
      ctx.fillStyle = k === 0 ? TEAL : "#1B3B47";
      ctx.beginPath();
      ctx.roundRect(230, y, 396 * parte, 16, 8);
      ctx.fill();
      rotulo(`${Math.round(parte * 412)}`, 638, y + 13, "#3A5464", 11);
    });

    // ── Consulta que alimenta el tablero ──
    tarjeta(672, 424, 312, 176);
    rotulo("CONSULTA", 692, 450);
    const sql = [
      ["select", " canal,"],
      ["", "  count(*) as total,"],
      ["", "  avg(latencia_ms)"],
      ["from", " conversaciones"],
      ["where", " creado > now() - '30d'"],
      ["group by", " canal"],
    ];
    sql.forEach(([clave, resto], k) => {
      const y = 476 + k * 20;
      ctx.font = "600 12px ui-monospace, Consolas, monospace";
      ctx.fillStyle = "#C792EA";
      ctx.fillText(clave, 692, y);
      ctx.fillStyle = "#8FA5AC";
      ctx.fillText(resto, 692 + ctx.measureText(clave).width, y);
    });

    const halo = ctx.createRadialGradient(512, 320, 160, 512, 320, 700);
    halo.addColorStop(0, "rgba(0,0,0,0)");
    halo.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 1024, 640);
  });
}

/**
 * Mancha de luz circular, para el reflejo del mouse sobre la alfombrilla.
 * Un `circleGeometry` a secas deja un borde duro; esto se desvanece.
 */
export function texturaHalo() {
  return crear("halo", 128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.42)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

/** Ciudad de noche vista por la ventana. */
export function texturaCiudad() {
  return crear("ciudad", 1024, 1024, (ctx) => {
    const cielo = ctx.createLinearGradient(0, 0, 0, 1024);
    cielo.addColorStop(0, "#050A14");
    cielo.addColorStop(0.5, "#0A1526");
    cielo.addColorStop(0.82, "#16283F");
    cielo.addColorStop(1, "#22354C");
    ctx.fillStyle = cielo;
    ctx.fillRect(0, 0, 1024, 1024);

    // Estrellas
    for (let i = 0; i < 120; i++) {
      const x = (i * 137.7) % 1024;
      const y = (i * 71.3) % 420;
      ctx.fillStyle = `rgba(200,225,255,${0.12 + ((i * 37) % 40) / 160})`;
      ctx.fillRect(x, y, 1.6, 1.6);
    }

    // Resplandor urbano en el horizonte
    const glow = ctx.createRadialGradient(512, 980, 40, 512, 980, 620);
    glow.addColorStop(0, "rgba(255,168,92,0.30)");
    glow.addColorStop(1, "rgba(255,168,92,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 500, 1024, 524);

    // Edificios en tres capas de profundidad
    const capas = [
      { y0: 620, alto: 260, color: "#0A1622", luces: 0.1, ancho: 120 },
      { y0: 700, alto: 300, color: "#0C1D2C", luces: 0.18, ancho: 96 },
      { y0: 790, alto: 320, color: "#101F2E", luces: 0.3, ancho: 74 },
    ];

    capas.forEach((capa, ci) => {
      let x = -40;
      let semilla = ci * 7 + 3;
      while (x < 1064) {
        semilla = (semilla * 9301 + 49297) % 233280;
        const r = semilla / 233280;
        const w = capa.ancho * (0.55 + r * 0.8);
        const h = capa.alto * (0.4 + r * 0.85);
        const y = capa.y0 - h + 120;

        ctx.fillStyle = capa.color;
        ctx.fillRect(x, y, w, 1024 - y);

        // Ventanas encendidas
        const cols = Math.max(2, Math.floor(w / 16));
        const filas = Math.max(3, Math.floor(h / 20));
        for (let cx = 0; cx < cols; cx++) {
          for (let cy = 0; cy < filas; cy++) {
            const rr = ((cx * 31 + cy * 17 + ci * 11 + Math.floor(x)) % 100) / 100;
            if (rr > 1 - capa.luces) {
              const calido = rr > 0.97;
              ctx.fillStyle = calido ? "rgba(120,220,235,0.9)" : "rgba(255,196,120,0.78)";
              ctx.fillRect(x + 7 + cx * 16, y + 10 + cy * 20, 6, 9);
            }
          }
        }

        // Antena ocasional
        if (r > 0.72) {
          ctx.fillStyle = capa.color;
          ctx.fillRect(x + w / 2 - 2, y - 44, 4, 44);
          ctx.fillStyle = "rgba(255,90,90,0.95)";
          ctx.beginPath();
          ctx.arc(x + w / 2, y - 46, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        x += w + 8 + r * 22;
      }
    });

    // Neblina
    const neblina = ctx.createLinearGradient(0, 640, 0, 1024);
    neblina.addColorStop(0, "rgba(20,40,60,0)");
    neblina.addColorStop(1, "rgba(30,58,80,0.5)");
    ctx.fillStyle = neblina;
    ctx.fillRect(0, 640, 1024, 384);
  });
}

/** Cuadro de pared: Code. Build. Deploy. Repeat. */
export function texturaPoster() {
  return crear("poster", 512, 640, (ctx) => {
    ctx.fillStyle = "#070D11";
    ctx.fillRect(0, 0, 512, 640);
    ctx.font = "600 66px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#F2F8FA";
    ctx.textBaseline = "alphabetic";
    ["Code.", "Build.", "Deploy.", "Repeat."].forEach((t, i) => {
      ctx.fillText(t, 44, 168 + i * 82);
    });
    ctx.fillStyle = "#2FE4E4";
    ctx.fillRect(44, 512, 96, 7);
  });
}

/** Piso de madera. */
export function texturaMadera(oscura = false) {
  return crear(`madera-${oscura}`, 512, 512, (ctx) => {
    const base = oscura ? "#241812" : "#3A281C";
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);

    for (let fila = 0; fila < 8; fila++) {
      const y = fila * 64;
      const desfase = (fila % 2) * 90;
      for (let tabla = -1; tabla < 4; tabla++) {
        const x = desfase + tabla * 170;
        const tono = 0.82 + (((fila * 7 + tabla * 13) % 10) / 10) * 0.36;
        ctx.fillStyle = oscura
          ? `rgb(${Math.round(36 * tono)},${Math.round(24 * tono)},${Math.round(18 * tono)})`
          : `rgb(${Math.round(58 * tono)},${Math.round(40 * tono)},${Math.round(28 * tono)})`;
        ctx.fillRect(x, y, 168, 62);

        // Veta
        ctx.strokeStyle = "rgba(0,0,0,0.16)";
        ctx.lineWidth = 1;
        for (let v = 0; v < 4; v++) {
          ctx.beginPath();
          const vy = y + 10 + v * 14;
          ctx.moveTo(x + 4, vy);
          ctx.bezierCurveTo(x + 50, vy + 3, x + 110, vy - 3, x + 164, vy + 1);
          ctx.stroke();
        }
      }
    }

    // Juntas
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 2;
    for (let fila = 0; fila <= 8; fila++) {
      ctx.beginPath();
      ctx.moveTo(0, fila * 64);
      ctx.lineTo(512, fila * 64);
      ctx.stroke();
    }
  });
}

/** Alfombra bajo el escritorio. */
export function texturaAlfombra() {
  return crear("alfombra", 256, 256, (ctx) => {
    ctx.fillStyle = "#11161A";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5200; i++) {
      const x = (i * 61.7) % 256;
      const y = (i * 29.3) % 256;
      const v = ((i * 17) % 26) / 100;
      ctx.fillStyle = `rgba(${Math.round(40 + v * 90)},${Math.round(48 + v * 90)},${Math.round(54 + v * 92)},0.35)`;
      ctx.fillRect(x, y, 2, 2);
    }
  });
}

/** Lomos de libros para los estantes. */
export function texturaLibros() {
  return crear("libros", 512, 128, (ctx) => {
    const tonos = ["#1E2A33", "#2A2118", "#152029", "#241A22", "#1A2620", "#28221A"];
    let x = 0;
    let i = 0;
    while (x < 512) {
      const w = 16 + ((i * 23) % 22);
      ctx.fillStyle = tonos[i % tonos.length];
      ctx.fillRect(x, 0, w - 2, 128);
      ctx.fillStyle = "rgba(255,190,120,0.16)";
      ctx.fillRect(x + 3, 26, w - 8, 4);
      ctx.fillRect(x + 3, 96, w - 8, 3);
      x += w;
      i++;
    }
  });
}
