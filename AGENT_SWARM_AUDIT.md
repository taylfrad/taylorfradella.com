# 🤖 AGENT SWARM — CODEBASE AUDIT

# Paste this entire file into Claude Code and run it against your repo.

# All agents are READ-ONLY. Nothing will be changed or rewritten.

# At the end, a combined master report will be generated.

\---

You are an orchestrator running a swarm of 5 specialized audit agents across this entire codebase.
Each agent has a specific focus. Run them sequentially. After all agents complete, compile everything
into a single master report file called `AUDIT\\\_REPORT.md` at the root of the project.

Do NOT modify any files. Do NOT suggest rewrites inline. Only read, analyze, and document findings.

\---

## ════════════════════════════════════════

## AGENT 01 — UI CONSISTENCY AUDITOR

## ════════════════════════════════════════

Scan every component, stylesheet, CSS module, Tailwind config, and design token file.
Your job is to find every visual inconsistency in the codebase — anything that doesn't
match the established patterns or looks like it was built at a different time.

**Look for:**

### Buttons \& Interactive Elements

* Buttons using different border-radius values without intentional variation
(e.g., some `rounded-full`, some `rounded-md`, some `rounded-none`)
* Inconsistent padding/height across similar button types (primary, secondary, ghost, icon)
* Hover/active/focus states that differ across buttons of the same type
* Some buttons using `box-shadow`, others not, with no clear pattern
* Font-weight or font-size inconsistencies within the button system

### Typography

* Headings (h1–h6) that don't follow a clear, consistent type scale
* Font families appearing in some places but not others without clear design intent
* Hardcoded font-size values in px when the rest of the codebase uses rem (or vice versa)
* Inconsistent line-height or letter-spacing across similar text elements

### Spacing \& Layout

* Padding or margin values that deviate from the spacing scale
(e.g., a random `padding: 13px` when the system uses multiples of 4 or 8)
* Different internal padding across sections/cards/components that visually look the same
* Inconsistent gap values between flex or grid children

### Colors

* Hardcoded hex/rgb colors in components instead of CSS variables or design tokens
* Near-duplicate colors that are slightly off (e.g., `#1a1a1a` vs `#181818` vs `#1c1c1c`)
* Colors used in one place that don't appear anywhere else in the codebase
* Background, border, and text colors applied inconsistently across similar components

### Icons

* Mixed icon libraries used in the same project (e.g., Heroicons + Lucide + inline SVGs)
* Icon sizes that don't follow a consistent scale
* Inconsistent `stroke-width` across icons of the same set

### Animations \& Transitions

* Different transition durations on similar interactive elements
(e.g., hover transitions at 150ms in one place, 300ms in another)
* Mixed easing functions with no apparent reason for variation
* Elements that animate on hover in one part of the UI but not in visually similar elements elsewhere

### Z-Index

* Z-index values used without a clear layering system
* Modals, drawers, tooltips, or dropdowns with potentially conflicting z-index values

### Component API Inconsistencies

* Components that do the same thing but accept different prop names
(e.g., one uses `variant`, another uses `type`, another uses `kind`)
* Structurally identical components that were built separately instead of being reused

**Output format for Agent 01:**

```
## AGENT 01 REPORT — UI CONSISTENCY

### Summary
- Total issues: X
- Critical: X | Moderate: X | Minor: X

### \\\[Category Name]

\\\*\\\*Issue #X — \\\[Short descriptive title]\\\*\\\*
File(s): path/to/file
Line(s): \\\[if applicable]
Severity: Critical | Moderate | Minor
What's wrong: \\\[Clear description]
Evidence:
  - file-a.jsx uses: \\\[value]
  - file-b.jsx uses: \\\[different value]
Expected: \\\[What consistency would look like]

\\\[Repeat for every issue]
```

\---

## ════════════════════════════════════════

## AGENT 02 — BUG DETECTION AGENT

## ════════════════════════════════════════

Perform a deep static analysis of the entire codebase. Find bugs, document exactly
how they trigger, and note their impact. Do NOT fix them.

**Look for:**

### Logic Bugs

* Conditions that are always true or always false
* Off-by-one errors in loops, slices, or pagination
* Incorrect boolean logic (misused `\\\&\\\&` vs `||`, double negation, wrong comparisons)
* Unreachable code after early returns
* Switch/case statements missing `break` or `default`

### Async \& State Bugs

