# Mobile Parity Audit — Phase 0 (mobile-auditor)

**Scope:** React 18 + Vite portfolio SPA at repo root (`src/`). Read-only audit against
`MOBILE_PORT_SPEC.md`. Device matrix: 320 / 375 / 393 / 414 / 430 px portrait + landscape.

**Headline:** The repo is already substantially mobile-aware. The `perf/cleanup-and-optimization`
branch did real work (Lanyard DPR clamp + IntersectionObserver suspension + idle detection,
Projects tap-to-play previews, Work/ProjectDetail `isMobile` branches, `clamp()` typography, some
`env(safe-area-*)`). The remaining gaps are concentrated and specific: the **viewport meta is
missing `viewport-fit=cover`** (so every `env(safe-area-inset-*)` already in the code is currently a
no-op), **pinned scrollytelling sections use `h-screen`/`100vh`** (not dynamic units → address-bar
jump), the **Work page hijacks wheel/touch scroll** (`preventDefault`, non-passive wheel), several
**hover-only reveals have no touch fallback**, and the **WebGL Lanyard lacks `visibilitychange`
suspension, `powerPreference`, and `webglcontextlost` handling**.

---

## Stack fingerprint

### Build / framework / routing
- **Vite 4.4 + React 18.2 + SWC** (`@vitejs/plugin-react-swc`). `package.json:46-49`, `vite.config.js:3,7`.
- **React Router 6.30** (`react-router-dom`). `BrowserRouter` mounted in `src/main.jsx:91` with
  `future: { v7_relativeSplatPath, v7_startTransition }`. Routes in `src/App.jsx:305-311`: `/`,
  `/project/:id`, `/work`, `/skills`, `/about`. All routes lazy (`App.jsx:37-41`).
- **Manual chunking** for the heavy 3D/motion libs in `vite.config.js:42-48` (`rapier`, `r3f`,
  `three`, `motion`, `ogl`). `base: "/"` (`vite.config.js:53`). `postbuild` copies 404 for GH Pages
  SPA routing (`package.json:13`, `scripts/copy-404.js`).
- **Custom Vite plugin** `scripts/vite-hero-preload.js` (`vite.config.js:4,7`) — injects hero preload.

### 3D / WebGL layer
- **Single Three.js scene:** the **Lanyard** (`src/components/Lanyard.jsx`). Uses
  `@react-three/fiber 8.18`, `@react-three/drei 9.122`, `@react-three/rapier 1.5` (physics rope +
  card), `meshline 3.3`, `three 0.167`.
  - `<Canvas>` created at `Lanyard.jsx:318` with `frameloop="demand"` (`:321`), DPR clamped
    `dpr={[1, Math.min(window.devicePixelRatio, 2)]}` (`:322`), `gl={{ alpha: transparent }}`
    (`:323`). `onCreated` sets `gl.domElement.style.touchAction = "none"` (`:329`) so the card is
    draggable on touch.
  - `Environment` with 4 `Lightformer`s (`Lanyard.jsx:347-376`). `meshPhysicalMaterial` clearcoat +
    metalness on the card (`:745-752`). No shadow maps configured (good — shadows off by default).
  - Physics: `<Physics gravity={gravity} timeStep={1/60}>` (`:336`), 4 `RigidBody` rope segments +
    spherical joint (`:499-505`), `useFrame` simulation loop (`:518-642`).
  - **Mobile-aware already:** `isMobile` via `matchMedia("(max-width:767px)")` (`:291-296`);
    IntersectionObserver with `rootMargin:"200px"` flips `isVisibleRef` and the loop early-returns
    when off-screen (`:298-309,:528`); idle detection halts `invalidate()` after 90 still frames
    (`:384-386,:611-642`); meshline resolution + lineWidth differ on mobile (`:822,:826`); intro
    physics profiles differ (`INTRO_MOBILE` vs `INTRO_DESKTOP`, `:106-114,:422`).
- **The "hero shader/Balatro" described in CLAUDE.md is now a `<video>`.** `HeroBackground.jsx`
  renders a poster `.webp` + `hero.webm`/`hero.mp4` (`:46-81`), **not** an OGL shader. `ogl` is still
  a dependency and chunk (`package.json:27`, `vite.config.js:47`) but I found **no OGL usage in
  `src/`** — likely dead weight on the bundle. `StaticHeroBackground.jsx` is a pure CSS gradient
  (Suspense fallback + Lanyard placeholder).
