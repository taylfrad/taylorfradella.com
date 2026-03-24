// SSR note: import this component with dynamic import / ssr:false
// (e.g. React.lazy or Next.js dynamic). Uses Canvas/WebGL APIs.
/* eslint-disable react/no-unknown-property */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  createPortal,
} from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

import almondMilkyOtf from "@/assets/fonts/AlmondMilky.otf";
import cardGLB from "@/assets/lanyard/card.glb";
import lanyardPng from "@/assets/lanyard/lanyard.png";
import rollSafeStickerPng from "@/assets/lanyard/roll-safe-sticker.png";

const STICKER_NAME_FONT_FAMILY = "Almond Milky";
const STICKER_NAME_FONT_FALLBACK =
  "'Segoe Print', 'Comic Sans MS', 'Bradley Hand', 'Chalkboard SE', cursive";
const STICKER_NAME_FONT_STACK = `'${STICKER_NAME_FONT_FAMILY}', ${STICKER_NAME_FONT_FALLBACK}`;

let stickerNameFontLoadPromise = null;
let hasLoadedStickerNameFont = false;

function loadStickerNameFont() {
  if (typeof document === "undefined" || typeof FontFace !== "function")
    return Promise.resolve(false);
  if (hasLoadedStickerNameFont) return Promise.resolve(true);
  if (document.fonts?.check(`1em "${STICKER_NAME_FONT_FAMILY}"`)) {
    hasLoadedStickerNameFont = true;
    return Promise.resolve(true);
  }
  if (!stickerNameFontLoadPromise) {
    const font = new FontFace(
      STICKER_NAME_FONT_FAMILY,
      `url(${almondMilkyOtf}) format("opentype")`,
      { style: "normal", weight: "400" },
    );
    stickerNameFontLoadPromise = font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        hasLoadedStickerNameFont = true;
        return true;
      })
      .catch(() => {
        stickerNameFontLoadPromise = null;
        return false;
      });
  }
  return stickerNameFontLoadPromise;
}

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_VISUAL_SCALE = 3.0;
const CARD_VISUAL_OFFSET = [0, -1.2, -0.05];
const STICKER_PLANE_SCALE = 1.35;
const LANYARD_Y = 4.2;

const REST = {
  j1: [0, -0.85, 0],
  j2: [0, -1.7, 0],
  j3: [0, -2.55, 0],
  card: [0, -3.4, 0],
};

const INTRO_DURATION = 0.75;
const INTRO_DESKTOP = {
  gravityScaleStart: 0.55,
  dampingStart: 5.2,
  dampingEnd: 4,
  j1: { pos: [-0.2, -0.62, 0], vel: [0.028, -0.006, 0] },
  j2: { pos: [-0.46, -1.25, 0], vel: [0.042, -0.009, 0] },
  j3: { pos: [-0.82, -1.96, 0], vel: [0.056, -0.013, 0] },
  card: { pos: [-1.18, -2.62, 0], vel: [0.074, -0.017, 0] },
};
const INTRO_MOBILE = {
  gravityScaleStart: 0.58,
  dampingStart: 5.4,
  dampingEnd: 4,
  j1: { pos: [-0.14, -0.66, 0], vel: [0.024, -0.006, 0] },
  j2: { pos: [-0.32, -1.31, 0], vel: [0.038, -0.008, 0] },
  j3: { pos: [-0.56, -2.02, 0], vel: [0.052, -0.012, 0] },
  card: { pos: [-0.82, -2.72, 0], vel: [0.068, -0.016, 0] },
};

