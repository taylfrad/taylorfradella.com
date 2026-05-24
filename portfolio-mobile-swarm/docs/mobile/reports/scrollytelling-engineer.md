# Scrollytelling-Engineer Lane — Report

**Mandate:** the desktop scroll narrative must play on every phone with the SAME beats, order, and
easing (`easeIO` cubic), adapting only the MECHANISM (dynamic viewport units, native touch scroll,
scrub denominators). I changed no beat ranges and no curve.

**Files changed (5):** `src/App.jsx`, `src/components/ProjectDetail.jsx`, `src/components/Skills.jsx`,
`src/components/Work.jsx`, `src/styles/globals.css`. Hero files untouched (verified via git diff:
`Lanyard.jsx`, `Hero.jsx`, `HeroBackground.jsx`, `HeroShell.jsx`, `StaticHeroBackground.jsx` all
zero-change). `useScrollyProgress.js` (where `easeIO` lives) is byte-for-byte unchanged.

**Lint + build:** `npm run lint` → 0 warnings (clean before and after; the two `duration-[400ms]`
warnings the orchestrator mentioned did not fire in this environment, and I introduced none).
`npm run build` → passes, including the `postbuild` 404 copy. Custom CSS utilities confirmed present
in the emitted `dist` CSS.

---

## Shared-file edits (for orchestrator sequencing)

- **`src/components/ProjectDetail.jsx`** — I did ONLY my structural items (svh pinned children +
  reduced-motion source). I did NOT touch the NextProject hover logic at the bottom (`onMouseEnter`/
  `setHovered`, ~:805-839 after my edits) — that is the touch lane's. Sequence as the audit planned:
  scrollytelling (me) first, then touch.
- **`src/styles/globals.css`** — append-only. Added a `.h-screen-svh` / `.min-h-screen-svh` utility
  block at the very end with a `/* MOBILE-SWARM: scrollytelling … */` marker. No existing rules
  modified, so layout/touch appends won't collide.
- **`src/components/Work.jsx`** — I own the de-hijack. Already mobile-optimized for layout; layout
  lane should not re-touch the scroll mechanism.

---

## Per-section parity: desktop beats → how each is now driven on touch

The pinned-child viewport-unit fix does **not** alter the scrub math. All `ProjectDetail` sections
derive progress from Framer `useScroll({ offset: ["start start","end end"] })` on the OUTER `vh`
container; Framer measures the element's own scroll range, independent of the sticky child's height.
Swapping the child `100vh → 100svh` only changes where the pinned scene *clips*, never the 0→1
mapping. I confirmed every `useTransform` range below is unchanged.

### `/project/:id` — ProjectDetail.jsx
Outer scrub containers unchanged (mobile already shortened): Hero 170vh mobile / 220vh desktop,
Statement 200/220, Tech 200, Features 220/260.

1. **HeroSection** — sticky child `h-screen → h-screen-svh`. Beats intact off `p`: title scale
   1→0.72 & Y +6→−6vh (0.08–0.42); role op 0→1 + Y 14→0 (0.18–0.38); accent line scaleX 0→1
   (0.12–0.38); desc op + Y 20→0 (0.38–0.56); tags op (0.52–0.66); links/status op (0.62–0.76);
   glow (desktop-only, hidden mobile), watermark op 0.18→0.06 + scale 1→0.9, scroll-indicator
   0.5→0 (0–0.1). On touch these now scrub against a frame that no longer jumps when the address bar
   animates.
2. **StatementSpotlightsSection** — sticky child `min-h-screen → min-h-screen-svh`. Title op+Y 40→0
   (0–0.12), statement op+Y 28→0 (0.15–0.28), spotlights stagger `0.22 + i*0.12` over 0.1 windows —
   all unchanged. Mobile stays stacked flex-col; desktop 2-col.
3. **TechSection** — sticky child `→ min-h-screen-svh`. Title 0–0.12, rows 0.18–0.30 reveal; kinetic
   horizontal text x = `dir*speed*-1 → dir*speed` over page-scroll 0→1, unchanged. Mobile 4 rows /
   reps=3 retained.
4. **ScreenshotShowcase / ScrollRevealImage** — non-pinned; clip 50→0%, scale 1.2→1, radius 20→12
   over `["start end","center center"]` — unchanged.