- `react-pdf 10.4` + `MobilePdfViewer` for the resume/manual modals.

### Scroll / scrollytelling mechanism — **CUSTOM, three different implementations**
There is no GSAP and no Lenis. Scroll is driven three ways:
1. **Framer Motion `useScroll` + `useTransform`** (the dominant pattern) — `ProjectDetail.jsx`.
   `useStickyMotion(ref)` (`ProjectDetail.jsx:28-34`) wraps `useScroll({ target, offset:["start
   start","end end"] })` and returns `scrollYProgress`; sections map it through `useTransform(...,
   { ease: easeIO })` writing transform/opacity straight to the DOM (no re-render). Also used by
   `useScrollMotion.js` and `Footer.jsx`.
2. **Hand-rolled rAF lerp loop** — `Skills.jsx` (`SkillsScrollytelling`, `:306-503`). A passive
   `scroll`+`resize` listener computes a target via `getBoundingClientRect()` / `window.innerHeight`
   (`:359-381`), and a rAF loop lerps `current → target` at `0.08`/frame, gated by an
   IntersectionObserver (`:385-427`). Heights are `vh`-based (`:444`, `capCount*180+80 = 800vh`).
3. **Custom fullpage-style section scroller** — `Work.jsx` (`:120-221`). RAF tween (`scrollToEntry`,
   1200ms cubic) + `wheel`/`touch`/`key` handlers that **advance one full viewport per gesture**.
- `useScrollyProgress.js` is now a thin shim: only `easeIO()` (`:14-16`) and `useScrollyInView()`
  (`:20-52`, IntersectionObserver-ish via passive `scroll` + 500ms polling, fires once). Its old
  `useStickyProgress` was migrated into Framer's `useStickyMotion` (see header comments `:1-8`).
  **Working-tree modification:** the file was trimmed to just these two exports — the desktop
  baseline math `(-rect.top / (height - vh))` is preserved verbatim inside `useStickyMotion`.
- `src/lib/navigation.js` — `scrollToSection()` / `smoothScrollToTop()` custom rAF tweens
  (1200ms / adaptive). `SCROLL_TO_PROJECTS_FLAG` back-nav continuity (`constants.js:7`).

### Styling system + tokens
- **Tailwind 3.4** (`tailwind.config.cjs`) + `tailwindcss-animate`. `darkMode:["class"]` (`:3`).
  Container padding `1rem`, only `2xl:1400px` screen override (`:6-11`) — **default Tailwind
  breakpoints otherwise** (sm 640 / md 768 / lg 1024).
- **Semantic CSS-variable tokens** in `src/styles/globals.css` (`:8-181` light/dark roots) and
  **glass tokens** in `src/styles/glass-tokens.css`. The `md`/`isMobile` breakpoint used in JS is
  consistently **`max-width: 767px`** (Hero, Lanyard, ProjectDetail, Work, PageHeader, PdfModal);
  Projects uses **600/900** for grid columns (`Projects.jsx:561-582`).
- **Fonts:** body stack is `"SF Pro Display/Text", -apple-system, … "Inter" …` (`globals.css:217`);
  **Inter** is the only self-hosted webfont (`index.html:101-125`, preloaded `:73`). Headline/
  nameplate use `NAME_FONT_FAMILY = "font_shi8d64tg, sans-serif"` (`constants.js:10`) — a custom
  display face. **Manrope and JetBrains Mono are NOT in the codebase** — the spec's expected type
  stack does not match; code mono is `"SF Mono","Fira Code","Roboto Mono"` (`globals.css:272`).
- **Coral accent:** the spec's `#F97066` exists **only** as the FieldFlow work-entry accent
  (`Work.jsx:42`) and a gradient stop (`:66`). The **site/brand accent is `#4A8EB7`**
  (`--accent-brand`, `globals.css:48`); `--accent → --accent-cyan #2C6F85` (`:69`). Per-project
  accents vary (`projectsData`, `ProjectDetail` reads `project.accentColor`). **There is no single
  global coral.** Lanes must not assume `#F97066` is the site accent.

