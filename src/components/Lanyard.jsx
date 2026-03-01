/* eslint-disable react/no-unknown-property */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei/core/Gltf";
import { useTexture } from "@react-three/drei/core/Texture";
import { Environment } from "@react-three/drei/core/Environment";
import { Lightformer } from "@react-three/drei/core/Lightformer";
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
import lanyardBandPng from "@/assets/lanyard/lanyard.png";
import rollSafeStickerPng from "@/assets/lanyard/roll-safe-sticker.png";
import { isLikelyLowEndDevice } from "@/lib/performance";

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload(cardGLB);

const CARD_VISUAL_SCALE = 2.25;
const CARD_VISUAL_OFFSET = new THREE.Vector3(0, -1.2, -0.05);
const STICKER_PLANE_SCALE = 1.35;
const STICKER_NAME_FONT_FAMILY = "Almond Milky";
const STICKER_NAME_FONT_FALLBACK =
  "'Segoe Print', 'Comic Sans MS', 'Bradley Hand', 'Chalkboard SE', cursive";
const STICKER_NAME_FONT_STACK = `'${STICKER_NAME_FONT_FAMILY}', ${STICKER_NAME_FONT_FALLBACK}`;
const DESKTOP_STRAP_SEGMENTS = 36;
const DESKTOP_STRAP_SEGMENTS_LOW_END = 24;
const DESKTOP_STRAP_TWIST_DECAY_EXP = 2;
const DESKTOP_STRAP_MAX_TWIST = Math.PI * 0.9;
const DESKTOP_STRAP_TEXTURE_REPEAT = 6;
const DESKTOP_STRAP_WIDTH_SCALE = 0.55;
const DESKTOP_STRAP_THICKNESS_SCALE = 0.08;
const MIN_VECTOR_LENGTH_SQ = 1e-7;

function isFiniteVectorLike(vec) {
  return (
    vec &&
    Number.isFinite(vec.x) &&
    Number.isFinite(vec.y) &&
    Number.isFinite(vec.z)
  );
}

function isFiniteQuaternionLike(quat) {
  return (
    quat &&
    Number.isFinite(quat.x) &&
    Number.isFinite(quat.y) &&
    Number.isFinite(quat.z) &&
    Number.isFinite(quat.w)
  );
}

function projectVectorOnPlane(target, source, normal) {
  const projectedAmount = source.dot(normal);
  return target.copy(source).addScaledVector(normal, -projectedAmount);
}

function setProjectedPerpendicular(target, normal, preferred, fallback) {
  projectVectorOnPlane(target, preferred, normal);
  if (target.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
    projectVectorOnPlane(target, fallback, normal);
  }
  if (target.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
    target.set(normal.y, normal.z, normal.x);
    projectVectorOnPlane(target, target, normal);
  }
  if (target.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
    target.set(1, 0, 0);
  }
  return target.normalize();
}

function getSignedAngleAroundAxis(from, to, axis, crossTarget) {
  const cosine = THREE.MathUtils.clamp(from.dot(to), -1, 1);
  const sine = axis.dot(crossTarget.copy(from).cross(to));
  return Math.atan2(sine, cosine);
}

function writeRibbonVertex(
  positions,
  normals,
  uvs,
  vertexIndex,
  point,
  normal,
  u,
  v,
) {
  const positionOffset = vertexIndex * 3;
  const uvOffset = vertexIndex * 2;

  positions[positionOffset + 0] = point.x;
  positions[positionOffset + 1] = point.y;
  positions[positionOffset + 2] = point.z;

  normals[positionOffset + 0] = normal.x;
  normals[positionOffset + 1] = normal.y;
  normals[positionOffset + 2] = normal.z;

  uvs[uvOffset + 0] = u;
  uvs[uvOffset + 1] = v;
}

function writeRibbonQuad(
  positions,
  normals,
  uvs,
  vertexOffset,
  a,
  b,
  c,
  d,
  faceNormal,
  uStart,
  uEnd,
  vStart = 0,
  vEnd = 1,
) {
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 0,
    a,
    faceNormal,
    uStart,
    vStart,
  );
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 1,
    b,
    faceNormal,
    uStart,
    vEnd,
  );
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 2,
    c,
    faceNormal,
    uEnd,
    vEnd,
  );
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 3,
    a,
    faceNormal,
    uStart,
    vStart,
  );
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 4,
    c,
    faceNormal,
    uEnd,
    vEnd,
  );
  writeRibbonVertex(
    positions,
    normals,
    uvs,
    vertexOffset + 5,
    d,
    faceNormal,
    uEnd,
    vStart,
  );

  return vertexOffset + 6;
}

