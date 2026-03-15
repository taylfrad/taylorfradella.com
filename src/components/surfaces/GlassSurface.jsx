import { forwardRef, useMemo } from "react";

import { cn } from "@/lib/utils";

const VARIANT_ALIAS = {
  card: "regular",
  panel: "tinted",
  nav: "clear",
};

function normalizeVariant(variant) {
  const nextVariant = VARIANT_ALIAS[variant] || variant;
  if (nextVariant === "clear" || nextVariant === "tinted") return nextVariant;
  return "regular";
}

const GlassSurface = forwardRef(function GlassSurface(
  {
    variant = "regular",
    as: Component = "div",
    className,
    children,
    forceTinted = false,
    ...props
  },
  forwardedRef,
) {
  const resolvedVariant = useMemo(
    () => (forceTinted ? "tinted" : normalizeVariant(variant)),
    [forceTinted, variant],
  );

  const isInteractive =
    Component === "button" ||
    Component === "a" ||
    props.role === "button" ||
    typeof props.onClick === "function" ||
    props.tabIndex !== undefined;

  return (
    <Component
      ref={forwardedRef}
      className={cn(
        "glass-surface",
        `glass-surface--${resolvedVariant}`,
        isInteractive && "glass-surface--interactive",
        className,
      )}
      data-glass-variant={resolvedVariant}
      data-force-tinted={forceTinted ? "true" : undefined}
      {...props}
    >
      <span className="glass-surface__fill" aria-hidden />
      <span className="glass-surface__highlight" aria-hidden />
      <span className="glass-surface__border" aria-hidden />
      {children}
    </Component>
  );
});

export default GlassSurface;
