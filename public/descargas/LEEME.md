# Descargas

Acá van los archivos que la gente puede bajar del sitio.

## WhisperFlow

1. Dejá el instalador o el zip en esta carpeta, por ejemplo
   `WhisperFlow-1.0-win64.zip`.
2. Abrí `src/content/projects.ts`, buscá el proyecto `whisperflow` y completá:

```ts
descarga: {
  href: "/descargas/WhisperFlow-1.0-win64.zip",
  etiqueta: "Descargar para Windows",
  peso: "180 MB",
},
```

Mientras `href` esté vacío, la ficha muestra el botón como
«Descargar para Windows · próximamente» y nadie se lleva un enlace roto.

**Ojo con el tamaño.** Cloudflare Pages limita cada archivo a 25 MB. Un
empaquetado de WhisperFlow con PyTorch y el modelo de Whisper adentro pasa de
largo ese límite, así que para ese caso conviene subir el archivo a GitHub
Releases o a R2 y poner acá la URL completa en vez de una ruta local.
