/** Lightweight static hero background. No OGL, no theme deps. Used as Suspense fallback and Lanyard placeholder. */
export function StaticHeroBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 55%, var(--bg) 100%)",
      }}
    />
  );
}
