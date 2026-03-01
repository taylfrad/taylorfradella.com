import { motion } from "framer-motion";
import { ChevronUp, FileText, Github, Linkedin } from "lucide-react";
import { useInView } from "react-intersection-observer";

const Footer = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const scrollToTop = () => {
    const heroSection = document.getElementById("hero");
    const fixedHeaderHeight = 80;

    if (!heroSection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const findScrollableParent = (element) => {
      let parent = element.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const scrollableParent = findScrollableParent(heroSection);

    if (scrollableParent) {
      const targetScrollTop = heroSection.offsetTop - fixedHeaderHeight;
      const scrollToPosition = Math.max(0, targetScrollTop);
      scrollableParent.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const footerLinkClass =
    "rounded-md border border-transparent px-1.5 py-1 text-foreground/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-foreground hover:shadow-[0_8px_18px_rgba(2,6,23,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 motion-reduce:transform-none";

  return (
    <footer
      ref={ref}
      id="footer"
      className="relative flex w-full flex-col border-t border-border/45 bg-background/35 px-0 py-10 text-foreground shadow-[0_-10px_36px_rgba(0,0,0,0.24)] backdrop-blur-2xl md:py-12"
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center p-0 text-muted-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 motion-reduce:transform-none sm:bottom-6 sm:right-6 sm:h-11 sm:w-11 md:right-20 md:h-12 md:w-12"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 gap-y-8 px-4 sm:px-6 md:grid-cols-3 md:gap-y-0 md:px-8"
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Contact me
          </p>
          <a
            href="mailto:taylor.fradella@selu.edu"
            className={`mt-2 break-all text-sm font-semibold sm:break-normal md:text-base ${footerLinkClass}`}
          >
            taylor.fradella@selu.edu
          </a>
        </div>

        <div className="flex flex-col items-center text-center md:items-center md:text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Let&apos;s connect
          </p>
          <ul
            className="footer-social-icons mt-2 text-sm md:text-base"
            aria-label="Footer social links"
          >
            <li>
              <a
                href="https://www.linkedin.com/in/taylorfradella/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={footerLinkClass}
              >
                <span className="footer-social-icon-wrap">
                  <span className="icon">
                    <Linkedin className="h-3 w-3" strokeWidth={2} />
                  </span>
                </span>
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1m9vus2XiZgg8Ket0AMkIP9sJzNuEmZF-qncZdzFydjA/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
                className={footerLinkClass}
              >
                <span className="footer-social-icon-wrap">
                  <span className="icon">
                    <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </span>
                <span>Resume</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/taylfrad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={footerLinkClass}
              >
                <span className="footer-social-icon-wrap">
                  <span className="icon">
                    <Github className="h-3 w-3" strokeWidth={2} />
                  </span>
                </span>
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            &copy;{new Date().getFullYear()} Taylor Fradella
          </p>
          <p className="mt-2 text-sm text-foreground/90">
            Made with{" "}
            <span role="img" aria-label="computer">
              💻
            </span>{" "}
            &{" "}
            <span role="img" aria-label="red heart">
              ❤️
            </span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
