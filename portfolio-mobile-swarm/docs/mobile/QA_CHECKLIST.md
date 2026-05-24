# Mobile QA Checklist

The `mobile-qa-verifier` runs this across the device matrix. Each cell is PASS / FAIL / N-A. A
breakpoint is done only when every applicable row passes.

## Device matrix

Test each in **portrait and landscape**:

- 320 px — iPhone SE / small Android (tightest)
- 375 px — iPhone 13/14/15
- 393 px — Pixel
- 414 px — large Android
- 430 px — iPhone Pro Max

## Acceptance criteria

### Layout
- [ ] No horizontal scroll at 320px (and at every width).
- [ ] No content clipped; nothing overlaps illegibly.
- [ ] Type and spacing scale smoothly 320→430 (no cramped or sparse extremes).
- [ ] Safe-area insets respected — nothing under notch / home indicator / rounded corners.
- [ ] Landscape: full-height/pinned sections don't break or hide content.
- [ ] Glassmorphism / dark / coral aesthetic preserved (matches desktop language).

### Scrollytelling parity
- [ ] Every desktop beat (per audit baseline) fires on touch.
- [ ] Beats fire in the same order with matching easing.
- [ ] Pacing feels equivalent to desktop (re-tuned scrub distances per breakpoint).
- [ ] Pinned/full-height sections don't jump or clip when the address bar shows/hides.
- [ ] No scroll hijacking — native momentum scroll feels normal.
- [ ] Orientation change re-computes the timeline correctly (no stuck/misaligned state).

### Performance
- [ ] Sustained ≥ 50 fps during scrollytelling on a mid-tier phone profile.
- [ ] Never sustained < 30 fps.
- [ ] No long tasks > 200 ms during scroll.
- [ ] Pixel ratio clamped (≤ 2, lower on low-tier); shadows/AA within budget.
- [ ] Single rAF loop (renderer + scroll smoothing not competing).
- [ ] Render loop suspends when offscreen / tab hidden; resumes cleanly.
- [ ] No layout shift introduced by the mobile changes.

### Touch & interaction
- [ ] Every former hover affordance is reachable by touch (always-on or tap-toggle).
- [ ] Tap targets ≥ 44×44 px.
- [ ] No 300ms tap delay; deliberate tap-highlight; sensible `:active` feedback.
- [ ] 3D pointer/touch interactions work and don't fight page scroll.

### Accessibility
- [ ] `prefers-reduced-motion: reduce` gives a coherent, readable, low-motion experience.
- [ ] Contrast and focus states intact.

### Regression guard
- [ ] Desktop behavior unchanged at `min-width` breakpoints (spot-checked).
- [ ] No new console errors or WebGL context warnings on mobile.

## How to record

Produce a matrix in `docs/mobile/reports/QA.md`:

| Device / Orientation | Layout | Scrolly | Perf | Touch | A11y | Regression |
|----------------------|--------|---------|------|-------|------|------------|
| 320 portrait         |        |         |      |       |      |            |
| 320 landscape        |        |         |      |       |      |            |
| 375 portrait         |        |         |      |       |      |            |
| ...                  |        |         |      |       |      |            |

For each FAIL: note the issue, file:line if known, and the lane to route it back to.
