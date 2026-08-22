/**
 * Regenera `src/lib/brandIcons.ts` desde simple-icons.
 *
 *   npm i -D simple-icons && node scripts/gen-icons.mjs && npm un simple-icons
 *
 * Se hace así —y no importando el paquete en runtime— porque simple-icons pesa
 * 5 MB: acá extraemos solo los trazos que el sitio realmente dibuja.
 *
 * Para agregar un logo nuevo: buscá su clave en https://simpleicons.org
 * (el slug en camelCase con prefijo `si`) y sumalo al mapa de abajo.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const si = require("simple-icons");
const version = JSON.parse(readFileSync("node_modules/simple-icons/package.json", "utf8")).version;

/** clave que usa el sitio → export de simple-icons */
const MAPA = {
  react: "siReact",
  nextjs: "siNextdotjs",
  typescript: "siTypescript",
  javascript: "siJavascript",
  python: "siPython",
  nestjs: "siNestjs",
  nodejs: "siNodedotjs",
  hono: "siHono",
  postgresql: "siPostgresql",
  supabase: "siSupabase",
  prisma: "siPrisma",
  cloudflare: "siCloudflare",
  workers: "siCloudflareworkers",
  railway: "siRailway",
  vercel: "siVercel",
  docker: "siDocker",
  git: "siGit",
  github: "siGithub",
  postman: "siPostman",
  n8n: "siN8n",
  tailwind: "siTailwindcss",
  vite: "siVite",
  framer: "siFramer",
  claude: "siClaude",
  whatsapp: "siWhatsapp",
  instagram: "siInstagram",
  telegram: "siTelegram",
  x: "siX",
  gmail: "siGmail",
  threejs: "siThreedotjs",
  jwt: "siJsonwebtokens",
};

// Ojo: AWS, OpenAI/Codex, VS Code y LinkedIn no están en simple-icons por
// restricciones de marca. Se dibujan a mano en src/components/ui/TechIcon.tsx.

const salida = {};
for (const [clave, exportado] of Object.entries(MAPA)) {
  const icono = si[exportado];
  if (!icono) {
    console.error(`  falta: ${clave} (${exportado})`);
    continue;
  }
  salida[clave] = { t: icono.title, h: `#${icono.hex}`, p: icono.path };
}

const cabecera = `/**
 * Trazos SVG de logos de marca, extraídos de simple-icons v${version}.
 *
 * Se generan una sola vez y viven acá para que el bundle no cargue el paquete
 * completo (5 MB) ni dependa de un CDN externo.
 *
 * Para agregar un logo: instalá simple-icons, corré el script de scripts/gen-icons.mjs
 * y pegá la clave nueva. Licencia CC0 1.0 Universal.
 */
`;

writeFileSync(
  "src/lib/brandIcons.ts",
  `${cabecera}export const brandIcons: Record<string, { t: string; h: string; p: string }> = ${JSON.stringify(
    salida,
    null,
    2,
  )};\n`,
);

console.log(`generado con ${Object.keys(salida).length} iconos`);
