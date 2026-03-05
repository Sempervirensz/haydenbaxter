/* eslint-disable react-hooks/refs */
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { geoContains } from "d3-geo";
import { feature as topoFeature } from "topojson-client";
import * as THREE from "three";
import land110m from "world-atlas/land-110m.json";

export type ParticleGlobeProps = {
  size?: number;
  particleCount?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
};

type Pulse = {
  x: number;
  y: number;
  z: number;
  start: number;
};

type InteractionState = {
  hovered: boolean;
  pointerDown: boolean;
  dragging: boolean;
  ndcX: number;
  ndcY: number;
  hasSpherePointer: boolean;
  sphereX: number;
  sphereY: number;
  sphereZ: number;
  pointerFlowX: number;
  pointerFlowY: number;
  pointerFlowZ: number;
  pointerFlowSpeed: number;
  lastX: number;
  lastY: number;
  yaw: number;
  pitch: number;
  yawVelocity: number;
  pitchVelocity: number;
  turbulenceBoost: number;
  renderTime: number;
  pulses: Pulse[];
};

type ParticleBuffers = {
  positions: Float32Array;
  targets: Float32Array;
  velocities: Float32Array;
  sizes: Float32Array;
  baseAlpha: Float32Array;
  alpha: Float32Array;
  tones: Float32Array;
  coast: Float32Array;
  neighborsA: Uint32Array;
  neighborsB: Uint32Array;
};

const BASE_RADIUS = 1.0;
const POINTER_FIELD_RADIUS = 0.64;
const PULSE_LIFETIME = 1.4;
const PULSE_SPEED = 1.05;
const PULSE_SPREAD = 0.14;
const DEG = 180 / Math.PI;
const LAND_QUERY_CACHE = new Map<string, boolean>();
const LAND_GRID_LON = 180;
const LAND_GRID_LAT = 90;

const ATLAS_LAND_FEATURE = (() => {
  try {
    const topology = land110m as any;
    return topoFeature(topology, topology.objects.land) as any;
  } catch {
    return null;
  }
})();

let atlasLandGrid: Uint8Array | null = null;
let atlasGridStatus: "idle" | "building" | "ready" = "idle";
const atlasReadyListeners = new Set<() => void>();

function notifyAtlasReady() {
  for (const listener of atlasReadyListeners) {
    listener();
  }
}

function buildAtlasLandGrid(): Uint8Array | null {
  if (!ATLAS_LAND_FEATURE) {
    return null;
  }

  const grid = new Uint8Array(LAND_GRID_LON * LAND_GRID_LAT);
  let idx = 0;
  for (let y = 0; y < LAND_GRID_LAT; y += 1) {
    const lat = 89.5 - (y / (LAND_GRID_LAT - 1)) * 179;
    for (let x = 0; x < LAND_GRID_LON; x += 1) {
      const lon = -179.5 + (x / (LAND_GRID_LON - 1)) * 359;
      grid[idx] = geoContains(ATLAS_LAND_FEATURE, [lon, lat]) ? 1 : 0;
      idx += 1;
    }
  }

  return grid;
}

function ensureAtlasLandGridAsync() {
  if (atlasLandGrid || atlasGridStatus !== "idle") {
    return;
  }
  atlasGridStatus = "building";

  // Build after the initial frame so the fallback globe can render immediately.
  window.setTimeout(() => {
    atlasLandGrid = buildAtlasLandGrid();
    LAND_QUERY_CACHE.clear();
    atlasGridStatus = atlasLandGrid ? "ready" : "idle";
    if (atlasLandGrid) {
      notifyAtlasReady();
    }
  }, 0);
}

function getAtlasLandGrid(): Uint8Array | null {
  if (atlasLandGrid) {
    return atlasLandGrid;
  }

  if (typeof window !== "undefined") {
    ensureAtlasLandGridAsync();
  }

  return null;
}

function subscribeAtlasReady(listener: () => void): () => void {
  atlasReadyListeners.add(listener);
  return () => atlasReadyListeners.delete(listener);
}

type LonLat = readonly [number, number];

