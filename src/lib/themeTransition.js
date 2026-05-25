/**
 * Sine-wave theme transition.
 *
 * Light/dark swapping is revealed behind a vertical sine-wave wipe using the
 * View Transitions API. The browser snapshots the real rendered pixels of the
 * old and new themes, so the wave reveals actual content with no flash — even
 * when toggling while the dark hero is on screen.
 *
 * This module only orchestrates. The wave itself is pure CSS, scoped to
 * `html[data-theme-wave="active"]` in globals.css (`@keyframes theme-wave-*`).
 *
 * Feel is tuned in the CSS keyframes (amplitude/frequency of the polygon) and
 * the `--theme-wave-*` knobs below.
 */

const WAVE_ATTR = "data-theme-wave";

/**
 * Whether to use the sine-wave wipe for this swap.
 * Falls back to the plain crossfade when motion should be reduced or when the
 * browser lacks the View Transitions API (older Safari/Firefox).
 */
export function canUseThemeWave(reduceEffects) {
  if (reduceEffects) return false;
  if (typeof document === "undefined") return false;
  return typeof document.startViewTransition === "function";
}

/**
 * Run `apply` inside a View Transition so the new theme is revealed behind the
 * sine-wave wipe. `apply` must synchronously flip the theme on <html> (it may
 * also schedule React state updates — only the class flip needs to be sync).
 */
export function runThemeWave(root, apply) {
  // Scope the wave CSS to just this swap so it never leaks into any other
  // future view transition on the page.
  root.setAttribute(WAVE_ATTR, "active");

  let transition;
  try {
    transition = document.startViewTransition(apply);
  } catch {
    // API exists but refused (e.g. a transition is already capturing) — apply
    // the theme directly so we never leave the UI half-swapped.
    apply();
    root.removeAttribute(WAVE_ATTR);
    return;
  }

  const cleanup = () => root.removeAttribute(WAVE_ATTR);
  // `finished` settles on completion, skip, or interruption by a rapid retoggle.
  transition.finished.then(cleanup, cleanup);
  // Swallow `ready` rejection (skipped transition) to avoid an unhandled reject.
  transition.ready.catch(() => {});
}
