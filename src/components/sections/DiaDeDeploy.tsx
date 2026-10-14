import { useEffect, useRef } from "react";
import { dia } from "@/content/dia";

/** Pantallas de scroll que dura cada momento. Más = el clip avanza más lento. */
const SCROLL_POR_MOMENTO = 1.6;
/** Ancho del fundido entre clips, en pantallas. Los bordes ya coinciden cuadro a cuadro. */
const FUNDIDO = 0.08;
/** Mismo criterio que el <source media> del póster: celular en vertical usa los clips 9:16. */
const MQ_MOVIL = "(max-width: 860px) and (orientation: portrait)";

type Tramo = {
  video: HTMLVideoElement | null;
  cargando: boolean;
  listo: boolean;
  actual: number;
  meta: number;
  visible: boolean;
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

/**
 * Un día de trabajo que avanza con el scroll: el scroll mueve el tiempo de
 * cuatro clips encadenados (amanecer → noche) generados con Higgsfield.
 *
 * Es el motor de scroll-world adaptado para vivir como una sección más:
 * los clips se cargan como Blob (siempre se pueden adelantar), no se pide
 * un salto nuevo mientras el anterior no terminó (clave en celulares), y el
 * póster se queda visible hasta que el video pinta su primer cuadro (iOS).
 */
export function DiaDeDeploy() {
  const seccion = useRef<HTMLElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);
  const textos = useRef<(HTMLDivElement | null)[]>([]);
  const marcas = useRef<(HTMLLIElement | null)[]>([]);
  const reloj = useRef<HTMLSpanElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sec = seccion.current;
    if (!sec) return;

    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tactil = matchMedia("(hover: none) and (pointer: coarse)").matches;
    const movil = matchMedia(MQ_MOVIL).matches;
    const N = dia.momentos.length;
    const tramos: Tramo[] = dia.momentos.map(() => ({
      video: null,
      cargando: false,
      listo: false,
      actual: 0,
      meta: 0,
      visible: false,
    }));
    const urls: string[] = [];
    let usuarioListo = false;
    let raf = 0;
    let pendiente = false;
    // React monta dos veces en desarrollo y vuelve a montar con cada recarga en
    // caliente. Sin esta bandera, la descarga del primer montaje termina después
    // de la limpieza y deja un segundo video congelado encima del bueno.
    let cancelado = false;

    function cebar(v: HTMLVideoElement | null) {
      if (!tactil || !v) return;
      v.play()
        .then(() => v.pause())
        .catch(() => {});
    }

    function cargar(i: number) {
      const t = tramos[i];
      if (reducir || t.cargando) return;
      t.cargando = true;
      const m = dia.momentos[i];
      fetch(movil ? m.clipMovil : m.clip)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((blob) => {
          const capa = capas.current[i];
          if (cancelado || !capa) return;
          const v = document.createElement("video");
          v.className = "dia-video";
          v.muted = true;
          v.playsInline = true;
          v.preload = "auto";
          v.setAttribute("muted", "");
          v.setAttribute("playsinline", "");
          v.setAttribute("aria-hidden", "true");
          v.src = URL.createObjectURL(blob);
          urls.push(v.src);
          v.addEventListener("loadedmetadata", () => {
            t.listo = true;
            leer();
          });
          // Ocultar el póster solo cuando ya hay un cuadro pintado.
          v.addEventListener("seeked", () => capa.classList.add("has-clip"), { once: true });
          v.addEventListener("loadeddata", () => {
            v.pause();
            if (usuarioListo) cebar(v);
          });
          capa.appendChild(v);
          t.video = v;
        })
        .catch(() => {
          t.cargando = false;
        });
    }

    function leer() {
      pendiente = false;
      const vh = window.innerHeight;
      const total = sec!.offsetHeight - vh;
      const L = total / N;
      const y = -sec!.getBoundingClientRect().top;
      const fundido = FUNDIDO * vh;
      let cercano = 0;
      let mejor = -1;

      for (let i = 0; i < N; i++) {
        const t = tramos[i];
        const ini = i * L;
        const fin = ini + L;
        if (y > ini - 1.5 * vh && y < fin + 1.5 * vh) cargar(i);

        const local = clamp((y - ini) / L);
        t.meta = local;

        let fuera = 0;
        if (y < ini && i > 0) fuera = ini - y;
        else if (y > fin && i < N - 1) fuera = y - fin;
        const op = suave(1 - fuera / fundido);
        const capa = capas.current[i];
        if (capa) {
          capa.style.opacity = String(op);
          capa.style.zIndex = String(op > 0.5 ? 2 : 1);
        }
        t.visible = op > 0.001;

        // Texto: el primero ya está al llegar, el último se queda al final.
        let ct: number;
        if (i === 0) ct = y > fin ? 0 : suave(1 - (local - 0.45) / 0.4);
        else if (i === N - 1) ct = y < ini ? 0 : suave(local / 0.35);
        else ct = y < ini || y > fin ? 0 : suave(1 - Math.abs(local - 0.5) / 0.5);
        const tx = textos.current[i];
        if (tx) {
          tx.style.opacity = String(ct);
          tx.style.transform = reducir ? "none" : `translateY(${(1 - ct) * 16}px)`;
          tx.style.pointerEvents = ct > 0.5 ? "auto" : "none";
        }
        if (ct > mejor) {
          mejor = ct;
          cercano = i;
        }
      }

      marcas.current.forEach((mk, k) => mk?.classList.toggle("is-on", k === cercano));
      const p = clamp(y / total);
      if (barra.current) barra.current.style.transform = `scaleX(${p})`;
      if (reloj.current) {
        const h = dia.horaInicio + p * (dia.horaFin - dia.horaInicio);
        const hh = Math.floor(h);
        const mm = Math.floor((h - hh) * 60);
        reloj.current.textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      }
    }

    function bucle() {
      const eps = tactil ? 0.02 : 0.008; // saltos más gruesos en celular = menos decodificación
      for (const t of tramos) {
        const v = t.video;
        if (!v || !t.listo) continue;
        if (v.seeking) continue; // no apilar saltos: congela el video en celulares
        if (!t.visible && Math.abs(t.actual - t.meta) < 0.002) continue;
        t.actual += (t.meta - t.actual) * (reducir ? 1 : 0.18);
        const tiempo = clamp(t.actual, 0, 0.999) * (v.duration || 1);
        if (Math.abs(v.currentTime - tiempo) > eps) {
          try {
            v.currentTime = tiempo;
          } catch {
            /* el video todavía no acepta saltos */
          }
        }
      }
      raf = requestAnimationFrame(bucle);
    }

    const alScroll = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(leer);
      }
    };
    const alTocar = () => {
      if (usuarioListo) return;
      usuarioListo = true;
      tramos.forEach((t) => cebar(t.video));
    };

    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    window.addEventListener("pointerdown", alTocar, { once: true, passive: true });
    window.addEventListener("touchstart", alTocar, { once: true, passive: true });
    leer();
    raf = requestAnimationFrame(bucle);

    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
      window.removeEventListener("pointerdown", alTocar);
      window.removeEventListener("touchstart", alTocar);
      // Los videos se crean a mano, fuera de React: también se quitan a mano.
      tramos.forEach((t) => t.video?.remove());
      capas.current.forEach((c) => c?.classList.remove("has-clip"));
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const N = dia.momentos.length;

  return (
    <section
      ref={seccion}
      id="proceso"
      aria-label={dia.titulo}
      className="dia relative z-[1]"
      style={{ height: `${(N * SCROLL_POR_MOMENTO + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {dia.momentos.map((m, i) => (
          <div
            key={m.clip}
            ref={(n) => {
              capas.current[i] = n;
            }}
            className="dia-capa"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <picture>
              <source media={MQ_MOVIL} srcSet={m.posterMovil} />
              <img src={m.poster} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            </picture>
          </div>
        ))}

        <div className="dia-velo" aria-hidden="true" />

        {/* Cabecera: título de la sección + reloj del día */}
        <div className="absolute inset-x-0 top-0 z-[5] pt-[92px]">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-14">
            <span className="eyebrow">{dia.titulo}</span>
            <span className="dia-reloj font-mono">
              <small>Hora</small>
              <span ref={reloj}>06:00</span>
            </span>
          </div>
        </div>

        {/* Textos por momento */}
        <div className="absolute inset-x-0 bottom-[96px] z-[5] md:bottom-[112px]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
            <div className="relative min-h-[240px] max-w-[600px]">
              {dia.momentos.map((m, i) => (
                <div
                  key={m.etiqueta}
                  ref={(n) => {
                    textos.current[i] = n;
                  }}
                  className="absolute inset-x-0 bottom-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="font-mono text-[11px] tracking-[0.18em] text-neon uppercase">
                    {String(i + 1).padStart(2, "0")} · {m.etiqueta}
                  </p>
                  <h2 className="mt-3 text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] font-bold tracking-tight text-balance">
                    {m.titulo} <span className="neon-text">{m.acento}</span>
                  </h2>
                  <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed text-paper/75">
                    {m.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Riel de momentos + progreso */}
        <div className="absolute inset-x-0 bottom-0 z-[5] pb-6">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
            <div className="dia-riel">
              <span ref={barra} className="dia-riel-fill" />
            </div>
            <ol className="mt-3 grid grid-cols-4 font-mono text-[10px] tracking-[0.14em] uppercase">
              {dia.momentos.map((m, i) => (
                <li
                  key={m.etiqueta}
                  ref={(n) => {
                    marcas.current[i] = n;
                  }}
                  className={`dia-marca ${i === 0 ? "is-on" : ""}`}
                >
                  {m.etiqueta}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
