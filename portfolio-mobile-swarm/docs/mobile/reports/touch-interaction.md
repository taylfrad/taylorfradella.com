# Touch-Interaction Lane — Report

**Mandate:** make every hover-dependent affordance reachable on touch and make taps feel native,
without regressing the desktop hover baseline. I am the LAST implementer lane, working over the
layout that scrollytelling + responsive-layout + webgl already stabilized. All changes are additive
and gated so hover-capable (desktop) pointers are byte-for-byte unchanged.

**Files changed (4):**
- `index.html` — viewport meta (P0).
- `src/components/ProjectDetail.jsx` — NextProject CTA hover gating + lightbox tap-target sizes.
- `src/components/Projects.jsx` — bento card hover gating + play-button tap target.
- `src/styles/globals.css` — appended a touch block (touch-action, tap-highlight, `:active`, tooltip).

**Lint + build:** `npm run lint` → **0 warnings**. `npm run build` → **passes** (`✓ built in ~6s`,
`postbuild` 404 copy ran). Only the two pre-existing `duration-[400ms]` Tailwind warnings appeared
(one originates from the existing `NextProjectSection` `<h2>` — not introduced by me). All my CSS
rules + the viewport meta verified present in `dist` (`dist/index.html`, `dist/404.html`,
`dist/assets/index-*.css`).

---

## Task 1 — index.html viewport meta (P0, done first)

