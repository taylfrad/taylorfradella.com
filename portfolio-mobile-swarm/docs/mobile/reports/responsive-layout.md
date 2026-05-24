# Responsive-Layout Lane — Report

**Mandate:** make every phone size (320–430 portrait + landscape) look intentional with zero
horizontal scroll; mobile-first, additive, desktop is a protected baseline. The repo was already
substantially fluid (clamp typography, isMobile branches, responsive grids), so the job was to
**verify** and fix only genuine gaps — not churn working code.

**Bottom line:** Most of the page is already fine and I left it alone. There were **two real,
verified bugs**, both in the Skills pinned/footer interaction (the exact fragile spot the audit and
the scrollytelling lane flagged). I fixed both, mobile-gated. Horizontal scroll is clean at 320px.
Fluid type is healthy — no changes. One safe-area inset added. Hero landscape-padding flagged as a
follow-up (NOT touched). `index.html` NOT touched. Lint + build pass.

Everything below was **measured in a real browser** (Playwright, Chromium) at 320/375/430 portrait
and 667×375 / 812×375 / 932×430 landscape, plus a 1280×800 desktop regression check.

---

## Files changed (3)

### 1. `src/components/SkillsPage.jsx:40` — footer flows on short viewports
Added a `skills-footer` class to the footer wrapper (kept its existing `absolute bottom-0 …`
classes for desktop). CSS (below) flips it to `position: static` on phone-class viewports.
`// MOBILE-SWARM: layout` rationale comment added above it (`:24-39`).

