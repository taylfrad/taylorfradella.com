# Portfolio Mobile Parity Swarm

A Claude Code subagent swarm that makes your portfolio look and animate on **every phone size**
exactly as well as it does on desktop — including the scrollytelling. Hover effects are
gracefully replaced (tap/always-on); everything else reaches parity.

## What's in here

```
.claude/
  commands/
    mobilize.md            ← the kickoff command. Run `/mobilize` to start the whole swarm.
  agents/
    mobile-auditor.md      ← Phase 0. Read-only. Discovers your stack, files every mobile defect.
    responsive-layout.md   ← Phase 1. Fluid layout, breakpoints, safe areas, typography.
    webgl-performance.md   ← Phase 1. Three.js mobile perf: DPR, shadows, draw calls, lite mode.
    scrollytelling-engineer.md ← Phase 1. Scroll-linked animation parity on touch devices.
    touch-interaction.md   ← Phase 1. Hover → tap/active, tap targets, 300ms delay, highlights.
    mobile-qa-verifier.md  ← Phase 2. Verifies against the device matrix + definition of done.
docs/mobile/
  MOBILE_PORT_SPEC.md      ← THE source of truth. Every agent reads this first.
  QA_CHECKLIST.md          ← Device matrix + acceptance criteria the QA agent runs.
  reports/                 ← Agents write their findings/changelogs here. Starts empty.
SWARM_README.md            ← this file.
```

## How to install

1. Copy the `.claude/` folder and the `docs/` folder into the **root of your portfolio repo**
   (next to `package.json`). If you already have a `.claude/` folder, merge — these filenames
   won't collide with defaults.
2. (Optional) Add one line to your repo's `CLAUDE.md` so the context is always loaded:
   > For any mobile/responsive work, read `docs/mobile/MOBILE_PORT_SPEC.md` first.
3. Open the repo in Claude Code.

## How to run

In Claude Code, just type:

```
/mobilize
```

That kicks off the orchestrator, which runs the phases below. You can also run a single lane,
e.g. `/mobilize scrollytelling` to only do the scroll work, or `/mobilize audit` for a dry run
that changes nothing.

## The phases

- **Phase 0 — Audit (read-only).** `mobile-auditor` maps your stack and writes
  `docs/mobile/reports/AUDIT.md`: every breakage, by viewport, with file:line references and a
  severity. Nothing is edited yet. Review this before continuing if you want a checkpoint.
- **Phase 1 — Implement (4 specialist lanes).** The orchestrator dispatches the four implementer
  agents. Each owns a disjoint set of concerns (see the ownership map in the spec) to avoid
  stepping on each other. A commit is made between lanes so conflicts are visible.
- **Phase 2 — Verify.** `mobile-qa-verifier` re-checks the whole device matrix against the
  definition of done and writes `docs/mobile/reports/QA.md`. Anything failing is routed back to
  the relevant lane for a fix pass.

## Ground rules baked into every agent

- **Never regress desktop.** All changes are mobile-first and additive; desktop behavior is a
  protected baseline.
- **Preserve the scrollytelling, don't simplify it.** The mobile version animates the same beats;
  it adapts the *mechanism* (touch, viewport units, perf budget), not the *story*.
- **Respect `prefers-reduced-motion`.** Parity does not override accessibility.
- **Discover, don't assume.** The auditor establishes facts; downstream agents act on them.

See `docs/mobile/MOBILE_PORT_SPEC.md` for the full technical playbook.
