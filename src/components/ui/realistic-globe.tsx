"use client";

import { Suspense, useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";

/* ── Types ── */
export type GlobeVisualStyle =
  | "blue-marble"
  | "night-lights"
  | "clouds"
  | "dark-minimal";

interface JourneyDot {
  coords: [number, number];
  label: string;
  selected?: boolean;
}

interface RealisticGlobeProps {
  width?: number;
  height?: number;
  autoRotate?: boolean;
  frozen?: boolean;
  visualStyle?: GlobeVisualStyle;
  /** Manual longitude offset in degrees */
  lonOffset?: number;
  /** Manual latitude offset in degrees */
  latOffset?: number;
  journeyDots?: JourneyDot[];
  selectedDot?: number;
  journeyArcs?: { from: number; to: number }[];
  onDotClick?: (index: number) => void;
}

/* ── Helpers ── */
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function lerpAngle(a: number, b: number, t: number) {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Atmosphere shaders ── */
const atmosphereVertex = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function makeAtmosphereFrag(r: number, g: number, b: number, strength: number) {
  return `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}, 1.0) * intensity * ${strength.toFixed(2)};
    }
  `;
}

/* ── Journey dot mesh ── */
function DotMarker({
  position,
  isSelected,
  isVisited,
  index,
  onClick,
  color = "#ffffff",
}: {
  position: THREE.Vector3;
  isSelected: boolean;
  isVisited: boolean;
  index: number;
  onClick: (i: number) => void;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = isSelected ? 1 + 0.15 * Math.sin(t * 3 + index) : 1;
    meshRef.current.scale.setScalar(pulse);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 2.5);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        isSelected ? 0.2 + 0.1 * Math.sin(t * 3 + index) : 0;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(index); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <sphereGeometry args={[isSelected ? 0.025 : 0.018, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? color : isVisited ? "#cccccc" : "#666666"}
          transparent
          opacity={isSelected ? 1 : isVisited ? 0.8 : 0.5}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[isSelected ? 0.03 : 0.024, isSelected ? 0.035 : 0.028, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.6 : 0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Arc between two dots ── */
function ArcLine({
  from,
  to,
  radius,
  color = "#ffffff",
}: {
  from: [number, number];
  to: [number, number];
  radius: number;
  color?: string;
}) {
  const points = useMemo(() => {
    const start = latLonToVec3(from[1], from[0], radius);
    const end = latLonToVec3(to[1], to[0], radius);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.15);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(64);
  }, [from, to, radius]);

  const lineRef = useRef<THREE.Line>(null);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.4 + 0.2 * Math.sin(clock.getElapsedTime() * 1.5);
  });

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
    </line>
  );
}

/* ── Style configs ── */
const STYLE_CONFIGS: Record<GlobeVisualStyle, {
  textures: string[];
  atmosphereColor: [number, number, number];
  atmosphereStrength: number;
  ambientIntensity: number;
  dotColor: string;
  arcColor: string;
}> = {
  "blue-marble": {
    textures: ["/textures/earth-blue-marble.jpg", "/textures/earth-topology.png"],
    atmosphereColor: [0.3, 0.6, 1.0],
    atmosphereStrength: 0.6,
    ambientIntensity: 0.6,
    dotColor: "#ffffff",
    arcColor: "#ffffff",
  },
  "night-lights": {
    textures: ["/textures/earth-night.jpg", "/textures/earth-topology.png"],
    atmosphereColor: [0.1, 0.4, 1.0],
    atmosphereStrength: 0.4,
    ambientIntensity: 1.2,
    dotColor: "#00ccff",
    arcColor: "#00ccff",
  },
  clouds: {
    textures: [
      "/textures/earth-blue-marble.jpg",
      "/textures/earth-topology.png",
      "/textures/earth-clouds.png",
    ],
    atmosphereColor: [0.4, 0.7, 1.0],
    atmosphereStrength: 0.7,
    ambientIntensity: 0.6,
    dotColor: "#ffffff",
    arcColor: "#ffffff",
  },
  "dark-minimal": {
    textures: ["/textures/earth-topology.png"],
    atmosphereColor: [0.0, 1.0, 0.6],
    atmosphereStrength: 0.35,
    ambientIntensity: 0.3,
    dotColor: "#00ff88",
    arcColor: "#00ff88",
  },
};

/* ── Globe scene (Blue Marble) ── */
function BlueMarbleScene(props: SceneProps) {
  const [tex] = useLoader(THREE.TextureLoader, STYLE_CONFIGS["blue-marble"].textures);
  useEffect(() => { if (tex) tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  return (
    <GlobeSceneShell {...props} style="blue-marble">
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </GlobeSceneShell>
  );
}

/* ── Globe scene (Night Lights) ── */
function NightLightsScene(props: SceneProps) {
  const [tex] = useLoader(THREE.TextureLoader, STYLE_CONFIGS["night-lights"].textures);
  useEffect(() => { if (tex) tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  return (
    <GlobeSceneShell {...props} style="night-lights">
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </GlobeSceneShell>
  );
}

/* ── Globe scene (Clouds) ── */
function CloudsScene(props: SceneProps) {
  const [tex, , cloudTex] = useLoader(THREE.TextureLoader, STYLE_CONFIGS["clouds"].textures);
  useEffect(() => { if (tex) tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  const cloudRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.02;
  });
  return (
    <GlobeSceneShell {...props} style="clouds">
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshBasicMaterial map={cloudTex} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </GlobeSceneShell>
  );
}

/* ── Globe scene (Dark Minimal — GitHub-style) ── */
function DarkMinimalScene(props: SceneProps) {
  const [bump] = useLoader(THREE.TextureLoader, STYLE_CONFIGS["dark-minimal"].textures);
  return (
    <GlobeSceneShell {...props} style="dark-minimal">
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0d1117"
          bumpMap={bump}
          bumpScale={0.05}
          roughness={0.9}
          metalness={0.3}
          emissive={new THREE.Color(0x0d2818)}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Subtle grid lines */}
      <mesh>
        <sphereGeometry args={[1.002, 48, 48]} />
        <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </GlobeSceneShell>
  );
}

/* ── Shared scene shell (rotation, dots, arcs, atmosphere, lighting) ── */
interface SceneProps {
  autoRotate?: boolean;
  frozen?: boolean;
  lonOffset?: number;
  latOffset?: number;
  journeyDots?: JourneyDot[];
  selectedDot?: number;
  journeyArcs?: { from: number; to: number }[];
  onDotClick?: (index: number) => void;
}

function GlobeSceneShell({
  autoRotate,
  frozen,
  lonOffset = 0,
  latOffset = 0,
  journeyDots,
  selectedDot,
  journeyArcs,
  onDotClick,
  style,
  children,
}: SceneProps & { style: GlobeVisualStyle; children: React.ReactNode }) {
  const globeRef = useRef<THREE.Group>(null);
  const RADIUS = 1;
  const config = STYLE_CONFIGS[style];

  const targetRotation = useRef<[number, number] | null>(null);
  // Three.js SphereGeometry: at rotation.y=0, prime meridian (lon=0) faces +Z.
  // Camera is at +Z looking toward origin. To show lon L, set rotation.y = -(L * π/180).
  // For NYC (lon=-74), rotation.y = 74° in degrees → shows western hemisphere.
  const currentRotation = useRef<[number, number]>([74, 0]);
  const transitionT = useRef(1);

  useEffect(() => {
    if (journeyDots && selectedDot !== undefined && journeyDots[selectedDot]) {
      const [lon, lat] = journeyDots[selectedDot].coords;
      // Negate lon to rotate that longitude toward camera; dampen lat tilt
      targetRotation.current = [-lon, -lat * 0.35];
      transitionT.current = 0;
    }
  }, [selectedDot, journeyDots]);

  useFrame((_, delta) => {
    if (!globeRef.current) return;
    if (targetRotation.current && transitionT.current < 1) {
      transitionT.current = Math.min(1, transitionT.current + delta * 0.7);
      const t = easeOutCubic(transitionT.current);
      // Blend toward target — use higher factor for snappier response
      currentRotation.current[0] = lerpAngle(currentRotation.current[0], targetRotation.current[0], t * 0.08);
      currentRotation.current[1] += (targetRotation.current[1] - currentRotation.current[1]) * t * 0.08;
    } else if (autoRotate && selectedDot === undefined) {
      currentRotation.current[0] += delta * 8;
    }
    globeRef.current.rotation.y = ((currentRotation.current[0] + lonOffset) * Math.PI) / 180;
    globeRef.current.rotation.x = ((currentRotation.current[1] + latOffset) * Math.PI) / 180;
  });

  const dotPositions = useMemo(() => {
    if (!journeyDots) return [];
    return journeyDots.map((dot) => latLonToVec3(dot.coords[1], dot.coords[0], RADIUS * 1.005));
  }, [journeyDots]);

  const handleDotClick = useCallback((i: number) => { onDotClick?.(i); }, [onDotClick]);

  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: makeAtmosphereFrag(...config.atmosphereColor, config.atmosphereStrength),
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    [style]
  );

  return (
    <>
      <ambientLight intensity={config.ambientIntensity + 0.4} />
      <directionalLight position={[0, 0, 5]} intensity={3} />
      <directionalLight position={[5, 3, 2]} intensity={1.5} />
      <directionalLight position={[-3, -1, 3]} intensity={0.8} />

      <group ref={globeRef}>
        {children}

        {/* Atmosphere glow */}
        <mesh material={atmosphereMat}>
          <sphereGeometry args={[RADIUS * 1.12, 64, 64]} />
        </mesh>

        {/* Journey dots */}
        {journeyDots &&
          dotPositions.map((pos, i) => (
            <DotMarker
              key={i}
              position={pos}
              isSelected={selectedDot === i}
              isVisited={selectedDot !== undefined && i <= selectedDot}
              index={i}
              onClick={handleDotClick}
              color={config.dotColor}
            />
          ))}

        {/* Journey arcs */}
        {journeyArcs &&
          journeyDots &&
          selectedDot !== undefined &&
          selectedDot > 0 &&
          journeyArcs
            .filter((a) => a.to <= selectedDot!)
            .map((arc, i) => (
              <ArcLine
                key={i}
                from={journeyDots[arc.from].coords}
                to={journeyDots[arc.to].coords}
                radius={RADIUS}
                color={config.arcColor}
              />
            ))}
      </group>
    </>
  );
}

/* ── Main component ── */
export default function RealisticGlobe({
  width = 700,
  height = 700,
  autoRotate = true,
  frozen = false,
  visualStyle = "blue-marble",
  lonOffset = 0,
  latOffset = 0,
  journeyDots,
  selectedDot,
  journeyArcs,
  onDotClick,
}: RealisticGlobeProps) {
  const sceneProps = { autoRotate, frozen, lonOffset, latOffset, journeyDots, selectedDot, journeyArcs, onDotClick };

  const SceneComponent = {
    "blue-marble": BlueMarbleScene,
    "night-lights": NightLightsScene,
    clouds: CloudsScene,
    "dark-minimal": DarkMinimalScene,
  }[visualStyle];

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneComponent {...sceneProps} />
        </Suspense>
      </Canvas>
    </div>
  );
}
