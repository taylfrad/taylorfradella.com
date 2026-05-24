# webgl-performance — SAFE HARDENING ONLY

Lane scope was deliberately narrowed by the user to additive lifecycle/robustness fixes. The hero
is off-limits for any visual/motion change. Only two files were touched: `src/components/Lanyard.jsx`
and `src/components/ui/video-stage.jsx`. No other file was modified.

---

## A. `src/components/Lanyard.jsx` — three additive fixes

All three are additive on top of the existing `frameloop="demand"` + IntersectionObserver suspension
+ idle-frame halting. None of them replaces or alters those mechanisms.

### A1. `powerPreference: "high-performance"` (line ~381)
- **Before:** `gl={{ alpha: transparent }}`
- **After:** `gl={{ alpha: transparent, powerPreference: "high-performance" }}`
- Pure renderer hint requesting the discrete/high-perf GPU. Nothing else in the `gl` object changed.
- **DPR line directly above (~379) left byte-identical:** `dpr={[1, Math.min(window.devicePixelRatio, 2)]}`.

### A2. `visibilitychange` suspension (IO effect rewritten additively, lines ~298–360)
- Added two refs near the existing ones (lines ~287–293):
  - `ioVisibleRef` — raw on-screen state from the IntersectionObserver.
  - `contextHandlersRef` — holds the context-loss listeners for teardown (see A3).
- The IO effect now writes the raw intersection result to `ioVisibleRef`, and a `syncVisibility()`
  helper computes the **combined** state:
  `isVisibleRef.current = ioVisibleRef.current && !document.hidden`.
  - `isVisibleRef` is exactly what the existing frame loop reads
    (`if (!isVisibleRef?.current) return;`, ~line 528), so the existing early-return is **unchanged**
    and now also halts when the tab is hidden.
  - When the tab is hidden → `isVisibleRef.current = false` → the demand loop stops requesting frames.
    **No `invalidate()` is called on hide** (matches the spec instruction exactly).
  - On a hidden→visible transition the helper calls `invalidateRef.current?.()` to resume — **only if
    the canvas is also on-screen** per the IO (`ioVisibleRef.current`). If still off-screen, it does
    not invalidate.
  - To avoid fighting the idle-frame halting logic, it re-invalidates **only on the hidden→visible
    edge** (guarded by `wasVisible`), never on every sync.
- A `document` `visibilitychange` listener drives `syncVisibility()`. It is removed on unmount in the
  same effect's cleanup (alongside `obs.disconnect()`). Guarded with `typeof document !== "undefined"`
  for the SSR-safe contract this file already follows.

### A3. Context-loss recovery (in `onCreated`, lines ~389–404; teardown effect ~lines 339–357)
- In `onCreated`, after `invalidateRef.current = invalidate`, added listeners on `gl.domElement`:
  - `webglcontextlost` → `event.preventDefault()` (lets the browser attempt restoration).
  - `webglcontextrestored` → `invalidateRef.current?.()` (requests a repaint so the canvas doesn't
    stay blank).
- The listener references + the canvas element are stashed in `contextHandlersRef` and detached in a
  dedicated unmount-cleanup effect.

**Net effect of A:** the GL context asks for the high-perf GPU, the render loop now additionally
suspends when the tab is backgrounded (resuming cleanly only when both on-screen and foregrounded),
and a lost GPU context recovers instead of leaving a permanently blank canvas. No scene/material/
light/geometry/physics/motion code was touched.

---

## B. `src/components/ui/video-stage.jsx` — per-frame setState

