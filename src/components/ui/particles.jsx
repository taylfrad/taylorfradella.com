import { memo, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

function hexToRgb(hex) {
  let normalized = (hex ?? "").replace("#", "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const value = Number.parseInt(normalized, 16);
  if (!Number.isFinite(value)) return [255, 255, 255];

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return [red, green, blue];
}

function Particles({
  className,
  children,
  quantity = 120,
  staticity = 52,
  ease = 58,
  size = 0.7,
  speed = 0.1,
  refresh = true,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  maxDpr = 1.2,
  targetFps = 60,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const contextRef = useRef(null);
  const circlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef();
  const isInViewportRef = useRef(true);
  const isDocumentVisibleRef = useRef(
    typeof document === "undefined" ? true : !document.hidden,
  );
  const dprRef = useRef(1);
  const safeEase = Math.max(1, ease);
  const safeStaticity = Math.max(1, staticity);
  const safeQuantity = Math.max(0, Math.floor(quantity));
  const safeTargetFps =
    Number.isFinite(targetFps) && targetFps > 0 ? targetFps : 0;
  const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : 0.1;
  const rgb = useMemo(() => hexToRgb(color), [color]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return undefined;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    contextRef.current = context;

    let disposed = false;
    let lastFrameTime = 0;
    let resizeObserver;
    let intersectionObserver;
    let resizeFrameId = 0;
    let pendingWidth = 0;
    let pendingHeight = 0;
    const IGNORE_RESIZE_JITTER = 24;
    const RESPAWN_RESIZE_THRESHOLD = 20;
    const frameInterval = safeTargetFps > 0 ? 1000 / safeTargetFps : 0;

    const setCanvasSize = (nextWidth, nextHeight) => {
      if (disposed) return;
      const prevWidth = canvasSizeRef.current.w;
      const prevHeight = canvasSizeRef.current.h;
      const width = Math.max(1, Math.floor(nextWidth));
      const height = Math.max(1, Math.floor(nextHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const deviceWidth = Math.max(1, Math.floor(width * dpr));
      const deviceHeight = Math.max(1, Math.floor(height * dpr));
      const widthDelta = Math.abs(width - prevWidth);
      const heightDelta = Math.abs(height - prevHeight);
      const hasPreviousSize = prevWidth > 0 && prevHeight > 0;
      const dprChanged = dprRef.current !== dpr;
      const isJitterResize =
        hasPreviousSize &&
        !dprChanged &&
        widthDelta <= IGNORE_RESIZE_JITTER &&
        heightDelta <= IGNORE_RESIZE_JITTER;

      if (isJitterResize) {
        return { resized: false, shouldRespawn: false };
      }

      const sameSize =
        canvasSizeRef.current.w === width &&
        canvasSizeRef.current.h === height &&
        canvas.width === deviceWidth &&
        canvas.height === deviceHeight &&
        dprRef.current === dpr;
      if (sameSize) {
        return { resized: false, shouldRespawn: false };
      }

      dprRef.current = dpr;
      canvasSizeRef.current.w = width;
      canvasSizeRef.current.h = height;
      canvas.width = deviceWidth;
      canvas.height = deviceHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const shouldRespawn =
        circlesRef.current.length === 0 ||
        widthDelta > RESPAWN_RESIZE_THRESHOLD ||
        heightDelta > RESPAWN_RESIZE_THRESHOLD;

      return { resized: true, shouldRespawn };
    };

    const queueResize = (nextWidth, nextHeight) => {
      pendingWidth =
        Number.isFinite(nextWidth) && nextWidth > 0
          ? nextWidth
          : canvasSizeRef.current.w || container.clientWidth;
      pendingHeight =
        Number.isFinite(nextHeight) && nextHeight > 0
          ? nextHeight
          : canvasSizeRef.current.h || container.clientHeight;

      if (resizeFrameId) return;
      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = 0;
        const { resized, shouldRespawn } = setCanvasSize(
          pendingWidth,
          pendingHeight,
        );
        if (resized && shouldRespawn) {
          drawInitialParticles();
        }
      });
    };

    const clear = () => {
      context.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);
    };

    const createParticle = () => ({
      x: Math.floor(Math.random() * canvasSizeRef.current.w),
      y: Math.floor(Math.random() * canvasSizeRef.current.h),
      translateX: 0,
      translateY: 0,
      size: Math.random() * 1.8 + size,
      alpha: 0,
      targetAlpha: Number.parseFloat((Math.random() * 0.55 + 0.25).toFixed(2)),
      dx: (Math.random() - 0.5) * safeSpeed,
      dy: (Math.random() - 0.5) * safeSpeed,
      magnetism: 0.9 + Math.random() * 5.2,
      reactivity: 0.85 + Math.random() * 1.15,
    });

    const drawParticle = (particle, addToList = false) => {
      context.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      context.translate(particle.translateX, particle.translateY);
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      context.fillStyle = `rgba(${rgb.join(", ")}, ${particle.alpha})`;
      context.fill();
      context.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

      if (addToList) {
        circlesRef.current.push(particle);
      }
    };

    const drawInitialParticles = () => {
      circlesRef.current.length = 0;
      clear();
      for (let i = 0; i < safeQuantity; i += 1) {
        drawParticle(createParticle(), true);
      }
    };

    const remapValue = (value, start1, end1, start2, end2) => {
      const mapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return mapped > 0 ? mapped : 0;
    };

    const animate = (time) => {
      if (disposed) return;
      frameRef.current = window.requestAnimationFrame(animate);

      if (!isDocumentVisibleRef.current || !isInViewportRef.current) return;
      if (frameInterval > 0 && time - lastFrameTime < frameInterval) return;
      lastFrameTime = time;

      clear();

      for (let i = circlesRef.current.length - 1; i >= 0; i -= 1) {
        const particle = circlesRef.current[i];

        const edgeDistances = [
          particle.x + particle.translateX - particle.size,
          canvasSizeRef.current.w -
            particle.x -
            particle.translateX -
            particle.size,
          particle.y + particle.translateY - particle.size,
          canvasSizeRef.current.h -
            particle.y -
            particle.translateY -
            particle.size,
        ];
        const closestEdge = Math.min(...edgeDistances);
        const edgeAlpha = Number.parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
        );

        if (edgeAlpha > 1) {
          particle.alpha = Math.min(
            particle.targetAlpha,
            particle.alpha + 0.02,
          );
        } else {
          particle.alpha = particle.targetAlpha * edgeAlpha;
        }
        particle.x += particle.dx + vx;
        particle.y += particle.dy + vy;
        const translateTargetX =
          (mouseRef.current.x / (safeStaticity / particle.magnetism)) *
          particle.reactivity;
        const translateTargetY =
          (mouseRef.current.y / (safeStaticity / particle.magnetism)) *
          particle.reactivity;
        particle.translateX +=
          (translateTargetX - particle.translateX) / safeEase;
        particle.translateY +=
          (translateTargetY - particle.translateY) / safeEase;

        drawParticle(particle);

        const isOutOfBounds =
          particle.x < -particle.size ||
          particle.x > canvasSizeRef.current.w + particle.size ||
          particle.y < -particle.size ||
          particle.y > canvasSizeRef.current.h + particle.size;

        if (isOutOfBounds) {
          circlesRef.current.splice(i, 1);
          drawParticle(createParticle(), true);
        }
      }
    };

    const handleMouseMove = (event) => {
      const { w, h } = canvasSizeRef.current;
      if (!w || !h) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      } else {
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
      }
    };

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = !document.hidden;
    };

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        queueResize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(container);
    } else {
      const handleResize = () => queueResize();
      window.addEventListener("resize", handleResize, { passive: true });
      resizeObserver = {
        disconnect: () => window.removeEventListener("resize", handleResize),
      };
    }

    if (typeof window.IntersectionObserver === "function") {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isInViewportRef.current = entry.isIntersecting;
        },
        { threshold: 0, rootMargin: "300px 0px 300px 0px" },
      );
      intersectionObserver.observe(container);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (typeof ResizeObserver !== "function") {
      queueResize();
    }
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (resizeFrameId) {
        window.cancelAnimationFrame(resizeFrameId);
      }
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    color,
    maxDpr,
    refresh,
    rgb,
    safeEase,
    safeQuantity,
    safeStaticity,
    safeSpeed,
    safeTargetFps,
    size,
    vx,
    vy,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  );
}

Particles.displayName = "Particles";

export { Particles };
export default memo(Particles);
