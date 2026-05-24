# Mobile Port Spec — Source of Truth

**Every agent reads this file before doing anything.** It defines the mission, the non-negotiables,
the device matrix, the technical playbook, and the file-ownership lanes that keep the swarm from
colliding.

---

## 1. Mission

Bring the portfolio to **full visual and motion parity on mobile**, across every phone size, with
no desktop regressions. The scrollytelling sequences must animate on touch devices the same way
they do on desktop. Hover-triggered effects are the only acceptable behavioral difference, and they
must degrade gracefully (always-visible or tap-to-reveal), never just disappear.

## 2. Non-negotiables (the golden rules)

1. **Desktop is a protected baseline.** Gate desktop-only behavior behind `@media (hover: hover)`
   and `min-width` queries. Mobile work is additive. If a change could alter desktop rendering,
   it must be scoped so it can't.
2. **Same story, adapted mechanism.** Do not delete scroll beats or "lite" the narrative on mobile.
   Adapt *how* the animation is driven (touch scroll, dynamic viewport units, perf budget), not
   *what* it shows.
3. **Accessibility wins ties.** Honor `prefers-reduced-motion: reduce` everywhere — provide a
   static or minimal-motion path. Maintain tap-target and contrast standards.
4. **No assumptions — discover first.** Facts come from the audit report, not from guesses about
   the framework or scroll library.
5. **Measure, don't vibe.** Performance claims must be backed by the budget in §6. The QA agent
   verifies; implementer agents self-check before handing off.

## 3. Design language to preserve

The existing aesthetic must survive the port. Confirm these against the actual repo (the auditor
records the real tokens), but the expected language is:

- Dark / nighttime backgrounds, glassmorphism surfaces.
- Coral accent `#F97066` (verify exact value/token in the codebase).
- Type stack: Manrope (display), Inter (body), JetBrains Mono (code/labels).
- Apple-influenced motion: smooth, eased, depth/parallax. Mobile keeps the same easing curves and
  timing relationships, scaled to a touch-appropriate scroll distance.

Do **not** introduce new colors, fonts, or motion vocabularies. Reuse existing tokens/utilities.

## 4. Device & breakpoint matrix

Target the full range. Test portrait and landscape.

| Class            | Logical width | Representative device          | Notes                                   |
|------------------|---------------|--------------------------------|-----------------------------------------|
| Small phone      | 320–360 px    | iPhone SE, small Android       | Tightest layout; nothing may clip       |
| Standard phone   | 375–393 px    | iPhone 13/14/15, Pixel         | Primary target                          |
| Large phone      | 414–430 px    | iPhone Pro Max, large Android  | Don't let content feel sparse           |
| Landscape        | ≤ 430 px tall | any phone rotated              | Pinned/100vh sections must not break    |
| Foldable (nice)  | ~280 px       | Galaxy Fold cover screen       | Best-effort, no hard layout break       |

Honor device chrome: use `env(safe-area-inset-*)` for notches/home indicators.

## 5. Technical playbook

### 5.1 Viewport height (the #1 mobile scrollytelling bug)

`100vh` is wrong on mobile — it ignores the dynamic browser chrome (address bar) and causes
pinned/full-height sections to jump or overflow as the bar hides/shows.

- Use **dynamic viewport units**: `100dvh` for the live height, with `svh`/`lvh` where you want the
  small/large extreme deliberately.
- Fallback order for older browsers:
  ```css
  .full {
    height: 100vh;       /* fallback */
    height: 100svh;      /* small viewport, safe for pinned hero */
    height: 100dvh;      /* dynamic, preferred */
  }
  ```
- For scroll-pinned sections, prefer `svh` (smallest) so content never gets cut when the bar is
  visible, then let it grow.

### 5.2 Scrollytelling on touch (parity, not scroll-jacking)

The goal is the same scrubbed animation, driven by native momentum scroll.

- **Drive animation from scroll progress, not from wheel/touch hijacking.** Hijacking momentum on
  mobile feels broken. Keep native scroll; map scroll position → animation progress.
- **If the site uses GSAP ScrollTrigger:**
  - Set `ScrollTrigger.config({ ignoreMobileResize: true })` so the iOS address-bar resize doesn't
    spuriously refresh and snap the timeline.
  - Consider `ScrollTrigger.normalizeScroll(true)` to tame iOS address-bar show/hide jank on pinned
    sections (test — it changes scroll handling, so QA both ways).
  - For pinned scenes use `anticipatePin: 1` and verify `pin-spacer` doesn't introduce a visible
    jump on touch.
  - Recompute on orientation change: `ScrollTrigger.refresh()` on a debounced `orientationchange`.
