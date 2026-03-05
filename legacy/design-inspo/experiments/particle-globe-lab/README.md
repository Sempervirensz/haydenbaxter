# Particle Globe Lab

Standalone sandbox prototype for a cinematic monochrome interactive particle globe.

This lab is intentionally isolated in `experiments/particle-globe-lab` and does not depend on
the main app state, routing, or shared layout.

## Tech

- React + TypeScript + Vite
- `three`
- `@react-three/fiber`
- `@react-three/drei`

## Run

```bash
cd experiments/particle-globe-lab
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

## File Map

- `src/components/ParticleGlobe.tsx` - reusable component for future app integration
- `src/App.tsx` - standalone demo page + tuning controls
- `src/styles.css` - dark monochrome lab styling

## Required Interactions Implemented

1. Mouse proximity repulsion field
2. Mouse down attraction magnet
3. Click pulse/ripple propagation
4. Drag-to-rotate with inertia
5. Hover turbulence boost

## Controls In Demo

- **Quality**: low / medium / high particle presets
- **Quality (Auto)**: lets the component choose a safer particle count based on device profile + reduced motion
- **Rotation speed**: live speed slider
- **Interactions enabled**: toggle interaction logic

## Exposed Props (`ParticleGlobe`)

```ts
type ParticleGlobeProps = {
  size?: number;
  particleCount?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
};
```

## Performance Notes

- Uses `BufferGeometry` + `Points` + custom shader attributes (`aSize`, `aAlpha`, `aTone`)
- Keeps particle data in preallocated typed arrays; no per-frame array/object allocation in loops
- Approximates inter-particle behavior via fixed neighbor sampling (`O(n)`) instead of naive `O(n²)`
- Caps render DPR dynamically (`reduced motion` and high-count paths reduce DPR)
- Honors `prefers-reduced-motion` by lowering dynamics and turbulence energy

## Tuning Knobs (in `ParticleGlobe.tsx`)

- `POINTER_FIELD_RADIUS` - influence radius for repulsion/attraction
- `getInitialCount()` - device-adaptive quality heuristic used by `Auto` mode
- `PULSE_LIFETIME`, `PULSE_SPEED`, `PULSE_SPREAD` - ripple shape and propagation speed
- `noiseAmpBase` and hover boost ramp - turbulence feel
- spring/damping constants in `useFrame` loop:
  - shell spring (`shellForce`)
  - restore spring (`desired - position`)
  - velocity damping / speed cap

## Future Integration Notes

To embed later in the main app:

1. Copy `src/components/ParticleGlobe.tsx` into the target app component folder.
2. Ensure `three`, `@react-three/fiber`, and `@react-three/drei` are installed.
3. Import and render:

```tsx
<ParticleGlobe size={680} particleCount={12000} rotationSpeed={0.14} interactive />
```

4. Keep parent container dark/neutral for best contrast with monochrome particles.
