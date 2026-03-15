import { Suspense, lazy, useEffect, useRef, useState, useCallback } from "react";

import { BACKGROUND_DARK } from "@/constants";
import { useTheme } from "@/components/theme-provider";
import { StaticHeroBackground } from "./StaticHeroBackground";
import useDeviceCapability from "@/hooks/useDeviceCapability";

const Balatro = lazy(() => import("./Balatro"));

const HERO_COLOR_VARIANTS = {
  cool: {
    // User-specified hero palette
    color1: "#0e1116",
    color2: "#0A3A4A",
    color3: "#052146",
  },
  warm: {
    color1: BACKGROUND_DARK,
    color2: "#1d1f27",
    color3: "#261f29",
  },
};
const ACTIVE_HERO_COLOR_VARIANT = "cool";

export default function HeroBackground({
  animated = true,
  honorReducedEffects = true,
  onReady,
  initialVisualReady = false,
}) {
  const { shouldReduceEffects } = useTheme();
  const tier = useDeviceCapability();
  // Skip the full-screen shader on low-end devices — the static gradient
  // and radial washes still provide a premium background.
  const shouldAnimate =
    animated && tier !== "low" && (!honorReducedEffects || !shouldReduceEffects);
  const heroColors = HERO_COLOR_VARIANTS[ACTIVE_HERO_COLOR_VARIANT];
  const [isVisualReady, setIsVisualReady] = useState(initialVisualReady);

  const hasNotifiedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  // Stable callback — notifies parent exactly once
  const notifyReady = useCallback(() => {
    if (hasNotifiedRef.current) return;
    hasNotifiedRef.current = true;
    setIsVisualReady(true);
    if (typeof onReadyRef.current === "function") onReadyRef.current();
  }, []);

  // Safety net: if Balatro's onReady never fires (WebGL context failure, slow load),
  // force the wrapper visible after 2.5s so the user always sees the hero background.
  // Also covers: initialVisualReady (instant restore from Projects) and
  // non-animated mode (reduced effects / animated=false).
  useEffect(() => {
    if (initialVisualReady || !shouldAnimate) {
      notifyReady();
      return;
    }
    const t = setTimeout(notifyReady, 2500);
    return () => clearTimeout(t);
  }, [shouldAnimate, initialVisualReady, notifyReady]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Always show static gradient so we never flash when Balatro loads or fades in */}
      <StaticHeroBackground />
      {shouldAnimate ? (
        <Suspense fallback={null}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: isVisualReady ? 1 : 0,
              transition: "opacity 600ms ease-out",
            }}
          >
            <Balatro
              isRotate={false}
              mouseInteraction={false}
              pixelFilter={2000}
              color1={heroColors.color1}
              color2={heroColors.color2}
              color3={heroColors.color3}
              onReady={notifyReady}
            />
          </div>
        </Suspense>
      ) : null}

      {/* Teal/muted blue washes to match bokeh */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 25% 25%, var(--g4) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 50% at 70% 30%, var(--g2) 0%, transparent 55%)",
            "radial-gradient(ellipse 60% 70% at 50% 70%, var(--g1) 0%, transparent 50%)",
            "radial-gradient(ellipse 50% 50% at 85% 60%, var(--g3) 0%, transparent 55%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{ backgroundColor: "var(--bg)" }}
      />
    </div>
  );
}
