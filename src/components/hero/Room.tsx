import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import {
  texturaAlfombra,
  texturaCiudad,
  texturaEditor,
  texturaHalo,
  texturaLibros,
  texturaMadera,
  texturaPanel,
  texturaPoster,
  texturaTerminal,
} from "./textures";
import { MONITORES } from "./setup";

/**
 * El cuarto de desarrollo, modelado a mano.
 *
 * Sistema de coordenadas: el piso es y=0, la pared del fondo z=-5.6 y la
 * ventana está en la pared derecha. La silla mira hacia el escritorio, o sea
 * hacia -z, que es también hacia donde apunta la cámara en modo POV.
 *
 * Todo es geometría primitiva: nada de modelos externos que descargar.
 */

const SALA = {
  fondoZ: -5.6,
  alto: 6,
  izqX: -9,
  // La pared derecha está cerca a propósito: es la que lleva la ventana, y a
  // esta distancia entra en el encuadre del hero sin forzar el campo de visión.
  derX: 7.2,
};

const MESA = {
  y: 1.12,
  ancho: 8.6,
  prof: 2.4,
  z: -4.2,
  grosor: 0.13,
};

type Props = {
  modo: "hero" | "pov";
  onSentarse: () => void;
  monitorActivo: number | null;
  onMonitor: (id: number | null) => void;
  onTeclado: (modo: number) => void;
  /** Se apaga en móviles y con `prefers-reduced-motion`. */
  animar: boolean;
};

export function Room({
  modo,
  onSentarse,
  monitorActivo,
  onMonitor,
  onTeclado,
  animar,
}: Props) {
  return (
    <group>
      <Piso />
      <Paredes />
      <Ventana />
      <LetreroNeon animar={animar} />
      <Cuadro />
      <Repisa />
      <Libreria />
      <Escritorio />
      <Monitores activo={monitorActivo} onMonitor={onMonitor} enPov={modo === "pov"} />
      <Laptop />
      <Perifericos animar={animar} enPov={modo === "pov"} onTeclado={onTeclado} />
      <Torre animar={animar} />
      <Silla modo={modo} onSentarse={onSentarse} animar={animar} />
      <Plantas />
      <Puff />
    </group>
  );
}

/* ── Superficies ─────────────────────────────────────────────────────────── */

function Piso() {
  const madera = useMemo(() => {
    const t = texturaMadera();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 3.4);
    return t;
  }, []);

  const alfombra = useMemo(() => {
    const t = texturaAlfombra();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 2);
    return t;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0.6]} receiveShadow>
        <planeGeometry args={[24, 17]} />
        <meshStandardMaterial map={madera} roughness={0.42} metalness={0.22} color="#8a7a6c" />
      </mesh>

      {/* Alfombra bajo la silla */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, -1.2]}>
        <planeGeometry args={[6.6, 4.6]} />
        <meshStandardMaterial map={alfombra} roughness={0.98} color="#2A3037" />
      </mesh>
    </group>
  );
}

function Paredes() {
  return (
    <group>
      {/* Fondo */}
      <mesh position={[0, SALA.alto / 2, SALA.fondoZ]} receiveShadow>
        <planeGeometry args={[24, SALA.alto]} />
        <meshStandardMaterial color="#151C21" roughness={0.94} />
      </mesh>

      {/* Zócalo del fondo */}
      <mesh position={[0, 0.09, SALA.fondoZ + 0.06]}>
        <boxGeometry args={[24, 0.18, 0.08]} />
        <meshStandardMaterial color="#0B1115" roughness={0.8} />
      </mesh>

      {/* Pared derecha (la de la ventana) */}
      <mesh position={[SALA.derX, SALA.alto / 2, 0.5]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[14, SALA.alto]} />
        <meshStandardMaterial color="#12191E" roughness={0.94} />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[SALA.izqX, SALA.alto / 2, 0.5]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[14, SALA.alto]} />
        <meshStandardMaterial color="#10161B" roughness={0.95} />
      </mesh>

      {/* Techo, apenas insinuado */}
      <mesh position={[0, SALA.alto, 0.5]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#0A0F13" roughness={1} />
      </mesh>
    </group>
  );
}

