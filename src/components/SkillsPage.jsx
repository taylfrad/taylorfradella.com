import { Suspense, lazy } from "react";
import PageHeader from "./PageHeader";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";

// Skills retains its existing scrollytelling internals — we just put it on
// its own route with the shared subpage shell (top nav + footer at the end).
const Skills = lazy(() => import("./Skills"));

export default function SkillsPage() {
  return (
    <div
      className="relative w-full"
      style={{
        minHeight: "100svh",
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <PageHeader active="skills" theme="light" />
      <Suspense fallback={<div style={{ height: "100svh" }} />}>
        <Skills />
      </Suspense>
      {/* Footer is absolutely positioned at the bottom of the SkillsPage
          container. The container's height is driven entirely by the Skills
          section (which uses internal sticky scrolling), so max scroll lands
          exactly when the footer's bottom edge meets viewport bottom — there
          is no "dead scroll" past the parked footer. During the last sliver
          of scroll, the footer rises into view from below while the sticky-
          pinned slide 4 stays static above it (the parallax effect). */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>

      <BackToTop />
    </div>
  );
}
