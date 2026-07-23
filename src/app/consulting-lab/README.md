# Consulting Hero Lab

Front-end-only test page for comparing Consulting hero/reveal directions.

## Scope
- Hero only
- Immediate reveal of 3 service paths
- No full consulting-page sections, routing systems, backend, or CMS

## File structure
- `src/data/consultingHeroLab.ts`
  - Content + config types
  - Control options
  - Variant presets
  - Default service paths
- `src/components/consulting-lab/variantDefinitions.ts`
  - Variant-specific display definitions
- `src/components/consulting-lab/ConsultingLabControls.tsx`
  - Control panel UI and control bindings
- `src/components/consulting-lab/ConsultingHeroRenderer.tsx`
  - Hero + path reveal renderer
- `src/components/consulting-lab/useConsultingReveal.ts`
  - Reveal logic (click / scroll + reduced motion handling)
- `src/components/consulting-lab.css`
  - Lab styles
- `src/components/ConsultingVariantLab.tsx`
  - Lab composition and state orchestration
- `src/app/consulting-lab/page.tsx`
  - Route entrypoint

## Add a new variant
1. Add the variant ID to `HeroVariant` in `src/data/consultingHeroLab.ts`.
2. Add label + preset in `HERO_VARIANT_LABELS` and `VARIANT_PRESETS`.
3. Add display definition in `src/components/consulting-lab/variantDefinitions.ts`.
4. Add/adjust CSS hooks in `src/components/consulting-lab.css` (e.g. `.heroLab-preview.is-yourVariant`).