function Ventana() {
  const ciudad = useMemo(() => texturaCiudad(), []);
  const x = SALA.derX - 0.02;

  return (
    <group position={[x, 2.85, -3.4]} rotation-y={-Math.PI / 2}>
      {/* Vista a la ciudad */}
      <mesh>
        <planeGeometry args={[3.8, 3.3]} />
        <meshBasicMaterial map={ciudad} toneMapped={false} />
      </mesh>

      {/* Persianas recogidas: solo cubren el tercio superior, así la ciudad
          queda a la vista como en el prototipo */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, 1.56 - i * 0.17, 0.06]} rotation-x={0.5}>
          <boxGeometry args={[3.76, 0.16, 0.012]} />
          <meshStandardMaterial color="#0E151A" roughness={0.85} />
        </mesh>
      ))}

      {/* Marco */}
      {[
        [0, 1.73, 4.1, 0.16],
        [0, -1.73, 4.1, 0.16],
      ].map(([px, py, w, h], i) => (
        <mesh key={`h${i}`} position={[px, py, 0.1]}>
          <boxGeometry args={[w, h, 0.16]} />
          <meshStandardMaterial color="#0A1014" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      {[-1.97, 1.97].map((px, i) => (
        <mesh key={`v${i}`} position={[px, 0, 0.1]}>
          <boxGeometry args={[0.16, 3.62, 0.16]} />
          <meshStandardMaterial color="#0A1014" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      {/* Parteluz central */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.07, 3.5, 0.12]} />
        <meshStandardMaterial color="#0A1014" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Luz fría que entra por la ventana y recorta el borde derecho del cuarto */}
      <pointLight position={[0, 0, 1.6]} intensity={9} distance={7} color="#6FA8FF" />
    </group>
  );
}

/* ── Pared del fondo: neón, cuadro y repisas ─────────────────────────────── */

function LetreroNeon({ animar }: { animar: boolean }) {
  const grupo = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!grupo.current || !animar) return;
    // Parpadeo sutil, como un tubo de neón real
    const t = clock.elapsedTime;
    const flick = 0.92 + Math.sin(t * 9.3) * 0.03 + Math.sin(t * 23.7) * 0.02;
    grupo.current.scale.setScalar(flick > 0.9 ? 1 : 1);
    grupo.current.children.forEach((hijo) => {
      const mesh = hijo as THREE.Mesh;
      if (mesh.material && "opacity" in (mesh.material as THREE.Material)) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = flick;
      }
    });
  });

  const barra = (
    key: string,
    pos: [number, number, number],
    rot: number,
    largo: number,
  ) => (
    <mesh key={key} position={pos} rotation-z={rot}>
      <capsuleGeometry args={[0.045, largo, 4, 10]} />
      <meshBasicMaterial color="#8CFFFA" toneMapped={false} transparent opacity={0.95} />
    </mesh>
  );

  return (
    <group position={[0, 3.62, SALA.fondoZ + 0.14]}>
      <group ref={grupo}>
        {/* < : el trazo de arriba baja hacia la izquierda, el de abajo sube */}
        {barra("a1", [-0.93, 0.25, 0], -0.98, 0.8)}
        {barra("a2", [-0.93, -0.25, 0], 0.98, 0.8)}
        {/* / */}
        {barra("b1", [0, 0, 0], -0.34, 1.16)}
        {/* > : espejo del anterior */}
        {barra("c1", [0.93, 0.25, 0], 0.98, 0.8)}
        {barra("c2", [0.93, -0.25, 0], -0.98, 0.8)}
      </group>

      {/* El resplandor sobre la pared lo hace la luz, no un plano: un plano
          semitransparente dejaría un rectángulo de bordes duros. */}
      <pointLight position={[0, 0, 0.7]} intensity={9} distance={6} color="#2FE4E4" />
    </group>
  );
}

