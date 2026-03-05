---
name: port-brand-carousel
description: Port the Design-Inspo brand carousel into the Next.js homepage while preserving the original behavior and styling.
disable-model-invocation: true
allowed-tools: Read, Edit, Grep, Glob
---

# Port Brand Carousel (Design-Inspo → Next.js)

Goal: implement a BrandCarousel component for the primary Next.js site, using the reference section in `legacy/design-inspo`.

Reference sources (if present):
- Markup idea: `legacy/design-inspo/app/renderers/page.js` (renderBrands/buildBrandList)
- Data: `legacy/design-inspo/app/data/site-content.js` (brands/logos/repeats/note)
- CSS: `legacy/design-inspo/style.css` (.brands, .brands__track, keyframes)

Implementation targets (primary):
- Data: `src/data/siteContent.ts` (or similar)
- Component: `src/components/BrandCarousel.tsx`
- Styles: `src/app/globals.css`

Acceptance:
- Continuous scroll (no jump)
- Edge fade gradients
- Hover subtly brightens logos
- Works on mobile
- Respects prefers-reduced-motion (pause animation)