// ─── CARD FACE TEXTURE ──────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function makeCardFaceTexture({ useCustomNameFont = false } = {}) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  const w = 1024;
  const h = 1440;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Outer card
  const outerPad = 52;
  roundRect(ctx, outerPad, outerPad, w - outerPad * 2, h - outerPad * 2, 92);
  ctx.fillStyle = "#fbfbfb";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#dcdcdc";
  ctx.stroke();

  // Inner content area
  const innerPad = outerPad + 34;
  const innerX = innerPad;
  const innerY = innerPad;
  const innerW = w - innerPad * 2;
  const innerH = h - innerPad * 2;
  const headerH = Math.round(innerH * 0.42);

  roundRect(ctx, innerX, innerY, innerW, innerH, 54);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#121212";
  ctx.stroke();

  // Black header
  const r = 54;
  ctx.beginPath();
  ctx.moveTo(innerX + r, innerY);
  ctx.lineTo(innerX + innerW - r, innerY);
  ctx.quadraticCurveTo(innerX + innerW, innerY, innerX + innerW, innerY + r);
  ctx.lineTo(innerX + innerW, innerY + headerH);
  ctx.lineTo(innerX, innerY + headerH);
  ctx.lineTo(innerX, innerY + r);
  ctx.quadraticCurveTo(innerX, innerY, innerX + r, innerY);
  ctx.closePath();
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();

  // Grommet hole
  const holeX = w / 2;
  const holeY = innerY + 82;
  const rimShadow = ctx.createRadialGradient(
    holeX,
    holeY,
    18 * 0.9,
    holeX,
    holeY,
    25,
  );
  rimShadow.addColorStop(0, "rgba(0,0,0,0.22)");
  rimShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rimShadow;
  ctx.beginPath();
  ctx.arc(holeX, holeY, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(holeX, holeY, 21, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.stroke();
  const holeFill = ctx.createRadialGradient(
    holeX - 1,
    holeY - 1,
    1,
    holeX,
    holeY,
    18,
  );
  holeFill.addColorStop(0, "#e2e2e2");
  holeFill.addColorStop(1, "#131316");
  ctx.beginPath();
  ctx.arc(holeX, holeY, 18, 0, Math.PI * 2);
  ctx.fillStyle = holeFill;
  ctx.fill();

  // Header text
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 150px 'Arial Black', Arial, sans-serif";
  ctx.fillText("HELLO", w / 2, innerY + headerH * 0.35);
  ctx.font = "900 86px 'Arial Black', Arial, sans-serif";
  ctx.fillText("MY NAME IS", w / 2, innerY + headerH * 0.72);

  // Separator
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(innerX + 14, innerY + headerH);
  ctx.lineTo(innerX + innerW - 14, innerY + headerH);
  ctx.stroke();

  // Handwriting name
  const nameLines = ["Taylor", "Fradella"];
  const nameFontFamily = useCustomNameFont
    ? STICKER_NAME_FONT_STACK
    : STICKER_NAME_FONT_FALLBACK;
  let nameFontSize = 176;
  while (nameFontSize > 86) {
    ctx.font = `900 ${nameFontSize}px ${nameFontFamily}`;
    const widest = Math.max(...nameLines.map((l) => ctx.measureText(l).width));
    if (widest <= innerW - 130) break;
    nameFontSize -= 2;
  }
  const nameY = innerY + headerH + (innerH - headerH) * 0.56;
  const topLineY = -nameFontSize * 0.45;
  const bottomLineY = nameFontSize * 0.5;
  ctx.save();
  ctx.translate(w / 2, nameY);
  ctx.rotate(-0.018);
  ctx.font = `900 ${nameFontSize}px ${nameFontFamily}`;
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(0,0,0,0.58)";
  ctx.fillStyle = "#050505";
  ctx.strokeText(nameLines[0], 0, topLineY);
  ctx.fillText(nameLines[0], 0, topLineY);
  ctx.strokeText(nameLines[1], 0, bottomLineY);
  ctx.fillText(nameLines[1], 0, bottomLineY);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.flipY = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── ROOT COMPONENT ──────────────────────────────────────────────────────────
export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  groupOffsetX = 0,
  groupOffsetY = 4,
  introSwing = true,
  interactive = true,
  onReady,
}) {
  const groupRef = useRef();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const containerRef = useRef(null);
  const isVisibleRef = useRef(true);
  const invalidateRef = useRef(null);

  // matchMedia fires only on breakpoint cross (not every resize pixel),
  // avoiding layout thrash from reading window.innerWidth on each event.
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-0 flex h-full w-full items-center justify-center transform scale-100 origin-center"
      role="presentation"
      aria-hidden="true"
    >
      <Canvas
        tabIndex={-1}
        camera={{ position, fov }}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ alpha: transparent }}
        onCreated={({ gl, invalidate }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          // Claim touch events on the canvas so card dragging works on mobile.
          // Scrolling past the hero still works via the headline/CTA overlay (z-20)
          // and the header (z-30) which sit above the canvas (z-10).
          gl.domElement.style.touchAction = "none";
          invalidateRef.current = invalidate;
          invalidate();
        }}
      >
        <ambientLight intensity={Math.PI} />
        <group ref={groupRef} position={[groupOffsetX, groupOffsetY, 0]}>
          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band
              isMobile={isMobile}
              introSwing={introSwing}
              interactive={interactive}
              onReady={onReady}
              isVisibleRef={isVisibleRef}
              invalidateRef={invalidateRef}
            />
          </Physics>
        </group>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