type LandPolygon = {
  points: readonly LonLat[];
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
};

const RAW_LAND_POLYGONS: readonly (readonly LonLat[])[] = [
  // North America
  [
    [-168, 71],
    [-150, 69],
    [-136, 72],
    [-124, 70],
    [-112, 65],
    [-100, 62],
    [-90, 57],
    [-83, 49],
    [-78, 42],
    [-80, 32],
    [-88, 25],
    [-97, 18],
    [-107, 22],
    [-116, 28],
    [-124, 36],
    [-132, 46],
    [-145, 58],
    [-160, 66],
  ],
  // Greenland
  [
    [-73, 82],
    [-54, 83],
    [-38, 78],
    [-25, 71],
    [-32, 62],
    [-48, 58],
    [-62, 61],
    [-70, 70],
  ],
  // Central America
  [
    [-97, 24],
    [-90, 21],
    [-84, 18],
    [-80, 13],
    [-82, 8],
    [-88, 9],
    [-93, 15],
  ],
  // South America
  [
    [-81, 12],
    [-73, 10],
    [-64, 6],
    [-56, 2],
    [-50, -6],
    [-47, -16],
    [-49, -26],
    [-55, -35],
    [-62, -43],
    [-70, -55],
    [-76, -51],
    [-78, -38],
    [-79, -24],
    [-79, -10],
  ],
  // Africa
  [
    [-18, 36],
    [-6, 37],
    [7, 36],
    [20, 34],
    [31, 31],
    [39, 22],
    [47, 11],
    [50, 2],
    [46, -11],
    [40, -22],
    [34, -31],
    [24, -35],
    [14, -34],
    [7, -29],
    [1, -20],
    [-4, -8],
    [-8, 4],
    [-13, 15],
    [-17, 25],
  ],
  // Europe
  [
    [-11, 36],
    [-2, 43],
    [11, 45],
    [22, 48],
    [33, 55],
    [29, 61],
    [18, 62],
    [8, 59],
    [0, 54],
    [-7, 49],
    [-11, 43],
  ],
  // Asia main body
  [
    [26, 36],
    [39, 41],
    [52, 47],
    [66, 54],
    [82, 58],
    [98, 61],
    [116, 58],
    [132, 52],
    [147, 48],
    [161, 55],
    [170, 66],
    [149, 72],
    [124, 73],
    [101, 70],
    [81, 65],
    [61, 57],
    [47, 50],
    [36, 44],
    [29, 40],
  ],
  // Arabia / Middle East
  [
    [34, 32],
    [44, 32],
    [53, 27],
    [56, 18],
    [50, 13],
    [43, 15],
    [38, 22],
  ],
  // India
  [
    [68, 24],
    [78, 29],
    [88, 25],
    [91, 18],
    [86, 8],
    [78, 7],
    [72, 13],
  ],
  // Southeast Asia
  [
    [95, 22],
    [107, 20],
    [115, 13],
    [116, 5],
    [109, -1],
    [102, 3],
    [99, 12],
  ],
  // East Asia / Korea / Japan arc
  [
    [118, 39],
    [126, 43],
    [133, 41],
    [141, 38],
    [145, 44],
    [141, 32],
    [132, 29],
    [123, 31],
  ],
  // Australia
  [
    [112, -11],
    [123, -12],
    [136, -15],
    [148, -24],
    [153, -35],
    [145, -43],
    [132, -43],
    [119, -35],
    [112, -24],
  ],
  // Madagascar
  [
    [47, -13],
    [51, -15],
    [51, -23],
    [47, -26],
    [44, -20],
  ],
];

const LAND_POLYGONS: readonly LandPolygon[] = RAW_LAND_POLYGONS.map((points) => {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lon, lat] of points) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return { points, minLon, maxLon, minLat, maxLat };
});

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(current: number, target: number, t: number): number {
  return current + (target - current) * t;
}

function easeDamp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

function trigNoise3(x: number, y: number, z: number, t: number): number {
  return (
    Math.sin(x * 4.7 + t * 0.8) * 0.45 +
    Math.sin(y * 5.9 - t * 0.7) * 0.35 +
    Math.sin(z * 6.3 + t * 1.2) * 0.2
  );
}