let stickerNameFontLoadPromise = null;
let hasLoadedStickerNameFont = false;

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadStickerNameFont() {
  if (typeof document === "undefined" || typeof FontFace !== "function") {
    return Promise.resolve(false);
  }
  if (hasLoadedStickerNameFont) return Promise.resolve(true);

  if (document.fonts?.check(`1em "${STICKER_NAME_FONT_FAMILY}"`)) {
    hasLoadedStickerNameFont = true;
    return Promise.resolve(true);
  }

  if (!stickerNameFontLoadPromise) {
    const stickerNameFont = new FontFace(
      STICKER_NAME_FONT_FAMILY,
      `url(${almondMilkyOtf}) format("opentype")`,
      { style: "normal", weight: "400" },
    );

    stickerNameFontLoadPromise = stickerNameFont
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
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

function createFrontStickerTexture({ useCustomNameFont = false } = {}) {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const width = 1024;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Sticker outer card
  const outerPad = 52;
  drawRoundedRect(
    ctx,
    outerPad,
    outerPad,
    width - outerPad * 2,
    height - outerPad * 2,
    92,
  );
  ctx.fillStyle = "#fbfbfb";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#dcdcdc";
  ctx.stroke();

  // Sticker inner label
  const innerPad = outerPad + 34;
  const innerX = innerPad;
  const innerY = innerPad;
  const innerW = width - innerPad * 2;
  const innerH = height - innerPad * 2;
  const headerH = Math.round(innerH * 0.42);

  drawRoundedRect(ctx, innerX, innerY, innerW, innerH, 54);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#121212";
  ctx.stroke();

  // Black header band
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

  // Lanyard punch hole near top-center of the sticker.
  const holeX = width / 2;
  const holeY = innerY + 82;
  const holeOuterR = 25;
  const holeInnerR = 18;

  // Soft rim shadow to fake depth.
  const rimShadow = ctx.createRadialGradient(
    holeX,
    holeY,
    holeInnerR * 0.9,
    holeX,
    holeY,
    holeOuterR,
  );
  rimShadow.addColorStop(0, "rgba(0, 0, 0, 0.22)");
  rimShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = rimShadow;
  ctx.beginPath();
  ctx.arc(holeX, holeY, holeOuterR, 0, Math.PI * 2);
  ctx.fill();

  // Outer cut edge.
  ctx.beginPath();
  ctx.arc(holeX, holeY, holeInnerR + 3, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.stroke();

  // Dark center of the punched hole.
  const holeFill = ctx.createRadialGradient(
    holeX - 1,
    holeY - 1,
    1,
    holeX,
    holeY,
    holeInnerR,
  );
  holeFill.addColorStop(0, "#e2e2e2");
  holeFill.addColorStop(1, "#131316");
  ctx.beginPath();
  ctx.arc(holeX, holeY, holeInnerR, 0, Math.PI * 2);
  ctx.fillStyle = holeFill;
  ctx.fill();

  // Header text
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 150px 'Arial Black', Arial, sans-serif";
  ctx.fillText("HELLO", width / 2, innerY + headerH * 0.35);
  ctx.font = "900 86px 'Arial Black', Arial, sans-serif";
  ctx.fillText("MY NAME IS", width / 2, innerY + headerH * 0.72);

  // Divider line between header and blank sticker area
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(innerX + 14, innerY + headerH);
  ctx.lineTo(innerX + innerW - 14, innerY + headerH);
  ctx.stroke();

  // Printed-handwriting name, darker and bolder for readability.
  const nameLines = ["Taylor", "Fradella"];
  const nameFontFamily = useCustomNameFont
    ? STICKER_NAME_FONT_STACK
    : STICKER_NAME_FONT_FALLBACK;
  let nameFontSize = 176;
  while (nameFontSize > 86) {
    ctx.font = `900 ${nameFontSize}px ${nameFontFamily}`;
    const widestLine = Math.max(
      ...nameLines.map((line) => ctx.measureText(line).width),
    );
    if (widestLine <= innerW - 130) break;
    nameFontSize -= 2;
  }

  const nameY = innerY + headerH + (innerH - headerH) * 0.56;
  const topLineY = -nameFontSize * 0.45;
  const bottomLineY = nameFontSize * 0.5;
  ctx.save();
  ctx.translate(width / 2, nameY);
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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  groupOffsetX = 0.9,
  groupOffsetY = 4,
  scale = 1,
  bandColor = "#000000",
  bandWidth = 0.32,
  introSwing = true,
  active = true,
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [isInViewport, setIsInViewport] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const lowEndDevice = useMemo(() => isLikelyLowEndDevice(), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") return undefined;
    if (typeof window.IntersectionObserver !== "function") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "300px 0px 300px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const shouldRender = active && isDocumentVisible && isInViewport;
  const adaptiveMaxDpr = lowEndDevice
    ? isMobile
      ? 1.1
      : 1.25
    : isMobile
      ? 1.5
      : 2;
  const physicsStep =
    lowEndDevice && !isMobile ? 1 / 45 : isMobile ? 1 / 30 : 1 / 60;

  return (
    <div
      ref={containerRef}
      className="relative z-0 h-full w-full flex justify-center items-center"
    >
      <Canvas
        frameloop={shouldRender ? "always" : "never"}
        camera={{ position, fov }}
        dpr={[1, adaptiveMaxDpr]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={physicsStep}>
          <Band
            isMobile={isMobile}
            lowEndDevice={lowEndDevice}
            groupOffsetX={groupOffsetX}
            groupOffsetY={groupOffsetY}
            scale={scale}
            bandColor={bandColor}
            bandWidth={bandWidth}
            introSwing={introSwing}
          />
        </Physics>
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

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  lowEndDevice = false,
  groupOffsetX = 0,
  groupOffsetY = 4,
  scale = 1,
  bandColor = "#000000",
  bandWidth = 0.46,
  introSwing = true,
}) {
  const band = useRef();
  const desktopStrap = useRef();
  const desktopStrapMaterial = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const hasValidCurveRef = useRef(false);
  const desktopStrapSegmentCount = lowEndDevice
    ? DESKTOP_STRAP_SEGMENTS_LOW_END
    : DESKTOP_STRAP_SEGMENTS;
  const desktopStrapSampleCount = desktopStrapSegmentCount + 1;

  const {
    vec,
    ang,
    rot,
    dir,
    dragOffset,
    clipAnchorWorld,
    clipAnchorLocal,
    clipAnchorQuat,
    mobileCtrl1,
    mobileCtrl2,
    worldUp,
    worldRight,
    worldForward,
    frameUp,
    frameRight,
    previousTangent,
    currentTangent,
    tangentBlend,
    cardRightWorld,
    cardRightProjected,
    signedAngleCross,
    transportQuat,
    twistQuat,
    rotatedRight,
    topFaceNormal,
    bottomFaceNormal,
    leftFaceNormal,
    rightFaceNormal,
    clipOrientationRight,
  } = useMemo(
    () => ({
      vec: new THREE.Vector3(),
      ang: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      dragOffset: new THREE.Vector3(),
      clipAnchorWorld: new THREE.Vector3(),
      clipAnchorLocal: new THREE.Vector3(),
      clipAnchorQuat: new THREE.Quaternion(),
      mobileCtrl1: new THREE.Vector3(),
      mobileCtrl2: new THREE.Vector3(),
      worldUp: new THREE.Vector3(0, 1, 0),
      worldRight: new THREE.Vector3(1, 0, 0),
      worldForward: new THREE.Vector3(0, 0, 1),
      frameUp: new THREE.Vector3(0, 1, 0),
      frameRight: new THREE.Vector3(1, 0, 0),
      previousTangent: new THREE.Vector3(0, -1, 0),
      currentTangent: new THREE.Vector3(0, -1, 0),
      tangentBlend: new THREE.Vector3(0, -1, 0),
      cardRightWorld: new THREE.Vector3(1, 0, 0),
      cardRightProjected: new THREE.Vector3(1, 0, 0),
      signedAngleCross: new THREE.Vector3(),
      transportQuat: new THREE.Quaternion(),
      twistQuat: new THREE.Quaternion(),
      rotatedRight: new THREE.Vector3(1, 0, 0),
      topFaceNormal: new THREE.Vector3(0, 0, 1),
      bottomFaceNormal: new THREE.Vector3(0, 0, -1),
      leftFaceNormal: new THREE.Vector3(-1, 0, 0),
      rightFaceNormal: new THREE.Vector3(1, 0, 0),
      clipOrientationRight: new THREE.Vector3(1, 0, 0),
    }),
    [],
  );

  const segmentProps = useMemo(
    () => ({
      type: "dynamic",
      canSleep: true,
      colliders: false,
    }),
    [],
  );
  const dynamicBodyRefs = useMemo(() => [card, j1, j2, j3, fixed], []);
  const introProfile = useMemo(() => {
    const baseProfile = {
      durationSec: 0,
      startGravityScale: 1,
      finalGravityScale: 1,
      startLinearDamping: 4,
      finalLinearDamping: 4,
      startAngularDamping: 4,
      finalAngularDamping: 4,
      j1StartPos: [0, -0.85, 0],
      j2StartPos: [0, -1.7, 0],
      j3StartPos: [0, -2.55, 0],
      cardStartPos: [0, -3.4, 0],
      j1StartVel: [0, 0, 0],
      j2StartVel: [0, 0, 0],
      j3StartVel: [0, 0, 0],
      cardStartVel: [0, 0, 0],
    };

    if (!introSwing) return baseProfile;

    if (isMobile) {
      return {
        ...baseProfile,
        durationSec: 0.68,
        startGravityScale: 0.58,
        startLinearDamping: 5.4,
        startAngularDamping: 5.1,
        j1StartPos: [-0.14, -0.66, 0],
        j2StartPos: [-0.32, -1.31, 0],
        j3StartPos: [-0.56, -2.02, 0],
        cardStartPos: [-0.82, -2.72, 0],
        j1StartVel: [0.024, -0.006, 0],
        j2StartVel: [0.038, -0.008, 0],
        j3StartVel: [0.052, -0.012, 0],
        cardStartVel: [0.068, -0.016, 0],
      };
    }

    return {
      ...baseProfile,
      durationSec: 0.75,
      startGravityScale: 0.55,
      startLinearDamping: 5.2,
      startAngularDamping: 5.0,
      j1StartPos: [-0.2, -0.62, 0],
      j2StartPos: [-0.46, -1.25, 0],
      j3StartPos: [-0.82, -1.96, 0],
      cardStartPos: [-1.18, -2.62, 0],
      j1StartVel: [0.028, -0.006, 0],
      j2StartVel: [0.042, -0.009, 0],
      j3StartVel: [0.056, -0.013, 0],
      cardStartVel: [0.074, -0.017, 0],
    };
  }, [introSwing, isMobile]);
  const introBodyRefs = useMemo(() => [j1, j2, j3, card], []);
  const introStateRef = useRef({
    started: false,
    done: !introSwing,
    startTime: 0,
  });
  const bandRepeat = useMemo(() => new THREE.Vector2(-4, 1), []);
  const [mobileCurve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [desktopCurve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const desktopStrapState = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const verticesPerQuad = 6;
    const quadsPerSegment = 4;
    const vertexCount =
      desktopStrapSegmentCount * quadsPerSegment * verticesPerQuad;
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const points = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(),
    );
    const tangents = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(0, -1, 0),
    );
    const rights = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(1, 0, 0),
    );
    const twistedRights = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(1, 0, 0),
    );
    const ups = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(0, 0, 1),
    );
    const cornerTopRight = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(),
    );
    const cornerTopLeft = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(),
    );
    const cornerBottomLeft = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(),
    );
    const cornerBottomRight = Array.from(
      { length: desktopStrapSampleCount },
      () => new THREE.Vector3(),
    );
    const distances = new Float32Array(desktopStrapSampleCount);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    return {
      geometry,
      positions,
      normals,
      uvs,
      points,
      tangents,
      rights,
      twistedRights,
      ups,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomLeft,
      cornerBottomRight,
      distances,
    };
  }, [desktopStrapSampleCount, desktopStrapSegmentCount]);
  const [isStickerNameFontReady, setIsStickerNameFontReady] = useState(
    () => hasLoadedStickerNameFont,
  );

  const { nodes, materials } = useGLTF(cardGLB);
  const frontStickerTexture = useMemo(
    () =>
      createFrontStickerTexture({ useCustomNameFont: isStickerNameFontReady }),
    [isStickerNameFontReady],
  );
  const lanyardBandTexture = useTexture(lanyardBandPng);
  const rollSafeTexture = useTexture(rollSafeStickerPng);
  const clipAttachmentOffset = useMemo(() => {
    nodes.clip.geometry.computeBoundingBox();
    const bbox = nodes.clip.geometry.boundingBox;
    if (!bbox) return new THREE.Vector3(0, 1.45, 0);

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);

    const ringLocal = new THREE.Vector3(
      center.x,
      bbox.max.y - size.y * 0.1,
      center.z,
    );

    return ringLocal.multiplyScalar(CARD_VISUAL_SCALE).add(CARD_VISUAL_OFFSET);
  }, [nodes.clip.geometry]);
  const cardJointAnchor = useMemo(
    () => [
      clipAttachmentOffset.x,
      clipAttachmentOffset.y,
      clipAttachmentOffset.z,
    ],
    [clipAttachmentOffset],
  );
  const stickerPlacement = useMemo(() => {
    nodes.card.geometry.computeBoundingBox();
    const bbox = nodes.card.geometry.boundingBox;
    if (!bbox) {
      return {
        width: 1.5,
        height: 2.1,
        x: 0,
        y: 0,
        zFront: 0.02,
        zBack: -0.02,
      };
    }
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

  useEffect(() => {
    if (!lanyardBandTexture) return;
    lanyardBandTexture.colorSpace = THREE.SRGBColorSpace;
    lanyardBandTexture.anisotropy = 16;
    lanyardBandTexture.wrapS = THREE.RepeatWrapping;
    lanyardBandTexture.wrapT = THREE.RepeatWrapping;
    lanyardBandTexture.needsUpdate = true;
  }, [lanyardBandTexture]);
  const shouldUseBandTexture = !!lanyardBandTexture && !isMobile;
  const effectiveBandWidth = isMobile ? bandWidth * 1.7 : bandWidth;
  const desktopBandWidth = effectiveBandWidth * DESKTOP_STRAP_WIDTH_SCALE;

  useEffect(() => {
    if (!rollSafeTexture) return;
    rollSafeTexture.colorSpace = THREE.SRGBColorSpace;
    rollSafeTexture.anisotropy = 16;
    rollSafeTexture.needsUpdate = true;
  }, [rollSafeTexture]);

  useEffect(() => {
    mobileCurve.curveType = "chordal";
    desktopCurve.curveType = "chordal";
  }, [mobileCurve, desktopCurve]);

  useEffect(() => {
    let mounted = true;

    loadStickerNameFont().then((loaded) => {
      if (!mounted || !loaded) return;
      setIsStickerNameFontReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (frontStickerTexture) frontStickerTexture.dispose();
    };
  }, [frontStickerTexture]);
  useEffect(() => {
    const strapMaterial = desktopStrapMaterial.current;
    return () => {
      desktopStrapState.geometry.dispose();
      strapMaterial?.dispose?.();
    };
  }, [desktopStrapState]);

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  // Keep mobile and desktop strap tuning fully isolated so edits don't
  // unintentionally affect the other mode.
  const mobileStrapVisualDrop = 0.3;
  const desktopStrapVisualDrop = 0.26;
  const mobileStrapClipEndpointDrop = 0.42;
  const desktopStrapClipEndpointDrop = 0.37;
  const mobileClipAttachBiasY = -0.018;
  const desktopClipAttachBiasY = -0.012;
  const mobileDragSensitivity = 0.78;
  const mobileDragFollowRate = 12;
  const fallbackBandPoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.3, 0),
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(0, -0.9, 0),
    ],
    [],
  );
  const updateMobileBandGeometry = useCallback((points) => {
    const geometry = band.current?.geometry;
    if (!geometry || typeof geometry.setPoints !== "function") return false;
    geometry.setPoints(points);
    return true;
  }, []);
  const writeDesktopVolumeGeometry = useCallback(() => {
    const {
      positions,
      normals,
      uvs,
      ups,
      twistedRights,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomLeft,
      cornerBottomRight,
      distances,
      geometry,
    } = desktopStrapState;
    const totalLength = Math.max(
      distances[desktopStrapSegmentCount],
      MIN_VECTOR_LENGTH_SQ,
    );

    let vertexOffset = 0;
    for (let i = 0; i < desktopStrapSegmentCount; i += 1) {
      const uStart =
        -(distances[i] / totalLength) * DESKTOP_STRAP_TEXTURE_REPEAT;
      const uEnd =
        -(distances[i + 1] / totalLength) * DESKTOP_STRAP_TEXTURE_REPEAT;

      topFaceNormal.copy(ups[i]).add(ups[i + 1]);
      if (topFaceNormal.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
        topFaceNormal.copy(ups[i]);
      }
      topFaceNormal.normalize();
      bottomFaceNormal.copy(topFaceNormal).multiplyScalar(-1);

      rightFaceNormal.copy(twistedRights[i]).add(twistedRights[i + 1]);
      if (rightFaceNormal.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
        rightFaceNormal.copy(twistedRights[i]);
      }
      rightFaceNormal.normalize();
      leftFaceNormal.copy(rightFaceNormal).multiplyScalar(-1);

      vertexOffset = writeRibbonQuad(
        positions,
        normals,
        uvs,
        vertexOffset,
        cornerTopRight[i],
        cornerTopLeft[i],
        cornerTopLeft[i + 1],
        cornerTopRight[i + 1],
        topFaceNormal,
        uStart,
        uEnd,
      );
      vertexOffset = writeRibbonQuad(
        positions,
        normals,
        uvs,
        vertexOffset,
        cornerBottomRight[i],
        cornerBottomLeft[i],
        cornerBottomLeft[i + 1],
        cornerBottomRight[i + 1],
        bottomFaceNormal,
        uStart,
        uEnd,
      );
      vertexOffset = writeRibbonQuad(
        positions,
        normals,
        uvs,
        vertexOffset,
        cornerTopLeft[i],
        cornerBottomLeft[i],
        cornerBottomLeft[i + 1],
        cornerTopLeft[i + 1],
        leftFaceNormal,
        uStart,
        uEnd,
      );
      vertexOffset = writeRibbonQuad(
        positions,
        normals,
        uvs,
        vertexOffset,
        cornerBottomRight[i],
        cornerTopRight[i],
        cornerTopRight[i + 1],
        cornerBottomRight[i + 1],
        rightFaceNormal,
        uStart,
        uEnd,
      );
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.attributes.uv.needsUpdate = true;
    geometry.computeBoundingSphere();
  }, [
    desktopStrapState,
    desktopStrapSegmentCount,
    topFaceNormal,
    bottomFaceNormal,
    leftFaceNormal,
    rightFaceNormal,
  ]);
  const updateDesktopFallbackGeometry = useCallback(() => {
    const {
      points,
      tangents,
      twistedRights,
      ups,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomLeft,
      cornerBottomRight,
      distances,
    } = desktopStrapState;
    const halfWidth = Math.max(desktopBandWidth * 0.5, 0.015);
    const halfThickness = Math.max(
      desktopBandWidth * DESKTOP_STRAP_THICKNESS_SCALE,
      0.003,
    );
    const fallbackStart = fallbackBandPoints[0];
    const fallbackEnd = fallbackBandPoints[fallbackBandPoints.length - 1];

    tangentBlend.copy(fallbackEnd).sub(fallbackStart);
    if (tangentBlend.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
      tangentBlend.set(0, -1, 0);
    } else {
      tangentBlend.normalize();
    }

    distances[0] = 0;
    for (let i = 0; i <= desktopStrapSegmentCount; i += 1) {
      const t = i / desktopStrapSegmentCount;
      points[i].copy(fallbackStart).lerp(fallbackEnd, t);
      tangents[i].copy(tangentBlend);
      twistedRights[i].copy(worldRight);

      ups[i].copy(tangents[i]).cross(twistedRights[i]);
      if (ups[i].lengthSq() < MIN_VECTOR_LENGTH_SQ) {
        setProjectedPerpendicular(ups[i], tangents[i], worldUp, worldForward);
      } else {
        ups[i].normalize();
      }

      cornerTopRight[i]
        .copy(points[i])
        .addScaledVector(twistedRights[i], halfWidth)
        .addScaledVector(ups[i], halfThickness);
      cornerTopLeft[i]
        .copy(points[i])
        .addScaledVector(twistedRights[i], -halfWidth)
        .addScaledVector(ups[i], halfThickness);
      cornerBottomLeft[i]
        .copy(points[i])
        .addScaledVector(twistedRights[i], -halfWidth)
        .addScaledVector(ups[i], -halfThickness);
      cornerBottomRight[i]
        .copy(points[i])
        .addScaledVector(twistedRights[i], halfWidth)
        .addScaledVector(ups[i], -halfThickness);

      if (i > 0) {
        distances[i] = distances[i - 1] + points[i - 1].distanceTo(points[i]);
      }
    }

    writeDesktopVolumeGeometry();
  }, [
    desktopStrapState,
    desktopBandWidth,
    fallbackBandPoints,
    desktopStrapSegmentCount,
    tangentBlend,
    worldRight,
    worldUp,
    worldForward,
    writeDesktopVolumeGeometry,
  ]);
  const updateDesktopStrapGeometry = useCallback(
    (cardRotation) => {
      const {
        points,
        tangents,
        rights,
        twistedRights,
        ups,
        cornerTopRight,
        cornerTopLeft,
        cornerBottomLeft,
        cornerBottomRight,
        distances,
      } = desktopStrapState;
      const halfWidth = Math.max(desktopBandWidth * 0.5, 0.015);
      const halfThickness = Math.max(
        desktopBandWidth * DESKTOP_STRAP_THICKNESS_SCALE,
        0.003,
      );

      for (let i = 0; i <= desktopStrapSegmentCount; i += 1) {
        desktopCurve.getPoint(i / desktopStrapSegmentCount, points[i]);
        if (!isFiniteVectorLike(points[i])) return false;
      }

      for (let i = 0; i <= desktopStrapSegmentCount; i += 1) {
        if (i === 0) {
          tangentBlend.copy(points[1]).sub(points[0]);
        } else if (i === desktopStrapSegmentCount) {
          tangentBlend
            .copy(points[desktopStrapSegmentCount])
            .sub(points[desktopStrapSegmentCount - 1]);
        } else {
          tangentBlend.copy(points[i + 1]).sub(points[i - 1]);
        }

        if (tangentBlend.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
          if (i > 0) {
            tangentBlend.copy(tangents[i - 1]);
          } else {
            tangentBlend.set(0, -1, 0);
          }
        }
        tangents[i].copy(tangentBlend).normalize();
      }

      frameRight.copy(
        setProjectedPerpendicular(frameRight, tangents[0], worldRight, worldUp),
      );
      frameUp.copy(tangents[0]).cross(frameRight).normalize();
      rights[0].copy(frameRight);

      for (let i = 1; i <= desktopStrapSegmentCount; i += 1) {
        previousTangent.copy(tangents[i - 1]);
        currentTangent.copy(tangents[i]);
        transportQuat.setFromUnitVectors(previousTangent, currentTangent);
        frameRight.applyQuaternion(transportQuat);

        if (frameRight.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
          frameRight.copy(rights[i - 1]);
        }

        projectVectorOnPlane(frameRight, frameRight, currentTangent);
        if (frameRight.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
          setProjectedPerpendicular(
            frameRight,
            currentTangent,
            frameUp,
            worldForward,
          );
        } else {
          frameRight.normalize();
        }
        frameUp.copy(currentTangent).cross(frameRight).normalize();
        rights[i].copy(frameRight);
      }

      let clipTwist = 0;
      if (isFiniteQuaternionLike(cardRotation)) {
        clipAnchorQuat.set(
          cardRotation.x,
          cardRotation.y,
          cardRotation.z,
          cardRotation.w,
        );
        cardRightWorld.copy(worldRight).applyQuaternion(clipAnchorQuat);
        projectVectorOnPlane(cardRightProjected, cardRightWorld, tangents[0]);
        if (cardRightProjected.lengthSq() < MIN_VECTOR_LENGTH_SQ) {
          clipOrientationRight
            .copy(worldForward)
            .applyQuaternion(clipAnchorQuat);
          projectVectorOnPlane(
            cardRightProjected,
            clipOrientationRight,
            tangents[0],
          );
        }
        if (cardRightProjected.lengthSq() >= MIN_VECTOR_LENGTH_SQ) {
          cardRightProjected.normalize();
          clipTwist = getSignedAngleAroundAxis(
            rights[0],
            cardRightProjected,
            tangents[0],
            signedAngleCross,
          );
          clipTwist = THREE.MathUtils.clamp(
            clipTwist,
            -DESKTOP_STRAP_MAX_TWIST,
            DESKTOP_STRAP_MAX_TWIST,
          );
        }
      }

      distances[0] = 0;
      for (let i = 1; i <= desktopStrapSegmentCount; i += 1) {
        distances[i] = distances[i - 1] + points[i - 1].distanceTo(points[i]);
      }

      for (let i = 0; i <= desktopStrapSegmentCount; i += 1) {
        const t = i / desktopStrapSegmentCount;
        const twistStrength = Math.pow(1 - t, DESKTOP_STRAP_TWIST_DECAY_EXP);
        const twist = clipTwist * twistStrength;

        twistQuat.setFromAxisAngle(tangents[i], twist);
        rotatedRight.copy(rights[i]).applyQuaternion(twistQuat).normalize();
        twistedRights[i].copy(rotatedRight);

        ups[i].copy(tangents[i]).cross(twistedRights[i]);
        if (ups[i].lengthSq() < MIN_VECTOR_LENGTH_SQ) {
          setProjectedPerpendicular(ups[i], tangents[i], worldUp, worldForward);
        } else {
          ups[i].normalize();
        }

        cornerTopRight[i]
          .copy(points[i])
          .addScaledVector(twistedRights[i], halfWidth)
          .addScaledVector(ups[i], halfThickness);
        cornerTopLeft[i]
          .copy(points[i])
          .addScaledVector(twistedRights[i], -halfWidth)
          .addScaledVector(ups[i], halfThickness);
        cornerBottomLeft[i]
          .copy(points[i])
          .addScaledVector(twistedRights[i], -halfWidth)
          .addScaledVector(ups[i], -halfThickness);
        cornerBottomRight[i]
          .copy(points[i])
          .addScaledVector(twistedRights[i], halfWidth)
          .addScaledVector(ups[i], -halfThickness);
      }

      writeDesktopVolumeGeometry();
      return true;
    },
    [
      desktopStrapState,
      desktopBandWidth,
      desktopStrapSegmentCount,
      desktopCurve,
      tangentBlend,
      frameRight,
      worldRight,
      worldUp,
      frameUp,
      previousTangent,
      currentTangent,
      transportQuat,
      worldForward,
      clipAnchorQuat,
      cardRightWorld,
      cardRightProjected,
      clipOrientationRight,
      signedAngleCross,
      twistQuat,
      rotatedRight,
      writeDesktopVolumeGeometry,
    ],
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.85]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.85]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85]);
  useSphericalJoint(j3, card, [[0, 0, 0], cardJointAnchor]);

  const applyIntroDynamics = useCallback(
    (progress) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const eased =
        clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
      const gravityScale = THREE.MathUtils.lerp(
        introProfile.startGravityScale,
        introProfile.finalGravityScale,
        eased,
      );
      const linearDamping = THREE.MathUtils.lerp(
        introProfile.startLinearDamping,
        introProfile.finalLinearDamping,
        eased,
      );
      const angularDamping = THREE.MathUtils.lerp(
        introProfile.startAngularDamping,
        introProfile.finalAngularDamping,
        eased,
      );

      introBodyRefs.forEach((ref) => {
        const body = ref.current;
        if (!body) return;
        body.setGravityScale(gravityScale, true);
        body.setLinearDamping(linearDamping);
        body.setAngularDamping(angularDamping);
      });
    },
    [introBodyRefs, introProfile],
  );

  const completeIntro = useCallback(() => {
    if (introStateRef.current.done) return;
    introStateRef.current.done = true;
    introStateRef.current.started = true;
    applyIntroDynamics(1);
  }, [applyIntroDynamics]);

  useEffect(() => {
    introStateRef.current = {
      started: false,
      done: !introSwing,
      startTime: 0,
    };
  }, [introSwing, introProfile]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      dynamicBodyRefs.forEach((ref) => ref.current?.wakeUp());
      const targetX = vec.x - dragged.x;
      const targetY = vec.y - dragged.y;
      const targetZ = vec.z - dragged.z;

      if (!isMobile) {
        card.current?.setNextKinematicTranslation({
          x: targetX,
          y: targetY,
          z: targetZ,
        });
      } else {
        const currentPos = card.current?.translation();
        if (isFiniteVectorLike(currentPos)) {
          const followAlpha =
            1 - Math.exp(-delta * mobileDragFollowRate * mobileDragSensitivity);
          card.current?.setNextKinematicTranslation({
            x: THREE.MathUtils.lerp(currentPos.x, targetX, followAlpha),
            y: THREE.MathUtils.lerp(currentPos.y, targetY, followAlpha),
            z: THREE.MathUtils.lerp(currentPos.z, targetZ, followAlpha),
          });
        } else {
          card.current?.setNextKinematicTranslation({
            x: targetX,
            y: targetY,
            z: targetZ,
          });
        }
      }
    }

    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) {
      return;
    }
    const hasMobileStrap =
      isMobile && typeof band.current?.geometry?.setPoints === "function";
    const hasDesktopStrap = !isMobile && !!desktopStrap.current;
    if (!hasMobileStrap && !hasDesktopStrap) return;

    if (introSwing && !introStateRef.current.done) {
      const elapsedTime = state.clock.getElapsedTime();
      if (!introStateRef.current.started) {
        introStateRef.current.started = true;
        introStateRef.current.startTime = elapsedTime;
        applyIntroDynamics(0);
      }

      const introProgress = Math.min(
        1,
        (elapsedTime - introStateRef.current.startTime) /
          Math.max(0.001, introProfile.durationSec),
      );
      applyIntroDynamics(introProgress);
      if (introProgress >= 1) introStateRef.current.done = true;
    }

    const fixedPos = fixed.current.translation();
    const j1Pos = j1.current.translation();
    const j2Pos = j2.current.translation();
    const j3Pos = j3.current.translation();
    const cardPos = card.current.translation();
    const cardRotation = card.current.rotation();
    if (
      !isFiniteVectorLike(fixedPos) ||
      !isFiniteVectorLike(j1Pos) ||
      !isFiniteVectorLike(j2Pos) ||
      !isFiniteVectorLike(j3Pos)
    ) {
      if (!hasValidCurveRef.current) {
        if (isMobile) {
          updateMobileBandGeometry(fallbackBandPoints);
        } else if (!isMobile) {
          updateDesktopFallbackGeometry();
        }
      }
      return;
    }

    [j1, j2].forEach((ref) => {
      const translation = ref.current.translation();
      if (!isFiniteVectorLike(translation)) return;
      if (!ref.current.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(translation);
      }
      const clampedDistance = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(translation)),
      );
      ref.current.lerped.lerp(
        translation,
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
      );
    });

    let strapStartPoint = j3Pos;
    if (isFiniteVectorLike(cardPos)) {
      const clipAttachBiasY = isMobile
        ? mobileClipAttachBiasY
        : desktopClipAttachBiasY;
      clipAnchorWorld.set(cardPos.x, cardPos.y, cardPos.z);
      if (isFiniteQuaternionLike(cardRotation)) {
        clipAnchorQuat.set(
          cardRotation.x,
          cardRotation.y,
          cardRotation.z,
          cardRotation.w,
        );
        clipAnchorLocal
          .set(
            cardJointAnchor[0],
            cardJointAnchor[1] + clipAttachBiasY,
            cardJointAnchor[2],
          )
          .applyQuaternion(clipAnchorQuat);
        clipAnchorWorld.add(clipAnchorLocal);
      } else {
        clipAnchorWorld.x += cardJointAnchor[0];
        clipAnchorWorld.y += cardJointAnchor[1] + clipAttachBiasY;
        clipAnchorWorld.z += cardJointAnchor[2];
      }
      strapStartPoint = clipAnchorWorld;
    }

    if (isMobile) {
      mobileCtrl1.copy(strapStartPoint).lerp(fixedPos, 0.36);
      mobileCtrl2.copy(strapStartPoint).lerp(fixedPos, 0.72);
      mobileCurve.points[0].copy(strapStartPoint);
      mobileCurve.points[1].copy(mobileCtrl1);
      mobileCurve.points[2].copy(mobileCtrl2);
      mobileCurve.points[3].copy(fixedPos);
      mobileCurve.points[0].y -= mobileStrapClipEndpointDrop;
      mobileCurve.points[1].y -= mobileStrapVisualDrop * 0.35;
      mobileCurve.points[2].y -= mobileStrapVisualDrop * 0.2;
      mobileCurve.points[3].y -= mobileStrapVisualDrop;
    } else {
      desktopCurve.points[0].copy(strapStartPoint);
      desktopCurve.points[1]
        .copy(j2.current.lerped)
        .lerp(strapStartPoint, 0.22);
      desktopCurve.points[2].copy(j1.current.lerped);
      desktopCurve.points[3].copy(fixedPos);
      desktopCurve.points[0].y -= desktopStrapClipEndpointDrop * 0.5;
      desktopCurve.points[1].y -= desktopStrapVisualDrop * 0.55;
      desktopCurve.points[2].y -= desktopStrapVisualDrop;
      desktopCurve.points[3].y -= desktopStrapVisualDrop;
    }

    const activePoints = isMobile ? mobileCurve.points : desktopCurve.points;
    if (activePoints.some((point) => !isFiniteVectorLike(point))) {
      if (!hasValidCurveRef.current) {
        if (isMobile) {
          updateMobileBandGeometry(fallbackBandPoints);
        } else if (!isMobile) {
          updateDesktopFallbackGeometry();
        }
      }
      return;
    }

    if (isMobile) {
      const hasUpdatedMobileStrap = updateMobileBandGeometry(
        mobileCurve.getPoints(16),
      );
      if (hasUpdatedMobileStrap) {
        hasValidCurveRef.current = true;
      } else if (!hasValidCurveRef.current) {
        updateMobileBandGeometry(fallbackBandPoints);
      }
    } else {
      const hasUpdatedDesktopStrap = updateDesktopStrapGeometry(cardRotation);
      if (hasUpdatedDesktopStrap) {
        hasValidCurveRef.current = true;
      } else if (!hasValidCurveRef.current) {
        updateDesktopFallbackGeometry();
      }
    }

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    if (isFiniteVectorLike(ang) && isFiniteVectorLike(rot)) {
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group
        position={[groupOffsetX, groupOffsetY, 0]}
        scale={[scale, scale, scale]}
      >
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody
          position={introProfile.j1StartPos}
          linearVelocity={introProfile.j1StartVel}
          linearDamping={introProfile.finalLinearDamping}
          angularDamping={introProfile.finalAngularDamping}
          gravityScale={introProfile.finalGravityScale}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={introProfile.j2StartPos}
          linearVelocity={introProfile.j2StartVel}
          linearDamping={introProfile.finalLinearDamping}
          angularDamping={introProfile.finalAngularDamping}
          gravityScale={introProfile.finalGravityScale}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={introProfile.j3StartPos}
          linearVelocity={introProfile.j3StartVel}
          linearDamping={introProfile.finalLinearDamping}
          angularDamping={introProfile.finalAngularDamping}
          gravityScale={introProfile.finalGravityScale}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={introProfile.cardStartPos}
          linearVelocity={introProfile.cardStartVel}
          linearDamping={introProfile.finalLinearDamping}
          angularDamping={introProfile.finalAngularDamping}
          gravityScale={introProfile.finalGravityScale}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={CARD_VISUAL_SCALE}
            position={CARD_VISUAL_OFFSET}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              if (e.target.hasPointerCapture(e.pointerId)) {
                e.target.releasePointerCapture(e.pointerId);
              }
              drag(false);
            }}
            onPointerDown={(e) => {
              if (!card.current) return;
              completeIntro();
              e.target.setPointerCapture(e.pointerId);
              drag(
                dragOffset
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
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
                map={frontStickerTexture}
                transparent
                alphaTest={0.03}
                side={THREE.FrontSide}
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            </mesh>
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
                map={rollSafeTexture}
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
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
          </group>
        </RigidBody>
      </group>
      {isMobile ? (
        <mesh ref={band} renderOrder={1000}>
          <meshLineGeometry />
          <meshLineMaterial
            color={shouldUseBandTexture ? "#ffffff" : bandColor}
            map={shouldUseBandTexture ? lanyardBandTexture : null}
            useMap={shouldUseBandTexture ? 1 : 0}
            repeat={bandRepeat}
            depthTest={false}
            depthWrite={false}
            transparent
            opacity={1}
            alphaTest={0.02}
            resolution={isMobile ? [1000, 2000] : [1000, 1000]}
            lineWidth={effectiveBandWidth}
          />
        </mesh>
      ) : (
        <mesh ref={desktopStrap} geometry={desktopStrapState.geometry}>
          <meshPhysicalMaterial
            ref={desktopStrapMaterial}
            color={shouldUseBandTexture ? "#4a4a4a" : bandColor}
            map={shouldUseBandTexture ? lanyardBandTexture : null}
            bumpMap={shouldUseBandTexture ? lanyardBandTexture : null}
            bumpScale={shouldUseBandTexture ? 0.09 : 0}
            transparent
            opacity={1}
            alphaTest={0.02}
            side={THREE.DoubleSide}
            roughness={0.97}
            metalness={0}
            clearcoat={0}
            clearcoatRoughness={1}
            envMapIntensity={0.12}
            depthTest
            depthWrite
          />
        </mesh>
      )}
    </>
  );
}