### Existing breakpoints / mobile handling already present
- `useMediaQuery.js` (`matchMedia`, breakpoint-cross only). Hero compact `<768`, tablet `768–1023`
  (`Hero.jsx:188-189`). Projects 1/2/3-col at `<=600 / <=900 / else` (`Projects.jsx:561`).
- Mobile-specific code already shipped: Hero hamburger menu (`Hero.jsx:36-85`), Projects tap-to-play
  (`Projects.jsx:350-387`), Work mobile logo watermark (`globals.css:1041-1057`), ProjectDetail
  `isMobile` scroll-distance + glow-off (`ProjectDetail.jsx:248,273,276`), PdfModal mobile viewer
  (`PdfModal.jsx:36-46`).

### Viewport meta (exact contents)
`index.html:5`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
**Missing `viewport-fit=cover`.** Consequence: all the `env(safe-area-inset-*)` rules already in the
code (Hero `:167,:337`, HeroShell `:21,:69`, PageHeader `:77`, PdfModal `:127,:128,:144`) **do
nothing** on notched devices because the safe-area insets resolve to `0` without `viewport-fit=cover`.
Also no `theme-color` issue (present `:18-26`), but no `interactiveWidget` hint.

---

## Defect inventory

Severity: **P0** = broken/unusable · **P1** = clearly wrong · **P2** = polish.
Lane: **layout** / **webgl** / **scrollytelling** / **touch**.

