import { Suspense, lazy } from "react";

import { useTheme } from "@/components/theme-provider";

const Balatro = lazy(() => import("./Balatro"));

function StaticHeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#36454f] via-[#070b47] to-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background/70" />
    </>
  );
}

export default function HeroBackground({ animated = true }) {
  const { shouldReduceEffects } = useTheme();
  const shouldAnimate = animated && !shouldReduceEffects;

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {shouldAnimate ? (
        <Suspense fallback={<StaticHeroBackground />}>
          <Balatro
            isRotate={false}
            mouseInteraction={false}
            pixelFilter={2000}
            color1="#0e1116"
            color2="#0c2d35"
            color3="#052146"
          />
        </Suspense>
      ) : (
        <StaticHeroBackground />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
    </div>
  );
}
