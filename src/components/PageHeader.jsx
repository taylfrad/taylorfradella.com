import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAME_FONT_FAMILY } from "@/constants";
import { ModeToggle } from "@/components/mode-toggle";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/components/theme-provider";

const ROUTES = [
  { key: "projects", label: "Projects", href: "/#projects" },
  { key: "skills", label: "Skills", href: "/skills" },
  { key: "work", label: "Work", href: "/work" },
  { key: "about", label: "About", href: "/about" },
];

export default function PageHeader({ active, theme = "dark" }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const { theme: userTheme } = useTheme();
  const isDropdownDark = userTheme === "dark";

  const goHome = useCallback(() => navigate("/"), [navigate]);

  const handleClick = useCallback(
    (e, route) => {
      e.preventDefault();
      setIsMenuOpen(false);
      if (route.key === "projects") {
        try {
          sessionStorage.setItem("scrollToProjectsPending", "1");
        } catch {
          // ignore
        }
        navigate("/", { state: { scrollToProjects: true } });
        return;
      }
      if (route.key === active) return;
      navigate(route.href);
    },
    [navigate, active],
  );

  // Close menu on breakpoint change
  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuPanelRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const isDark = theme === "dark";

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6 md:px-10"
      style={{ paddingTop: "calc(16px + env(safe-area-inset-top))" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="pointer-events-auto flex w-full items-center gap-4">
          <button
            type="button"
            onClick={goHome}
            className={`cursor-pointer border-none bg-transparent p-0 text-left text-xs font-semibold tracking-tight sm:text-sm md:text-base ${isDark ? "text-white" : "text-[var(--text-primary)]"}`}
            style={{ fontFamily: NAME_FONT_FAMILY }}
            aria-label="Return to home"
          >
            TAYLOR FRADELLA
          </button>

          {isMobile ? (
            /* ── Mobile hamburger ──────────────────────────────── */
            <div className="relative ml-auto">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="page-mobile-menu"
                onClick={() => setIsMenuOpen((o) => !o)}
                className={`inline-flex h-9 w-9 items-center justify-center transition-colors duration-200 ease-out ${isDark ? "text-white/60 hover:text-white" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden />
                )}
              </button>
              {isMenuOpen ? (
                <div
                  id="page-mobile-menu"
                  ref={menuPanelRef}
                  role="menu"
                  className={`absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-2xl ${isDropdownDark ? "page-mobile-dropdown--dark" : "page-mobile-dropdown--light"}`}
                >
                  {ROUTES.map((route, i, arr) => {
                    const isActive = route.key === active;
                    return (
                      <button
                        key={route.key}
                        type="button"
                        role="menuitem"
                        onClick={(e) => handleClick(e, route)}
                        className={`w-full px-5 py-3 text-[14px] font-medium tracking-wide transition-colors duration-150 ${
                          isDropdownDark ? "page-mobile-dropdown__item--dark" : "page-mobile-dropdown__item--light"
                        } ${isActive ? "page-mobile-dropdown__item--active" : ""}${
                          i < arr.length - 1
                            ? isDropdownDark
                              ? " border-b border-white/[0.08]"
                              : " border-b border-black/[0.06]"
                            : ""
                        }`}
                      >
                        {route.label}
                      </button>
                    );
                  })}
                  <div
                    className={`flex items-center justify-center px-5 py-2 ${isDropdownDark ? "border-t border-white/[0.08]" : "border-t border-black/[0.06]"}`}
                  >
                    <ModeToggle colorClass={isDark ? "text-white/60 hover:text-white" : undefined} />
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            /* ── Desktop inline nav ──────────────────────────── */
            <nav className={`ml-auto flex items-center gap-1.5 text-xs font-medium tracking-tight sm:gap-3 sm:text-sm md:gap-6 md:text-base ${isDark ? "text-white/60" : "text-[var(--text-tertiary)]"}`}>
              {ROUTES.map((route) => {
                const isActive = route.key === active;
                return (
                  <a
                    key={route.key}
                    href={route.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => handleClick(e, route)}
                    className={`floating-nav-btn inline-flex items-center justify-center px-1 py-1 transition-colors duration-200 ease-out motion-reduce:transition-none ${
                      isActive
                        ? `${isDark ? "text-white" : "text-[var(--text-primary)]"} underline underline-offset-4 [text-decoration-thickness:1.5px]`
                        : `${isDark ? "text-white/60 hover:text-white" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"} hover:underline hover:underline-offset-4 [text-decoration-thickness:1.5px]`
                    }`}
                  >
                    {route.label}
                  </a>
                );
              })}
              <ModeToggle colorClass={isDark ? "text-white/60 hover:text-white" : undefined} />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
