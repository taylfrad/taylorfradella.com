import React, { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const BREAKPOINT_KEYS = Object.keys(BREAKPOINTS);

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isResponsiveValue(value) {
  if (!isObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => BREAKPOINT_KEYS.includes(key));
}

function spacingValue(value) {
  if (typeof value === "number") {
    return `${value * 8}px`;
  }
  return value;
}

function resolveResponsive(value, width) {
  if (!isResponsiveValue(value)) return value;

  let resolved;
  for (const key of BREAKPOINT_KEYS) {
    if (width >= BREAKPOINTS[key] && value[key] !== undefined) {
      resolved = value[key];
    }
  }
  return resolved;
}

function applySpacing(style, key, value) {
  const v = spacingValue(value);
  if (v === undefined) return;

  switch (key) {
    case "p":
      style.padding = v;
      break;
    case "pt":
      style.paddingTop = v;
      break;
    case "pr":
      style.paddingRight = v;
      break;
    case "pb":
      style.paddingBottom = v;
      break;
    case "pl":
      style.paddingLeft = v;
      break;
    case "px":
      style.paddingLeft = v;
      style.paddingRight = v;
      break;
    case "py":
      style.paddingTop = v;
      style.paddingBottom = v;
      break;
    case "m":
      style.margin = v;
      break;
    case "mt":
      style.marginTop = v;
      break;
    case "mr":
      style.marginRight = v;
      break;
    case "mb":
      style.marginBottom = v;
      break;
    case "ml":
      style.marginLeft = v;
      break;
    case "mx":
      style.marginLeft = v;
      style.marginRight = v;
      break;
    case "my":
      style.marginTop = v;
      style.marginBottom = v;
      break;
    default:
      break;
  }
}

function sxToStyle(sx, width) {
  if (!sx) return {};
  if (Array.isArray(sx)) {
    return sx.reduce((acc, item) => ({ ...acc, ...sxToStyle(item, width) }), {});
  }

  const style = {};

  for (const [key, rawValue] of Object.entries(sx)) {
    if (key.startsWith("&") || key.startsWith("@")) {
      continue;
    }

    const value = resolveResponsive(rawValue, width);
    if (value === undefined || isObject(value)) {
      continue;
    }

    if (
      ["p", "pt", "pr", "pb", "pl", "px", "py", "m", "mt", "mr", "mb", "ml", "mx", "my"].includes(key)
    ) {
      applySpacing(style, key, value);
      continue;
    }

    if (key === "bgcolor") {
      style.backgroundColor = value;
      continue;
    }

    style[key] = value;
  }

  return style;
}

export const Box = forwardRef(function Box(
  { component = "div", sx, style, className, ...props },
  ref
) {
  const width = typeof window === "undefined" ? BREAKPOINTS.md : window.innerWidth;
  const resolvedStyle = sxToStyle(sx, width);
  const Comp = component;

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ ...resolvedStyle, ...style }}
      {...props}
    />
  );
});

const TYPOGRAPHY_VARIANTS = {
  body1: { fontSize: "1rem", lineHeight: 1.5 },
  body2: { fontSize: "0.875rem", lineHeight: 1.43 },
  h1: { fontSize: "2.5rem", lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: "2rem", lineHeight: 1.25, fontWeight: 700 },
  h3: { fontSize: "1.75rem", lineHeight: 1.25, fontWeight: 700 },
  h4: { fontSize: "1.5rem", lineHeight: 1.3, fontWeight: 700 },
  h5: { fontSize: "1.25rem", lineHeight: 1.35, fontWeight: 700 },
  h6: { fontSize: "1rem", lineHeight: 1.4, fontWeight: 700 },
};

export const Typography = forwardRef(function Typography(
  { component = "p", variant = "body1", sx, style, className, noWrap = false, ...props },
  ref
) {
  const width = typeof window === "undefined" ? BREAKPOINTS.md : window.innerWidth;
  const resolvedStyle = sxToStyle(sx, width);
  const noWrapStyle = noWrap
    ? {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : null;
  const Comp = component;

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ ...TYPOGRAPHY_VARIANTS[variant], ...resolvedStyle, ...noWrapStyle, ...style }}
      {...props}
    />
  );
});

export const IconButton = forwardRef(function IconButton(
  { component = "button", sx, style, className, type, ...props },
  ref
) {
  const width = typeof window === "undefined" ? BREAKPOINTS.md : window.innerWidth;
  const resolvedStyle = sxToStyle(sx, width);
  const Comp = component;

  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      style={{ ...resolvedStyle, ...style }}
      type={Comp === "button" ? type ?? "button" : type}
      {...props}
    />
  );
});

export function Dialog({ open, onClose, sx, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.(event);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const previousActiveElement = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previousActiveElement?.focus) {
        previousActiveElement.focus();
      }
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const paperStyles = sx?.["& .MuiDialog-paper"] || {};
  const width = window.innerWidth;
  const resolvedPaperStyle = sxToStyle(paperStyles, width);

  return createPortal(
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/95"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.(event);
        }
      }}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={dialogRef}
    >
      <div style={resolvedPaperStyle} className="h-full w-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
