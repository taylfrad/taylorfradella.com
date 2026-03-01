import { useEffect, useMemo, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { isLikelyLowEndDevice } from "@/lib/performance";

function hexToVec4(hex) {
  let hexStr = hex.replace("#", "");
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  if (hexStr.length === 6) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 8) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
    a = parseInt(hexStr.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;
  #define PI 3.14159265359

  uniform float iTime;
  uniform vec3 iResolution;

  uniform float uSpinRotation;
  uniform float uSpinSpeed;
  uniform vec2 uOffset;
  uniform vec4 uColor1;
  uniform vec4 uColor2;
  uniform vec4 uColor3;
  uniform float uContrast;
  uniform float uLighting;
  uniform float uSpinAmount;
  uniform float uPixelFilter;
  uniform float uSpinEase;
  uniform bool uIsRotate;
  uniform vec2 uMouse;

  varying vec2 vUv;

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / uPixelFilter;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;

    float uv_len = length(uv);
    float speed = (uSpinRotation * uSpinEase * 0.2);

    if(uIsRotate){
      speed = iTime * speed;
    }
    speed += 302.2;

    float mouseInfluence = (uMouse.x * 2.0 - 1.0);
    speed += mouseInfluence * 0.1;

    float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;

    uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
    uv *= 30.0;

    float baseSpeed = iTime * uSpinSpeed;
    speed = baseSpeed + mouseInfluence * 2.0;

    vec2 uv2 = vec2(uv.x + uv.y);

    for(int i = 0; i < 5; i++) {
      uv2 += sin(max(uv.x, uv.y)) + uv;
      uv += 0.5 * vec2(
        cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
        sin(uv2.x - 0.113 * speed)
      );
      uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);

    float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);

    return
      (0.3 / uContrast) * uColor1 +
      (1.0 - 0.3 / uContrast) * (
        uColor1 * c1p +
        uColor2 * c2p +
        vec4(c3p * uColor3.rgb, c3p * uColor1.a)
      ) +
      light;
  }

  void main() {
    vec2 uv = vUv * iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv);
  }
`;

export default function Balatro({
  spinRotation = 0,
  spinSpeed = 3,
  offset = [0.0, 0.0],
  color1 = "#0e1116",
  color2 = "#0c2d35",
  color3 = "#290c4e",
  contrast = 4.5,
  lighting = 0.4,
  spinAmount = 0.3,
  pixelFilter = 2000,
  spinEase = 1.0,
  isRotate = false,
  mouseInteraction = false,
  active = true,
  maxDpr = 1.3,
  targetFps = 60,
}) {
  const containerRef = useRef(null);
  const activeRef = useRef(active);
  const isInViewportRef = useRef(true);
  const isDocumentVisibleRef = useRef(
    typeof document === "undefined" ? true : !document.hidden,
  );
  const safeTargetFps =
    Number.isFinite(targetFps) && targetFps > 0 ? targetFps : 0;
  const lowEndDevice = useMemo(() => isLikelyLowEndDevice(), []);
  const adaptiveMaxDpr = lowEndDevice ? Math.min(maxDpr, 1) : maxDpr;
  const adaptiveTargetFps = lowEndDevice
    ? Math.min(safeTargetFps, 24)
    : safeTargetFps;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, adaptiveMaxDpr),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program;
    let resizeObserver;
    let resizeFrameId = 0;
    let pendingWidth = 0;
    let pendingHeight = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDpr = 0;
    let hasSize = false;

    const applyResize = (nextWidth, nextHeight) => {
      const width = Math.max(1, Math.floor(nextWidth));
      const height = Math.max(1, Math.floor(nextHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, adaptiveMaxDpr);
      if (width === lastWidth && height === lastHeight && dpr === lastDpr)
        return;

      lastWidth = width;
      lastHeight = height;
      lastDpr = dpr;
      hasSize = true;
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.iResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ];
      }
    };

    const queueResize = (nextWidth, nextHeight) => {
      pendingWidth =
        Number.isFinite(nextWidth) && nextWidth > 0
          ? nextWidth
          : lastWidth || container.clientWidth;
      pendingHeight =
        Number.isFinite(nextHeight) && nextHeight > 0
          ? nextHeight
          : lastHeight || container.clientHeight;

      if (resizeFrameId) return;
      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = 0;
        applyResize(pendingWidth, pendingHeight);
      });
    };

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ],
        },
        uSpinRotation: { value: spinRotation },
        uSpinSpeed: { value: spinSpeed },
        uOffset: { value: offset },
        uColor1: { value: hexToVec4(color1) },
        uColor2: { value: hexToVec4(color2) },
        uColor3: { value: hexToVec4(color3) },
        uContrast: { value: contrast },
        uLighting: { value: lighting },
        uSpinAmount: { value: spinAmount },
        uPixelFilter: { value: pixelFilter },
        uSpinEase: { value: spinEase },
        uIsRotate: { value: isRotate },
        uMouse: { value: [0.5, 0.5] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationFrameId;
    let observer;
    let lastFrameTime = 0;
    const frameInterval = adaptiveTargetFps > 0 ? 1000 / adaptiveTargetFps : 0;

    function update(time) {
      animationFrameId = requestAnimationFrame(update);
      if (
        !activeRef.current ||
        !isDocumentVisibleRef.current ||
        !isInViewportRef.current ||
        !hasSize
      ) {
        return;
      }
      if (frameInterval > 0 && time - lastFrameTime < frameInterval) return;
      lastFrameTime = time;
      program.uniforms.iTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    }

    animationFrameId = requestAnimationFrame(update);
    container.appendChild(gl.canvas);

    function handleMouseMove(e) {
      if (!mouseInteraction) return;
      const width = lastWidth;
      const height = lastHeight;
      if (!width || !height) return;
      const x = e.offsetX / width;
      const y = 1.0 - e.offsetY / height;
      program.uniforms.uMouse.value = [x, y];
    }

    if (mouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
    }
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
      queueResize();
    }

    if (typeof window.IntersectionObserver === "function") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInViewportRef.current = entry.isIntersecting;
        },
        {
          threshold: 0,
          rootMargin: "300px 0px 300px 0px",
        },
      );
      observer.observe(container);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeFrameId) {
        window.cancelAnimationFrame(resizeFrameId);
      }
      resizeObserver?.disconnect();
      if (mouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      observer?.disconnect();
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    spinRotation,
    spinSpeed,
    adaptiveMaxDpr,
    adaptiveTargetFps,
    offset,
    color1,
    color2,
    color3,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
  ]);

  return <div ref={containerRef} className="w-full h-full" />;
}
