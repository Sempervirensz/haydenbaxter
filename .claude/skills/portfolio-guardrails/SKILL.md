---
name: portfolio-guardrails
description: Enforce architecture + design language while editing the primary Next.js site and consulting legacy/design-inspo as reference.
allowed-tools: Read, Grep, Glob
---

# Portfolio Guardrails

Before implementing changes:
- Classify the request: **copy**, **layout**, **behavior**, or **styling**.
- Use the correct layer:
  - Copy/content: `src/data/**`
  - Layout/components: `src/components/**`, `src/app/**`
  - Styling: `src/app/globals.css` (+ component styles)
- Use `legacy/design-inspo/**` as reference for CD, labels, and motion patterns.
- Preserve dark-only + DYMO labels + grounded motion.

Output requirements:
- List files to touch
- Smallest diff plan
- Verification checklist
