# Particle Globe Fix Log

## Problem
The spinning particle globe on the main portfolio consulting card page appears "dented" (concave/non-spherical) and on mobile displays as "half a globe" — particles shifted to the right and clipped by the circular container.

## Architecture
- **Source**: `experiments/particle-globe-lab/src/components/ParticleGlobe.tsx` (React Three Fiber / Three.js)
- **Built output**: `experiments/particle-globe-lab/dist/` (Vite bundle, served via iframe)
- **Embedding**: `app/renderers/page.js` line 330 — iframe with `src="/experiments/particle-globe-lab/dist/?embed=1"`
- **CSS container**: `.cns-hero__orbShell` in `style.css` — circular clip via `border-radius: 50%; overflow: hidden`

---

## Strategy 1: Flatten Terrain Shell Variation
**Goal**: Remove the "dent" caused by ocean vs land height difference.

**What**: Ocean particles sit at `0.993 * radius`, land at `~1.005 * radius` — a 1.2% height gap visible as non-uniform sphere surface.

**Change** (line 493):
```
// Before
const shell = radius * (0.993 + land * 0.012 + coastFactor * 0.004);

// After
const shell = radius * (0.998 + land * 0.004 + coastFactor * 0.001);
```

**Result**: Relief reduced from 1.6% to 0.5%. Continents still subtly bulge but the sphere reads as round.

---

## Strategy 2: Reduce Curl Noise Amplitude
**Goal**: Prevent large-scale coherent deformations that create visible dents.

**What**: `trigNoise3` uses low-frequency sines (4.7, 5.9, 6.3) that create wave-like displacement patterns across the sphere surface.

**Change** (line 728):
```
// Before
const noiseAmpBase = reducedMotion ? 0.002 : 0.012;

// After
const noiseAmpBase = reducedMotion ? 0.001 : 0.005;
```

**Result**: Noise cut by ~60%. Particles still have organic movement but don't drift into coherent dent patterns.

---

## Strategy 3: Boost Back-Face Alpha
**Goal**: Fix the "half globe" appearance on mobile where back-facing particles were invisible.

**What**: Alpha formula made back-facing particles too transparent, so on small screens only the front hemisphere was visible.

**Change** (line 902):
```
// Before
alpha[i] = clamp(baseAlpha[i] * (0.42 + front * 0.66) * shimmer * coastBoost, 0.03, 1);

// After
alpha[i] = clamp(baseAlpha[i] * (0.58 + front * 0.50) * shimmer * coastBoost, 0.06, 1);
```

**Result**: Back-face base alpha raised from 0.42 to 0.58, floor from 0.03 to 0.06. Globe reads as a full sphere from all angles.

---

## Strategy 4: Strengthen Shell Constraint
**Goal**: Keep particles tightly on the sphere surface, preventing drift that breaks the spherical silhouette.

**What**: The spring force pulling particles back to the shell surface was too weak relative to other forces (pointer interaction, noise).

**Change** (line 871):
```
// Before
const shellForce = shellDelta * 3.3 * frameDt;

// After
const shellForce = shellDelta * 7.0 * frameDt;
```

**Result**: Particles snap back to the sphere surface ~2x faster after disturbance.

---

## Strategy 5: Adaptive Camera (FOV + Distance by Container Size)
**Goal**: Make the globe fill its container appropriately on all screen sizes.

**What**: Added `AdaptiveCamera` component using `useThree()` to adjust camera based on container dimensions.

**Iteration 1 — FAILED** (camera too close, caused overflow):
```
// Moved camera closer on small screens
if (minDim < 240) { cam.position.z = 4.6; cam.fov = 42; }  // wider FOV, farther
else if (minDim < 320) { cam.position.z = 4.35; cam.fov = 36; }
```
Problem: Wider FOV + farther distance made globe *smaller*. Then reversed to closer distance (3.4, 3.6) which made globe overflow canvas and get asymmetrically clipped.

**Iteration 2 — Current**:
```tsx
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
```

**Result**: Subtle zoom on small containers (z: 4.15 → 3.95, FOV: 32 → 30) without overflowing the canvas.

---

## Strategy 6: Enlarge Mobile CSS Container
**Goal**: Make the globe physically larger on mobile screens.

**What**: The `.cns-hero__orbShell` container was too small on mobile, making the globe hard to read.

**Change** (style.css line 5154, inside `@media (max-width: 960px)`):
```css
/* Before */
.cns-hero__orbShell { width: clamp(168px, 42vw, 214px); }

/* After */
.cns-hero__orbShell { width: clamp(210px, 52vw, 280px); }
```

Also bumped CSS cache version in `index.html`:
```
style.css?v=20260224-scv1  →  style.css?v=20260304-globe
```

**Result**: At 471px viewport → container grew from ~198px to ~245px.

---

## Failed / Reverted Attempts

### Wrong file: consulting-lab/lab.js
Accidentally edited the 2D canvas globe in the consulting concept gallery instead of the Three.js globe in the main portfolio. Changes reverted:
- `this.ry = this.rx * 1.14` (elliptical stretch) — not the target
- `perspective = 0.78 + ((z2 + 1) * 0.22)` — not the target

### First terrain + noise fix (reverted then re-applied)
Initial attempt with stronger values was reverted after user reported "cut off" and "lost interactivity." Re-applied with gentler values in the current build.

---

## Current Build State
- **Bundle**: `dist/assets/index-BBe8KcAM.js`
- **Server**: `python3 -m http.server 8000` at localhost:8000
- **Pending verification**: User needs to hard-refresh and confirm globe appearance on mobile (471x740)
