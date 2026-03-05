# Performance + Accessibility Rules

- Any animation must respect `prefers-reduced-motion`.
- Keep scroll handlers light (avoid heavy DOM work in hot paths).
- Keyboard usability for interactive elements (tab order, visible focus, ESC closes modals).
- Avoid layout shift: define image dimensions/aspect ratios where possible.