function Cuadro() {
  const poster = useMemo(() => texturaPoster(), []);
  return (
    <group position={[3.15, 3.5, SALA.fondoZ + 0.07]}>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.5, 1.88]} />
        <meshBasicMaterial map={poster} toneMapped={false} />
      </mesh>
      {/* Marco, detrás del póster para que no compitan por el mismo plano */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[1.66, 2.04, 0.06]} />
        <meshStandardMaterial color="#0A0F13" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Repisa() {
  const libros = useMemo(() => texturaLibros(), []);

  return (
    <group position={[-4.6, 3.35, SALA.fondoZ + 0.32]}>
      {/* Tablón */}
      <mesh>
        <boxGeometry args={[3.6, 0.11, 0.62]} />
        <meshStandardMaterial color="#2B1F16" roughness={0.65} />
      </mesh>

      {/* Tira LED cálida bajo la repisa */}
      <mesh position={[0, -0.075, 0.02]}>
        <boxGeometry args={[3.4, 0.035, 0.05]} />
        <meshBasicMaterial color="#FFCB8A" toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.5, 0.35]} intensity={5} distance={4.6} color="#FFB367" />

      {/* Libros acostados */}
      <mesh position={[-1.15, 0.19, 0]}>
        <boxGeometry args={[1.05, 0.27, 0.42]} />
        <meshStandardMaterial map={libros} roughness={0.85} />
      </mesh>

      {/* Maceta colgante */}
      <group position={[-1.5, 0.28, 0.06]}>
        <mesh>
          <cylinderGeometry args={[0.17, 0.13, 0.22, 12]} />
          <meshStandardMaterial color="#1B2A26" roughness={0.8} />
        </mesh>
        <Follaje cantidad={9} radio={0.34} caida />
      </group>

      {/* Figuras decorativas */}
      <mesh position={[0.4, 0.24, 0]}>
        <boxGeometry args={[0.24, 0.36, 0.24]} />
        <meshStandardMaterial color="#16222A" roughness={0.7} />
      </mesh>
      <mesh position={[0.95, 0.22, 0]}>
        <sphereGeometry args={[0.17, 14, 14]} />
        <meshStandardMaterial color="#1E2E38" roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[1.42, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.16, 4, 10]} />
        <meshStandardMaterial color="#D8E4E8" roughness={0.5} emissive="#5A6A72" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function Libreria() {
  const libros = useMemo(() => texturaLibros(), []);
  const baldas = [1.35, 2.25, 3.15, 4.05];

  return (
    <group position={[5.6, 0, SALA.fondoZ + 0.36]}>
      {/* Fondo iluminado */}
      <mesh position={[0, 2.7, -0.3]}>
        <planeGeometry args={[2.5, 3.2]} />
        <meshStandardMaterial color="#241A12" roughness={0.9} emissive="#4A2E14" emissiveIntensity={0.5} />
      </mesh>

      {/* Laterales */}
      {[-1.28, 1.28].map((x, i) => (
        <mesh key={i} position={[x, 2.7, 0]}>
          <boxGeometry args={[0.1, 3.3, 0.66]} />
          <meshStandardMaterial color="#22180F" roughness={0.75} />
        </mesh>
      ))}

      {baldas.map((y, bi) => (
        <group key={bi} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[2.6, 0.09, 0.66]} />
            <meshStandardMaterial color="#2B1F16" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.06, -0.28]}>
            <boxGeometry args={[2.4, 0.03, 0.04]} />
            <meshBasicMaterial color="#FFC98A" toneMapped={false} />
          </mesh>

          {/* Libros parados */}
          <mesh position={[-0.72 + (bi % 2) * 0.3, 0.36, 0.02]}>
            <boxGeometry args={[0.9, 0.62, 0.4]} />
            <meshStandardMaterial map={libros} roughness={0.88} />
          </mesh>

          {/* Un objeto por balda */}
          {bi === 0 && (
            <mesh position={[0.72, 0.24, 0.02]}>
              <sphereGeometry args={[0.19, 14, 14]} />
              <meshStandardMaterial color="#141C22" roughness={0.4} metalness={0.5} />
            </mesh>
          )}
          {bi === 1 && (
            <group position={[0.66, 0.3, 0.02]}>
              <mesh>
                <boxGeometry args={[0.42, 0.3, 0.3]} />
                <meshStandardMaterial color="#1A242B" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0, 0.16]}>
                <planeGeometry args={[0.3, 0.18]} />
                <meshBasicMaterial color="#2FE4E4" toneMapped={false} />
              </mesh>
            </group>
          )}
          {bi === 2 && (
            <group position={[0.7, 0.28, 0.02]}>
              <mesh>
                <cylinderGeometry args={[0.16, 0.14, 0.2, 12]} />
                <meshStandardMaterial color="#1D2E28" roughness={0.85} />
              </mesh>
              <Follaje cantidad={7} radio={0.26} />
            </group>
          )}
          {bi === 3 && (
            <mesh position={[0.66, 0.26, 0.02]}>
              <capsuleGeometry args={[0.13, 0.2, 4, 12]} />
              <meshStandardMaterial color="#E4EBEE" roughness={0.45} emissive="#68757C" emissiveIntensity={0.3} />
            </mesh>
          )}
        </group>
      ))}

      <pointLight position={[0, 3, 0.8]} intensity={5.5} distance={5} color="#FFA855" />
    </group>
  );
}

/* ── Escritorio y equipo ─────────────────────────────────────────────────── */

function Escritorio() {
  return (
    <group>
      {/* Tablero */}
      <mesh position={[0, MESA.y, MESA.z]} castShadow receiveShadow>
        <boxGeometry args={[MESA.ancho, MESA.grosor, MESA.prof]} />
        {/* Bastante rugoso: con poca rugosidad el tablero espeja las tiras LED
            y la madera se vuelve turquesa. */}
        <meshStandardMaterial color="#4A3527" roughness={0.72} metalness={0.08} />
      </mesh>
      {/* Canto delantero, un poco más claro */}
      <mesh position={[0, MESA.y, MESA.z + MESA.prof / 2 + 0.005]}>
        <boxGeometry args={[MESA.ancho, MESA.grosor, 0.01]} />
        <meshStandardMaterial color="#5B4231" roughness={0.35} />
      </mesh>

      {/* Patas: dos marcos metálicos en U */}
      {[-MESA.ancho / 2 + 0.5, MESA.ancho / 2 - 0.5].map((x, i) => (
        <group key={i} position={[x, 0, MESA.z]}>
          <mesh position={[0, MESA.y / 2, -0.9]}>
            <boxGeometry args={[0.09, MESA.y, 0.09]} />
            <meshStandardMaterial color="#0E1418" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[0, MESA.y / 2, 0.9]}>
            <boxGeometry args={[0.09, MESA.y, 0.09]} />
            <meshStandardMaterial color="#0E1418" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[0, MESA.y - 0.08, 0]}>
            <boxGeometry args={[0.07, 0.07, 1.9]} />
            <meshStandardMaterial color="#0E1418" roughness={0.35} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.05, 1.9]} />
            <meshStandardMaterial color="#0E1418" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Tira LED bajo el tablero: es la que tiñe el piso de teal */}
      <mesh position={[0, MESA.y - 0.1, MESA.z + MESA.prof / 2 - 0.06]}>
        <boxGeometry args={[MESA.ancho - 0.5, 0.045, 0.045]} />
        <meshBasicMaterial color="#5CF2F2" toneMapped={false} />
      </mesh>
      {/* Van bajas y con poco alcance: no hay sombras en la escena, así que
          una luz alta acá se colaría a través del tablero e iluminaría el
          escritorio desde abajo. */}
      <pointLight position={[-2.4, 0.24, MESA.z + 1.7]} intensity={7} distance={4.2} color="#2FE4E4" />
      <pointLight position={[2.4, 0.24, MESA.z + 1.7]} intensity={7} distance={4.2} color="#2FE4E4" />

      {/* Tira LED en el zócalo de la pared izquierda, como en el prototipo */}
      <mesh position={[-5.4, 0.14, -1.2]} rotation-y={0.0}>
        <boxGeometry args={[0.05, 0.05, 7.6]} />
        <meshBasicMaterial color="#5CF2F2" toneMapped={false} />
      </mesh>
      <pointLight position={[-5.4, 0.5, -1.2]} intensity={5} distance={5.5} color="#2FE4E4" />

      {/* Lámpara de escritorio */}
      <Lampara />

      {/* Taza */}
      <group position={[-2.15, MESA.y + 0.19, MESA.z + 0.62]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.13, 0.26, 18]} />
          <meshStandardMaterial color="#0F1519" roughness={0.5} />
        </mesh>
        <mesh position={[0.19, 0, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.08, 0.022, 8, 16]} />
          <meshStandardMaterial color="#0F1519" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.135, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.13, 18]} />
          <meshStandardMaterial color="#20140C" roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 0.151]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#2FE4E4" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Lampara() {
  return (
    <group position={[4.0, MESA.y + 0.07, MESA.z - 0.9]}>
      <mesh>
        <cylinderGeometry args={[0.22, 0.24, 0.05, 20]} />
        <meshStandardMaterial color="#0C1216" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation-z={-0.16}>
        <cylinderGeometry args={[0.035, 0.035, 1, 10]} />
        <meshStandardMaterial color="#0C1216" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[-0.34, 0.98, 0]} rotation-z={0.85}>
        <cylinderGeometry args={[0.035, 0.035, 0.72, 10]} />
        <meshStandardMaterial color="#0C1216" roughness={0.4} metalness={0.7} />
      </mesh>
      <group position={[-0.62, 0.82, 0]} rotation-z={-0.5}>
        <mesh>
          <coneGeometry args={[0.26, 0.36, 20, 1, true]} />
          <meshStandardMaterial color="#0E141A" roughness={0.5} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.16, 0]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.24, 20]} />
          <meshBasicMaterial color="#FFD9A0" toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[-0.9, 0.5, 0.3]} intensity={11} distance={5.2} color="#FFB367" />
    </group>
  );
}

