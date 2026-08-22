import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Room } from "./Room";
import { limpiarTexturas } from "./textures";
import type { Calidad } from "@/lib/device";

/**
 * Canvas del hero: luces, cámara y postproceso.
 *
 * La geometría vive en `Room.tsx`; acá solo se decide cómo se ve y cómo se
 * mueve la cámara entre los dos modos.
 */

export type Modo = "hero" | "pov";

/** Encuadres de cámara. `fov` se anima junto con la posición. */
const ENCUADRE = {
  hero: {
    // Ligeramente a la izquierda del centro: así la pared derecha —la de la
    // ventana— entra en cuadro, como en el prototipo.
    pos: new THREE.Vector3(-0.35, 2.95, 8.1),
    mira: new THREE.Vector3(0.55, 2.0, -3.6),
    fov: 40,
  },
  pov: {
    pos: new THREE.Vector3(0, 1.95, -1.35),
    mira: new THREE.Vector3(0, 2.2, -5.06),
    fov: 58,
  },
};

type Props = {
  modo: Modo;
  /** Con `false` el bucle de render se detiene (hero fuera de pantalla). */
  activo: boolean;
  calidad: Exclude<Calidad, "ninguna">;
  animar: boolean;
  onSentarse: () => void;
  monitorActivo: number | null;
  onMonitor: (id: number | null) => void;
  onTeclado: (modo: number) => void;
  onListo: () => void;
};

export default function Scene({
  modo,
  activo,
  calidad,
  animar,
  onSentarse,
  monitorActivo,
  onMonitor,
  onTeclado,
  onListo,
}: Props) {
  const alta = calidad === "alta";

  useEffect(() => {
    return () => limpiarTexturas();
  }, []);

  return (
    <Canvas
      frameloop={activo ? "always" : "never"}
      dpr={alta ? [1, 1.8] : 1}
      gl={{
        antialias: alta,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
        // Solo en desarrollo: permite capturar el canvas con toDataURL()
        preserveDrawingBuffer: import.meta.env.DEV,
      }}
      camera={{
        position: ENCUADRE.hero.pos.toArray(),
        fov: ENCUADRE.hero.fov,
        near: 0.1,
        far: 60,
      }}
      onCreated={({ gl, scene, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        scene.background = new THREE.Color("#04080b");
        if (import.meta.env.DEV) {
          // Gancho para inspeccionar y capturar la escena desde la consola.
          (window as unknown as Record<string, unknown>).__escena = { gl, scene, camera, THREE };
        }
        onListo();
      }}
      performance={{ min: 0.4 }}
    >
      <fog attach="fog" args={["#04080b", 13, 30]} />

      <ambientLight intensity={0.34} color="#9FD9E0" />
      <hemisphereLight args={["#1B3A44", "#0A0705", 0.42]} />
      {/* Relleno frío general, para que las siluetas no se pierdan en negro */}
      <directionalLight position={[-6, 7, 6]} intensity={0.28} color="#7FB6C8" />

      <Room
        modo={modo}
        onSentarse={onSentarse}
        monitorActivo={monitorActivo}
        onMonitor={onMonitor}
        onTeclado={onTeclado}
        animar={animar}
      />

      <Camara modo={modo} animar={animar} />

      {alta && (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.38}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.7}
          />
          <Vignette offset={0.26} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

/**
 * Anima la cámara entre el plano general y el POV, y agrega parallax de mouse.
 *
 * Se usa amortiguación exponencial (`damp`) en vez de una animación por
 * duración: así la transición nunca "salta" si el usuario cambia de modo a
 * medio camino, y es independiente de los FPS.
 */
function Camara({ modo, animar }: { modo: Modo; animar: boolean }) {
  const { camera, size } = useThree();
  const mira = useRef(ENCUADRE.hero.mira.clone());
  const puntero = useRef({ x: 0, y: 0 });
  const destino = useRef(new THREE.Vector3());

  useEffect(() => {
    const alMover = (e: PointerEvent) => {
      puntero.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      puntero.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", alMover, { passive: true });
    return () => window.removeEventListener("pointermove", alMover);
  }, []);

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const enc = ENCUADRE[modo];
    const aspecto = size.width / Math.max(1, size.height);

    // En vertical el cuarto no cabe a lo ancho: se retrocede un poco y se
    // abre el campo de visión, pero sin exagerar — pasarse deja el cuarto
    // diminuto en medio de una pantalla vacía.
    const retroceso = modo === "hero" ? Math.min(3.4, Math.max(0, (1.5 - aspecto) * 3.4)) : 0;
    const px = animar ? puntero.current.x : 0;
    const py = animar ? puntero.current.y : 0;

    destino.current.copy(enc.pos);
    if (modo === "hero") {
      destino.current.z += retroceso;
      destino.current.y -= retroceso * 0.14;
      destino.current.x += px * 0.55;
      destino.current.y += -py * 0.3;
    }

    const lambda = 2.6;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, destino.current.x, lambda, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, destino.current.y, lambda, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, destino.current.z, lambda, dt);

    // En POV el puntero mueve la mirada: "look around" sin controles orbitales
    const miraDestinoX = enc.mira.x + (modo === "pov" ? px * 2.1 : px * 0.28);
    const miraDestinoY = enc.mira.y + (modo === "pov" ? -py * 1.05 : -py * 0.16);

    mira.current.x = THREE.MathUtils.damp(mira.current.x, miraDestinoX, lambda * 1.3, dt);
    mira.current.y = THREE.MathUtils.damp(mira.current.y, miraDestinoY, lambda * 1.3, dt);
    mira.current.z = THREE.MathUtils.damp(mira.current.z, enc.mira.z, lambda, dt);
    cam.lookAt(mira.current);

    const fovDestino = modo === "hero" ? enc.fov + retroceso * 2.4 : enc.fov;
    if (Math.abs(cam.fov - fovDestino) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, fovDestino, lambda, dt);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