function wrapLon(lon: number): number {
  let wrapped = lon;
  while (wrapped <= -180) wrapped += 360;
  while (wrapped > 180) wrapped -= 360;
  return wrapped;
}

function pointInPolygon(lon: number, lat: number, polygon: readonly LonLat[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = yi > lat !== yj > lat;
    if (!crosses) {
      continue;
    }
    const xIntersect = ((xj - xi) * (lat - yi)) / (yj - yi + 1e-9) + xi;
    if (lon < xIntersect) {
      inside = !inside;
    }
  }
  return inside;
}

function isLandAt(lon: number, lat: number): boolean {
  const l = wrapLon(lon);
  const a = clamp(lat, -85, 85);
  for (const polygon of LAND_POLYGONS) {
    if (l < polygon.minLon || l > polygon.maxLon || a < polygon.minLat || a > polygon.maxLat) {
      continue;
    }
    if (pointInPolygon(l, a, polygon.points)) {
      return true;
    }
  }
  return false;
}

function isLandAtAccurate(lon: number, lat: number): boolean {
  const qLon = Math.round(wrapLon(lon) * 2) / 2;
  const qLat = Math.round(clamp(lat, -89.5, 89.5) * 2) / 2;
  const cacheKey = `${qLon}|${qLat}`;
  const cached = LAND_QUERY_CACHE.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  let value = false;
  const grid = getAtlasLandGrid();
  if (grid) {
    const xf = ((qLon + 180) / 360) * (LAND_GRID_LON - 1);
    const yf = ((89.5 - qLat) / 179) * (LAND_GRID_LAT - 1);
    const xi = clamp(Math.round(xf), 0, LAND_GRID_LON - 1);
    const yi = clamp(Math.round(yf), 0, LAND_GRID_LAT - 1);
    value = grid[yi * LAND_GRID_LON + xi] === 1;
  } else {
    value = isLandAt(qLon, qLat);
  }

  LAND_QUERY_CACHE.set(cacheKey, value);
  return value;
}

function sampleContinents(lon: number, lat: number, x: number, y: number, z: number): { land: number; coast: number } {
  const breakup = 0.5 + 0.5 * trigNoise3(x * 1.2, y * 1.2, z * 1.2, 0);
  const landHere = isLandAtAccurate(lon, lat);

  const coastProbe = 0.9;
  const probeOffsets: readonly LonLat[] = [
    [coastProbe, 0],
    [-coastProbe, 0],
    [0, coastProbe],
    [0, -coastProbe],
    [coastProbe * 0.75, coastProbe * 0.75],
    [-coastProbe * 0.75, coastProbe * 0.75],
    [coastProbe * 0.75, -coastProbe * 0.75],
    [-coastProbe * 0.75, -coastProbe * 0.75],
  ];

  let edgeHits = 0;
  for (const [dLon, dLat] of probeOffsets) {
    if (isLandAtAccurate(lon + dLon, lat + dLat) !== landHere) {
      edgeHits += 1;
    }
  }

  const edgeFactor = edgeHits / probeOffsets.length;
  const land = landHere ? clamp(0.9 + breakup * 0.1, 0, 1) : 0;
  const coast = landHere
    ? edgeFactor * (0.42 + 0.36 * breakup)
    : edgeFactor * (0.14 + 0.18 * breakup);
  return { land: clamp(land, 0, 1), coast: clamp(coast, 0, 1) };
}