function Monitores({
  activo,
  onMonitor,
  enPov,
}: {
  activo: number | null;
  onMonitor: (id: number | null) => void;
  enPov: boolean;
}) {
  const pantallas = useMemo(
    () => [texturaEditor("a"), texturaTerminal(), texturaPanel()],
    [],
  );
  const [hover, setHover] = useState<number | null>(null);
  useCursor(enPov && hover !== null);

  return (
    <group position={[0, 0, MESA.z - 0.86]}>
      {MONITORES.map((m, i) => {
        const resaltado = enPov && (hover === m.id || activo === m.id);
        return (
          <group key={m.id} position={[m.x, 0, 0]} rotation-y={m.rotY}>
            {/* Base y poste */}
            <mesh position={[0, MESA.y + 0.09, 0.08]}>
              <boxGeometry args={[0.62, 0.05, 0.38]} />
              <meshStandardMaterial color="#0B1014" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, MESA.y + 0.36, 0.02]}>
              <boxGeometry args={[0.09, 0.55, 0.09]} />
              <meshStandardMaterial color="#0B1014" roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Carcasa */}
            <group
              position={[0, 2.3, 0]}
              onPointerOver={(e) => {
                if (!enPov) return;
                e.stopPropagation();
                setHover(m.id);
              }}
              onPointerOut={() => setHover(null)}
              onClick={(e) => {
                if (!enPov) return;
                e.stopPropagation();
                onMonitor(activo === m.id ? null : m.id);
              }}
            >
              <RoundedBox args={[2.5, 1.5, 0.09]} radius={0.035} smoothness={3} position={[0, 0, -0.05]}>
                <meshStandardMaterial color="#080C10" roughness={0.45} metalness={0.5} />
              </RoundedBox>

              {/* Pantalla */}
              <mesh position={[0, 0.02, 0.005]}>
                <planeGeometry args={[2.36, 1.34]} />
                <meshBasicMaterial map={pantallas[i]} toneMapped={false} />
              </mesh>

              {/* Marco resaltado al pasar el cursor en POV */}
              <mesh position={[0, 0.02, 0.008]} visible={resaltado}>
                <planeGeometry args={[2.42, 1.4]} />
                <meshBasicMaterial color="#2FE4E4" transparent opacity={0.16} toneMapped={false} />
              </mesh>

              {/* Luz que la pantalla derrama hacia atrás */}
              <mesh position={[0, 0, -0.13]}>
                <planeGeometry args={[2.9, 1.9]} />
                <meshBasicMaterial color="#1D9FB8" transparent opacity={0.09} depthWrite={false} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Luz azulada que sale del conjunto de monitores */}
      <pointLight position={[0, 2.3, 0.9]} intensity={5.5} distance={5.5} color="#4FD8E8" />
    </group>
  );
}

