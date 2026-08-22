import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, LoaderCircle, MousePointerClick, Mouse, X } from "lucide-react";
import { profile } from "@/content/profile";
import { useCalidad, useEnVista, usePrefiereQuieto } from "@/lib/device";
import { Icon } from "@/components/ui/Icon";
import { Social } from "@/components/ui/Social";
import { MODOS_TECLADO, MONITORES } from "./setup";
import type { Modo } from "./Scene";

/** El motor 3D se carga aparte: la primera pintura no lo espera. */
const Scene = lazy(() => import("./Scene"));

export function Hero({ onPov }: { onPov: (activo: boolean) => void }) {
  const seccion = useRef<HTMLElement>(null);
  const enVista = useEnVista(seccion);
  const calidad = useCalidad();
  const quieto = usePrefiereQuieto();
  const [modo, setModo] = useState<Modo>("hero");
  const [listo, setListo] = useState(false);
  const [monitorActivo, setMonitorActivo] = useState<number | null>(null);
  const [tecladoModo, setTecladoModo] = useState<number | null>(null);

  const hay3D = calidad !== "ninguna";
  const animar = !quieto;

  const salir = useCallback(() => {
    setModo("hero");
    setMonitorActivo(null);
    setTecladoModo(null);
  }, []);

  // Monitores y teclado comparten el panel del HUD: lo último que se toca es
  // lo que se muestra.
  const alMonitor = useCallback((id: number | null) => {
    setMonitorActivo(id);
    setTecladoModo(null);
  }, []);

  const alTeclado = useCallback((modoRgb: number) => {
    setTecladoModo(modoRgb);
    setMonitorActivo(null);
  }, []);

  const sentarse = useCallback(() => setModo("pov"), []);

  // Esc sale del POV
  useEffect(() => {
    if (modo !== "pov") return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") salir();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [modo, salir]);

  // Dentro del POV se bloquea el scroll y se avisa al navbar: la escena ocupa
  // toda la atención y el menú estorbaría encima del setup.
  useEffect(() => {
    onPov(modo === "pov");
    if (modo !== "pov") return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [modo, onPov]);

  const enPov = modo === "pov";

  const info =
    monitorActivo !== null
      ? {
          clave: `monitor-${monitorActivo}`,
          titulo: MONITORES[monitorActivo].titulo,
          sub: MONITORES[monitorActivo].sub,
        }
      : tecladoModo !== null
        ? {
            clave: `teclado-${tecladoModo}`,
            titulo: "Iluminación RGB",
            sub: `Teclado y mouse en «${MODOS_TECLADO[tecladoModo]}» · seguí haciendo clic para cambiar`,
          }
        : null;

  return (
    <section
      id="inicio"
      ref={seccion}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
    >
      {/* ── Capa 3D ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-[26%] bottom-0 md:inset-0">
        {hay3D ? (
          <Suspense fallback={<Cargando />}>
            <Scene
              modo={modo}
              activo={enVista}
              calidad={calidad}
              animar={animar}
              onSentarse={sentarse}
              monitorActivo={monitorActivo}
              onMonitor={alMonitor}
              onTeclado={alTeclado}
              onListo={() => setListo(true)}
            />
          </Suspense>
        ) : (
          <CuartoPlano />
        )}

        {/* Velo mientras el canvas aparece, para que no haya un flash negro */}
        <AnimatePresence>
          {hay3D && !listo && (
            <motion.div
              key="velo"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Cargando />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Degradados que hacen legible el texto sobre la escena */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{ opacity: enPov ? 0 : 1 }}
      >
        {/* Móvil: el velo baja de arriba, donde está el texto */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,8,11,0.97)_0%,rgba(4,8,11,0.9)_26%,rgba(4,8,11,0.3)_52%,rgba(4,8,11,0.2)_100%)] md:hidden" />
        {/* Escritorio: el velo viene de la izquierda, donde está el texto */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(4,8,11,0.92)_0%,rgba(4,8,11,0.62)_34%,rgba(4,8,11,0.1)_60%,rgba(4,8,11,0)_100%)] md:block" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,#04080b_6%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(4,8,11,0.9),transparent)]" />
      </div>

      {/* ── Texto del hero ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!enPov && (
          <motion.div
            key="hero-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-start px-6 pt-28 sm:px-10 md:justify-center md:pt-0 lg:px-14"
          >
            <div className="pointer-events-auto max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[1.02] font-bold tracking-tight"
              >
                {profile.hero.titulo.map((linea) => (
                  <span key={linea} className="block">
                    {linea}
                  </span>
                ))}
                <span className="neon-text block">{profile.hero.tituloAcento}</span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 h-1 w-16 origin-left rounded-full bg-neon shadow-[0_0_18px_2px_rgba(47,228,228,0.6)]"
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-7 max-w-md text-lg leading-relaxed whitespace-pre-line text-paper/72"
              >
                {profile.hero.subtitulo}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.66 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a href="#proyectos" className="btn-ghost group text-base">
                  {profile.hero.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

                {hay3D && (
                  <button
                    type="button"
                    onClick={sentarse}
                    // En móvil el botón cae sobre la escena; la píldora lo mantiene legible.
                    className="group inline-flex items-center gap-2 rounded-full bg-ink-950/60 px-3 py-1.5 text-sm font-medium text-paper/60 backdrop-blur-sm transition hover:text-neon md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
                  >
                    <MousePointerClick className="h-4 w-4" />
                    <span className="border-b border-dashed border-current/40 pb-0.5">
                      Entrar al setup
                    </span>
                  </button>
                )}
              </motion.div>
            </div>

            {/* Pilares sobre la alfombra */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="pointer-events-auto absolute inset-x-6 bottom-28 mx-auto hidden max-w-2xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/8 bg-ink-950/45 backdrop-blur-md md:grid lg:inset-x-auto lg:left-[calc(50%+5rem)] lg:w-[34rem] lg:-translate-x-1/2 xl:left-[calc(50%+3rem)]"
            >
              {profile.hero.pilares.map((p) => (
                <li key={p.titulo} className="flex flex-col items-center gap-2 px-4 py-5 text-center">
                  <Icon name={p.icono} className="h-6 w-6 text-neon" />
                  <div className="text-sm leading-tight">
                    <div className="font-semibold">{p.titulo}</div>
                    <div className="text-paper/55">{p.sub}</div>
                  </div>
                </li>
              ))}
            </motion.ul>

            {/* Indicador de scroll */}
            <motion.a
              href="#sobre-mi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.15 }}
              className="pointer-events-auto absolute inset-x-0 bottom-7 mx-auto flex w-max items-center gap-3 text-sm text-paper/55 transition hover:text-neon"
            >
              <Mouse className="h-5 w-5" strokeWidth={1.6} />
              <span className="hidden sm:inline">{profile.hero.scrollHint}</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </motion.a>

            {/* Redes */}
            <div className="pointer-events-auto absolute right-6 bottom-7 hidden lg:block">
              <Social />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pista sobre la silla ────────────────────────────────────────── */}
      <AnimatePresence>
        {hay3D && listo && !enPov && (
          <motion.div
            key="pista"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
            className="pointer-events-none absolute bottom-[31%] left-1/2 z-10 hidden -translate-x-1/2 lg:block"
          >
            <div className="relative flex items-center gap-2 rounded-full border border-neon/35 bg-ink-950/75 px-4 py-2 text-xs font-medium text-neon backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-neon" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
              </span>
              {profile.hero.hint3d}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD del POV ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {enPov && (
          <motion.div
            key="pov-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.55, duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            {/* Marco de visor */}
            <div className="absolute inset-0 ring-1 ring-neon/10 ring-inset" />
            <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,rgba(4,8,11,0.85),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(4,8,11,0.88),transparent)]" />

            <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-neon uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon" />
              POV · el setup
            </div>

            <button
              type="button"
              onClick={salir}
              className="btn-ghost pointer-events-auto absolute top-5 right-6 px-4 py-2 text-sm"
            >
              <X className="h-4 w-4" />
              Salir
            </button>

            <div className="absolute inset-x-0 bottom-8 mx-auto w-max max-w-[92vw] px-4 text-center">
              <AnimatePresence mode="wait">
                {info ? (
                  <motion.div
                    key={info.clave}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="panel px-5 py-3"
                  >
                    <div className="text-sm font-semibold text-neon">{info.titulo}</div>
                    <div className="text-sm text-paper/70">{info.sub}</div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="ayuda"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-paper/55"
                  >
                    Mové el cursor para mirar alrededor · clic en un monitor, el teclado o el mouse ·{" "}
                    <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[11px]">Esc</kbd>{" "}
                    para salir
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Estados alternativos ───────────────────────────────────────────────── */

function Cargando() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-950">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-neon/12 blur-2xl" />
          <svg viewBox="0 0 120 60" className="relative h-16 w-32">
            <g
              fill="none"
              stroke="#2FE4E4"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(47,228,228,0.8))" }}
            >
              <path d="M34 16 18 30l16 14" />
              <path d="M53 46 67 14" />
              <path d="M86 16l16 14-16 14" />
            </g>
          </svg>
        </div>
        <div className="flex items-center gap-2 text-sm text-paper/45">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Preparando el setup…
        </div>
      </div>
    </div>
  );
}

/** Alternativa sin WebGL: mismo ambiente, cero 3D. */
function CuartoPlano() {
  return (
    <div className="absolute inset-0 bg-ink-950">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute top-1/2 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,228,228,0.16),transparent_62%)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(47,228,228,0.07),transparent)]" />
      <svg
        viewBox="0 0 120 60"
        className="absolute top-[26%] right-[14%] hidden h-28 w-56 md:block"
        style={{ filter: "drop-shadow(0 0 14px rgba(47,228,228,0.75))" }}
      >
        <g fill="none" stroke="#7CF5F0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M34 16 18 30l16 14" />
          <path d="M53 46 67 14" />
          <path d="M86 16l16 14-16 14" />
        </g>
      </svg>
    </div>
  );
}