| Severity | Viewport(s) | Issue | File:line | Lane |
|---|---|---|---|---|
| **P0** | all | **Viewport meta lacks `viewport-fit=cover`** → every `env(safe-area-inset-*)` in the code is a no-op; content can sit under notch/home indicator; also blocks edge-to-edge. | `index.html:5` | touch |
| **P0** | all portrait | **Pinned scrollytelling sections use `h-screen` / `min-h-screen` (=100vh)** for the sticky child. On mobile, the address bar show/hide changes the visual viewport, so the pinned scene jumps/clips as the bar animates. Must move to `100svh`/`100dvh`. | `ProjectDetail.jsx:274` (`h-screen`), `:439,:593,:667` (`min-h-screen`); `Skills.jsx:449` (`h-screen`) | scrollytelling |
| **P0** | all | **Work page hijacks scroll on touch.** `onWheel`+`onTouchEnd` call `e.preventDefault()` and the wheel listener is `{ passive: false }`; a single swipe jumps one full viewport via a 1200ms rAF tween. Spec §5.2 explicitly forbids momentum hijacking on mobile. Fights native momentum, can feel stuck, and breaks if a swipe is short. | `Work.jsx:178-221` (esp. `:186` `preventDefault`, `:210` `passive:false`) | scrollytelling |
| **P1** | all touch | **Hover-only reveal, no touch fallback — Next Project CTA glow + title scale.** Driven by `onMouseEnter/Leave` → `hovered` state; on touch the affordance never appears. Gate behind `@media (hover:hover)` and/or use `:active`/always-on. | `ProjectDetail.jsx:769,776-799` (`setHovered`, `hovered ? … : …`) | touch |
| **P1** | all touch | **Hover-only reveal — Projects bento accent glow + arrow nudge + lift.** Card `hovered` state drives box-shadow lift, arrow `translateX`, and glow (for `id>7`). Mobile gets tap-to-play video instead but loses the visual hover affordances. Confirm always-on/active treatment. | `Projects.jsx:118,162-181,335-347,499-516` | touch |
| **P1** | all touch | **Hover-only mode-toggle tooltip** (`group-hover:opacity-100`) and **footer icon hover animations** (`onMouseEnter` → `startAnimation`) have no touch path. Tooltip is non-critical (button has `aria-label`), but icon micro-animations never fire on touch. | `mode-toggle.jsx:59-69`; `Footer.jsx:97-98,112-113,125-126` | touch |
| **P1** | landscape (≤430 tall) | **Hero content uses `pt-[54svh]/pt-[50svh]` push-down** to sit below the lanyard; in landscape the headline + CTA can be pushed off the bottom / overlap the chevron. Needs a landscape check (the 100svh hero is fine, but the 50svh top-padding is portrait-tuned). | `Hero.jsx:386` | layout |
| **P1** | all | **WebGL: no `visibilitychange` suspension.** Lanyard suspends when off-screen (IO) but keeps its demand loop eligible when the tab is hidden / backgrounded. Spec §5.3 requires pausing on `visibilitychange`. SENSITIVE (hero). | `Lanyard.jsx:298-309` (only IO, no visibility) | webgl |
| **P1** | all | **WebGL: no `webglcontextlost`/`restored` handling** and **no `powerPreference:"high-performance"`** on the GL context. Mobile context loss under memory pressure will blank the canvas permanently. SENSITIVE (hero). | `Lanyard.jsx:323` (`gl={{ alpha }}` only) | webgl |
| **P1** | 320–430 | **Skills custom scroll uses `window.innerHeight` + `h-screen` together.** The rAF target math reads `window.innerHeight` (`:364`) which changes with the address bar, while the sticky child is fixed `h-screen` (100vh). The mismatch desyncs progress vs. the pinned frame on bar show/hide; `vh`-based clearance (`:85,:226`) and 800vh total height compound it. Recompute on `orientationchange`/visualViewport. | `Skills.jsx:359-381,444,449,85,226` | scrollytelling |
| **P1** | 320 portrait | **SkillsPage footer is `absolute bottom-0`** and relies on Skills' `vh`-derived total height landing the footer exactly at viewport bottom. With mobile dynamic-viewport math the "no dead scroll / no overlap" assumption can break (dead scroll or footer overlapping pinned slide). Verify at 320/landscape. | `SkillsPage.jsx:31-33`; `Skills.jsx:444` | scrollytelling / layout |
| **P2** | all | **`requestAnimationFrame`-driven React `setState` per frame** in two places: Skills `setScrollProgress` every frame (`:393`) and `video-stage.jsx` `setTime` every frame (`:87`). Per-frame React reconciliation is costly on mid-tier phones during scroll/preview. Prefer motion values / refs. | `Skills.jsx:393`; `video-stage.jsx:87` | scrollytelling / webgl |
| **P2** | 320–375 | **Mobile preview play/pause button is 40×40 px** (< 44 min touch target). | `Projects.jsx:367-368` (`width:40,height:40`) | touch |
| **P2** | all touch | **`touch-action: manipulation` not set on interactive elements** (only `touchAction:"none"` on the Lanyard canvas). No global 300ms-delay mitigation beyond the viewport meta. `-webkit-tap-highlight-color` only set on `.floating-nav-btn` (`globals.css:438`), not site-wide. | `globals.css` (absent); nav/buttons throughout | touch |
| **P2** | all | **Page-transition slide uses `100vh`/`-100vh`** for the vertical (home↔subpage) Work slide. During the transition body scroll is locked (`App.jsx:218-231`), so overflow is contained, but the off-screen page is positioned with `100vh` not `100dvh`, so the slide distance can mismatch the visible viewport on mobile and leave a sliver. | `App.jsx:71,113` | scrollytelling / layout |
| **P2** | all | **`ScrollRevealImage` clip/scale reveal** (`offset:["start end","center center"]`) is fine on touch, but the `scale 1.2→1` on a full-width image is a paint-during-scroll cost on long screenshot lists. Low risk; verify fps on image-heavy projects. | `ProjectDetail.jsx:166-198` | scrollytelling |
| **P2** | all | **`prefers-reduced-motion` coverage is good but partial.** Honored globally (`globals.css:380-387`), in Skills (static fallback `:299-301`), Work, About, chevrons. **Not honored** by: ProjectDetail scroll-linked `useTransform` reveals (they still scrub — acceptable since scrub follows the finger, but no static path), `ScrollRevealImage`, and the Lanyard intro swing path partially (uses `shouldReduceEffects` for gravity but still mounts WebGL). Confirm a coherent reduced path on ProjectDetail. | `ProjectDetail.jsx` (no reduced branch); `Lanyard`/`Hero.jsx:363` | scrollytelling / webgl |
| **P2** | all | **Dead OGL dependency / chunk.** `ogl` is bundled (`vite.config.js:47`) but unused in `src/`. Not a mobile defect per se, but ships unused JS to phones. Flag for cleanup (out of swarm scope unless trivially safe). | `package.json:27`, `vite.config.js:47` | (none / cleanup) |
| **P2** | all | **Leftover `html.reduce-effects` token block** in `glass-tokens.css:189-203`. It IS still wired (theme-provider toggles the class from OS `prefers-reduced-motion`, `theme-provider.jsx:61`), so it is **not dead** — but note it duplicates the `@media (prefers-reduced-transparency)` block and could be consolidated. No action needed for parity. | `glass-tokens.css:189`; `theme-provider.jsx:61` | (none) |

