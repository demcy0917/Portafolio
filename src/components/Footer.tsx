import { profile } from "@/content/profile";
import { Logo } from "./Navbar";
import { Social } from "./ui/Social";

export function Footer() {
  return (
    <footer className="relative border-t border-white/7 bg-ink-900/60">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 py-8 sm:px-10 md:flex-row md:justify-between lg:px-14">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold">{profile.nombre}</div>
            <div className="text-[13px] text-paper/45">{profile.rol}</div>
          </div>
        </div>

        <p
          className="text-[13px] font-medium text-paper/35 uppercase"
          style={{ letterSpacing: "0.42em" }}
        >
          {profile.footer.lema}
        </p>

        <div className="flex items-center gap-5">
          <Social incluirCorreo />
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-4 text-center text-xs text-paper/30">
        © {new Date().getFullYear()} {profile.nombre} · {profile.marca} — Hecho con React, Three.js
        y demasiado café.
      </div>
    </footer>
  );
}
