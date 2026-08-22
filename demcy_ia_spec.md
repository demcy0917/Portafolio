# 🚀 demcy.ia - Portfolio 3D Interactivo

**Objetivo:** Crear un portfolio full-stack interactivo con experiencia 3D en el hero que permite explorar el setup de desarrollo.

**Stack:** React + Three Fiber + Framer Motion | Cloudflare Pages | Supabase (opcional) | Railway (opcional)

---

## 📋 Estructura General

```
demcy.ia/
├── Inicio (Hero 3D Interactivo) ← EXPERIENCIA 3D AQUÍ
├── Sobre mí
├── Proyectos
├── Habilidades
├── Contacto
└── Descargar CV
```

**Nota:** La experiencia 3D está **solo en el hero (Inicio)**. Las demás secciones siguen el diseño de los prototipos proporcionados.

---

## 🎨 Diseños de Referencia

**Carpeta de prototipos:** `/prototipo/`
- Cada sección tiene su imagen de referencia
- Mantener fidelidad visual: tema dark, neon teal/cyan, tipografía, espaciado

**Iconos de tecnologías:**
- Están en el prototipo "Habilidades"
- ¿Debería buscar/descargar los iconos oficiales automáticamente o prefieres que los proporcione en una carpeta `/public/icons/`?

---

## 🎮 Experiencia 3D - Hero (Inicio)

### Escena Principal (Al cargar)
- **Imagen de fondo:** Setup de desarrollo (como en el prototipo)
- **Interactividad:** User puede **clickear la silla** para entrar al POV
- **Ambiente:** Iluminación realista, neon glow en los bordes

### Cuando Clickea la Silla → POV Interactivo

**Elementos visibles en el POV:**
1. **Monitores (3-4 pantallas):** Mostrar código TypeScript (placeholder por ahora, definir después)
2. **Teclado & Mouse:** Detalles del setup
3. **Ventana:** Vista a la ciudad/exterior (render simple o imagen)
4. **Ambiente:** Iluminación del setup, plantas, objetos decorativos

**Interactividad en el POV:**
- ¿Puede el user clickear los monitores para ver más detalles?
- ¿Puede rotar la vista o solo es "look around"?
- **Por ahora:** Simple POV interactivo (click para entrar, click para salir)

**Código en monitores:**
- Mostrar código TypeScript decorativo
- ¿Es una imagen o HTML interactivo dentro de Three.js?
- **Por ahora:** Imagen/texto estático es suficiente

### Transiciones
- Animar camera smoothly del hero al POV (Framer Motion + Three.js)
- Botón/control para volver al hero (ease-out smooth)

---

## 🔧 Stack Técnico Definido

### Frontend
```
- React 18+
- React Three Fiber (3D con Three.js)
- Three.js (rendering 3D)
- Framer Motion (animaciones suaves)
- Tailwind CSS (styling)
```

### Deployment
```
- Cloudflare Pages (hosting estático + dynamic)
- Cloudflare Workers (si necesita serverless logic)
```

### Backend (Si se necesita)
```
- Hono (lightweight, Cloudflare Workers compatible)
- O NestJS (si es más complejo, deploy en Railway)
- Railway (hosting)
```

### Database (Si se necesita)
```
- Supabase (PostgreSQL managed)
```

---

## ❓ Preguntas para Claude Code

### 1. Sobre los Iconos de Tecnologías
- **¿Busco los iconos automáticamente de CDN (simple icons, tabler icons)?**
- **¿O creo una carpeta `/public/icons/` y los colocas ahí?**
- **Recomendación:** Usar Tabler Icons (ya integrado en muchos proyectos, limpio, consistente)

### 2. Sobre el Código en los Monitores
- ¿Renderizar como **imagen estática** o como **HTML/texto interactivo** dentro de Three.js?
- ¿El código debe ser **real (archivo TS)** o **placeholder decorativo**?
- **Por ahora:** Placeholder decorativo. Definir después.

### 3. Sobre la Navegación Entre Secciones
- ¿Scroll suave (smooth scroll) entre secciones?
- ¿Navbar fijo en la parte superior (como en prototipo)?
- **Asumir:** Sí a ambas, diseño responsive mobile-first.

### 4. Sobre Analytics/Tracking
- ¿Agregar analytics (Vercel Analytics, Plausible)?
- **Asumir:** No por ahora. Agregar después si es necesario.

### 5. Sobre la Imagen del Hero 3D
- ¿La imagen de fondo es un **asset estático** que proporciono?
- ¿O generar la escena 3D completa con Three.js?
- **Asumir:** Asset estático + overlays 3D interactivos.

### 6. Sobre el CV
- ¿Generar PDF automáticamente o linkear a un PDF estático en `/public/`?
- **Asumir:** Archivo PDF estático, button descarga directo.

### 7. Sobre Formulario de Contacto
- ¿Necesita backend? (Hono + Supabase para guardar mensajes)
- ¿O simple email redirect (mailto:)?
- **Asumir:** Por ahora mailto:. Agregar backend después si es necesario.

---

## 📁 Estructura de Carpetas Esperada

```
demcy-ia/
├── public/
│   ├── cv.pdf
│   ├── prototipo/
│   │   ├── inicio.png
│   │   ├── sobre-mi.png
│   │   ├── proyectos.png
│   │   ├── habilidades.png
│   │   └── contacto.png
│   └── icons/ (si decides crear carpeta, populate aquí)
├── src/
│   ├── components/
│   │   ├── Hero3D.tsx
│   │   ├── POVSetup.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sections/
│   │   │   ├── SobreMi.tsx
│   │   │   ├── Proyectos.tsx
│   │   │   ├── Habilidades.tsx
│   │   │   └── Contacto.tsx
│   │   └── Footer.tsx
│   ├── App.tsx
│   └── index.css
├── package.json
└── vite.config.ts (o next.config.js si prefieres Next.js)
```

---

## 🎯 Requisitos Funcionales

### ✅ MUST HAVE (Prioritario)
- [ ] Hero 3D interactivo (clickear silla → POV)
- [ ] Diseño fiel a prototipos (todas las secciones)
- [ ] Navbar funcional con smooth scroll
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Botón CV descargable

### 🎁 NICE TO HAVE (Después)
- [ ] Más objetos clickeables en el POV (monitores, ventana, etc.)
- [ ] Código interactivo en monitores
- [ ] Form de contacto con backend
- [ ] Analytics
- [ ] Dark/light mode toggle

---

## 🚀 Deployment

```
Local: npm run dev
Build: npm run build
Deploy: Cloudflare Pages (conectar repo)
Preview: https://demcy-ia.pages.dev (o tu dominio personalizado)
```

---

## 📝 Notas Finales

- **Prioridad:** Hacer que funcione smooth en desktop primero, optimizar mobile después
- **Performance:** Lazy load componentes, optimizar modelos 3D para no cargar todo de una
- **Accesibilidad:** Asegurar que la experiencia 3D no sea el único way de navegar (fallback HTML)
- **SEO:** Metadatos, og:image, estructurado

---

## ❓ Antes de Empezar

**Responde estas preguntas para afinar detalles:**

1. ¿Tabler Icons para los logos de tecnologías?
2. ¿PDF estático o generar dinámico?
3. ¿Formulario de contacto simple (mailto) o backend?
4. ¿Next.js o Vite + React?
5. ¿El hero 3D es asset estático o generado completamente en Three.js?

---

**Autor:** Demcy  
**Fecha:** Aug 2026  
**Estado:** Ready for Claude Code