function Laptop() {
  const pantalla = useMemo(() => texturaEditor("b"), []);

  return (
    <group position={[2.62, MESA.y + 0.07, MESA.z + 0.45]} rotation-y={-0.52}>
      {/* Base */}
      <RoundedBox args={[1.5, 0.055, 1.02]} radius={0.02} smoothness={3}>
        <meshStandardMaterial color="#0D1317" roughness={0.4} metalness={0.65} />
      </RoundedBox>
      {/* Teclado insinuado */}
      <mesh position={[0, 0.032, 0.06]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.28, 0.62]} />
        <meshStandardMaterial color="#070B0E" roughness={0.75} emissive="#0B4048" emissiveIntensity={0.55} />
      </mesh>

      {/* Tapa */}
      {/* Bisagra al fondo de la base; la tapa se inclina 17° hacia atrás */}
      <group position={[0, 0.028, -0.5]} rotation-x={-0.3}>
        <RoundedBox args={[1.5, 1.0, 0.045]} radius={0.02} smoothness={3} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#0D1317" roughness={0.4} metalness={0.65} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0.026]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshBasicMaterial map={pantalla} toneMapped={false} />
        </mesh>
      </group>

      <pointLight position={[0, 0.9, -0.2]} intensity={2.6} distance={3} color="#4FD8E8" />
    </group>
  );
}

/* ── Teclado RGB ─────────────────────────────────────────────────────────── */

const BLANCO = new THREE.Color("#FFFFFF");

/** Alturas relativas al centro del chasis, que va de -0.03 a +0.03. */
const ALTURA_LUZ = 0.036;
const ALTURA_CAP = 0.064;

const TECLADO = {
  cols: 14,
  filas: 5,
  pasoX: 0.135,
  pasoZ: 0.118,
  /** Ancho, alto y profundidad de una tecla. */
  tecla: [0.104, 0.044, 0.088] as [number, number, number],
  /** Columnas que ocupa la barra espaciadora, en la última fila. */
  espacio: [4, 9] as const,
};

type Tecla = { x: number; z: number; escalaX: number; col: number; fila: number };

/**
 * Posición y ancho de cada tecla. La última fila lleva barra espaciadora.
 *
 * Las columnas que la barra se come no se generan. Es importante que no queden
 * como instancias de escala cero: una matriz singular produce normales NaN, y
 * ese NaN se propaga por el desenfoque del bloom hasta dejar toda la pantalla
 * en negro.
 */
function disposicionTeclado(): Tecla[] {
  const { cols, filas, pasoX, pasoZ, espacio } = TECLADO;
  const centroEspacio = (espacio[0] + espacio[1]) / 2;
  const anchoBarra = espacio[1] - espacio[0] + 1;
  const teclas: Tecla[] = [];

  for (let fila = 0; fila < filas; fila++) {
    for (let col = 0; col < cols; col++) {
      const dentroDelEspacio = fila === filas - 1 && col >= espacio[0] && col <= espacio[1];
      const esBarra = dentroDelEspacio && col === Math.floor(centroEspacio);
      if (dentroDelEspacio && !esBarra) continue;

      const colEfectiva = esBarra ? centroEspacio : col;
      teclas.push({
        x: (colEfectiva - (cols - 1) / 2) * pasoX,
        z: (fila - (filas - 1) / 2) * pasoZ,
        escalaX: esBarra ? anchoBarra : 1,
        col,
        fila,
      });
    }
  }

  return teclas;
}

const TECLAS = disposicionTeclado();
const TOTAL_TECLAS = TECLAS.length;

/**
 * Teclado mecánico con iluminación RGB por tecla.
 *
 * Las teclas son dos `instancedMesh` de 70 instancias cada uno —uno para los
 * keycaps oscuros y otro para la luz que se escapa por debajo— en vez de 140
 * meshes sueltos: así el teclado entero cuesta dos draw calls.
 *
 * En el POV se puede interactuar: al pasar el cursor la tecla se hunde y se
 * enciende, y al hacer clic cambia el modo de iluminación y sale una onda
 * desde la tecla pulsada.
 */