### Horizontal-scroll audit (no P0 found)
- `body { overflow-x: hidden }` (`globals.css:216`) + multiple ancestors use `overflow-x: clip`
  (`App.jsx:277`, `ProjectDetail.jsx:934`) / `overflow: clip` (`Projects.jsx:596`). This is a strong
  safety net.
- **Watch items (not confirmed bugs):** the kinetic `ScrollTextRow` translates up to ±280px inside
  `overflow-hidden` sticky `TechSection` (`ProjectDetail.jsx:486-528,594`) — contained, OK. The Work
  big-logo at `44vw`/`80vw` is in an `overflow-hidden` section (`Work.jsx:367`) — OK. No raw `100vw`
  inside padded containers found. Lightbox uses `100dvw/100dvh` correctly (`ProjectDetail.jsx:127-128`).

---

## Desktop scrollytelling baseline (parity target)

Downstream lanes must reproduce **these beats, in this order, with `easeIO` cubic
(`t<0.5 ? 4t³ : 1−(−2t+2)³/2`, `useScrollyProgress.js:14`)**, only re-tuning scrub *distance* per
breakpoint — never deleting beats. All progress values are the section's local `scrollYProgress`
(0→1) from `useStickyMotion` unless noted.

### `/project/:id` — ProjectDetail.jsx (the primary scrollytelling experience)
Outer container height = scrub distance. **Mobile already shortens these** (keep that pattern):

1. **HeroSection** (`:246-355`) — container `170vh` mobile / `220vh` desktop (`:273`), sticky
   `h-screen` child. Beats off `p`:
   - title scale `1→0.72` over `0.08–0.42`; title Y `+6vh→−6vh` same range (`:254-256`).
   - role overline opacity `0→1` + Y `14→0` over `0.18–0.38` (`:257-258`).
   - accent line `scaleX 0→1` over `0.12–0.38` (`:259`).
   - description opacity + Y `20→0` over `0.38–0.56` (`:260-261`).
   - tags opacity `0→1` over `0.52–0.66` (`:262`).
   - links/status opacity `0→1` over `0.62–0.76` (`:263`).
   - glow opacity `0.1→0.35` over `0–0.5` (**desktop only**, hidden on mobile `:276`); watermark
     opacity `0.18→0.06` + scale `1→0.9`; scroll-indicator fades `0.5→0` over `0–0.1` (`:264-268`).
2. **StatementSpotlightsSection** (`:383-480`) — `200vh` mobile / `220vh` desktop (`:438`),
   `offset:["start 0.85","end 0.5"]`. Title opacity+Y `40→0` over `0–0.12`; statement opacity+Y
   `28→0` over `0.15–0.28` (`:395-398`); each spotlight staggers `start = 0.22 + i*0.12`, opacity+Y
   `24→0` over a `0.1` window (`:365-368`). Desktop = 2-col grid; **mobile = stacked flex-col**
   (`:441`). Fallback (no statement/spotlights): centered `extendedDescription`, IO fade (`:404-413`).
3. **TechSection** (`:535-628`) — `200vh`, sticky. Title opacity+Y `40→0` over `0–0.12`; rows
   opacity+Y `24→0` over `0.18–0.3` (`:548-551`). Then **kinetic horizontal text**: rows translate
   `x` from `dir*speed*−1 → dir*speed` over page-scroll `0→1` (`:486-491`); speeds 140–280, alt
   directions. **Mobile renders 4 rows (reps=3); desktop 6 rows (reps=4)** (`:567,:576`). Highlight
   word = primary tool in accent; ghost words = stroked outline.
4. **ScreenshotShowcase** (`:200-228`) — non-pinned. Each image: `clipPath inset 50%→0%`, `scale
   1.2→1`, `borderRadius 20→12` over `offset:["start end","center center"]` (`:166-178`). Tap opens
   Lightbox (swipe/arrow nav).