function createParticleBuffers(count: number, radius: number): ParticleBuffers {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const baseAlpha = new Float32Array(count);
  const alpha = new Float32Array(count);
  const tones = new Float32Array(count);
  const coast = new Float32Array(count);
  const neighborsA = new Uint32Array(count);
  const neighborsB = new Uint32Array(count);

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const fi = i + 0.5;
    const y = 1 - (fi / count) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = fi * goldenAngle;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const lat = Math.asin(clamp(y, -1, 1)) * DEG;
    const lon = Math.atan2(z, x) * DEG;
    const sampled = sampleContinents(lon, lat, x, y, z);
    const land = sampled.land;
    const coastFactor = sampled.coast;
    const shell = radius * (0.998 + land * 0.004 + coastFactor * 0.001);

    const idx3 = i * 3;
    targets[idx3] = x * shell;
    targets[idx3 + 1] = y * shell;
    targets[idx3 + 2] = z * shell;

    positions[idx3] = targets[idx3];
    positions[idx3 + 1] = targets[idx3 + 1];
    positions[idx3 + 2] = targets[idx3 + 2];

    sizes[i] = 0.42 + land * 0.26 + coastFactor * 0.12 + ((i % 7) / 7) * 0.05;
    baseAlpha[i] = 0.24 + land * 0.56 + coastFactor * 0.08;
    alpha[i] = baseAlpha[i];
    tones[i] = clamp(0.34 + land * 0.58 + coastFactor * 0.12, 0, 1);
    coast[i] = coastFactor;

    neighborsA[i] = (i + 97) % count;
    neighborsB[i] = (i + 7919) % count;
  }

  return {
    positions,
    targets,
    velocities,
    sizes,
    baseAlpha,
    alpha,
    tones,
    coast,
    neighborsA,
    neighborsB,
  };
}