function Teclado({
  animar,
  enPov,
  modo,
  onCambiar,
}: {
  animar: boolean;
  enPov: boolean;
  modo: number;
  onCambiar: () => void;
}) {
  const caps = useRef<THREE.InstancedMesh>(null);
  const luces = useRef<THREE.InstancedMesh>(null);
  const [hover, setHover] = useState<number | null>(null);

  const teclas = TECLAS;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  // Cuánto está hundida cada tecla, de 0 a 1. Se amortigua cada cuadro.
  const hundido = useMemo(() => new Float32Array(TOTAL_TECLAS), []);
  const onda = useRef({ tecla: -1, inicio: -99 });
  const reloj = useRef(0);

  useCursor(enPov && hover !== null);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    reloj.current = t;
    if (!caps.current || !luces.current) return;

    const distanciaOnda = (t - onda.current.inicio) * 2.6;

    for (let i = 0; i < TOTAL_TECLAS; i++) {
      const k = teclas[i];

      // ── Pulsación ──
      const objetivo = hover === i && enPov ? 1 : 0;
      hundido[i] = THREE.MathUtils.damp(hundido[i], objetivo, 14, dt);

      dummy.position.set(k.x, ALTURA_CAP - hundido[i] * 0.013, k.z);
      dummy.scale.set(k.escalaX, 1, 1);
      dummy.updateMatrix();
      caps.current.setMatrixAt(i, dummy.matrix);

      // La placa de luz se apoya en el chasis y no se hunde con la tecla
      dummy.position.set(k.x, ALTURA_LUZ, k.z);
      dummy.updateMatrix();
      luces.current.setMatrixAt(i, dummy.matrix);

      // ── Color ──
      if (modo === 0) {
        // Ola de color que recorre el teclado de izquierda a derecha
        const fase = k.col / TECLADO.cols + k.fila * 0.04 - (animar ? t * 0.18 : 0);
        color.setHSL(((fase % 1) + 1) % 1, 0.85, 0.55);
      } else if (modo === 1) {
        // Teal de marca, respirando
        const respiro = animar ? 0.42 + 0.2 * Math.sin(t * 1.7 - k.col * 0.22) : 0.5;
        color.setHSL(0.5, 0.82, respiro);
      } else {
        // Reactivo: apagado salvo cerca del cursor
        const cerca = hover === null ? 9 : Math.hypot(k.x - teclas[hover].x, k.z - teclas[hover].z);
        color.setHSL(0.5, 0.7, Math.max(0.06, 0.62 - cerca * 1.5));
      }

      // ── Onda del clic ──
      if (onda.current.tecla >= 0) {
        const origen = teclas[onda.current.tecla];
        const d = Math.hypot(k.x - origen.x, k.z - origen.z);
        const cresta = 1 - Math.min(1, Math.abs(d - distanciaOnda) / (TECLADO.pasoX * 2.2));
        const desvanecer = Math.max(0, 1 - distanciaOnda / 2.2);
        if (cresta > 0) color.lerp(BLANCO, cresta * desvanecer * 0.9);
      }

      // La tecla bajo el cursor siempre gana
      if (hundido[i] > 0.02) color.lerp(BLANCO, hundido[i] * 0.85);

      luces.current.setColorAt(i, color);
    }

    caps.current.instanceMatrix.needsUpdate = true;
    luces.current.instanceMatrix.needsUpdate = true;
    if (luces.current.instanceColor) luces.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* Chasis */}
      <RoundedBox args={[2.05, 0.06, 0.68]} radius={0.02} smoothness={3}>
        <meshStandardMaterial color="#0A0F13" roughness={0.55} metalness={0.45} />
      </RoundedBox>

      {/* Placas de luz: lo que se ve alrededor de cada tecla */}
      <instancedMesh ref={luces} args={[undefined, undefined, TOTAL_TECLAS]} frustumCulled={false}>
        <boxGeometry args={[TECLADO.tecla[0] + 0.028, 0.013, TECLADO.tecla[2] + 0.026]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Keycaps: oscuros, la luz se cuela por los bordes */}
      <instancedMesh
        ref={caps}
        args={[undefined, undefined, TOTAL_TECLAS]}
        frustumCulled={false}
        onPointerMove={(e) => {
          if (!enPov) return;
          e.stopPropagation();
          setHover(e.instanceId ?? null);
        }}
        onPointerOut={() => setHover(null)}
        onClick={(e) => {
          if (!enPov) return;
          e.stopPropagation();
          onda.current = { tecla: e.instanceId ?? 0, inicio: reloj.current };
          onCambiar();
        }}
      >
        <boxGeometry args={TECLADO.tecla} />
        <meshStandardMaterial color="#0C1216" roughness={0.78} metalness={0.15} />
      </instancedMesh>

      {/* Resplandor general sobre la alfombrilla */}
      <mesh position={[0, -0.024, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#2FE4E4" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Mouse a juego con el teclado: aro de luz en la base, rueda encendida y un
 * halo sobre la alfombrilla. Comparte el modo RGB, así que los dos cambian a la
 * vez, y hacerle clic también cicla el modo.
 */
function Mouse({
  animar,
  enPov,
  modo,
  onCambiar,
}: {
  animar: boolean;
  enPov: boolean;
  modo: number;
  onCambiar: () => void;
}) {
  const aro = useRef<THREE.MeshBasicMaterial>(null);
  const rueda = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const [hover, setHover] = useState(false);
  const color = useMemo(() => new THREE.Color(), []);
  const texHalo = useMemo(() => texturaHalo(), []);

  useCursor(enPov && hover);

  useFrame(({ clock }) => {
    const t = animar ? clock.elapsedTime : 0;

    if (modo === 0) {
      // Mismo ciclo de tono que recorre el teclado, un paso por delante
      color.setHSL(((0.15 - t * 0.18) % 1 + 1) % 1, 0.85, 0.56);
    } else if (modo === 1) {
      color.setHSL(0.5, 0.82, 0.44 + 0.2 * Math.sin(t * 1.7));
    } else {
      color.setHSL(0.5, 0.7, hover && enPov ? 0.62 : 0.16);
    }
    if (hover && enPov) color.lerp(BLANCO, 0.55);

    aro.current?.color.copy(color);
    rueda.current?.color.copy(color);
    halo.current?.color.copy(color);
  });

  return (
    <group
      position={[1.62, 0.052, 0.02]}
      onPointerOver={(e) => {
        if (!enPov) return;
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => {
        if (!enPov) return;
        e.stopPropagation();
        onCambiar();
      }}
    >
      {/* Cuerpo */}
      <mesh scale={[0.62, 0.42, 1]}>
        <sphereGeometry args={[0.19, 20, 14]} />
        <meshStandardMaterial color="#0A0F13" roughness={0.45} metalness={0.45} />
      </mesh>

      {/* Separación entre los dos botones */}
      <mesh position={[0, 0.076, -0.03]}>
        <boxGeometry args={[0.008, 0.012, 0.2]} />
        <meshStandardMaterial color="#05080A" roughness={1} />
      </mesh>

      {/* Rueda encendida */}
      <mesh position={[0, 0.082, 0.028]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.024, 0.024, 0.026, 14]} />
        <meshBasicMaterial ref={rueda} toneMapped={false} />
      </mesh>

      {/* Aro de luz del contorno */}
      <mesh position={[0, -0.052, 0]} rotation-x={-Math.PI / 2} scale={[0.62, 1, 1]}>
        <ringGeometry args={[0.155, 0.212, 32]} />
        <meshBasicMaterial ref={aro} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Reflejo sobre la alfombrilla */}
      <mesh position={[0, -0.078, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.62, 0.62]} />
        <meshBasicMaterial
          ref={halo}
          map={texHalo}
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Perifericos({
  animar,
  enPov,
  onTeclado,
}: {
  animar: boolean;
  enPov: boolean;
  onTeclado: (modo: number) => void;
}) {
  // El modo vive acá para que teclado y mouse iluminen igual.
  const [modo, setModo] = useState(0);

  const cambiar = () => {
    const siguiente = (modo + 1) % 3;
    setModo(siguiente);
    onTeclado(siguiente);
  };

  return (
    <group position={[0, MESA.y + 0.095, MESA.z + 0.78]}>
      <Teclado animar={animar} enPov={enPov} modo={modo} onCambiar={cambiar} />
      <Mouse animar={animar} enPov={enPov} modo={modo} onCambiar={cambiar} />

      {/* Alfombrilla */}
      <mesh position={[0.45, -0.028, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.2, 0.88]} />
        <meshStandardMaterial color="#05080A" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function Torre({ animar }: { animar: boolean }) {
  const ventiladores = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (ventiladores.current && animar) ventiladores.current.rotation.z += dt * 1.6;
  });

  return (
    <group position={[4.05, 0.92, MESA.z + 0.55]} rotation-y={-0.12}>
      <RoundedBox args={[0.78, 1.72, 1.62]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color="#0A0E12" roughness={0.42} metalness={0.6} />
      </RoundedBox>

      {/* Cristal lateral */}
      <mesh position={[-0.4, 0, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[1.5, 1.6]} />
        <meshStandardMaterial
          color="#061318"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Ventiladores frontales con anillo RGB */}
      <group position={[0, 0, 0.82]}>
        {[0.5, 0, -0.5].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <torusGeometry args={[0.2, 0.028, 10, 26]} />
              <meshBasicMaterial color="#39EFEF" toneMapped={false} />
            </mesh>
            <group ref={i === 1 ? ventiladores : undefined}>
              {Array.from({ length: 7 }, (_, b) => (
                <mesh key={b} rotation-z={(b / 7) * Math.PI * 2} position={[0, 0, -0.02]}>
                  <boxGeometry args={[0.17, 0.05, 0.01]} />
                  <meshStandardMaterial color="#0D1418" roughness={0.7} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>

      <pointLight position={[0, 0, 1.3]} intensity={4} distance={3.6} color="#2FE4E4" />
    </group>
  );
}

/* ── Silla: el objeto clickeable ─────────────────────────────────────────── */

function Silla({
  modo,
  onSentarse,
  animar,
}: {
  modo: "hero" | "pov";
  onSentarse: () => void;
  animar: boolean;
}) {
  const [hover, setHover] = useState(false);
  const grupo = useRef<THREE.Group>(null);
  const anillo = useRef<THREE.Mesh>(null);
  const activable = modo === "hero";

  useCursor(hover && activable);

  useFrame(({ clock }, dt) => {
    if (!grupo.current) return;

    // En POV la silla se desvanece: la cámara está literalmente dentro de ella
    const objetivoEscala = hover && activable ? 1.022 : 1;
    grupo.current.scale.setScalar(
      THREE.MathUtils.damp(grupo.current.scale.x, objetivoEscala, 6, dt),
    );

    // Giro perezoso mientras nadie la usa
    if (animar && activable) {
      grupo.current.rotation.y = Math.sin(clock.elapsedTime * 0.32) * 0.035;
    }

    if (anillo.current) {
      const mat = anillo.current.material as THREE.MeshBasicMaterial;
      const objetivo = activable ? (hover ? 0.75 : 0.34) : 0;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, objetivo, 7, dt);
      const pulso = 1 + (animar ? Math.sin(clock.elapsedTime * 2.1) * 0.06 : 0);
      anillo.current.scale.setScalar(pulso);
    }
  });

  const cuero = <meshStandardMaterial color="#0C1114" roughness={0.72} metalness={0.12} />;
  const metal = <meshStandardMaterial color="#0A0E11" roughness={0.35} metalness={0.85} />;

  return (
    <group position={[0, 0, -1.9]} visible={modo === "hero"}>
      {/* Anillo de invitación en el piso */}
      <mesh ref={anillo} rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.98, 1.12, 48]} />
        <meshBasicMaterial color="#2FE4E4" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <group
        ref={grupo}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          if (!activable) return;
          e.stopPropagation();
          onSentarse();
        }}
      >
        {/* Asiento */}
        <RoundedBox args={[1.24, 0.19, 1.16]} radius={0.07} smoothness={3} position={[0, 0.62, 0.06]}>
          {cuero}
        </RoundedBox>

        {/* Respaldo de malla */}
        <group position={[0, 1.42, -0.48]} rotation-x={0.13}>
          <RoundedBox args={[1.12, 1.5, 0.11]} radius={0.09} smoothness={3}>
            <meshStandardMaterial color="#0B1013" roughness={0.86} metalness={0.05} />
          </RoundedBox>
          {/* Marco lateral */}
          {[-0.58, 0.58].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.01]}>
              <capsuleGeometry args={[0.045, 1.42, 4, 8]} />
              {metal}
            </mesh>
          ))}
          {/* Apoyacabezas */}
          <mesh position={[0, 0.78, 0.02]}>
            <boxGeometry args={[0.16, 0.3, 0.07]} />
            <meshStandardMaterial color="#0A0E11" roughness={0.35} metalness={0.85} />
          </mesh>
          <RoundedBox args={[0.8, 0.32, 0.14]} radius={0.06} smoothness={3} position={[0, 0.92, 0.02]}>
            {cuero}
          </RoundedBox>
        </group>

        {/* Apoyabrazos */}
        {[-0.7, 0.7].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0.8, -0.16]}>
              <boxGeometry args={[0.08, 0.34, 0.08]} />
              {metal}
            </mesh>
            <RoundedBox args={[0.16, 0.08, 0.62]} radius={0.035} smoothness={3} position={[0, 1.0, 0.02]}>
              {cuero}
            </RoundedBox>
          </group>
        ))}

        {/* Pistón */}
        <mesh position={[0, 0.34, 0.06]}>
          <cylinderGeometry args={[0.075, 0.09, 0.5, 14]} />
          {metal}
        </mesh>

        {/* Base de 5 aspas con ruedas */}
        <group position={[0, 0.1, 0.06]}>
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i / 5) * Math.PI * 2 + 0.3;
            return (
              <group key={i} rotation-y={a}>
                <mesh position={[0, 0, 0.34]}>
                  <boxGeometry args={[0.11, 0.07, 0.68]} />
                  {metal}
                </mesh>
                <mesh position={[0, -0.05, 0.66]}>
                  <sphereGeometry args={[0.075, 10, 8]} />
                  <meshStandardMaterial color="#0A0D10" roughness={0.6} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}

