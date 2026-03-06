---
paths:
  - "src/**"
---
# Primary Site (Next.js) Architecture Rules

- Keep edits localized:
  - Copy/content: `src/data/**` (avoid embedding long copy in components)
  - UI layout: `src/components/**`, `src/app/**`
  - Styling: `src/app/globals.css` + component styles
- Keep components clean and composable; avoid dumping everything into `page.tsx`.
- Prefer incremental ports from `legacy/design-inspo` (wrap → refactor).