5. **FeaturesSection** — sticky child `→ min-h-screen-svh`. Title 0–0.10; bullets stagger
   `0.14 + (i/total)*0.35`; links 0.50–0.56; summary fade 0.08–0.18; DescriptionReveal sentences
   `0.18 + (i/count)*0.32` — unchanged. Mobile stacked.
6. **NextProjectSection** — IO fade-in (CSS), not scroll-scrubbed. Untouched (hover is touch lane's).
7. **Global HUD** — `ProgressBarFill` left on live `useScroll` + `useSpring` (it's a scroll-position
   indicator, not a reveal — snapping it would be wrong).

### `/skills` — Skills.jsx (`SkillsScrollytelling`)
Sticky viewport `h-screen → h-screen-svh`. Total container height `capCount*180+80 = 800vh` and the
`vh` footer-overlap offsets (slide `bottom 0→32vh` at scrollProgress 0.9–1.0; dots `top 50→40vh`)
kept structurally as-is. The 4-slide crossfade phases (enter 0–0.18, reveal 0.12–0.35, desc
0.18–0.38, tools 0.30–0.50, exit 0.62–0.85) and the mount-intro (slide 0 → 0.55 over 3500ms quartic
after 800ms) are untouched. The reduced-motion `SkillsStatic` path is untouched.

### `/work` — Work.jsx
Entries already `100svh`. Per-entry build-out (first on mount, others via IO at 0.5 threshold) and
the desktop-only progress dots (`hidden md:flex`) are unchanged. Mobile parallax already 0vh→0vh
(left as-is). See "Work native scroll" below for the hijack change.

### Home page reveals & page transitions
`Projects`/`Skills`/`Footer` home reveals: not in my lane, untouched. Page transitions: only the
`axis:"y"` off-screen unit changed (vh→dvh); directions/timing/EASE preserved.

---

## Fix-by-fix detail

### 1. Pinned/full-height → dynamic units (svh), spec §5.1
Added to `globals.css` (end of file, marker comment):
```css
.h-screen-svh     { height: 100vh; height: 100svh; }
.min-h-screen-svh { min-height: 100vh; min-height: 100svh; }
```
`svh` (smallest viewport) so pinned scenes never clip when the address bar is visible; `vh` fallback
for old browsers. Applied to the sticky CHILDREN only (outer scrub containers stay `vh`):
- ProjectDetail: HeroSection child `h-screen → h-screen-svh` (~:277); Statement/Tech/Features
  children `min-h-screen → min-h-screen-svh` (~:443, :594, :668).
- Skills: sticky viewport `h-screen → h-screen-svh` (~:452).
Each site has a `// MOBILE-SWARM: scrollytelling …` marker. These are plain CSS classes (not Tailwind
utilities) so they are never purged and always present in `dist` (verified).

### 2. Work.jsx → native momentum scroll on mobile
Added `const isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)")`. The wheel/touch/key
hijack effect now `if (!isDesktop) return undefined;` at the top and has `isDesktop` in its deps. On
touch the effect never attaches, so `onWheel`/`onTouchEnd` (and their `e.preventDefault()`, and the
`{passive:false}` wheel listener) never run — phones get native momentum scroll through the
`100svh` entries. **Desktop snap preserved:** on hover+fine pointer the identical effect attaches; the
1200ms cubic `scrollToEntry` RAF tween, the `advance()` wrap logic, and key nav are byte-identical.
The active-index IO and per-entry build-out IO live in SEPARATE effects (un-gated) so they still fire
on native mobile scroll; `setActiveIndex` updates harmlessly on mobile (dots are desktop-only and not
rendered). `scrollToEntry` stays defined for the desktop dots' `onSelect`. No dead code, no broken
desktop dots/index.

### 3. Skills.jsx — innerHeight/viewport desync + orientation
**Root cause:** the per-scroll handler read `window.innerHeight`, which changes as the iOS address
bar animates, desyncing progress against the (now svh) pinned frame. **Fix:** cache the scrollable
distance (`containerH − innerHeight`) in `scrollableRef`, recompute it ONLY on a real
`resize`/`orientationchange` (debounced via rAF), and have the per-scroll path read solely
`getBoundingClientRect().top / scrollableRef`. Added an `orientationchange` listener. I deliberately
keep `innerHeight` (not the svh child height) as the denominator so progress still reaches a true
1.0 at the bottom of the scrub — using the svh height would under-shoot ~0.986 and under-apply the
footer-overlap easing. Moving the read out of the scroll loop is the actual desync cure. The 800vh
total height and `vh` clearance constants are unchanged (left for the layout lane to review against
SkillsPage's absolute footer at 320/landscape). On desktop `vh === svh` so behavior is identical.

### 4. App.jsx vertical page-slide → dvh (units only)
`axis:"y"` initial `100vh/-100vh → 100dvh/-100dvh` and exit `-100vh/100vh → -100dvh/100dvh`. `dvh`
is correct here (full off-screen translate, not a pinned child). Direction, `Y_DURATION` (1.2s), and
`EASE` unchanged. Verified via diff that nothing else moved.

### 5. Scrub-distance re-tune — DECLINED (no mismatch found)
The mobile scrub heights were tuned by a prior pass and the svh/dvh unit fixes don't disturb pacing:
Framer's `useScroll` maps progress from the element's own scroll range (child height irrelevant), and
the Skills denominator is now measured from real pixels. No clear pacing mismatch vs desktop was
found, so per the task's "don't churn without reason" guidance I changed nothing here.

### 6. Reduced-motion path for ProjectDetail — IMPLEMENTED (clean seam)
Added `useRevealProgress(liveProgress, staticValue = 1)`: under `prefers-reduced-motion` it returns a
constant `useMotionValue(staticValue)` instead of the live progress, so every existing `useTransform`
resolves to its END (fully-revealed) state (`clamp:true` makes input 1 yield the range end). This is
a single source-swap per section — no per-style branching, no parallel render path — and it mirrors
how `SkillsStatic` snaps to final layout. **Desktop is byte-identical** (non-reduced returns the live
value unchanged). Wired into all four pinned sections (Hero, Statement, Tech, Features), their child
reveal components (`SpotlightItem`, `FeatureBullet`, `DescriptionReveal`), and `ScrollRevealImage`.
The Tech kinetic horizontal text uses `staticValue = 0.5` so under reduced motion the rows freeze
centered/readable rather than slammed to one edge. The HUD progress bar is intentionally left
scroll-tracking. The global CSS reduced-motion rule (`globals.css:380`) only neutralizes CSS
transitions, NOT Framer motion values, so this fills the exact gap the audit flagged.

---

## Parity risks / honesty

- **Skills footer-overlap clearance at small viewports.** I kept the `vh` clearance offsets (32vh
  slide / 50→40vh dots) inside the now-`svh` pinned frame. `vh` vs `svh` differ only by the
  address-bar height, well within the 32vh clearance margin, and progress now reaches a true 1.0 so
  the easing fully applies — but the SkillsPage `absolute bottom-0` footer at 320px/landscape is the
  most fragile dynamic-viewport interaction in the app (audit agrees). Handed to the layout lane / QA
  to verify no dead scroll or footer overlap there.
- **iOS `window.resize` on address-bar toggle.** The debounced re-measure means even a spurious
  resize is a single one-frame correction, not a per-scroll jump — strictly better than the old
  per-scroll `innerHeight` read. Worth a QA pass on a real iOS device.
- **Work native scroll on iOS.** The `.work-page` container is `overflowY:auto` with no `touch-action`
  restriction, so native momentum should work. No `-webkit-overflow-scrolling` was needed (default in
  modern iOS) — QA should still confirm momentum + that the per-entry IO build-out fires on a real
  device.

## Declined / deferred (with reasons)
- **Per-frame `setState` in Skills (P2)** — DECLINED. Driving the slide transforms via motion
  values/refs would require rewriting every `CapabilitySlide` style computation (titleX, masterOpacity,
  all per-skill/per-tool staggers) plus the lerp loop and intro-max blending into `useTransform`
  chains — a large, feel-risking rewrite of the primary slide-render logic. Per the task ("if it would
  risk the feel or balloon the change, DON'T"), I left it. The IO already idles the loop off-screen,
  bounding the cost. Follow-up candidate.
- **Scrub-distance re-tune (item 5)** — DECLINED, no mismatch (see above).
