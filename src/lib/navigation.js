/**
 * Shared navigation/scroll utilities.
 */

/**
 * Smoothly scrolls to a section by ID.
 * @param {string} sectionId - One of "hero", "/", "skills", "projects", "contact", "footer"
 */
export function scrollToSection(sectionId, options = {}) {
  const behavior = options.behavior ?? "smooth";
  if (sectionId === "hero" || sectionId === "/") {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior, block: "start", inline: "nearest" });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    return;
  }

  if (sectionId === "contact" || sectionId === "footer") {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior, block: "start", inline: "nearest" });
    }
    return;
  }

  const el = document.getElementById(sectionId);
  if (el) {
    // Default behavior: match native scrolling (as it was before).
    // Optional: allow callers (e.g. "Back to Projects") to apply an offset.
    if (Number.isFinite(options.offset) && options.offset !== 0) {
      const rect = el.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - options.offset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior });
      return;
    }

    el.scrollIntoView({ behavior, block: "start", inline: "nearest" });
  }
}
