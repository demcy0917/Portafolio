/**
 * Capturas de la página para revisión visual durante el desarrollo.
 *
 *   node scripts/shot.mjs <carpeta-destino> [url]
 *
 * Usa el Chrome instalado en el sistema en modo headless. Hace falta porque el
 * hero es una escena WebGL: sin un navegador que componga cuadros no hay forma
 * de ver si la geometría quedó donde debía.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const destino = process.argv[2] ?? "./capturas";
const base = process.argv[3] ?? "http://localhost:5173";
mkdirSync(destino, { recursive: true });

const navegador = await chromium.launch({
  channel: "chrome",
  args: [
    // Chrome headless usa SwiftShader para WebGL; hay que dejarlo explícito
    // para que no caiga en el fallback por software sin GPU.
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
  ],
});

const pagina = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const errores = [];
pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
pagina.on("pageerror", (e) => errores.push("PAGEERROR " + e.message));

await pagina.goto(base, { waitUntil: "networkidle" });
// La escena 3D tarda en montar y las animaciones de entrada en asentarse
await pagina.waitForTimeout(4500);

const tomar = async (nombre, opciones = {}) => {
  // `animations: disabled` evita que las animaciones infinitas (el anillo de
  // la silla, el marquee) hagan que la captura nunca se estabilice.
  await pagina.screenshot({
    path: join(destino, `${nombre}.png`),
    animations: "disabled",
    caret: "hide",
    timeout: 60000,
    ...opciones,
  });
  console.log("→", nombre);
};

await tomar("01-hero");

// POV: clic en el botón que entra al setup
const entrar = pagina.getByRole("button", { name: /entrar al setup/i });
if (await entrar.count()) {
  await entrar.first().click();
  await pagina.waitForTimeout(2600);
  await tomar("02-pov");
  await pagina.keyboard.press("Escape");
  await pagina.waitForTimeout(1400);
}

const irA = async (id, desplazar = 0) => {
  await pagina.evaluate(
    ([sel, dy]) => {
      document.getElementById(sel)?.scrollIntoView({ behavior: "instant", block: "start" });
      if (dy) window.scrollBy(0, dy);
    },
    [id, desplazar],
  );
  await pagina.waitForTimeout(1300);
};

for (const [nombre, id] of [
  ["03-sobre-mi", "sobre-mi"],
  ["04-proyectos", "proyectos"],
  ["05-habilidades", "habilidades"],
  ["06-contacto", "contacto"],
]) {
  await irA(id);
  await tomar(nombre);
}

// La mitad de abajo de cada sección larga
await irA("proyectos", 780);
await tomar("04b-proyectos-abajo");
await irA("habilidades", 820);
await tomar("05b-habilidades-abajo");
await irA("contacto", 420);
await tomar("06b-contacto-abajo");

// Ficha de proyecto abierta
await pagina.evaluate(() =>
  document.getElementById("proyectos")?.scrollIntoView({ behavior: "instant", block: "start" }),
);
await pagina.waitForTimeout(600);
// Dos fichas: una con captura y otra con video. Se buscan por nombre de
// proyecto para que no se rompa al reordenar la lista.
for (const [proyecto, nombre] of [
  ["AiFlow", "07-ficha"],
  ["Creador de contenido", "07b-ficha-video"],
]) {
  const card = pagina.locator("li", { hasText: proyecto });
  const boton = card.getByRole("button", { name: /^ver proyecto$/i }).first();
  if (!(await boton.count())) continue;
  await boton.click();
  await pagina.waitForTimeout(1500);
  await tomar(nombre);
  await pagina.keyboard.press("Escape");
  await pagina.waitForTimeout(700);
}

// Móvil
await pagina.setViewportSize({ width: 390, height: 844 });
await pagina.goto(base, { waitUntil: "networkidle" });
await pagina.waitForTimeout(4000);
await tomar("08-movil-hero");
await pagina.evaluate(() =>
  document.getElementById("proyectos")?.scrollIntoView({ behavior: "instant", block: "start" }),
);
await pagina.waitForTimeout(1200);
await tomar("09-movil-proyectos");

console.log(errores.length ? "ERRORES DE CONSOLA:\n" + errores.join("\n") : "sin errores de consola");
await navegador.close();
