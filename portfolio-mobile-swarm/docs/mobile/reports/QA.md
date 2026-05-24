# Mobile QA Verification — Phase 2 (mobile-qa-verifier)

**Scope:** Verify the INTEGRATED result of all four lanes (layout / webgl / scrollytelling / touch)
against MOBILE_PORT_SPEC §8 definition of done + QA_CHECKLIST, across the device matrix. Read-only.

**Method:** Static verification (Grep/Read of the changed source) + dynamic verification (Playwright
Chromium driven against `npm run dev` on :5177, with CDP touch/hover/pointer emulation and
`emulateMedia({reducedMotion})` for the touch + reduced-motion paths the layout lane couldn't see).

**Headline verdict: PASS — meets the §8 definition of done.** Zero genuine routable FAILs found.
Lint clean, build passes, zero console errors across all routes/viewports/pointer-types. The three
audit P0s (viewport-fit, pinned `100vh`, Work scroll-hijack) are resolved and verified. The deliberate
scope decisions (no DPR tiering, hero off-limits) are intact and correctly NOT counted as failures.

---

## Pass/Fail matrix

Columns map to §8: **Layout / Scrolly / Perf / Touch / A11y / Regression**.
Legend: PASS · FAIL · N-A · KNOWN (intended/flagged follow-up, not a fail).

| Device / Orientation | Layout | Scrolly | Perf | Touch | A11y | Regression |
|----------------------|--------|---------|------|-------|------|------------|
| 320 portrait         | PASS   | PASS    | PASS | PASS  | PASS | PASS       |
| 320 landscape        | PASS   | PASS    | PASS | PASS  | PASS | PASS       |
| 375 portrait         | PASS   | PASS    | PASS | PASS  | PASS | PASS       |
| 375 landscape        | PASS¹  | PASS    | PASS | PASS  | PASS | PASS       |
| 393 portrait         | PASS   | PASS    | PASS | PASS  | PASS | PASS       |
| 393 landscape        | PASS¹  | PASS    | PASS | PASS  | PASS | PASS       |
| 414 portrait         | PASS²  | PASS    | PASS | PASS  | PASS | PASS       |
| 414 landscape        | PASS¹  | PASS    | PASS | PASS  | PASS | PASS       |
| 430 portrait         | PASS   | PASS    | PASS | PASS  | PASS | PASS       |
| 430 landscape        | PASS¹  | PASS    | PASS | PASS  | PASS | PASS       |
| Desktop (1280, hover)| PASS   | PASS    | PASS | N-A   | PASS | PASS       |

¹ Landscape phones: Skills landscape fix dynamically verified at 812×375 (representative wide landscape)
  and the layout lane verified 667×375 / 932×430. The fix is width-gated by `(orientation: landscape) and
  (max-height: 430px)`, so all phone-landscape widths in this row take the same code path. **Hero landscape
  top-padding is a KNOWN flagged follow-up (see below) — excluded from this cell per scope (hero off-limits).**
² 414/430 portrait: home full-scroll measured clean at 320 and 430 (the two extremes) with 0 overflow;
  375/393/414 are interpolated between verified extremes on the same fluid layout.

**Dynamic widths actually driven in-browser:** 320 portrait, 375 portrait, 393 portrait, 430 portrait,
812×375 landscape, plus 1280×800 desktop regression. Other matrix cells verified by code path + the
two measured extremes (the layout is fluid/clamp-based with media-gated landscape rules; no per-width
step logic exists between them).

---

## What was verified DYNAMICALLY (in-browser, measured)

### Layout / horizontal scroll
- **320 portrait, Home:** `document.scrollWidth === innerWidth === 320`, **0 overflow offenders** (full
  DOM scan). Full top-to-bottom scroll held `scrollWidth === 320` throughout. `viewport-fit=cover` live
  in the meta. (The `clientWidth 310` vs `scrollWidth 320` delta is the desktop Chromium vertical
  scrollbar; mobile uses overlay scrollbars — not a real-device issue, matches layout-lane note.)
- **430 portrait, Home:** full-scroll `maxScrollWidth 420` (=410 content +10 scrollbar), no overflow,
  scrollHeight 3245 (not sparse).
- **ProjectDetail /project/1 at 320 & 812×375:** `scrollWidth === innerWidth`, no overflow during full
  scroll. Kinetic Tech marquee rows are contained by `overflow-hidden` (confirmed — no doc overflow).
- **Skills landscape 812×375 (the fragile case):** no horizontal overflow; dots hidden (`display:none`);
  slide is compact **2-col grid `341px 341px`**; footer is **`position: static`** (flows below);
  active-slide content `top 69 / bottom 306` — **NOT clipped** top or bottom in the 375 frame
  (contentHeight 236 < 375). Screenshot of the busiest slide (UI Engineering: 4 skills + 5 tools)
  confirms a clean intentional 2-col layout, nothing clipped. The brittle positional selectors
  (`> div:first-child > h3` etc.) FUNCTION correctly here.
- **Work /work at 320 touch:** `.work-page` scrollWidth 320, no overflow; content centered & legible
  (screenshot confirmed); dots `display:none` (desktop-only). Dark aesthetic preserved.
- **Aesthetic:** Home hero (Lanyard over cloth shader), Projects bento (per-project accent gradients,
  glass pills, tap-to-play buttons), Work (FieldFlow), Skills pills — all render in the intended
  dark/glass/coral-adjacent language. Screenshots captured.

### Scrollytelling parity
- **ProjectDetail HeroSection beat fires on a touch-class (320) viewport:** h1 title scale scrubs
  smoothly `1.0 → 0.9995 (y40) → 0.95 (y80) → 0.767 (y120) → 0.72 (y160)`, then holds at 0.72 — exactly
  the baseline beat (scale 1→0.72 over progress 0.08–0.42) with the `easeIO` cubic curve. **Smooth scrub,
  not a snap.** Sticky child uses `h-screen-svh` (height == viewport == 568 at 320).
- **Skills scrollytelling fires on touch-class viewport:** pinned container = 4544px (=800vh), 4 slides;
  at ~18% scrub the active slide is at opacity ~0.96 with the others correctly hidden — the crossfade
  works. (The hand-rolled lerp at 0.08/frame is slow to converge under programmatic `scrollTo`; once
  settled it is correct.)
- **Pinned svh sections don't clip:** ProjectDetail hero child = exactly viewport height in portrait
  and landscape; `min-h-screen-svh` content sections correctly GROW past viewport in landscape (flow,
  not clip) — intended behavior of `min-h`.
- **Work native scroll (the resolved P0):** with CDP touch emulation (`hover:none, pointer:coarse`),
  `canHover === false` → the wheel/touch/key hijack effect does **not** attach. A native
  `scrollTo(innerHeight)` **landed exactly at 568** (not snapped/blocked) — momentum scroll honored.
  Per-entry build-out (`work-fade-up`) fires: entry 1 settled at mount (content opacity ~1), entry 2
  (FieldFlow) animated in on native scroll (caught mid-stagger 0.08→0.6→0.9→1.0, then settled).

### Performance
- **DPR clamp:** hero canvas effective DPR = 1 in headless (devicePixelRatio 1); source clamp
  `dpr={[1, Math.min(window.devicePixelRatio, 2)]}` confirmed — satisfies the ≤2 hard rule. (DPR
  capability-tiering deliberately NOT done per user scope — correctly not flagged.)
- **WebGL context healthy:** `gl.isContextLost() === false`, no WebGL warnings in console.
- **Canvas touch-action: none** confirmed (card-drag), page scrolls via overlay layers above it.
- **No layout shift introduced:** no overflow appeared at any scroll position on any tested width.
- fps not profiled directly (headless); see "Verified STATICALLY" for the budget audit.

### Touch & interaction
- **No stuck-hover-after-tap (the key risk):** dispatching a synthetic `mouseenter` (the exact tap
  artifact) on a **bento card** under touch emulation leaves transform = `matrix(1,0,0,1,0,0)` (identity,
  **no stuck lift**) — handlers are `undefined` on touch. Same verified for the **NextProject CTA**:
  h2 transform stays `none` (no stuck `scale(1.02)`), CTA fully reachable ("Lions Den Cinemas", opacity 1).
- **Tap targets:** all 4 bento play/pause buttons measured **exactly 44×44px** (was 40). Bento card hit
  area 301×340. ProjectDetail HUD back-to-top button 44×44.
- **Native tap responsiveness:** `touch-action: manipulation` + transparent tap-highlight applied
  site-wide (verified in `dist`/source); `:active` feedback gated behind `(hover:none),(pointer:coarse)`.

### Accessibility — reduced motion
- **`prefers-reduced-motion: reduce` emulated → coherent static path verified:**
  - **ProjectDetail:** `reduce-effects` class applied; h1 pinned at end-state `matrix(0.72…)`; of 60
    sampled reveal elements (p/h2/h3/span) **0 are near-zero opacity** — every `useTransform` reveal
    resolves to its fully-revealed END state via the new `useRevealProgress` seam. Readable, not stuck-hidden.
  - **Skills:** renders `SkillsStatic` (normal-flow 1349px section, NOT the 4544px pinned scroller); all
    5 headings present; no horizontal overflow.

### Regression (desktop, hover-capable, 1280×800 — fresh context, no touch emulation)
- **Work desktop snap PRESERVED:** `canHover === true`, dots visible (`flex`), `overflowY:auto`. A single
  `wheel` deltaY:120 drove the 1200ms RAF tween `scrollTop 0 → 48 (mid) → 800 (landed on entry 2)`.
- **Skills desktop PRESERVED:** footer `position: absolute` (parallax intact), dots `flex`, slide grid
  `444px 444px` (desktop 2-col). My/their landscape+portrait-phone media queries don't match desktop.
- **Bento hover PRESERVED:** desktop `mouseenter` activates the hover handler (`hoverLiftWorks: true`).
- **Console: 0 errors** across every route/viewport/pointer-type in the whole session.

---

## What was verified STATICALLY (code-level criteria)

- **index.html:5** — `viewport-fit=cover` present (unlocks every `env(safe-area-inset-*)`).
- **Lanyard.jsx** — `powerPreference:"high-performance"` (`:381`); `visibilitychange` listener combining
  `ioVisibleRef.current && !document.hidden → isVisibleRef` which the frame loop early-returns on
  (`:308–347, :528`), removed on unmount; `webglcontextlost/restored` handlers in `onCreated` + detached
  on unmount (`:389–404, :349–366`); **DPR line byte-identical** `Math.min(window.devicePixelRatio, 2)`
  (`:379`). `frameloop="demand"` + IO suspension + idle-halt all preserved (additive).
- **Work.jsx** — hijack effect gated `if (!isDesktop) return undefined;` with
  `isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)")` (`:88, :162-231`). All 4
  `e.preventDefault()` calls live INSIDE that gated effect → never run on touch. Build-out IO + active-index
  IO are in SEPARATE un-gated effects → fire on native scroll. Entries `100svh`.
- **Pinned svh** — `.h-screen-svh`/`.min-h-screen-svh` plain CSS classes in globals.css (`:1090-1097`,
  survive purge, present in `dist`); applied to ProjectDetail sticky children (`:305, :473, :634, :712`)
  + Skills (`:485`). App.jsx vertical page-slide → `100dvh` (`:74, :117`).
- **Skills desync fix** — per-scroll handler reads only `getBoundingClientRect().top / scrollableRef`;
  `scrollableRef` (containerH − innerHeight) recomputed only on debounced resize/`orientationchange`
  (`:372-414`). `orientationchange` listener added. Scroll/resize listeners `{passive:true}`.
- **Reduced-motion seam** — `useRevealProgress` swaps live progress for `useMotionValue(staticValue)`
  under `useReducedMotion()` (`ProjectDetail.jsx:34-38`), wired into all 4 pinned sections + child
  reveals + ScrollRevealImage; Tech kinetic uses `staticValue=0.5` (freeze centered). `useReducedMotion`
  is OS-driven via theme-provider's `matchMedia('(prefers-reduced-motion: reduce)')` (`:14,27,46`).
- **Touch CSS** — `touch-action:manipulation` + transparent tap-highlight on interactive set;
  `:active`/tooltip-hide all gated behind `(hover:none),(pointer:coarse)` (globals.css `:1232-1282`).
- **Hover gating** — ProjectDetail NextProject + Projects bento use `onMouseEnter={canHover ? … : undefined}`
  with `canHover = useMediaQuery("(hover: hover) and (pointer: fine)")` (PD `:820,826-827`; Projects
  `:128,170-175`). `onFocus/onBlur` left ungated (legitimate keyboard focus styling).
- **No `touchmove` preventDefault anywhere** — the only `touchmove` listener (main.jsx:71) is a
  `{passive:true}` scrollbar-reveal helper with no `preventDefault`.
- **BackToTop.jsx** — `marginBottom/Right: env(safe-area-inset-*, 0px)` + `min-h-[44px] min-w-[44px]`
  (`:25, :34-37`).
- **Performance/budget audit (code, since fps not profilable headless):** animations are transform/opacity
  (compositor-friendly); Lanyard is single `frameloop="demand"` rAF, suspends offscreen + tab-hidden;
  Skills/ProjectDetail reveals write via Framer motion values (no per-frame React reconcile) EXCEPT the
  two deferred P2 setState sites below. No competing rAF loops.

---

## GENUINE routable FAILs

**None.** No blocking defects found. The integrated tree meets §8.

---

## KNOWN / flagged follow-ups (intended — NOT routable fails)

1. **Hero landscape top-padding** — `Hero.jsx:386` `pt-[50svh]/pt-[54svh]` is portrait-tuned and can push
   the headline/CTA toward the bottom in landscape (≤430px tall). **DELIBERATELY NOT fixed (hero
   off-limits, needs user sign-off).** Recorded as KNOWN per scope decision #3. Not counted against any
   landscape Layout cell. **Recommend: route to user for sign-off** (layout lane proposed gating the
   large top-padding to portrait / centering the hero in landscape).
2. **Skills per-frame `setScrollProgress` setState** — `Skills.jsx:426` (P2). Deferred (would need a
   feel-risking rewrite of the slide-render logic). The IO idles the loop offscreen, bounding cost.
   Confirmed still present and functioning; not blocking.
3. **video-stage per-frame `setTime`** — `video-stage.jsx` (P2). Maximal safe reduction shipped (concrete
   value vs functional-updater closure); full removal needs rewriting ~8 `*-video.jsx` files. Only active
   while a preview is hovered/tapped. Not blocking.
4. **Skills landscape fix uses brittle positional CSS selectors + literal px** (globals.css:1152-1209) —
   tech-debt already logged. **Verified it FUNCTIONS** (no overlap/clip at 812×375; 2-col grid renders;
   content fits). Brittleness (depends on Skills.jsx DOM order/structure) remains a maintenance risk if
   Skills markup changes — confirm-but-not-block per scope decision #5.
5. **One inline-style override** — globals.css:1143 `#skills .sticky > .absolute.inset-x-0 { bottom:0
   !important }` overrides the inline `bottom` lerp Skills.jsx writes each frame. Presentational only;
   revisit if that easing is reworked in JS. (Layout lane flagged; noted.)

## Non-blocking observations
- **Pre-existing build warnings:** two `duration-[400ms]` Tailwind "ambiguous class" warnings on
  `vite build`. Pre-existing (one originates from the NextProjectSection `<h2>`), NOT introduced by the
  swarm, build still succeeds. No action required for parity.
- **Benign console warning:** `hero-poster.webp preloaded but not used within a few seconds` — pre-existing
  hero preload notice (hero off-limits). Not an error.
- **Dead OGL dependency** still bundled (`vite.config.js`) but unused in `src/` — out of swarm scope
  (auditor's cleanup note), not a mobile defect.
- **Safe-area on notched device:** the `env()` wiring + `viewport-fit=cover` are correct (verified
  statically + the `0px` fallback produces no shift on non-notched, confirmed dynamically). The actual
  pixel offset on a physical notch could not be reproduced in headless Chromium — **recommend a real
  notched-device spot-check** of header / back-to-top / PdfModal positions (low risk; standard pattern).

---

## Lint / build status (integrated tree)
- `npm run lint` → **PASS, 0 warnings** (`eslint . --report-unused-disable-directives --max-warnings 0`).
- `npm run build` → **PASS** (vite, 2774 modules, ~7s; `postbuild` 404 copy ran). Only the two
  pre-existing `duration-[400ms]` warnings (non-fatal).

## Overall verdict
**SHIP-READY for the mobile-parity scope.** All four lanes integrate cleanly; the three audit P0s are
resolved and dynamically confirmed; desktop is unregressed; reduced-motion and touch paths (which no
single lane could fully see) are verified coherent. The only outstanding item that touches behavior is
the **hero landscape top-padding**, which is an intentional sign-off-gated follow-up, not a defect of
this work.

### Prioritized list for the orchestrator
1. **(User sign-off)** Hero landscape top-padding (`Hero.jsx:386`) — route to user, hero off-limits.
2. **(Optional, real-device)** Spot-check safe-area insets + Work momentum + Skills 800vh pin on a
   physical notched iOS device (headless can't reproduce notch insets or true momentum).
3. **(Backlog, non-blocking)** Per-frame setState: Skills `setScrollProgress` (P2) and the 8-file
   video-stage rewrite (P2) — both deferred by design.
4. **(Backlog, maintenance)** Replace the brittle positional Skills-landscape selectors with stable
   hooks/classes if Skills markup is ever touched.