* `setState` or state mutations called after a component unmounts
* Missing `await` on async calls that need sequential execution
* Race conditions in parallel async operations
* Stale closures in event handlers or `setTimeout`/`setInterval` callbacks
* `useEffect` hooks with missing or incorrect dependency arrays causing stale values
* `useEffect` cleanups that don't cancel timers, subscriptions, or fetch calls

### Data \& Type Bugs

* Accessing `.length`, `.map()`, or properties on values that could be `null` or `undefined`
without a guard
* Type coercion surprises (e.g., `==` instead of `===`, string + number concatenation)
* JSON.parse calls without try/catch around them
* Mutating state or props directly instead of creating new references
* Array or object spread misuse that results in shallow copies being mutated

### Event Handling Bugs

* Event listeners added in `useEffect` without being removed in the cleanup function
* Multiple listeners being stacked on the same element across re-renders
* `e.preventDefault()` or `e.stopPropagation()` called incorrectly or missing

### Error Handling Gaps

* Async functions or fetch calls with no `.catch()` or try/catch
* Errors swallowed silently (empty catch blocks)
* User-facing actions (form submissions, API calls) with no error feedback path

### Environment \& Config Bugs

* Hardcoded URLs, API endpoints, or secrets that should be in environment variables
* Environment variables accessed without checking if they're defined
* Different behavior expected in dev vs prod that isn't being handled

**Output format for Agent 02:**

```
## AGENT 02 REPORT — BUG DETECTION

### Summary
- Total bugs found: X
- High severity: X | Medium: X | Low: X

\\\*\\\*Bug #X — \\\[Short title]\\\*\\\*
File(s): path/to/file
Line(s): \\\[line numbers]
Severity: High | Medium | Low
Type: \\\[Logic | Async | Data | Event | Error Handling | Config]
How it triggers: \\\[Step-by-step explanation of the exact user action or code path that causes this bug]
Impact: \\\[What the user experiences when it triggers]
Root cause: \\\[Underlying technical reason]

\\\[Repeat for every bug]
```

\---

## ════════════════════════════════════════

## AGENT 03 — PERFORMANCE OPTIMIZATION AGENT

## ════════════════════════════════════════

Audit the entire codebase for performance issues and missed optimization opportunities.
Document every finding. Do NOT change any code.

**Look for:**

### React / Component Performance

* Components re-rendering unnecessarily because:

  * Object or array literals created inline as props (new reference every render)
  * Functions defined inline as props instead of being memoized with `useCallback`
  * Expensive computations not wrapped in `useMemo`
  * Parent re-renders causing all children to re-render when they haven't changed
* Components that should be `React.memo` but aren't
* Large component trees that could benefit from virtualization (long lists, grids, tables)
— check for libraries like `react-window` or `react-virtual` being absent where needed

### Data Fetching \& Caching

* Fetches happening on every render or mount without caching
* No `stale-while-revalidate` strategy or query caching (is React Query, SWR, or similar in use?)
* Waterfalling requests that could be parallelized with `Promise.all`
* Large API responses being stored entirely in state when only a subset is needed

### Bundle \& Load Time

* Large libraries imported fully when only a small part is used
(e.g., `import \\\_ from 'lodash'` instead of `import debounce from 'lodash/debounce'`)
* Non-code-split routes or heavy components that could be lazy-loaded
* Images missing `loading="lazy"` or explicit width/height (causes layout shift)
* Fonts loaded without `font-display: swap`
* Third-party scripts loaded synchronously in `<head>` that could be deferred

### DOM \& Browser Performance

* Scroll or resize event handlers without debouncing or throttling
* Animations running on properties that trigger layout (avoid animating `width`, `height`,
`top`, `left` — prefer `transform` and `opacity` which stay on the GPU)
* `document.querySelector` or DOM lookups inside loops or frequently-called functions
* `setTimeout` or `setInterval` used for animations instead of `requestAnimationFrame`

### CSS Performance

* CSS selectors that are unnecessarily deep or use expensive pseudo-selectors
* Large CSS files not being split by route
* Styles recalculated on every scroll or resize event
* `will-change` missing on elements with known heavy animations (or overused, which is also a problem)

### Memory

* Event listeners, subscriptions, or timers not cleaned up → memory leaks over time
* Large data structures stored in global state or module scope when they could be local
* `console.log` statements left in production code

**Output format for Agent 03:**

