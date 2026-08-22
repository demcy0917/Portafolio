import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { profile } from "@/content/profile";

const SECCIONES = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "proyectos", label: "Proyectos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "contacto", label: "Contacto" },
];

export function Navbar({ oculto = false }: { oculto?: boolean }) {
  const [activa, setActiva] = useState("inicio");
  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);

  // Sección visible: se marca la última que cruzó la mitad de la pantalla.
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiva(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] },
    );

    SECCIONES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });

    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // El menú móvil bloquea el scroll del fondo
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          compacto
            ? "border-b border-white/6 bg-ink-950/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        } ${oculto ? "pointer-events-none -translate-y-full opacity-0" : ""}`}
        aria-hidden={oculto || undefined}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14">
          <a
            href="#inicio"
            aria-label={`${profile.nombre} — inicio`}
            className="flex shrink-0 items-center gap-2.5"
          >
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-paper/85">
              {profile.marca}
            </span>
          </a>

          {/* Escritorio */}
          <ul className="hidden items-center gap-1 lg:flex">
            {SECCIONES.map((s) => {
              const esActiva = activa === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`relative block px-4 py-2 text-[15px] transition-colors ${
                      esActiva ? "text-neon" : "text-paper/70 hover:text-paper"
                    }`}
                  >
                    {s.label}
                    {esActiva && (
                      <motion.span
                        layoutId="nav-activa"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-neon shadow-[0_0_10px_1px_rgba(47,228,228,0.75)]"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.cv}
              download
              className="btn-ghost hidden px-5 py-2.5 text-sm sm:inline-flex"
            >
              <Download className="h-4 w-4" />
              Descargar CV
            </a>

            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-paper/80 transition hover:border-neon/45 hover:text-neon lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-950/85 backdrop-blur-md"
              onClick={() => setAbierto(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col border-l border-white/8 bg-ink-900 px-7 py-6"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar menú"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-paper/80 transition hover:border-neon/45 hover:text-neon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="mt-10 flex flex-col gap-1">
                {SECCIONES.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.08 }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={() => setAbierto(false)}
                      className={`block rounded-xl px-4 py-3.5 text-lg transition ${
                        activa === s.id
                          ? "bg-neon/10 text-neon"
                          : "text-paper/80 hover:bg-white/5 hover:text-paper"
                      }`}
                    >
                      {s.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <a href={profile.cv} download className="btn-solid mt-auto w-full">
                <Download className="h-4 w-4" />
                Descargar CV
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M18 14h13c11.6 0 19 7.2 19 18s-7.4 18-19 18H18V14zm9.5 8.5v19H31c6.5 0 10.5-3.6 10.5-9.5S37.5 22.5 31 22.5h-3.5z"
        fill="#2FE4E4"
      />
      <path
        d="M12 26.5h9M12 33h6M12 39.5h9"
        stroke="#2FE4E4"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}
