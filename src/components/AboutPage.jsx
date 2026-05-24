import { Suspense, lazy } from "react";
import PageHeader from "./PageHeader";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";

const About = lazy(() => import("./About"));

// Site-wide footer (with the global --site-footer-bg tint applied by Footer
// itself, so it reads as a distinct surface from the page body).
export default function AboutPage() {
  return (
    <div
      className="relative w-full"
      style={{
        minHeight: "100svh",
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <PageHeader active="about" theme="light" />

      {/* Top padding so About content doesn't slip under the fixed header */}
      <div style={{ paddingTop: "120px" }}>
        <Suspense fallback={<div style={{ height: "60vh" }} />}>
          <About />
        </Suspense>
      </div>
      <div className="relative z-40">
        <Footer />
      </div>

      <BackToTop />
    </div>
  );
}