```
## AGENT 03 REPORT — PERFORMANCE

### Summary
- Total opportunities: X
- High impact: X | Medium: X | Low: X

\\\*\\\*Perf #X — \\\[Short title]\\\*\\\*
File(s): path/to/file
Line(s): \\\[if applicable]
Impact: High | Medium | Low
Category: \\\[React | Data Fetching | Bundle | DOM | CSS | Memory]
What's happening: \\\[Current behavior]
Why it's slow: \\\[Technical explanation]
Estimated gain: \\\[e.g., "Removes full re-render of X on every keystroke"]

\\\[Repeat for every finding]
```

\---

## ════════════════════════════════════════

## AGENT 04 — VIDEO OPTIMIZATION AGENT

## ════════════════════════════════════════

Find every video element, background video, video component, and any media loading
logic in the codebase. Audit all of it for performance, user experience, and
best practices. Do NOT change anything.

**Look for:**

### Video Element Attributes

* `<video>` tags missing `preload="none"` or `preload="metadata"` (auto-preloading
wastes bandwidth on page load)
* Videos missing `playsinline` (required for autoplay on iOS Safari)
* Autoplaying videos missing `muted` (browsers block unmuted autoplay)
* Videos missing explicit `width` and `height` or `aspect-ratio` CSS (causes layout shift)
* Background/decorative videos missing `aria-hidden="true"`

### Format \& Encoding

* Videos served only as `.mp4` without a `.webm` source alongside it
(WebM is typically 30–40% smaller with the same quality for modern browsers)
* No `<source>` tag ordering (most efficient format should be listed first)
* Videos that appear small on screen but are served at full original resolution
* No evidence of adaptive bitrate streaming (HLS/DASH) for long-form video content

### Lazy \& Intersection-Based Loading

* Videos that load immediately on page load even if they're below the fold
* No IntersectionObserver used to defer loading or playing of off-screen videos
* Poster images missing on `<video>` tags (blank space shown before video loads)
* Poster images that are unoptimized (large file size, wrong format)

### Autoplay \& Performance

* Autoplay videos that play even when the tab is not visible (should pause on
`document.visibilitychange`)
* Multiple videos autoplaying simultaneously
* Videos that loop forever with no pause mechanism offered to the user (accessibility issue)
* `requestVideoFrameCallback` or `requestAnimationFrame` not used for video-synced animations

### CDN \& Delivery

* Videos hosted on the same server as the app instead of a CDN or video platform
* No evidence of video compression tooling in the build pipeline (ffmpeg, HandBrake config, etc.)
* Video file sizes that appear unusually large given their duration and display size

**Output format for Agent 04:**

```
## AGENT 04 REPORT — VIDEO OPTIMIZATION

### Summary
- Total video issues: X
- High priority: X | Medium: X | Low: X

\\\*\\\*Video #X — \\\[Short title]\\\*\\\*
File(s): path/to/file
Line(s): \\\[if applicable]
Priority: High | Medium | Low
Category: \\\[Attributes | Format | Lazy Loading | Autoplay | Delivery]
Current state: \\\[What the code currently does]
Problem: \\\[Why this is an issue]
Fix direction: \\\[General description of what should change — no code]

\\\[Repeat for every finding]
```

\---

## ════════════════════════════════════════

## AGENT 05 — SCROLL \& ANIMATION PERFORMANCE AGENT

## (The "michellegore.com" Agent)

## ════════════════════════════════════════

This agent focuses specifically on scroll behavior, animation systems, and achieving
high-FPS rendering (targeting 240fps-capable smoothness like michellegore.com).

**Context on the michellegore.com technique:**
Her site achieves sustained high-FPS scroll by:

1. Using `requestAnimationFrame` (rAF) loops instead of scroll event listeners
2. Lerp-ing (linearly interpolating) scroll position so movement is always smooth
and never jarring — the page "eases into" its scroll target
3. Pausing the rAF loop when the user stops scrolling (detected via velocity → 0),
which eliminates unnecessary GPU work when nothing is moving
4. Using CSS `transform: translateY()` on a full-page wrapper instead of native scroll,
keeping repaints on the compositor thread (GPU) and off the main thread
5. Setting `will-change: transform` on the scroll wrapper
6. Using `overflow: hidden` on `<body>` and driving scroll position entirely via JS
7. Using GSAP ScrollSmoother or a custom lerp loop — NOT the browser's native scroll
8. Keeping all animations on `transform` and `opacity` only — never `top`, `left`,
`width`, `height`, or other layout-triggering properties

