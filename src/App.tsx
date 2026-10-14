import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { DiaDeDeploy } from "@/components/sections/DiaDeDeploy";
import { SobreMi } from "@/components/sections/SobreMi";
import { Proyectos } from "@/components/sections/Proyectos";
import { Habilidades } from "@/components/sections/Habilidades";
import { Contacto } from "@/components/sections/Contacto";

export default function App() {
  // El hero avisa cuando entra al POV para que el navbar se quite de encima.
  const [enPov, setEnPov] = useState(false);

  return (
    <>
      <a
        href="#sobre-mi"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-neon focus:px-5 focus:py-2.5 focus:font-semibold focus:text-ink-950"
      >
        Saltar al contenido
      </a>

      <Navbar oculto={enPov} />

      <main>
        <Hero onPov={setEnPov} />
        <DiaDeDeploy />
        <SobreMi />
        <Proyectos />
        <Habilidades />
        <Contacto />
      </main>

      <Footer />
    </>
  );
}
