export default function SectionHeader({
  title,
  as: Component = "h2",
  containerClassName = "w-fit max-w-full",
  headingClassName,
  headingStyle,
}) {
  return (
    <div className={containerClassName}>
      <Component className={headingClassName} style={headingStyle}>{title}</Component>
      <div
        className="mt-2 h-px w-full rounded-full"
        style={{ minHeight: 1, background: "linear-gradient(to right, currentColor 0%, transparent 100%)", opacity: 0.18 }}
        aria-hidden
      />
    </div>
  );
}

