import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    // Three.js y compañía pesan ~1 MB y viven en su propio chunk gracias al
    // `lazy(() => import("./Scene"))` del hero. No se define `manualChunks`
    // a propósito: forzar un chunk con nombre lo vuelve dependencia estática
    // del entry y el navegador lo precargaría antes de pintar el texto.
    chunkSizeWarningLimit: 1100,
  },
});