function getInitialCount(reducedMotion: boolean, requestedCount?: number): number {
  if (typeof requestedCount === "number") {
    return clamp(Math.floor(requestedCount), 800, 30000);
  }

  if (typeof window === "undefined") {
    return reducedMotion ? 8000 : 12000;
  }

  const dpr = window.devicePixelRatio || 1;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowPower = coarse || cores <= 4 || dpr > 2.3;

  if (reducedMotion) {
    return lowPower ? 5000 : 7000;
  }
  return lowPower ? 9000 : 14000;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function ndcToSphere(ndcX: number, ndcY: number, radius: number): { x: number; y: number; z: number } | null {
  const x = ndcX * radius;
  const y = ndcY * radius;
  const d2 = x * x + y * y;
  if (d2 > radius * radius) {
    return null;
  }
  const z = Math.sqrt(radius * radius - d2);
  return { x, y, z };
}

function cameraSphereToLocal(
  hit: { x: number; y: number; z: number },
  yaw: number,
  pitch: number
): { x: number; y: number; z: number } {
  // Inverse of the globe group's yaw/pitch so pointer forces track the visible rotated surface.
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = hit.x * cosY - hit.z * sinY;
  const z1 = hit.x * sinY + hit.z * cosY;

  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);
  const y2 = hit.y * cosX + z1 * sinX;
  const z2 = -hit.y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

function GlobePoints({
  count,
  landMaskVersion,
  rotationSpeed,
  interactive,
  reducedMotion,
  interactionRef,
}: {
  count: number;
  landMaskVersion: number;
  rotationSpeed: number;
  interactive: boolean;
  reducedMotion: boolean;
  interactionRef: MutableRefObject<InteractionState>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const buffersRef = useRef<ParticleBuffers>(createParticleBuffers(count, BASE_RADIUS));
  const lastCountRef = useRef(count);
  const lastLandMaskVersionRef = useRef(landMaskVersion);
  if (lastCountRef.current !== count || lastLandMaskVersionRef.current !== landMaskVersion) {
    buffersRef.current = createParticleBuffers(count, BASE_RADIUS);
    lastCountRef.current = count;
    lastLandMaskVersionRef.current = landMaskVersion;
  }
  const buffers = buffersRef.current;
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(buffers.sizes, 1));
    geom.setAttribute("aAlpha", new THREE.BufferAttribute(buffers.alpha, 1));
    geom.setAttribute("aTone", new THREE.BufferAttribute(buffers.tones, 1));
    geom.setAttribute("aCoast", new THREE.BufferAttribute(buffers.coast, 1));
    return geom;
  }, [buffers]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uPointScale: { value: 1.0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        attribute float aTone;
        attribute float aCoast;
        varying float vAlpha;
        varying float vTone;
        varying float vCoast;
        uniform float uPointScale;
        void main() {
          vAlpha = aAlpha;
          vTone = aTone;
          vCoast = aCoast;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depthScale = clamp(28.0 / -mvPosition.z, 0.0, 4.0);
          gl_PointSize = max(0.55, aSize * depthScale * uPointScale);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vTone;
        varying float vCoast;
        void main() {
          vec2 centered = gl_PointCoord - vec2(0.5);
          float d = length(centered);
          float softDisc = smoothstep(0.52, 0.0, d);
          float tone = clamp(vTone, 0.0, 1.0);
          float coast = clamp(vCoast, 0.0, 1.0);
          vec3 oceanDark = vec3(0.40, 0.41, 0.43);
          vec3 landLight = vec3(0.93, 0.94, 0.95);
          vec3 color = mix(oceanDark, landLight, tone);
          color = mix(color, vec3(1.0), coast * 0.4);
          float alpha = vAlpha * softDisc;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, []);

  useFrame(({ clock }, dt) => {
    const frameDt = clamp(dt, 0, 0.034);
    const time = clock.getElapsedTime();
    const interaction = interactionRef.current;
    const positions = buffers.positions;
    const targets = buffers.targets;
    const velocities = buffers.velocities;
    const alpha = buffers.alpha;
    const baseAlpha = buffers.baseAlpha;
    const coast = buffers.coast;
    const neighborsA = buffers.neighborsA;
    const neighborsB = buffers.neighborsB;
    const pulses = interaction.pulses;
    interaction.renderTime = time;

    interaction.turbulenceBoost = easeDamp(
      interaction.turbulenceBoost,
      interaction.hovered ? 1 : 0,
      3.2,
      frameDt
    );
    interaction.pointerFlowX *= Math.exp(-7.5 * frameDt);
    interaction.pointerFlowY *= Math.exp(-7.5 * frameDt);
    interaction.pointerFlowZ *= Math.exp(-7.5 * frameDt);
    interaction.pointerFlowSpeed = easeDamp(interaction.pointerFlowSpeed, 0, 5.5, frameDt);

    const autoRotate = reducedMotion ? 0 : rotationSpeed;
    interaction.yaw += autoRotate * frameDt;
    interaction.yaw += interaction.yawVelocity * frameDt;
    interaction.pitch += interaction.pitchVelocity * frameDt;

    interaction.pitch = clamp(interaction.pitch, -0.65, 0.65);
    interaction.yawVelocity *= Math.exp(-6 * frameDt);
    interaction.pitchVelocity *= Math.exp(-6 * frameDt);

    if (groupRef.current) {
      groupRef.current.rotation.y = interaction.yaw;
      groupRef.current.rotation.x = interaction.pitch;
    }

    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      if (time - pulses[i].start > PULSE_LIFETIME) {
        pulses.splice(i, 1);
      }
    }

    const noiseAmpBase = reducedMotion ? 0.001 : 0.005;
    const noiseAmp = noiseAmpBase + interaction.turbulenceBoost * 0.012;
    const pointerRadialSign = interaction.pointerDown ? -1 : 1;
    const pointerX = interaction.sphereX;
    const pointerY = interaction.sphereY;
    const pointerZ = interaction.sphereZ;
    const hasPointer = interactive && interaction.hasSpherePointer;

    const cosY = Math.cos(interaction.yaw);
    const sinY = Math.sin(interaction.yaw);
    const cosX = Math.cos(interaction.pitch);
    const sinX = Math.sin(interaction.pitch);

    for (let i = 0; i < count; i += 1) {
      const idx3 = i * 3;
      let px = positions[idx3];
      let py = positions[idx3 + 1];
      let pz = positions[idx3 + 2];

      const tx = targets[idx3];
      const ty = targets[idx3 + 1];
      const tz = targets[idx3 + 2];

      let vx = velocities[idx3];
      let vy = velocities[idx3 + 1];
      let vz = velocities[idx3 + 2];

      const swirl = trigNoise3(tx, ty, tz, time + i * 0.00007);
      const curlX = trigNoise3(ty + 1.7, tz + 2.3, tx - 0.9, time * 0.9);
      const curlY = trigNoise3(tz - 1.3, tx + 0.2, ty + 2.7, time * 0.8);
      const curlZ = trigNoise3(tx + 2.1, ty - 1.8, tz + 0.4, time * 1.1);

      const desiredX = tx + curlX * noiseAmp * (0.6 + swirl * 0.4);
      const desiredY = ty + curlY * noiseAmp * (0.6 + swirl * 0.4);
      const desiredZ = tz + curlZ * noiseAmp * (0.6 + swirl * 0.4);

      vx += (desiredX - px) * 3.4 * frameDt;
      vy += (desiredY - py) * 3.4 * frameDt;
      vz += (desiredZ - pz) * 3.4 * frameDt;

      const na3 = neighborsA[i] * 3;
      const nb3 = neighborsB[i] * 3;
      const nvx = (velocities[na3] + velocities[nb3]) * 0.5;
      const nvy = (velocities[na3 + 1] + velocities[nb3 + 1]) * 0.5;
      const nvz = (velocities[na3 + 2] + velocities[nb3 + 2]) * 0.5;
      let pointerProximity = 0;

      if (hasPointer) {
        const dx = px - pointerX;
        const dy = py - pointerY;
        const dz = pz - pointerZ;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radiusSq = POINTER_FIELD_RADIUS * POINTER_FIELD_RADIUS;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(Math.max(distSq, 1e-5));
          pointerProximity = (1 - dist / POINTER_FIELD_RADIUS) ** 2;
          const force = pointerProximity * 6.4;
          const inv = 1 / dist;
          const localLenInv = 1 / (Math.sqrt(px * px + py * py + pz * pz) + 1e-5);
          const nx = px * localLenInv;
          const ny = py * localLenInv;
          const nz = pz * localLenInv;

          let txf = dx - nx * (dx * nx + dy * ny + dz * nz);
          let tyf = dy - ny * (dx * nx + dy * ny + dz * nz);
          let tzf = dz - nz * (dx * nx + dy * ny + dz * nz);
          const tangentLen = Math.sqrt(txf * txf + tyf * tyf + tzf * tzf) + 1e-5;
          txf /= tangentLen;
          tyf /= tangentLen;
          tzf /= tangentLen;

          // Swirl around the local surface normal creates a looser, flow-like disturbance.
          let sx = ny * tzf - nz * tyf;
          let sy = nz * txf - nx * tzf;
          let sz = nx * tyf - ny * txf;
          const swirlLen = Math.sqrt(sx * sx + sy * sy + sz * sz) + 1e-5;
          sx /= swirlLen;
          sy /= swirlLen;
          sz /= swirlLen;

          const tangentForce = force * (interaction.pointerDown ? 0.55 : 0.72);
          const swirlForce = force * (interaction.pointerDown ? -1.15 : 0.95);
          const radialForce = force * (interaction.pointerDown ? 0.42 : 0.22) * pointerRadialSign;
          const flowDotN =
            interaction.pointerFlowX * nx + interaction.pointerFlowY * ny + interaction.pointerFlowZ * nz;
          let flowX = interaction.pointerFlowX - nx * flowDotN;
          let flowY = interaction.pointerFlowY - ny * flowDotN;
          let flowZ = interaction.pointerFlowZ - nz * flowDotN;
          const flowLen = Math.sqrt(flowX * flowX + flowY * flowY + flowZ * flowZ) + 1e-5;
          flowX /= flowLen;
          flowY /= flowLen;
          flowZ /= flowLen;
          const flowForce =
            force *
            clamp(0.38 + interaction.pointerFlowSpeed * (interaction.pointerDown ? 1.8 : 2.4), 0.38, 4.2);

          vx += (dx * inv) * radialForce * frameDt;
          vy += (dy * inv) * radialForce * frameDt;
          vz += (dz * inv) * radialForce * frameDt;

          vx += txf * tangentForce * frameDt;
          vy += tyf * tangentForce * frameDt;
          vz += tzf * tangentForce * frameDt;

          vx += sx * swirlForce * frameDt;
          vy += sy * swirlForce * frameDt;
          vz += sz * swirlForce * frameDt;

          // Direct advection tracks the pointer path more closely than a purely radial field.
          vx += flowX * flowForce * frameDt;
          vy += flowY * flowForce * frameDt;
          vz += flowZ * flowForce * frameDt;
        }
      }

      const neighborBlend = 0.6 + (1 - pointerProximity) * 0.65;
      vx += (nvx - vx) * neighborBlend * frameDt;
      vy += (nvy - vy) * neighborBlend * frameDt;
      vz += (nvz - vz) * neighborBlend * frameDt;

      if (!reducedMotion && pulses.length > 0) {
        for (let p = 0; p < pulses.length; p += 1) {
          const pulse = pulses[p];
          const age = time - pulse.start;
          const waveRadius = age * PULSE_SPEED;
          const decay = 1 - age / PULSE_LIFETIME;
          if (decay <= 0) {
            continue;
          }
          const dx = px - pulse.x;
          const dy = py - pulse.y;
          const dz = pz - pulse.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-5;
          const wave = Math.exp(-((dist - waveRadius) * (dist - waveRadius)) / PULSE_SPREAD);
          const impulse = wave * decay * 6.0;
          vx += (dx / dist) * impulse * frameDt;
          vy += (dy / dist) * impulse * frameDt;
          vz += (dz / dist) * impulse * frameDt;
        }
      }

      const shellLen = Math.sqrt(px * px + py * py + pz * pz) + 1e-5;
      const shellDelta = BASE_RADIUS - shellLen;
      const shellForce = shellDelta * 7.0 * frameDt;
      vx += (px / shellLen) * shellForce;
      vy += (py / shellLen) * shellForce;
      vz += (pz / shellLen) * shellForce;

      const velDamping = Math.exp(-4.35 * frameDt);
      vx *= velDamping;
      vy *= velDamping;
      vz *= velDamping;

      const speedCap = 0.22;
      vx = clamp(vx, -speedCap, speedCap);
      vy = clamp(vy, -speedCap, speedCap);
      vz = clamp(vz, -speedCap, speedCap);

      px += vx * frameDt;
      py += vy * frameDt;
      pz += vz * frameDt;

      positions[idx3] = px;
      positions[idx3 + 1] = py;
      positions[idx3 + 2] = pz;
      velocities[idx3] = vx;
      velocities[idx3 + 1] = vy;
      velocities[idx3 + 2] = vz;

      const z1 = px * sinY + pz * cosY;
      const z2 = py * sinX + z1 * cosX;
      const front = clamp((z2 / BASE_RADIUS + 1) * 0.5, 0, 1);
      const shimmer = 0.9 + 0.1 * Math.sin(time * 0.7 + i * 0.013);
      const coastBoost = 1 + coast[i] * 0.2;
      alpha[i] = clamp(baseAlpha[i] * (0.58 + front * 0.50) * shimmer * coastBoost, 0.06, 1);
    }

    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const alphaAttr = geometry.getAttribute("aAlpha") as THREE.BufferAttribute;
    positionAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function AdaptiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const minDim = Math.min(size.width, size.height);

    if (minDim < 260) {
      cam.fov = 30;
      cam.position.z = 3.95;
    } else {
      cam.fov = 32;
      cam.position.z = 4.15;
    }

    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export function ParticleGlobe({
  size,
  particleCount,
  rotationSpeed = 0.14,
  interactive = true,
  className,
}: ParticleGlobeProps) {
  const reducedMotion = useReducedMotion();
  const count = useMemo(() => getInitialCount(reducedMotion, particleCount), [particleCount, reducedMotion]);
  const [landMaskVersion, setLandMaskVersion] = useState(0);

  useEffect(() => {
    return subscribeAtlasReady(() => {
      setLandMaskVersion((value) => value + 1);
    });
  }, []);

  const interactionRef = useRef<InteractionState>({
    hovered: false,
    pointerDown: false,
    dragging: false,
    ndcX: 0,
    ndcY: 0,
    hasSpherePointer: false,
    sphereX: 0,
    sphereY: 0,
    sphereZ: BASE_RADIUS,
    pointerFlowX: 0,
    pointerFlowY: 0,
    pointerFlowZ: 0,
    pointerFlowSpeed: 0,
    lastX: 0,
    lastY: 0,
    yaw: 0.35,
    pitch: 0.15,
    yawVelocity: 0,
    pitchVelocity: 0,
    turbulenceBoost: 0,
    renderTime: 0,
    pulses: [],
  });

  const wrapperClass = className ? `particle-globe ${className}` : "particle-globe";

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    const interaction = interactionRef.current;
    interaction.ndcX = clamp(nx, -1, 1);
    interaction.ndcY = clamp(ny, -1, 1);
    const hit = ndcToSphere(interaction.ndcX, interaction.ndcY, BASE_RADIUS);
    if (hit) {
      const localHit = cameraSphereToLocal(hit, interaction.yaw, interaction.pitch);
      if (interaction.hasSpherePointer) {
        const dx = localHit.x - interaction.sphereX;
        const dy = localHit.y - interaction.sphereY;
        const dz = localHit.z - interaction.sphereZ;
        interaction.pointerFlowX = interaction.pointerFlowX * 0.38 + dx * 48;
        interaction.pointerFlowY = interaction.pointerFlowY * 0.38 + dy * 48;
        interaction.pointerFlowZ = interaction.pointerFlowZ * 0.38 + dz * 48;
        const flowMag = Math.sqrt(dx * dx + dy * dy + dz * dz);
        interaction.pointerFlowSpeed = clamp(
          interaction.pointerFlowSpeed * 0.52 + flowMag * 68,
          0,
          3.2
        );
      }
      interaction.hasSpherePointer = true;
      interaction.sphereX = localHit.x;
      interaction.sphereY = localHit.y;
      interaction.sphereZ = localHit.z;
    } else {
      interaction.hasSpherePointer = false;
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }
    updatePointer(event);
    const interaction = interactionRef.current;
    interaction.hovered = true;

    if (interaction.dragging) {
      const dx = event.clientX - interaction.lastX;
      const dy = event.clientY - interaction.lastY;
      interaction.lastX = event.clientX;
      interaction.lastY = event.clientY;
      interaction.yawVelocity += dx * 0.00075;
      interaction.pitchVelocity += dy * 0.00075;
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }
    updatePointer(event);
    const interaction = interactionRef.current;
    interaction.hovered = true;
    interaction.pointerDown = true;
    interaction.dragging = true;
    interaction.lastX = event.clientX;
    interaction.lastY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    interaction.pointerDown = false;
    interaction.dragging = false;
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerLeave = () => {
    const interaction = interactionRef.current;
    interaction.hovered = false;
    interaction.pointerDown = false;
    interaction.dragging = false;
    interaction.hasSpherePointer = false;
    interaction.pointerFlowX = 0;
    interaction.pointerFlowY = 0;
    interaction.pointerFlowZ = 0;
    interaction.pointerFlowSpeed = 0;
  };

  const handleClick = () => {
    if (!interactive || reducedMotion) {
      return;
    }
    const interaction = interactionRef.current;
    if (!interaction.hasSpherePointer) {
      return;
    }
    interaction.pulses.push({
      x: interaction.sphereX,
      y: interaction.sphereY,
      z: interaction.sphereZ,
      start: interaction.renderTime,
    });
  };

  const resolvedSize = typeof size === "number" ? `${size}px` : "100%";

  return (
    <div
      className={wrapperClass}
      style={{ width: resolvedSize, height: resolvedSize }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0, 4.15], fov: 32 }}
        dpr={[1, reducedMotion ? 1.25 : count > 15000 ? 1.55 : 1.9]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveCamera />
        <AdaptiveDpr pixelated />
        <GlobePoints
          count={count}
          landMaskVersion={landMaskVersion}
          rotationSpeed={rotationSpeed}
          interactive={interactive}
          reducedMotion={reducedMotion}
          interactionRef={interactionRef}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}

export default ParticleGlobe;
