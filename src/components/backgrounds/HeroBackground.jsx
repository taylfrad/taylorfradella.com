import { useEffect, useRef, useState, useCallback } from "react";

import { useTheme } from "@/components/theme-provider";
import { StaticHeroBackground } from "./StaticHeroBackground";

export default function HeroBackground({
  onReady,
  initialVisualReady = false,
}) {
  const { shouldReduceEffects } = useTheme();
  const [isVisualReady, setIsVisualReady] = useState(initialVisualReady);

  const hasNotifiedRef = useRef(false);
  const videoRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const notifyReady = useCallback(() => {
    if (hasNotifiedRef.current) return;
    hasNotifiedRef.current = true;
    setIsVisualReady(true);
    if (typeof onReadyRef.current === "function") onReadyRef.current();
  }, []);

  // If reduced effects or instant restore, signal ready immediately
  useEffect(() => {
    if (initialVisualReady || shouldReduceEffects) {
      notifyReady();
    }
  }, [shouldReduceEffects, initialVisualReady, notifyReady]);

  // Start from a random position so the loop doesn't always begin at frame 0
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = Math.random() * video.duration;
    }
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Static gradient fallback — always present so we never flash */}
      <StaticHeroBackground />

      {/* Poster image — loads instantly via <link rel="preload"> */}
      <img
        src="/videos/hero-poster.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Video fades in over the poster once buffered */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={notifyReady}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isVisualReady ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

    </div>
  );
}
