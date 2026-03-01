import { cn } from "@/lib/utils";

const variantClasses = {
  nav: "glass-nav",
  card: "glass-card",
  panel: "glass-panel",
};

export default function GlassFallback({
  variant = "card",
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn("glass-base", variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
