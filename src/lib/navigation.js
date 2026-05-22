/**
 * Shared navigation/scroll utilities.
 */

const SCROLL_DURATION = 1200;
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function smoothScrollTo(targetTop) {
  const start = window.scrollY;
  const distance = Math.max(0, targetTop) - start;
  if (Math.abs(distance) < 1) return;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Smoothly scrolls to a section by ID.
 * @param {string} sectionId - One of "hero", "/", "skills", "projects", "contact", "footer"
 */
export function scrollToSection(sectionId, options = {}) {
  const behavior = options.behavior ?? "smooth";
  const useCustom = behavior === "smooth";

  if (sectionId === "hero" || sectionId === "/") {
    const hero = document.getElementById("hero");
    if (useCustom) {
      smoothScrollTo(hero ? hero.getBoundingClientRect().top + window.scrollY : 0);
    } else if (hero) {
      hero.scrollIntoView({ behavior, block: "start", inline: "nearest" });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    return;
  }

  if (sectionId === "contact" || sectionId === "footer") {
    const footer = document.getElementById("footer");
    if (footer) {
      if (useCustom) {
        smoothScrollTo(footer.getBoundingClientRect().top + window.scrollY);
      } else {
        footer.scrollIntoView({ behavior, block: "start", inline: "nearest" });
      }
    }
    return;
  }

  const el = document.getElementById(sectionId);
  if (el) {
    const rect = el.getBoundingClientRect();
    const offset = Number.isFinite(options.offset) ? options.offset : 0;
    const targetTop = rect.top + window.scrollY - offset;
    if (useCustom) {
      smoothScrollTo(targetTop);
    } else {
      window.scrollTo({ top: Math.max(0, targetTop), behavior });
    }
  }
}