5. **FeaturesSection** (`:646-724`) — `220vh` mobile / `260vh` desktop (`:666`). Title opacity+Y
   `40→0` over `0–0.1`; feature bullets stagger `start = 0.14 + (i/total)*0.35`, opacity + X `14→0`
   over `0.06` (`:634-637`); links opacity+Y `0.5–0.56` (`:655-656`); right-column summary fades
   `0.08–0.18` (`:658`) then `DescriptionReveal` reveals sentences one-by-one
   (`start = 0.18 + (i/count)*0.32`, `:728-731`). Desktop 2-col; **mobile stacked** (`:669`).
6. **NextProjectSection** (`:766-801`) — `min-h-[60vh]`, IO fade-in (`inView` opacity+Y `28→0`,
   0.9s cubic `:787`). **Hover-only glow + title scale (P1 above).**
7. **Footer** (lazy).
- **Global HUD** (portaled, `:904-932`): top progress bar = `useSpring(useScroll().scrollYProgress)`
  (`:236-242`); back-to-projects button (preserves back-nav, `:871-884`); back-to-top chevron > 300px.

### `/skills` — Skills.jsx (`SkillsScrollytelling`)
- Total height `capCount*180 + 80 = 800vh` (`:444`); sticky `h-screen` viewport (`:449`).
- 4 capability slides crossfade by per-slide opacity off a **lerped** `scrollProgress` (0.08/frame).
  Per slide phases (local progress): enter `0–0.18` (title/overline slide in from −120px X),
  reveal `0.12–0.35` (accent line width `0→100%`, skills stagger from +60px X), desc `0.18–0.38`,
  tools `0.30–0.50` (pills from +40px X + scale 0.92→1), exit `0.62–0.85` (slide out −80px X, skipped
  for last) (`:60-72,154-206`).
- **Mount intro:** slide 0 auto-builds to `0.55` over 3500ms quartic after an 800ms delay, without
  scrolling (`:326-355`); `effectiveProgress = max(localProgress, introProgress)` for slide 0.
- Footer-overlap easing in last 10% of scroll: slide box `bottom 0→32vh`, dots `top 50vh→40vh`
  (`:85,221-222`).
- **Reduced-motion:** renders static stacked `SkillsStatic` list, no scroll mapping (`:253-301`).
  This is a clean parity reference for the reduced path.

### `/work` — Work.jsx
- Fullpage-style: N full-viewport (`100svh`) entries (`:370`), one role each. **Scroll-jacked**
  (P0 above): wheel/touch/key advance one entry via 1200ms rAF tween (`:121-148`).
- Per-entry parallax (Framer `useScroll` on the container): big logo Y `−10vh→10vh`, ambient
  `−5vh→5vh` — **both disabled on mobile** (set to `0vh→0vh`, `:339-348`). Entry build-out:
  first entry animates on mount, others via IO at 0.5 threshold (`:351-361`); CSS `work-fade-up`
  keyframes staggered (`globals.css:983-1021`).
- Right-rail progress dots (desktop only, `hidden md:flex`, `:268`).
- **Mobile already handled:** big logo becomes a blurred 80vw watermark, content centered
  (`globals.css:1041-1057`); logo sizes shrink (`Work.jsx:421-422,457`).

### Home page reveals (not pinned, but part of the story)
- `Projects` bento: IntersectionObserver `useReveal` staggered opacity+Y `28→0`, `delay = idx*70ms`
  (`Projects.jsx:24-43,117-184`). `Skills`/`Footer` reveals via `useScrollMotion`/`useReveal`.
- Page transitions (`App.jsx:65-135`): forward project slide-in from right (sync, 0.7s); backward
  fade-back; home↔subpage vertical slide `100vh` (1.2s `EASE`); subpage↔subpage horizontal by
  nav-order. **These are Framer page transitions, not scroll — preserve as-is (memory: asymmetric
  transitions are intentional).**

---

## Recommended lane plan & sequencing

### Shared files (orchestrator must sequence — multiple lanes touch these)
- **`src/components/ProjectDetail.jsx`** — touched by **scrollytelling** (`h-screen`→`svh/dvh` on
  `:274,439,593,667`; reduced-motion path) AND **touch** (NextProject hover→touch `:769-799`).
  → Sequence: scrollytelling first (structural pin fix), then touch (hover gating), commit between.
