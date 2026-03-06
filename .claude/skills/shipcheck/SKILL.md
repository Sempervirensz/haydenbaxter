---
name: shipcheck
description: Run a lightweight QA checklist: Next homepage layout, carousel motion, reduced-motion behavior, and no console errors.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
---

# Shipcheck

Checklist:
1) `npm run dev`
2) Load `/` (homepage)
3) Verify:
   - No console errors
   - Hero renders correctly
   - Brand carousel scrolls smoothly
   - Reduced motion disables/pauses carousel animation
4) Mobile sanity check (narrow viewport)

Output:
- Issues found + file references
- Fixes ordered by impact