`index.html:5`:
```diff
- <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+ <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
This activates EVERY `env(safe-area-inset-*)` rule already in the codebase (Hero, HeroShell,
PageHeader, PdfModal) **plus** the one the layout lane added to `BackToTop.jsx` — all of which were
no-ops without `viewport-fit=cover`. Nothing else in the meta was altered (`initial-scale=1.0` →
`1` is equivalent). `touch-action: manipulation` is handled site-wide in Task 4.

**Handoff / QA:** safe-area insets are now live on notched profiles. Re-verify header/CTA/back-to-top
positions on a notched device (the layout lane's `BackToTop` inset and PageHeader's top inset were
dormant until this landed).

---

## Task 2 — hover-only reveals → reachable on touch (no stuck hover)

General strategy: the underlying element was already visible/tappable, so I (a) gated the hover
ENHANCEMENT behind hover-capable pointers, (b) prevented synthetic-mouseenter-on-tap from leaving a
stuck visual, and (c) added a tactile `:active` press. Desktop hover paths are untouched.

### A. ProjectDetail "Next Project" CTA — `ProjectDetail.jsx` (NextProjectSection, ~:811-829)
- **Was:** JS `hovered` state via `onMouseEnter/Leave` driving an accent glow opacity (0.12→0.35) +
  title `scale(1.02)`.
- **Fix:** added `const canHover = useMediaQuery("(hover: hover) and (pointer: fine)")`
  (`useMediaQuery` was already imported). The handlers are now
  `onMouseEnter={canHover ? () => setHovered(true) : undefined}` (same for leave).
- **No stuck hover on tap:** on touch `canHover === false` → handlers are `undefined`, so a tap's
  synthetic mouseenter can never set `hovered`. `hovered` stays `false`; the CTA renders in its
  resting (always-visible) state. The link/title/arrow were always visible regardless of hover, so
  no information is lost.
- **Tap feedback:** added class `next-project-cta`; CSS gives `.next-project-cta:active h2 {
  transform: scale(0.99) }` on touch only (plus the generic `[role=link]:active` opacity dip).
- **Desktop unchanged:** when `canHover === true` the handlers are identical to before → the glow +
  `scale(1.02)` hover behaves exactly as it did.

### B. Projects bento cards — `Projects.jsx` (BentoCard, ~:117-174, :350-387)
- **Was:** card `hovered` state drives box-shadow lift (`translateY(-4px)` + accent shadow), arrow
  `translateX(4px)`, and the `id>7` accent glow. (Mobile already has tap-to-play video.)
- **Fix:** added `useMediaQuery` import + `const canHover = useMediaQuery("(hover: hover) and
  (pointer: fine)")`. Gated the pointer handlers:
  `onMouseEnter={canHover ? () => { setHovered(true); prefetchProjectDetail(); } : undefined}` and
  `onMouseLeave={canHover ? () => setHovered(false) : undefined}`.
- **Kept `onFocus`/`onBlur` ungated** (they set `hovered` too) — that is legitimate **keyboard**
  focus styling and is desktop-correct; it is not the synthetic-tap culprit (mouseenter is).
- **No stuck hover on tap:** on touch the mouse handlers are `undefined`, so a tap can't set the
  lift/glow/arrow. The card navigates on tap and, on back-nav, remounts with `hovered === false`.
- **Tap feedback:** added class `bento-card`; CSS gives `.bento-card:active { transform:
  scale(0.985) }` on touch only — a brief compression standing in for the desktop lift. The card
  remains fully usable (navigates on tap; tap-to-play button still works).
- **Note on prefetch:** `prefetchProjectDetail()` was tied to hover (a desktop cache warm-up). On
  touch there is no hover, so it no longer pre-warms — but the tap immediately triggers `navigate()`
  which lazy-loads the same chunk, so there is no functional loss, only the loss of a desktop-only
  head-start that never applied to touch anyway.
- **Desktop unchanged:** `canHover === true` → handlers identical to before.

### C. mode-toggle tooltip — `mode-toggle.jsx` (`group-hover:opacity-100`, :60) — low priority
- The Tailwind `group-hover` tooltip can stick on touch (a tap leaves the button group in `:hover`
  until the next tap elsewhere). The button already has `aria-label` + `sr-only` text, so the
  tooltip is redundant for assistive tech.
- **Fix (CSS-only, no component change):** `@media (hover: none), (pointer: coarse) { .glass-tooltip
  { display: none } }`. The tooltip is suppressed entirely on touch (zero info loss); desktop keeps
  it via the **untouched** `group-hover` utility. `.glass-tooltip`/`group-hover` are used ONLY by the
  mode-toggle (verified), so the rule is precisely scoped.
- The toggle's icon animation fires on `onClick` (not hover), so it already works on tap — no change.

### D. Footer icon hover micro-animations — `Footer.jsx` (`onMouseEnter` → startAnimation, :97-126)
- **Decision: LEFT AS-IS (documented).** These bespoke lucide draw/morph animations are desktop
  hover polish. Triggering them on tap is not worthwhile here: the LinkedIn/GitHub links open a new
  tab and Resume opens a modal immediately on tap, so the micro-animation wouldn't be perceived
  before the context change. The icons are fully functional links and now get a real tap-press cue
  from the generic touch `:active` opacity rule (they are `<a>`/`<button>`), so taps feel responsive.
  No stuck state is possible (the handlers only fire on real mouseenter, which doesn't occur on a
  plain tap, and they navigate away regardless).

---

## Task 3 — tap targets ≥ 44×44px

- **Projects mobile play/pause button** (`Projects.jsx`, ~:363-380): was `width:40, height:40`
  (< 44). Bumped to **`width:44, height:44`** and added `touchAction: "manipulation"` inline. The
  visual glyph (14px SVG in a translucent circle) reads fine at 44; kept it as the visual rather than
  padding-expanding a 40px glyph.
- **ProjectDetail lightbox controls** (close / prev / next `IconButton`s, ~:151-170): a genuine
  sub-44 target I found while scanning — lucide's default icon is **24px** and `.glass-btn` adds no
  padding, leaving these ~26px. Added `minWidth: 44, minHeight: 44, p: 1` to each via `sx`. They are
  absolutely positioned, so the larger hit area does not shift layout, and the visual icon size is
  unchanged. (`.glass-btn` already supplies an `:active` `translateY(1px) scale(0.98)`, and these
  also have Framer `whileTap`, so press feedback was already present.)

**Scanned and already compliant (left alone — no bloat):**
- `BackToTop.jsx` chevron — `min-h-[44px] min-w-[44px]`. ✓
- ProjectDetail HUD back-to-projects + back-to-top buttons — `min-h-[44px] min-w-[44px]`. ✓
- PageHeader mobile hamburger — `h-11 w-11` (44×44). ✓
- PageHeader mobile dropdown items — `px-5 py-3` @ 14px → comfortably ≥ 44 tall. ✓

---

## Task 4 — tap delay + tap highlight + active feedback (globals.css, append-only)

Appended a single `/* MOBILE-SWARM: touch … */` block at the **end** of `globals.css`, AFTER the
scrollytelling (`.h-screen-svh`) and layout blocks — none of their rules were modified.

- **Tap delay:** `touch-action: manipulation` on `button, a, [role=button], [role=link], summary,
  label[for], input[type=button], input[type=submit]`. This only disables double-tap-zoom / the
  300ms delay; it does not affect desktop pointing or page scroll, so it is safe site-wide. (The
  Lanyard canvas keeps its own `touch-action: none` — see Task 5.)
- **Tap highlight:** `-webkit-tap-highlight-color: transparent` on the same interactive set — matches
  and generalizes the existing `.floating-nav-btn` rule (globals.css:438). Paired with real `:active`
  feedback so taps are never dead.
- **`:active` feedback (touch-gated):** inside `@media (hover: none), (pointer: coarse)`:
  - generic `button:active / a:not([aria-hidden=true]):active / [role=button]:not(.bento-card):active
    / [role=link]:not(.bento-card):active { opacity: 0.78 }` — a calm tap confirmation for any
    control that lost a hover affordance. The bento card's decorative `aria-hidden` `<a>` wrapper is
    excluded so the whole card doesn't flash-dim on tap.
  - `.bento-card:active { transform: scale(0.985) }` (press compression).
  - `.next-project-cta:active h2 { transform: scale(0.99) }` (title settle).
  - `.glass-tooltip { display: none }` (Task 2C).
- **Desktop is a protected baseline:** all `:active`/feedback/tooltip-hide rules are gated behind
  `(hover: none)` / `(pointer: coarse)`, so hover-capable pointers never see them. `touch-action`
  and `tap-highlight-color` are inert on desktop.

---

## Task 5 — Lanyard pointer/touch (VERIFY ONLY — no edit)

**Confirmed: no change needed; canvas touch-action does NOT block page scroll.** `Lanyard.jsx:387`
sets `gl.domElement.style.touchAction = "none"` ONLY on the WebGL canvas (z-10), to make the physics
card draggable. The in-file comment (`:384-386`) documents that scrolling past the hero works via the
headline/CTA overlay (z-20) and header (z-30) which sit ABOVE the canvas. The canvas is a contained,
draggable element — the page scrolls normally around/over it. I did not touch `Lanyard.jsx`,
`Hero.jsx`, `HeroBackground.jsx`, `HeroShell.jsx`, or `StaticHeroBackground.jsx`.

---

## Shared-file edits (for orchestrator)

- **`src/styles/globals.css`** — APPEND-ONLY, single trailing `/* MOBILE-SWARM: touch … */` block.
  Does not modify the scrollytelling `.h-screen-svh`/`.min-h-screen-svh` block or the layout block
  that precede it. No collision.
- **`src/components/ProjectDetail.jsx`** — sequenced AFTER scrollytelling (as the audit planned). I
  touched ONLY the NextProject hover gating (`NextProjectSection`) and the lightbox `IconButton` tap
  sizes. I did not touch the scrollytelling lane's svh pinned children, the reduced-motion
  `useRevealProgress` seam, or any scroll-progress math.
- **`src/components/Projects.jsx`** — not owned by another lane (home bento). Added a `useMediaQuery`
  import (already used elsewhere in the repo), hover gating, the `bento-card` class, and the 40→44
  play-button size.

## Left as-is, with reasoning
- **Footer icon micro-animations** — desktop hover polish; not perceivable on tap (links/modal fire
  immediately) and now have generic `:active` feedback. (Task 2D.)
- **ProjectDetail HUD back-to-projects color hover** (inline `onMouseEnter` text-color swap, :959) —
  a subtle tertiary→primary text color shift on a button that navigates away (unmounts) on tap, so no
  stuck state persists; not in the four named hover cases. Left untouched.
- **Scrub distances / pinned units / WebGL** — other lanes' concerns; untouched.

## Did NOT do
- No hero edits (all five hero files zero-change). No `preventDefault` on `touchmove` anywhere. No new
  colors/fonts (reused tokens + existing easing curves). No git commit (orchestrator commits).