**Look for:**

### Current Scroll Implementation

* Is native scroll being used, or is there a custom smooth-scroll system?
* Are scroll events being used with addEventListener? (Less ideal than rAF loops)
* Is there any lerp / linear interpolation applied to scroll position?
* Is scroll velocity being tracked anywhere?
* Does the animation loop pause when nothing is moving, or does it run continuously?

### rAF \& Animation Loop Audit

* Are `requestAnimationFrame` loops properly cancelled when not needed?
* Are there competing animation loops that could conflict?
* Are scroll-driven animations tied to the scroll event or to a rAF loop?

### Compositor-Friendly Animations

* Are there any animations on layout-triggering properties (`width`, `height`, `top`,
`left`, `margin`, `padding`)? These must move to `transform` equivalents.
* Are `will-change: transform` hints applied to elements with heavy animations?
* Is `transform: translateZ(0)` or `translateZ(0)` used to force GPU layers where appropriate?

### Scroll Libraries in Use

* Is GSAP + ScrollTrigger present? If so, is ScrollSmoother configured?
* Is Lenis, Locomotive Scroll, or a similar smooth-scroll library present?
* If none of the above, document the gap — the site has no smooth-scroll system

### Pause-on-Idle Detection

* Is there any mechanism to detect when the user has stopped scrolling?
* Is velocity tracked via `getVelocity()` (GSAP) or a manual delta calculation?
* Does the rAF loop pause when velocity reaches near-zero?
* If not: this is the primary missing piece for michellegore.com-style performance

### Paint \& Layout Thrashing

* Are there any reads (getBoundingClientRect, offsetTop, scrollTop) immediately
followed by writes inside the same synchronous block? (Forces layout recalc)
* Are scroll-position reads happening inside rAF, or outside it in response to events?

**Output format for Agent 05:**

```
## AGENT 05 REPORT — SCROLL \\\& ANIMATION PERFORMANCE

### Current Scroll Architecture
\\\[Describe what the site is currently using for scroll — native, GSAP, Lenis, etc.]

### Gap Analysis vs. michellegore.com Technique
\\\[List each technique she uses and whether this codebase has it, is missing it, or has a partial version]

| Technique                          | Status        | Notes                     |
|------------------------------------|---------------|---------------------------|
| rAF-based animation loop           | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| Lerp scroll position               | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| Pause loop when idle               | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| Compositor-only animations         | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| will-change on scroll wrapper      | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| Velocity-based scroll detection    | ✅ / ❌ / ⚠️  | \\\[notes]                   |
| overflow:hidden body + JS scroll   | ✅ / ❌ / ⚠️  | \\\[notes]                   |

### Specific Issues Found

\\\*\\\*Scroll #X — \\\[Short title]\\\*\\\*
File(s): path/to/file
Line(s): \\\[if applicable]
Priority: High | Medium | Low
Category: \\\[rAF | Lerp | Compositor | Library | Paint]
Current state: \\\[What the code does]
Problem: \\\[Why this hurts performance or smoothness]
Fix direction: \\\[General direction — no code]

\\\[Repeat for every finding]
```

\---

## ════════════════════════════════════════

## FINAL STEP — COMPILE MASTER REPORT

## ════════════════════════════════════════

After all 5 agents complete their analysis, compile every report into a single file
called `AUDIT\\\_REPORT.md` at the root of the project.

The master report should have this structure:

```
# CODEBASE AUDIT REPORT
Generated: \\\[date and time]
Project: \\\[detected project name]

---

## EXECUTIVE SUMMARY

| Agent                        | Issues Found | Critical/High |
|------------------------------|--------------|---------------|
| 01 — UI Consistency          | X            | X             |
| 02 — Bug Detection           | X            | X             |
| 03 — Performance             | X            | X             |
| 04 — Video Optimization      | X            | X             |
| 05 — Scroll \\\& Animation      | X            | X             |
| \\\*\\\*TOTAL\\\*\\\*                    | \\\*\\\*X\\\*\\\*        | \\\*\\\*X\\\*\\\*         |

---
\\\[Full Agent 01 Report]
---
\\\[Full Agent 02 Report]
---
\\\[Full Agent 03 Report]
---
\\\[Full Agent 04 Report]
---
\\\[Full Agent 05 Report]
---
```

Write the file. Do not print the entire report to the terminal — just confirm it was written
and print the executive summary table only.

