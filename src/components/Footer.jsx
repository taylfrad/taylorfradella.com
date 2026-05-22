import { lazy, Suspense, useRef, useState } from "react";
import { motion } from "framer-motion";
import useReducedMotion from "@/hooks/useReducedMotion";

const PdfModal = lazy(() => import("@/components/ui/PdfModal"));
import useScrollMotion from "@/hooks/useScrollMotion";
import { FileTextIcon } from "@/components/ui/file-text";
import { GithubIcon } from "@/components/ui/github";
import { LinkedinIcon } from "@/components/ui/linkedin";

const iconSize = 17;

const RESUME_PDF = "/docs/TaylorFradellaResume.pdf";
const EMAIL = "taylor.fradella.dev@gmail.com";

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={handleClick}
        className="text-[14px] font-medium text-[var(--footer-link)] transition-colors duration-200 hover:text-[var(--footer-link-hover)]"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {EMAIL}
      </button>
      <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: "100%",
          transform: "translateX(-50%)",
          marginBottom: 6,
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-primary)",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          borderRadius: 6,
          padding: "3px 10px",
          whiteSpace: "nowrap",
          opacity: copied ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
      >
        Copied!
      </span>
    </span>
  );
}

const Footer = () => {
  const reducedMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);
  const sectionRef = useRef(null);
  const linkedinIconRef = useRef(null);
  const fileTextIconRef = useRef(null);
  const githubIconRef = useRef(null);
  const scrollMotion = useScrollMotion(sectionRef, {
    y: [12, 0],
    offset: ["start 0.9", "end 0.3"],
  });

  return (
    <footer
      ref={sectionRef}
      aria-label="Contact and social links"
      className="relative w-full px-4 pb-10 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pb-14 md:pt-12"
      // Per-page tint hook: ancestors can set --site-footer-bg to override.
      // Falls back to --bg-secondary so pages without an override are unchanged.
      style={{ backgroundColor: "var(--site-footer-bg, var(--bg-secondary))" }}
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col items-center"
        style={{ y: scrollMotion.y }}
      >
        {/* ── Overline ───────────────────────────────────────────────── */}
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
          Let&apos;s Connect
        </p>

        {/* ── Social links ─────────────────────────────────────────── */}
        <div>
          <ul className="footer-social-icons" aria-label="Footer social links">
            <li>
              <a
                href="https://www.linkedin.com/in/taylorfradella/"
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                onMouseEnter={() => !reducedMotion && linkedinIconRef.current?.startAnimation?.()}
                onMouseLeave={() => !reducedMotion && linkedinIconRef.current?.stopAnimation?.()}
              >
                <span className="footer-social-icon-wrap icon">
                  <LinkedinIcon ref={linkedinIconRef} size={iconSize} />
                </span>
                <span className="footer-social-label text-[14px] font-medium">LinkedIn</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setResumeOpen(true)}
                aria-label="Resume"
                style={{ cursor: "pointer", font: "inherit" }}
                onMouseEnter={() => !reducedMotion && fileTextIconRef.current?.startAnimation?.()}
                onMouseLeave={() => !reducedMotion && fileTextIconRef.current?.stopAnimation?.()}
              >
                <span className="footer-social-icon-wrap icon">
                  <FileTextIcon ref={fileTextIconRef} size={iconSize} />
                </span>
                <span className="footer-social-label text-[14px] font-medium">Resume</span>
              </button>
            </li>
            <li>
              <a
                href="https://github.com/taylfrad"
                target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                onMouseEnter={() => !reducedMotion && githubIconRef.current?.startAnimation?.()}
                onMouseLeave={() => !reducedMotion && githubIconRef.current?.stopAnimation?.()}
              >
                <span className="footer-social-icon-wrap icon">
                  <GithubIcon ref={githubIconRef} size={iconSize} />
                </span>
                <span className="footer-social-label text-[14px] font-medium">Github</span>
              </a>
            </li>
          </ul>
        </div>

        {/* ── Divider + bottom strip ───────────────────────────────── */}
        <div className="mt-6 w-full max-w-md">
          <div className="mx-auto h-px w-full bg-[var(--border-color)] opacity-50" aria-hidden />
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0">
            <EmailCopy />
            <span className="hidden h-3 w-px bg-[var(--border-color)] opacity-50 sm:mx-5 sm:block" aria-hidden />
            <p className="text-[13px] text-[var(--text-tertiary)]">
              &copy;{new Date().getFullYear()} Taylor Fradella
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Resume modal ───────────────────────────────────────────── */}
      {resumeOpen && (
        <Suspense fallback={null}>
          <PdfModal
            open={resumeOpen}
            onClose={() => setResumeOpen(false)}
            src={RESUME_PDF}
            title="Resume"
            preload
          />
        </Suspense>
      )}
    </footer>
  );
};

export default Footer;
