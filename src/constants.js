/**
 * Shared constants used across navigation, scroll, and typography.
 * Keeps magic strings/numbers in one place for easier maintenance.
 */

/** Session storage key for "scroll to projects" intent when returning from project detail */
export const SCROLL_TO_PROJECTS_FLAG = "scrollToProjectsPending";

/** Primary brand font family (used in Hero, project previews, etc.) */
export const NAME_FONT_FAMILY = "font_shi8d64tg, sans-serif";

/** Max RAF attempts for scroll-to-section retry (e.g. projects section not yet mounted) */
export const SCROLL_RETRY_MAX_ATTEMPTS = 360;

/** Dark background for hero, bokeh, fallbacks. */
export const BACKGROUND_DARK = "#0F172A";

/** Default accent color (e.g. portfolio, generic projects) */
export const ACCENT_DEFAULT = "#0071e3";

/** Workly project accent color */
export const ACCENT_WORKLY = "#b3363d";

/** Fixed header height in px (used for scroll-to-top offset) */
export const FIXED_HEADER_HEIGHT = 80;

/** Scrollbar reveal duration in ms before hiding again */
export const SCROLLBAR_HIDE_MS = 700;

/**
 * Z-index scale — keeps stacking order in one place.
 *
 * 0   – base content
 * 10  – in-section overlays (carousel arrows, dot indicators)
 * 20  – hero layers, scroll-driven decorations
 * 30  – floating header / nav
 * 50  – floating action buttons (back-to-top, fab)
 * 9999 – full-screen modals / lightboxes
 */
export const Z = {
  CONTENT: 0,
  SECTION_OVERLAY: 10,
  HERO_LAYER: 20,
  HEADER: 30,
  FAB: 50,
  MODAL: 9999,
};