### What the UI actually renders from `time` (verified before choosing an approach)
`CardStage`'s `time` is published through `TimelineContext` and consumed by **8 project preview
videos** (`fradelladev-video.jsx`, `fieldflow-video.jsx`, `taylcraft-video.jsx`, `workly-video.jsx`,
`taylor-video.jsx`, `lionsden-video.jsx`, `sweetspot-video.jsx`, plus `video-stage` itself). Each
video has ~7 `useSprite()` consumers plus a `useTime()` background. Every consumer reads
`localTime`/`progress`/`time` **synchronously during React render** and feeds it into `animate(...)`
/ `Easing` / `Math.sin(t*…)` with **sub-second windows** (e.g. `start: 0.15, end: 0.45`). The motion
is continuous and applied to plain `style={{}}` divs — these components do **not** use Framer
`motion` or motion values (verified: zero `framer-motion`/`useMotionValue` imports in the video
files).

### Consequence for the three suggested approaches
- **Whole-second buckets:** would step every animation at 1 fps and visibly break the previews.
  Rejected — violates "preserve exact visible behavior."
- **Framer motion value / ref + direct DOM write:** the ~50 scene components across 8 files read
  `time` from React context during render and never subscribe to a motion value. Making this work
  would require rewriting all 8 video files and every scene — **out of this lane's scope** (only
  `video-stage.jsx` may change) and a real regression risk.
- **Re-render only when the value changes:** the value changes every frame by design, so this is a
  no-op here.

### Approach chosen (safe, fully contained in `video-stage.jsx`, behavior-preserving)
Introduced a single `timeRef` accumulator as the playhead source of truth. The rAF loop now advances
`timeRef.current` and pushes a **concrete** value via `setTime(next)`, replacing the per-frame
**functional-updater closure** `setTime((t) => …)` that re-read previous state inside the setter on
every frame. The playback-reset effect and the exposed `setTime` callback also write `timeRef` so the
ref stays consistent.

- This trims per-frame closure allocation + setter-prev-state read and makes the loop/reset
  deterministic off one ref.
- It does **not** change a single rendered pixel: these scenes require a render per frame to animate,
  so `setTime` is still called each frame **by necessity**.

### Honest limitation (flagged per process rule, not guessed around)
The literal instruction "update the displayed time WITHOUT calling setState every frame" is **not
fully achievable inside `video-stage.jsx` alone** without breaking the visible animation, because the
8 consumer files read `time` from React context synchronously and interpolate sub-second motion from
it. Eliminating per-frame setState would require converting those 8 files to motion-value/ref
subscriptions — explicitly outside this lane's allowed file set and a visual-regression risk on the
project previews. The change shipped here is the maximal safe reduction in reconciliation overhead
that keeps behavior byte-identical. **Recommendation:** if the orchestrator wants per-frame setState
fully removed, route a follow-up that owns all 8 `*-video.jsx` files so the scenes can subscribe to a
motion value / ref directly. This is bounded cost today: `playing` is only true for the single
preview being hovered (desktop) or tapped (mobile), never idle.

---

## Prohibitions — confirmation
- **NO DPR/capability tiering.** `dpr={[1, Math.min(window.devicePixelRatio, 2)]}` left exactly as-is.
- **NO visual/material/light/color/tonemapping/geometry/particle/segment/meshline/lineWidth/intro/
  gravity/motion change.** Rendered pixels and motion are byte-identical. Only lifecycle/robustness
  and a non-visual setState refactor were added.
- **Untouched files:** `Hero.jsx`, `HeroBackground.jsx`, `StaticHeroBackground.jsx`, `HeroShell.jsx`,
  and everything else. Only `Lanyard.jsx` + `video-stage.jsx` changed.
- **`frameloop="demand"`, the IntersectionObserver suspension, and idle-frame detection are all
  preserved** — the visibilitychange + context-loss logic is layered on top, not a replacement.
- No git commit created (orchestrator commits).

## Verification results
- `npm run lint` → **passed, zero warnings** (`eslint . --report-unused-disable-directives
  --max-warnings 0`).
- `npm run build` → **passed** (`vite build`, 2774 modules, built in ~6s; `postbuild` 404 copy ran).
  - The two `duration-[400ms]` Tailwind "ambiguous class" warnings are **pre-existing** and unrelated
    to these two files (they originate from existing markup elsewhere; not introduced by this lane).
