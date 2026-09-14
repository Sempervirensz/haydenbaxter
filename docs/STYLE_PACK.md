# Hayden Baxter Product Style Pack

Use this to adapt the visual language of this app into another product app, especially a habit tracker, routine app, or calm productivity tool.

This is not a portfolio system.
Do not copy the homepage structure, case-study storytelling, brand marquee, or personal-brand sections.

## Core Vibe

- Dark matte surfaces
- Soft white hierarchy instead of bright white everywhere
- Premium restraint
- Tactile controls with subtle physical depth
- Apple-adjacent polish without glossy iOS mimicry
- Minimal accent color usage
- Calm, focused, clean product UI

## Use This

- `DM Sans` for the main app UI
- `DM Mono` for labels, pills, tabs, streaks, counters, and buttons
- `DM Serif Display` only as an occasional accent for milestone or empty-state moments
- Black and charcoal surfaces instead of colorful panels
- Thin borders and soft shadows
- Rounded cards and panels
- Buttons that feel pressed and tactile instead of loud and saturated

## Avoid This

- Bright gradients across the whole app
- Neon accents
- Bouncy motion
- Too many shadows
- Too many different card styles
- Portfolio-style editorial sections
- Big personal-brand hero layouts

## Fonts

- Primary UI font: `DM Sans, system-ui, sans-serif`
- Utility font: `DM Mono, ui-monospace, monospace`
- Optional accent font: `DM Serif Display, Georgia, serif`

## Color Tokens

```css
:root {
  --hb-app-bg: #0a0a0a;
  --hb-app-bg-deep: #000000;
  --hb-surface: #171717;
  --hb-surface-raised: #1c1c1c;
  --hb-surface-glass: rgba(255, 255, 255, 0.06);
  --hb-border-soft: rgba(255, 255, 255, 0.08);
  --hb-border-strong: rgba(255, 255, 255, 0.14);
  --hb-text-strong: rgba(255, 255, 255, 0.92);
  --hb-text-body: rgba(255, 255, 255, 0.62);
  --hb-text-muted: rgba(255, 255, 255, 0.36);
  --hb-accent-warm: #cba86a;
  --hb-success-soft: rgba(110, 200, 150, 0.16);
  --hb-danger-soft: rgba(255, 90, 80, 0.16);
}
```

## Surfaces

- App background: `#0A0A0A`
- Deep section background: `#000000`
- Default card surface: `#171717` or `rgba(255,255,255,0.03)`
- Raised button surface: `#1C1C1C`
- Glass panel surface: `rgba(255,255,255,0.06)`
- Border style: soft white hairline, never heavy outlines

## Buttons

Primary button style:

- Dark face
- Subtle border
- Hard bottom shadow
- Mono uppercase label for the DYMO feel
- Hover should mostly brighten text and border
- Active should feel pressed inward

Secondary button style:

- Near-transparent dark fill
- Soft border
- No heavy shadow
- Use for filters, utilities, and secondary actions

Ghost button style:

- Transparent background
- No heavy border
- Soft hover fill only
- Use for list actions and lightweight controls

```css
.hb-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--hb-border-soft);
  background: var(--hb-surface-raised);
  color: rgba(255, 255, 255, 0.82);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.65),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04),
    0 3px 0 #0b0b0b,
    0 6px 16px rgba(0, 0, 0, 0.35);
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  transition: color 140ms ease, border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
}

.hb-button:hover {
  color: var(--hb-text-strong);
  border-color: var(--hb-border-strong);
}

.hb-button:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 3px 6px rgba(0, 0, 0, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.28);
}

.hb-button--secondary {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: none;
}

.hb-button--ghost {
  background: transparent;
  box-shadow: none;
  border-color: transparent;
}
```

## Cards

Habit cards should feel quiet and premium:

- 12px to 18px radius
- Soft border
- Slightly translucent dark fill
- Soft inset highlight
- Use typography and spacing for hierarchy instead of extra decoration

```css
.hb-card {
  border-radius: 16px;
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.03);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.28);
  padding: 16px;
}

.hb-card-title {
  font-family: "DM Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--hb-text-strong);
}

.hb-card-meta {
  margin-top: 8px;
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--hb-text-muted);
}
```

## Chips And Pills

Use for:

- streak count
- cadence
- focus mode
- tags
- completion states

```css
.hb-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.72);
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
```

## Tabs

Use a dark segmented control instead of bright selected states.

```css
.hb-tabbar {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--hb-border-soft);
}

.hb-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  color: var(--hb-text-muted);
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hb-tab.is-active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--hb-text-strong);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
```

## Inputs

Inputs should feel slightly raised, not sunken and not pitch black.

```css
.hb-input {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--hb-border-soft);
  background: rgba(255, 255, 255, 0.04);
  color: var(--hb-text-strong);
  font-family: "DM Sans", system-ui, sans-serif;
  font-size: 14px;
}

.hb-input::placeholder {
  color: var(--hb-text-muted);
}

.hb-input:focus {
  outline: none;
  border-color: var(--hb-border-strong);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}
```

## Panels And Modals

- Use large radii
- Use matte or soft glass surfaces
- Keep overlays dark and low-contrast
- Blur is okay, but only lightly

```css
.hb-panel {
  border-radius: 22px;
  border: 1px solid var(--hb-border-soft);
  background: var(--hb-surface-glass);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
}
```

## Layout Guidance For A Habit Tracker

- Keep screens compact and calm
- Use one primary task per screen
- Let cards stack vertically with generous spacing
- Keep the top bar minimal
- Use pills for metadata instead of long labels
- Show progress in a subtle way
- Do not overdecorate the dashboard

Suggested structure:

- top bar
- today's habits
- streak or summary pills
- quick actions
- weekly rhythm or stats
- modal or sheet for editing habits

## Motion

- Buttons: `120ms` to `180ms`
- Cards and panels: `180ms` to `240ms`
- Use tiny `translateY` shifts only
- No bouncy springs for core actions
- No constant animation except maybe one subtle progress or ambient element

Reduced motion:

- remove decorative transforms
- remove ambient loops
- keep only opacity or border-color changes if needed

```css
@media (prefers-reduced-motion: reduce) {
  .hb-button,
  .hb-card,
  .hb-panel,
  .hb-tab {
    transition: none !important;
    transform: none !important;
  }
}
```

## Copy Tone

The app voice should feel:

- direct
- calm
- slightly premium
- human
- not playful in a cartoonish way
- not sterile or enterprise-heavy

Good examples:

- Today
- Evening Reset
- 3-day streak
- Mark complete
- Pause reminder
- Weekly rhythm

## Handoff Prompt

If you want another AI app to adapt this style, use this:

```text
Use this style pack to restyle the app into a dark premium habit tracker UI.
Keep the product structure of the current app, but replace its styling with this visual system:

- matte black and charcoal surfaces
- soft white text hierarchy
- DM Sans for core UI
- DM Mono for labels, tabs, chips, and buttons
- optional DM Serif Display only for very occasional accent moments
- tactile dark buttons with subtle pressed depth
- thin borders, soft shadows, and restrained glass surfaces
- Apple-adjacent polish, but not glossy and not overly colorful
- minimal accent color usage
- calm, focused, premium product feeling

Do not turn it into a portfolio or editorial landing page.
Do not add bright gradients, neon colors, or bouncy motion.
Adapt the existing app screens, controls, cards, tabs, and forms to this style system.
```
