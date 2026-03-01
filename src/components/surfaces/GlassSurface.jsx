import GlassFallback from "@/components/surfaces/GlassFallback";

export default function GlassSurface({
  variant = "card",
  className,
  children,
  ...props
}) {
  return (
    <GlassFallback variant={variant} className={className} {...props}>
      {children}
    </GlassFallback>
  );
}