// ─── BAND + CARD ─────────────────────────────────────────────────────────────
// Velocity threshold below which a body is considered "still"
const IDLE_VELOCITY_THRESHOLD = 0.015;
// Consecutive still frames before we stop rendering
const IDLE_FRAME_COUNT = 90;

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  introSwing = true,
  interactive = true,
  onReady,
  isVisibleRef,
  invalidateRef,
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const introDoneRef = useRef(!introSwing);
  const introStartTimeRef = useRef(null);
  const onReadyFiredRef = useRef(false);
  const idleFramesRef = useRef(0);
  const isIdleRef = useRef(false);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  // Pre-allocate arrays used every frame to avoid GC pressure from
  // creating new arrays inside useFrame (60fps = thousands of arrays/sec).
  const bodyRefs = useMemo(() => [j1, j2, j3, card], []);
  const allRefs = useMemo(() => [card, j1, j2, j3, fixed], []);
  const lerpRefs = useMemo(() => [j1, j2], []);

  const scene = useThree((state) => state.scene);

  const introProfile = isMobile ? INTRO_MOBILE : INTRO_DESKTOP;
  const j1Start = introSwing
    ? introProfile.j1
    : { pos: REST.j1, vel: [0, 0, 0] };
  const j2Start = introSwing
    ? introProfile.j2
    : { pos: REST.j2, vel: [0, 0, 0] };
  const j3Start = introSwing
    ? introProfile.j3
    : { pos: REST.j3, vel: [0, 0, 0] };
  const cardStart = introSwing
    ? introProfile.card
    : { pos: REST.card, vel: [0, 0, 0] };

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardPng);
  const rollSafe = useTexture(rollSafeStickerPng);
  const [cardFaceTex, setCardFaceTex] = useState(() => makeCardFaceTexture());

  useEffect(() => {
    loadStickerNameFont().then((loaded) => {
      setCardFaceTex(makeCardFaceTexture({ useCustomNameFont: loaded }));
    });
  }, []);

  const stickerPlacement = useMemo(() => {
    nodes.card.geometry.computeBoundingBox();
    const bbox = nodes.card.geometry.boundingBox;
    if (!bbox)
      return {
        width: 1.5,
        height: 2.1,
        x: 0,
        y: 0,
        zFront: 0.02,
        zBack: -0.02,
      };
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);
    return {
      width: size.x * 0.84 * STICKER_PLANE_SCALE,
      height: size.y * 0.8 * STICKER_PLANE_SCALE,
      x: center.x,
      y: center.y,
      zFront: bbox.max.z + 0.003,
      zBack: bbox.min.z - 0.003,
    };
  }, [nodes.card.geometry]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // Track pointer velocity during drag so we can apply it as an impulse on release.
  // Stores the last few world-space positions to compute a smoothed velocity.
  const dragPositionsRef = useRef([]);
  const DRAG_HISTORY = 6;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 2.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
    return undefined;
  }, [hovered, dragged]);


  useFrame((state, delta) => {
    if (band.current?.geometry && !band.current.geometry.__bsPatch) {
      band.current.geometry.__bsPatch = true;
      band.current.geometry.computeBoundingSphere = function () {
        if (!this.boundingSphere) this.boundingSphere = new THREE.Sphere();
        this.boundingSphere.center.set(0, 0, 0);
        this.boundingSphere.radius = 10;
      };
    }

    if (!isVisibleRef?.current) return;

    if (introSwing && !introDoneRef.current && fixed.current) {
      if (introStartTimeRef.current == null)
        introStartTimeRef.current = state.clock.elapsedTime;
      const t = state.clock.elapsedTime - introStartTimeRef.current;
      const raw = Math.min(1, t / INTRO_DURATION);
      const progress = raw * raw * (3 - 2 * raw);
      const g =
        introProfile.gravityScaleStart +
        (1 - introProfile.gravityScaleStart) * progress;
      const d =
        introProfile.dampingStart +
        (introProfile.dampingEnd - introProfile.dampingStart) * progress;
      bodyRefs.forEach((ref) => {
        const body = ref.current;
        if (body) {
          body.setGravityScale(g, true);
          body.setLinearDamping(d);
          body.setAngularDamping(d);
        }
      });
      if (progress >= 1) introDoneRef.current = true;
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      allRefs.forEach((ref) => ref.current?.wakeUp());
      const targetX = vec.x - dragged.x;
      const targetY = vec.y - dragged.y;
      const targetZ = vec.z - dragged.z;
      card.current?.setNextKinematicTranslation({
        x: targetX,
        y: targetY,
        z: targetZ,
      });
      // Record position for velocity calculation on release
      const now = state.clock.elapsedTime;
      const history = dragPositionsRef.current;
      history.push({ x: targetX, y: targetY, z: targetZ, t: now });
      if (history.length > DRAG_HISTORY) history.shift();
    }

    if (!onReadyFiredRef.current && typeof onReady === "function") {
      onReadyFiredRef.current = true;
      onReady();
    }

    if (!fixed.current) return;

    lerpRefs.forEach((ref) => {
      if (!ref.current.lerped)
        ref.current.lerped = new THREE.Vector3().copy(
          ref.current.translation(),
        );
      const d = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
      );
      ref.current.lerped.lerp(
        ref.current.translation(),
        delta * (minSpeed + d * (maxSpeed - minSpeed)),
      );
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());

    if (band.current?.geometry?.setPoints) {
      const pts = curve.getPoints(32);
      if (pts.every((p) => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z))) {
        band.current.geometry.setPoints(pts);
      }
    }

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });

    // ─── Idle detection ─────────────────────────────────────────────────
    // After intro settles and no drag, check if all bodies are nearly still.
    // Once idle, stop requesting frames so the render loop halts entirely.
    if (introDoneRef.current && !dragged) {
      let totalVelocity = 0;
      for (const ref of bodyRefs) {
        const body = ref.current;
        if (body) {
          const lv = body.linvel();
          const av = body.angvel();
          totalVelocity +=
            Math.abs(lv.x) + Math.abs(lv.y) + Math.abs(lv.z) +
            Math.abs(av.x) + Math.abs(av.y) + Math.abs(av.z);
        }
      }
      if (totalVelocity < IDLE_VELOCITY_THRESHOLD) {
        idleFramesRef.current++;
      } else {
        idleFramesRef.current = 0;
      }
      if (idleFramesRef.current >= IDLE_FRAME_COUNT) {
        isIdleRef.current = true;
        // Don't request another frame — render loop stops here
        return;
      }
    } else {
      idleFramesRef.current = 0;
    }

    // Request next frame while still active
    state.invalidate();
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 0, 0]}>
        <RigidBody
          ref={fixed}
          position={[0, 0, 0]}
          {...segmentProps}
          type="fixed"
        />
        <RigidBody
          position={j1Start.pos}
          linearVelocity={j1Start.vel}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={j2Start.pos}
          linearVelocity={j2Start.vel}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={j3Start.pos}
          linearVelocity={j3Start.vel}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={cardStart.pos}
          linearVelocity={cardStart.vel}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={CARD_VISUAL_SCALE}
            position={CARD_VISUAL_OFFSET}
            onPointerOver={interactive ? () => { hover(true); isIdleRef.current = false; idleFramesRef.current = 0; invalidateRef?.current?.(); } : undefined}
            onPointerOut={interactive ? () => { hover(false); } : undefined}
            onPointerUp={
              interactive
                ? (e) => {
                    (e.nativeEvent?.target ?? e.target)?.releasePointerCapture?.(e.pointerId);
                    // Compute fling velocity from recent drag positions
                    const history = dragPositionsRef.current;
                    if (history.length >= 2 && card.current) {
                      const newest = history[history.length - 1];
                      // Use an older sample for a smoother velocity estimate
                      const oldest = history[0];
                      const dt = newest.t - oldest.t;
                      if (dt > 0.005) {
                        const vx = (newest.x - oldest.x) / dt;
                        const vy = (newest.y - oldest.y) / dt;
                        const vz = (newest.z - oldest.z) / dt;
                        // Apply velocity after the body switches back to dynamic.
                        // Defer by one microtask so Rapier processes the type change first.
                        const bodyRef = card.current;
                        queueMicrotask(() => {
                          bodyRef.setLinvel?.({ x: vx, y: vy, z: vz }, true);
                        });
                      }
                    }
                    dragPositionsRef.current = [];
                    drag(false);
                    isIdleRef.current = false;
                    idleFramesRef.current = 0;
                    invalidateRef?.current?.();
                  }
                : undefined
            }
            onPointerDown={
              interactive
                ? (e) => {
                    const domTarget = e.nativeEvent?.target ?? e.target;
                    domTarget?.setPointerCapture?.(e.pointerId);
                    isIdleRef.current = false;
                    idleFramesRef.current = 0;
                    dragPositionsRef.current = [];
                    invalidateRef?.current?.();
                    allRefs.forEach((ref) => ref.current?.wakeUp());
                    drag(
                      new THREE.Vector3()
                        .copy(e.point)
                        .sub(vec.copy(card.current.translation())),
                    );
                  }
                : undefined
            }
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>

            {cardFaceTex && (
              <mesh
                position={[
                  stickerPlacement.x,
                  stickerPlacement.y,
                  stickerPlacement.zFront,
                ]}
                renderOrder={2}
              >
                <planeGeometry
                  args={[stickerPlacement.width, stickerPlacement.height]}
                />
                <meshStandardMaterial
                  map={cardFaceTex}
                  transparent
                  alphaTest={0.03}
                  depthWrite={false}
                  polygonOffset
                  polygonOffsetFactor={-1}
                  polygonOffsetUnits={-1}
                />
              </mesh>
            )}

            <mesh
              position={[
                stickerPlacement.x,
                stickerPlacement.y,
                stickerPlacement.zBack - 0.001,
              ]}
              rotation={[0, Math.PI, 0.12]}
              renderOrder={4}
            >
              <planeGeometry
                args={[
                  stickerPlacement.width * 0.74,
                  stickerPlacement.height * 0.64,
                ]}
              />
              <meshStandardMaterial
                map={rollSafe}
                transparent
                alphaTest={0.05}
                depthWrite={false}
                side={THREE.DoubleSide}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {createPortal(
        <mesh ref={band} renderOrder={1000} frustumCulled={false}>
          <meshLineGeometry />
          <meshLineMaterial
            color="white"
            depthTest={false}
            resolution={isMobile ? [1000, 2000] : [1000, 1000]}
            useMap
            map={texture}
            repeat={[-4, 1]}
            lineWidth={isMobile ? 1.3 : 0.6}
          />
        </mesh>,
        scene,
      )}
    </>
  );
}