- **`src/components/Skills.jsx`** — **scrollytelling** (innerHeight/`h-screen` sync, orientation
  recompute, per-frame setState) AND **layout** (`vh` clearance math at small viewports). Single
  lane (scrollytelling) should own the rAF/viewport math; layout only reviews the `vh` constants.
- **`src/styles/globals.css`** — **layout** (type scale, `svh`/`dvh` utilities, safe-area) AND
  **touch** (`touch-action`, `-webkit-tap-highlight`). Both append-only; use the
  `/* MOBILE-SWARM: <lane> */` marker. Low collision risk.
- **`src/components/Work.jsx`** — **scrollytelling** owns the de-hijack (make touch native;
  keep desktop wheel-snap behind `@media (hover:hover)` / pointer check). Already mobile-optimized
  for layout — coordinate so layout lane doesn't re-touch.
- **`index.html`** — **touch** owns the viewport-meta fix (add `viewport-fit=cover`). One-line,
  do it first — it unlocks every existing `env(safe-area-*)` rule site-wide.

### Lane assignments
- **touch-interaction:** `index.html:5` viewport meta (**do first**); hover→touch gating for
  ProjectDetail NextProject (`:769-799`), Projects bento (`Projects.jsx:118,162-181,335-347`),
  mode-toggle tooltip (`mode-toggle.jsx:59`), footer icons (`Footer.jsx:97-126`); tap targets
  (Projects play button 40→44px `:367`); `touch-action: manipulation` + tap-highlight in
  `globals.css`.
- **scrollytelling-engineer:** `h-screen`/`min-h-screen` → `100svh`/`100dvh` in ProjectDetail
  (`:274,439,593,667`) and Skills (`:449`); Work de-hijack (`Work.jsx:178-221`); Skills
  innerHeight/orientation recompute (`:359-381`) + per-frame setState (`:393`); App.jsx vertical
  slide `100vh`→`100dvh` (`:71,113`); re-tune scrub distances per breakpoint (the `*vh` container
  heights already branch on `isMobile` — extend, don't rewrite). **Preserve `easeIO` and every beat
  in the baseline above.**
- **responsive-layout:** type scale / spacing review (most is already `clamp()`); SkillsPage footer
  `absolute bottom-0` interaction at 320/landscape (`SkillsPage.jsx:31`); Hero landscape
  top-padding (`Hero.jsx:386`); safe-area padding on any newly edge-pinned elements; verify the
  `vh` constants in Skills against small viewports.
- **webgl-performance (ALL SENSITIVE — hero, requires user sign-off):** add `visibilitychange`
  suspend/resume to Lanyard (`:298-309`); add `powerPreference:"high-performance"` + 
  `webglcontextlost/restored` handlers on the GL context (`:323-332`); consider a capability tier
  (lower DPR clamp to 1.5 on low-end via `hardwareConcurrency`/`deviceMemory`) — the existing
  `isMobile` mesh/intro branches are the integration point. The video-stage per-frame `setTime`
  (`video-stage.jsx:87`) is in the project-preview render path, not the hero — safe to optimize
  outside the hero sign-off gate.

### Hero / off-limits callouts (require user sign-off before any change)
Per CLAUDE.md and project memory, the hero is delicate and off-limits. **All of these touch hero
code** and are marked SENSITIVE:
- `Lanyard.jsx` — visibilitychange suspension, powerPreference, context-loss handling, capability
  tiering (P1/P1/P1/P2 above).
- `Hero.jsx` — landscape top-padding (`:386`, P1) and any reduced-effects mount behavior (`:363`).
- `HeroBackground.jsx` — the hero `<video>` element (no defect found; do not touch without sign-off).

Everything else (ProjectDetail, Skills, Work, Projects, page CSS, viewport meta) is **outside the
hero** and safe for the lanes to implement under normal review.

---

## Verification notes for QA phase
- After the viewport-meta fix, **re-verify safe-area** on a notched profile — the insets that look
  broken today should start working, possibly changing header/CTA positions slightly.
- Watch the **Skills `800vh` pinned section** and **SkillsPage absolute footer** specifically at
  320px portrait and landscape — that's the most fragile dynamic-viewport interaction.
- Lint baseline: repo enforces `eslint --max-warnings 0` (`package.json:11`); confirm clean before
  and after each lane (could not run lint here — read-only; no code changed).
- No console-error/WebGL-warning audit was possible without a running dev server (kept read-only).