### 2. `src/styles/globals.css:1099-1213` — appended, mobile-gated, `/* MOBILE-SWARM: layout … */`
Append-only (does not modify the scrollytelling lane's `.h-screen-svh`/`.min-h-screen-svh` block
that precedes it). Three concerns:
- **`:1136` `@media (max-width: 767px), (orientation: landscape) and (max-height: 430px)`** —
  (a) `.skills-footer { position: static }` so the footer drops into normal flow and scrolls in
  below the pinned section; (b) `#skills .sticky > .absolute.inset-x-0 { bottom: 0 !important }` to
  freeze the per-slide footer-overlap lift (there's no overlapping footer to clear anymore).
- **`:1152` `@media (orientation: landscape) and (max-height: 430px)`** — landscape phones only:
  hide the desktop left-rail dots (`…left-6 { display:none }`), switch the slide to a compact
  2-column grid, and tighten internal spacing/type so all four slides fit the short pinned frame.

### 3. `src/components/ui/BackToTop.jsx:33-37` — safe-area inset on the fixed chevron
Added `marginBottom/marginRight: env(safe-area-inset-bottom/right, 0px)` to the fixed bottom-right
back-to-top button so it clears the home indicator / curved corner on notched phones. `0px`
fallback → no-op on desktop and until the touch lane adds `viewport-fit=cover`.
`// MOBILE-SWARM: layout` comment at the site.

---

## Task 1 (HIGHEST PRIORITY): SkillsPage absolute footer at 320px + landscape

**Outcome: was BROKEN (footer overlapped the last pinned slide). Now FIXED. No dead scroll.**

**What I found (measured, pristine code):**
- **No dead scroll** anywhere — at max scroll the footer's bottom edge lands exactly at the viewport
  bottom (`window.innerHeight − footer.bottom = 0`) at 320/375/430 portrait and all landscape sizes.
  The "no dead scroll" invariant the comment in SkillsPage.jsx describes held up.
- **Footer DID overlap the last slide** (the bug):
  - 320×568 portrait: last slide's content bottom was **217px below the footer's top** → the 3rd
    skill ("Firebase Services") and the entire "Tools & Frameworks" pill row rendered *under* the
    opaque footer.
  - 375×667 portrait: 77px overlap. 812×375 landscape: 148px overlap.
- **Root cause:** the footer is `absolute bottom-0`, and the last slide is `position: sticky` with
  its centering box lifted by an inline `bottom: 0→32vh` easing in the last 10% of scroll. But the
  single-column slide content (~543–570px) is taller than the band that 32vh clears on a short
  viewport — the footer (246px ≈ 37–43vh on portrait phones, 229px ≈ 61vh in landscape) is simply
  taller than the 32vh the author budgeted. The author's own comment in `Skills.jsx:77-80` shows
  32vh was *intended* to clear the footer; it's just too small for the real mobile footer height,
  and content overflows the lifted box regardless because it's center-aligned.
- I confirmed this is **physically unsolvable by clearance/compaction alone** on the shortest phones
  (e.g. 320×568: footer 246px leaves 322px, but even aggressively compacted content is ~465px).

**The fix (and why it's clean):** drop the footer into **normal document flow** on phone-class
viewports (`position: static`). Now the footer scrolls in *below* the pinned section instead of
overlaying it — overlap is eliminated by construction, and "no dead scroll" is preserved
(`docScrollHeight` becomes `800vh-container + footer-height`, footer still lands at viewport bottom).
I froze the now-pointless `bottom: …vh` slide easing to `0` so the slide just fills its frame.

**This required NO change to `Skills.jsx`.** The `bottom`-easing override is pure CSS (`!important`
beats the inline style Skills.jsx writes each frame). It is **presentational only** — it does not
touch the rAF/scroll-progress math the scrollytelling lane owns. The left-rail dots are
`hidden md:flex` so on portrait phones they never render; in landscape I hide them (their 50→40vh
easing is meaningless once the footer flows and it nudged them off-screen at scroll-end).
**Flagged for the scrollytelling lane / QA:** the one place I override an inline style Skills.jsx
produces is `#skills .sticky > .absolute.inset-x-0 { bottom: 0 !important }` (globals.css `:1147`).
If that easing is ever reworked in JS, revisit the override.

**Verified after fix (real browser):** footer `position:static`, 0px dead scroll, **0px overlap**
(slide content sits at/above the footer top), no horizontal scroll — at 320×568, 375×667, 430×932
portrait. Screenshot confirmed all three skills + all three tool pills now visible above the footer.

---

## Task 2: Horizontal-scroll re-verify at 320px

**Outcome: CONFIRMED CLEAN. No real offenders.** Measured with a full-DOM scanner (any element whose
rect exceeds the viewport), scrolling each page top-to-bottom at 320px width:
- **Home** (`/`): `document.scrollWidth === 320`, **0 offenders**.
- **Work** (`/work`): `document.scrollWidth === 320`, `.work-page` container scrollWidth `320`,
  **0 offenders**. The 80vw mobile big-logo watermark is contained by its `overflow-hidden` section.
- **ProjectDetail** (`/project/1`): `document.scrollWidth === 320` and stayed 320 through the entire
  scrollytelling. The kinetic `ScrollTextRow` marquee rows DO geometrically extend ~7000px wide
  (the scanner sees them), but they are inside the `overflow-hidden` `TechSection`, so they create
  **no document horizontal scroll** — exactly the audit's "watch item, contained, OK" note,
  now confirmed live. No fix needed; I did not add any new `overflow-hidden`.

The `scrollWidth − clientWidth = 10px` I saw on some pages is the desktop Chromium vertical
scrollbar (clientWidth excludes it); `scrollWidth` always equalled `innerWidth`. Mobile uses overlay
scrollbars (`scrollbar-gutter: stable` is gated `min-width:768px` in globals.css), so this is not a
real-device issue.

---

## Task 3: Fluid type / spacing — verified, NO changes (already healthy)

Spot-checked source + rendered sizes at 320 and 430. The audit's "good clamp() coverage" holds:
- **Headlines scale responsively** via the existing scale's `sm:/md:` steps — Hero
  `text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl`, Projects `text-4xl sm:text-5xl`, Skills
  scrolly headline `text-[40px] sm:text-[48px] md:text-[56px]`. No cramping at 320.
- **Body/label text** is constant small-scale (`text-[11px]`–`text-[17px]`) — appropriate at all
  phone widths; not cramped at 320, not sparse at 430.
- The one large fixed size, `Projects.jsx:547 text-[72px]`, lives in a `hidden … md:block` decorative
  counter — **never renders on phones**. Not a mobile concern.

Per the task's "don't convert a size unless there's a genuine problem," I changed nothing. Keeping
the existing scale's ratios and semantic tokens intact.

---

## Task 4: Safe-area insets — one addition

The audit found `env(safe-area-inset-*)` already used in PageHeader (`:77`, top), Hero/HeroShell
(off-limits), PdfModal — all currently no-ops until the touch lane adds `viewport-fit=cover`.
- **Added:** `BackToTop.jsx` fixed chevron (`bottom-4 right-4 …`) had **no** inset and sits in the
  bottom-right corner where the home indicator / curved screen corner lives. Added
  `marginBottom/marginRight: env(safe-area-inset-bottom/right, 0px)`.
- **Coordination / QA:** like every other inset in the repo, this is dormant until the **touch lane**
  adds `viewport-fit=cover` to the viewport meta. **QA: re-check the back-to-top button position on a
  notched profile** once that lands. I did **not** touch `index.html` (touch lane owns the meta).

The PageHeader mobile dropdown and other edge elements already sit under PageHeader's top inset — no
new insets needed there.

---

## Task 5: Landscape check (excluding hero)

**Outcome: found a real landscape break in Skills, FIXED. Other pages OK.**

- **Skills (was broken in landscape):** the single-column slide content (~560px) is far taller than a
  landscape viewport (375px), so the headline AND tools were **clipped ~92px top and bottom on every
  slide** (the pinned frame is `overflow-hidden`) — independent of the footer. Narrow landscape
  phones (<768px wide, e.g. 667×375) got single-column; wide ones (≥768px, e.g. 812×375) already got
  the desktop 2-col but it still overflowed the short frame, plus the footer overlapped (148px).
  - **Fix:** in `(orientation: landscape) and (max-height: 430px)`, force the compact 2-column slide
    layout (landscape has the width to spare) + tighten spacing/type, and hide the desktop dots.
    Combined with the footer-flow fix from Task 1.
  - **Verified:** all four slides now fit the frame (max content ≈236–272px vs 375–430px frame) at
    667×375, 812×375, and 932×430 (the `max-height:430px` boundary, inclusive). Screenshot of the
    busiest slide (UI Engineering: 4 skills + 5 tools) confirms a clean, intentional 2-col layout
    with nothing clipped. No dead scroll, no overlap, no horizontal scroll in any landscape size.
- **Home / Work / ProjectDetail in landscape:** no layout break or content hidden by my changes;
  they use `min-h-[100svh]`/flow layouts that reflow fine. (Hero excluded — see follow-up below.)

---

## Hero landscape top-padding — FLAGGED, NOT FIXED (needs user sign-off)

Per the hard prohibition (hero is OFF-LIMITS), I did **not** touch this. Recommending it as a
follow-up requiring user sign-off:

- **Issue (P1 from audit):** `Hero.jsx:386` pushes hero content down with `pt-[54svh]/pt-[50svh]` so
  it sits below the lanyard. This top-padding is portrait-tuned; in landscape (≤430px tall) 50svh is
  ~half the viewport, which can push the headline + CTA off the bottom or into the scroll chevron.
- **Proposed fix (for sign-off):** gate the large top-padding to portrait, e.g. reduce it in
  `(orientation: landscape) and (max-height: 430px)` to a much smaller value (or switch the hero to a
  centered/`justify-center` layout in landscape) so the headline/CTA stay on-screen. Must be verified
  against the lanyard position and the hero's existing `env(safe-area-inset-top)` padding. Because
  this is hero code, it should be done by/with the user, not in this lane.

---

## Desktop regression check (protected baseline)

Verified at **1280×800** on `/skills`: footer still `position: absolute` (parallax intact), slide
grid still `444px 444px` 2-col via the original `md:grid-cols-2`, `md:pl-20` (80px) intact, dots
`display:flex` (visible), the `bottom: …vh` footer-overlap easing still reaches the full **32vh** at
progress=1 (my `bottom:0` override does NOT apply), 0px dead scroll, **0 console errors**. All my
media queries are `max-width:767px` or `(landscape and max-height:430px)` — desktop matches neither.
Desktop is byte-for-byte unchanged in behavior.

Reduced-motion path also verified at 320px: `SkillsStatic` (normal-flow section) renders, footer
flows cleanly below it, no overlap, no horizontal scroll — the `position:static` change is if
anything *more* correct there than the prior absolute footer.

---

## Shared-file edits / coordination

- **`src/styles/globals.css`** — APPEND-ONLY with `/* MOBILE-SWARM: layout … */` marker (`:1099`).
  Did not modify the scrollytelling lane's preceding `.h-screen-svh`/`.min-h-screen-svh` block. The
  touch lane appends after me — no collision (my rules are a self-contained trailing block).
- **`src/components/SkillsPage.jsx`** — layout-only (footer wrapper class). Not owned by another lane.
- **`src/components/ui/BackToTop.jsx`** — layout-only (safe-area inset). Handoff: the inset is dormant
  until the **touch lane** adds `viewport-fit=cover`; QA re-checks on a notched profile.
- **One inline-style override flagged to scrollytelling lane:** globals.css `:1147`
  `#skills .sticky > .absolute.inset-x-0 { bottom: 0 !important }` overrides the inline `bottom` lerp
  Skills.jsx writes. It's presentational (not progress math), but the scrollytelling lane owns
  Skills.jsx and should be aware. I did **not** edit Skills.jsx.

## Lint + build

- `npm run lint` → **0 warnings** (clean). I introduced no new JS logic — changes are CSS, JSX
  comments, and one inline-style object — so no new lint surface. The two known `duration-[400ms]`
  warnings did not fire in this environment; I added none.
- `npm run build` → **passes** (`✓ built in ~6.5s`), `postbuild` 404 copy ran. Verified all four of
  my CSS rules survived minification into `dist`: `.skills-footer{position:static}`,
  `…inset-x-0{bottom:0!important}`, `grid-template-columns:1fr 1fr`, `…left-6{display:none}`.

## Did NOT touch
- `Hero.jsx`, `HeroBackground.jsx`, `HeroShell.jsx`, `StaticHeroBackground.jsx`, `Lanyard.jsx` (hero
  off-limits — landscape padding flagged above instead).
- `index.html` (touch lane owns the viewport meta).
- `Skills.jsx` scroll/rAF/progress logic (scrollytelling lane owns it; my Skills fixes are CSS-only).
- No git commit (orchestrator commits).