/* ── Vegetación y detalles ───────────────────────────────────────────────── */

function Follaje({ cantidad = 10, radio = 0.4, caida = false }) {
  const hojas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => {
        const a = (i / cantidad) * Math.PI * 2 + i * 0.7;
        const r = radio * (0.5 + ((i * 37) % 10) / 18);
        return {
          pos: [
            Math.cos(a) * r,
            caida ? -0.1 - ((i * 13) % 5) * 0.09 : 0.14 + ((i * 17) % 6) * 0.07,
            Math.sin(a) * r,
          ] as [number, number, number],
          rot: [caida ? 1.9 : 0.5 + ((i * 11) % 6) * 0.14, a, 0] as [number, number, number],
          esc: 0.72 + ((i * 23) % 8) / 18,
        };
      }),
    [cantidad, radio, caida],
  );

  return (
    <group>
      {hojas.map((h, i) => (
        <mesh key={i} position={h.pos} rotation={h.rot} scale={h.esc}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#2C5A3E" : "#20452F"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Plantas() {
  return (
    <group>
      {/* Maceta de piso, izquierda */}
      <group position={[-6.6, 0, -2.6]}>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.44, 0.32, 0.84, 16]} />
          <meshStandardMaterial color="#1A2320" roughness={0.9} />
        </mesh>
        <group position={[0, 1.05, 0]} scale={2.4}>
          <Follaje cantidad={12} radio={0.42} />
        </group>
        <group position={[0, 1.75, 0]} scale={1.7}>
          <Follaje cantidad={8} radio={0.34} />
        </group>
      </group>

      {/* Maceta pequeña sobre el escritorio */}
      <group position={[-3.35, MESA.y + 0.07, MESA.z + 0.55]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.16, 0.13, 0.28, 14]} />
          <meshStandardMaterial color="#8E9698" roughness={0.85} />
        </mesh>
        <group position={[0, 0.34, 0]} scale={1.05}>
          <Follaje cantidad={9} radio={0.22} />
        </group>
      </group>

      {/* Maceta de piso bajo la ventana */}
      <group position={[6.2, 0, -1.2]}>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.38, 0.28, 0.72, 14]} />
          <meshStandardMaterial color="#20302B" roughness={0.85} />
        </mesh>
        <group position={[0, 0.92, 0]} scale={2}>
          <Follaje cantidad={11} radio={0.36} />
        </group>
      </group>
    </group>
  );
}

function Puff() {
  return (
    <group position={[5.5, 0, 1.6]}>
      <mesh position={[0, 0.5, 0]} scale={[1.25, 0.72, 1.25]}>
        <sphereGeometry args={[1, 22, 16]} />
        <meshStandardMaterial color="#111820" roughness={0.94} />
      </mesh>
      {/* Cojín con el logo */}
      <mesh position={[0, 0.92, 0.42]} rotation-x={-0.5} scale={[0.62, 0.62, 0.18]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#0E151C" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.0, 0.56]} rotation-x={-0.5}>
        <circleGeometry args={[0.18, 20]} />
        <meshBasicMaterial color="#2FE4E4" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  );
}