- **If the site uses Lenis (or similar smooth scroll):**
  - Decide deliberately about `smoothTouch`. Default to **native touch scroll** (smoothTouch off)
    unless the desktop effect genuinely needs interpolated touch — interpolated touch often feels
    laggy and fights momentum. Document the choice.
  - Wire it to the scroll engine: `lenis.on('scroll', ScrollTrigger.update)` and drive `lenis.raf`
    from the same rAF loop as the WebGL renderer (don't run two competing rAF loops).
- **If the scrollytelling is custom (scroll/IntersectionObserver/rAF):**
  - Use `IntersectionObserver` for enter/exit and a passive `scroll` listener for progress.
    Listeners on scroll/touch must be `{ passive: true }`; never `preventDefault` on `touchmove`
    unless you intend to block scroll.
  - Read scroll once per rAF tick, not per scroll event. Cache layout reads; batch writes (avoid
    layout thrash).
- **Scroll distance:** mobile screens are shorter, so a section that scrubs over `300vh` on desktop
  may feel too fast or too slow on mobile. Re-tune scrub distances per breakpoint so the *pacing*
  matches desktop, even though pixel heights differ.
- **Compositing:** animate `transform` and `opacity` only. Promote moving layers with
  `transform: translateZ(0)` / `will-change: transform` (apply during the animation, remove after —
  permanent `will-change` wastes memory).

### 5.3 Three.js / WebGL performance on mobile

Mobile GPUs are far weaker and thermally throttled. Budget aggressively.

- **Clamp pixel ratio:** `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. On
  low-end devices clamp to `1.5` or even `1`. Never render at full 3x DPR.
- **Renderer hints:** `powerPreference: 'high-performance'`; antialiasing is expensive on mobile —
  prefer turning MSAA off and using a cheap post pass (SMAA/FXAA) or none.
- **Shadows:** reduce shadow map resolution or disable shadows on mobile; they're a top cost.
- **Geometry/draw calls:** reduce particle counts, instance where possible, merge static geometry,
  enable frustum culling, lower segment counts on procedural geometry.
- **Lite mode (capability tiering):** detect low-end via `navigator.hardwareConcurrency`,
  `navigator.deviceMemory`, and a short runtime FPS probe. Below threshold, drop to a lighter scene
  (fewer particles, no shadows, lower DPR) — but keep the same composition and motion beats.
- **Lifecycle:** suspend the render loop when the canvas is offscreen (`IntersectionObserver`) and
  on `visibilitychange` (tab hidden). Resume cleanly. Dispose geometries/materials/textures you
  stop using.
- **Single rAF:** one render/animation loop. Don't let scroll smoothing and the renderer each spin
  their own loop.
- **Context loss:** handle `webglcontextlost`/`webglcontextrestored` (more common on mobile under
  memory pressure).

### 5.4 Touch & interaction (hover replacement)

- Gate hover-only reveals behind `@media (hover: hover) and (pointer: fine)`. On touch, the
  affected content must be **always visible** or **tap-to-toggle** — never hidden with no path.
- Tap targets ≥ **44×44 px** (interactive padding counts).
- Kill the 300ms tap delay: ensure `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  and `touch-action: manipulation` on interactive elements.
- Control tap flash: set a deliberate `-webkit-tap-highlight-color` (often transparent + a real
  `:active` state).
- Provide `:active` feedback for anything that had a `:hover` state.
- For 3D pointer interactions, support both `pointer` events and touch; don't rely on `mousemove`.

### 5.5 Responsive layout & typography

- **Mobile-first.** Author base styles for the smallest target, layer up with `min-width`.
- **Fluid type & spacing:** `clamp()` for font sizes and key gaps so it scales 320 → 430 without
  step changes. Keep the existing scale's ratios.
- **Safe areas:** pad with `env(safe-area-inset-top/bottom/left/right)` on fixed/edge elements.
- **No horizontal scroll, ever.** Audit for elements wider than the viewport (common culprits:
  fixed-width 3D canvases, `100vw` inside padded containers, large absolute elements).
- **Container queries** where a component must adapt to its own width rather than the viewport.

## 6. Performance budget (mobile, mid-tier device)

- First interaction usable: animation/scroll responsive within ~1s of section entering view.
- Maintain **≥ 50 fps** during scrollytelling on a mid-tier phone; never sustained < 30 fps.
- No long tasks > 200 ms during scroll.
- No layout shift caused by the mobile changes (CLS contribution ≈ 0 from our edits).
- WebGL: stay within the DPR/shadow/draw-call rules in §5.3.

## 7. File-ownership lanes (collision avoidance)

To let lanes run without clobbering each other, each agent owns concerns, not necessarily whole
files. When two lanes must touch the same file, the orchestrator sequences them and commits between.

| Lane                     | Owns                                                                 |
|--------------------------|----------------------------------------------------------------------|
| responsive-layout        | CSS/Tailwind/layout components, type scale, breakpoints, safe areas  |
| webgl-performance        | Three.js renderer setup, scene init, materials/lights, rAF loop, lite mode |
| scrollytelling-engineer  | Scroll engine config, ScrollTrigger/Lenis wiring, scrub distances, viewport-unit fixes for pinned sections |
| touch-interaction        | Hover→touch gating, tap targets, viewport meta, pointer handlers     |

**Shared-file protocol:** if you must edit a file another lane owns, make the *minimal* change in
your concern, leave a `// MOBILE-SWARM: <lane> <reason>` comment, and note it in your report so the
orchestrator can detect overlap.

## 8. Definition of done

A breakpoint passes when:

- Layout is correct and uncramped at 320/375/414 portrait and at landscape; zero horizontal scroll.
- Every scrollytelling beat present on desktop fires on touch, in the same order, with matching
  easing and comparable pacing.
- Sustained ≥ 50 fps during scroll on a mid-tier phone; WebGL within budget.
- All former hover affordances are reachable by touch.
- `prefers-reduced-motion: reduce` yields a coherent reduced/static experience.
- Desktop is byte-for-byte unchanged in behavior at `min-width` breakpoints (spot-checked).
- Safe-area insets respected; no content under the notch/home indicator.

## 9. Reporting protocol

Every agent writes a markdown report to `docs/mobile/reports/<agent-name>.md` containing: what it
changed (file:line), why, any shared-file edits, any risks/assumptions, and any items it's handing
to another lane. The orchestrator reads these to integrate and to drive the verify phase.
