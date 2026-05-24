import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp, VIDEO_FONT_STACK } from "./video-stage";

const FF_CORAL = "#F97066";
const FF_CORAL_DARK = "#DC2626";
const FF_CORAL_LIGHT = "#FCA5A1";
const FF_VIOLET = "#A855F7";
const FF_VIOLET_LIGHT = "#C084FC";
const FF_BG = "#0C0A14";
const FF_WHITE = "#f5f5f7";
const FF_DIM = "rgba(220,210,230,0.5)";
const FF_FONT = VIDEO_FONT_STACK;
const FF_MONO = "'JetBrains Mono', monospace";

function FFMonogram({ size = 100, glow = 0 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: `linear-gradient(145deg, ${FF_CORAL_LIGHT}, ${FF_CORAL} 55%, ${FF_CORAL_DARK})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(249,112,102,${0.5 * glow}), 0 0 ${70 * glow}px rgba(249,112,102,${0.18 * glow}), 0 8px 30px rgba(0,0,0,0.5)`
        : "0 8px 30px rgba(0,0,0,0.5)",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 25% 18%, rgba(255,255,255,0.18) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />
      <span style={{
        color: "#fff", fontSize: size * 0.32, fontWeight: 700,
        fontFamily: FF_FONT, lineHeight: 1, letterSpacing: "0.03em",
        position: "relative", zIndex: 1,
      }}>FF</span>
    </div>
  );
}

// Scene 1: Logo Reveal
function SceneLogoFF() {
  const { localTime: t, duration: d } = useSprite();
  const iconScale = animate({ from: 0, to: 1, start: 0, end: 0.8, ease: Easing.easeOutBack })(t);
  const iconOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutQuad })(t);
  const glowAmt = clamp(animate({ from: 0, to: 1, start: 0.5, end: 1.0, ease: Easing.easeOutQuad })(t), 0, 1);
  const nameOp = animate({ from: 0, to: 1, start: 0.6, end: 1.2, ease: Easing.easeOutCubic })(t);
  const nameX = animate({ from: 30, to: 0, start: 0.6, end: 1.3, ease: Easing.easeOutCubic })(t);
  const tracking = animate({ from: 0.25, to: 0.08, start: 0.6, end: 1.4, ease: Easing.easeOutCubic })(t);
  const subOp = animate({ from: 0, to: 1, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const subY = animate({ from: 12, to: 0, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);
  const exitScale = animate({ from: 1, to: 0.92, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp, transform: `scale(${exitScale})`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ transform: `scale(${iconScale})`, opacity: iconOp }}>
          <FFMonogram size={48} glow={glowAmt} />
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700, color: FF_WHITE,
          letterSpacing: `${tracking}em`, fontFamily: FF_FONT, lineHeight: 1,
          opacity: nameOp, transform: `translateX(${nameX}px)`,
        }}>FieldFlow</div>
      </div>
      <div style={{
        marginTop: 10, fontSize: 8, fontWeight: 400, color: FF_DIM, fontFamily: FF_FONT,
        letterSpacing: "0.25em", textTransform: "uppercase",
        opacity: subOp, transform: `translateY(${subY}px)`,
      }}>Offline-First Field Service PWA</div>
    </div>
  );
}

// Scene 2: Feature Words
function SceneWordsFF() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Capture.", delay: 0.15, color: FF_WHITE },
    { text: "Dictate.", delay: 0.6, color: FF_WHITE },
    { text: "Sync.", delay: 1.05, color: FF_CORAL_LIGHT },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 14, opacity: exitOp,
    }}>
      {words.map((w, i) => {
        const op = animate({ from: 0, to: 1, start: w.delay, end: w.delay + 0.3, ease: Easing.easeOutCubic })(t);
        const sc = animate({ from: 0.6, to: 1, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutBack })(t);
        const y = animate({ from: 30, to: 0, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutCubic })(t);
        return (
          <div key={i} style={{
            fontSize: 28, fontWeight: 700, color: w.color,
            fontFamily: FF_FONT, letterSpacing: "-0.02em",
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Scene 3: Mini Voice Pipeline Card
function SceneVoicePipeline() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 100, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 ? Math.sin((t - 0.7) * 2) * 3 : 0;
  const lblOp = animate({ from: 0, to: 1, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const lblY = animate({ from: 12, to: 0, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  // Waveform bars
  const barCount = 16;
  const gradientBars = 10;
  const waveProgress = clamp(animate({ from: 0, to: 1, start: 0.6, end: 1.8, ease: Easing.easeOutCubic })(t), 0, 1);
  const textOp = animate({ from: 0, to: 1, start: 1.0, end: 1.5, ease: Easing.easeOutCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{
        transform: `translateY(${cardY + floatY}px) scale(${cardSc})`,
        opacity: cardOp, position: "relative",
      }}>
        <div style={{
          width: 185, borderRadius: 12, overflow: "hidden",
          background: "#12101c", border: "1px solid rgba(249,112,102,0.15)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
        }}>
          {/* Header */}
          <div style={{
            padding: "8px 10px 6px",
            borderBottom: "1px solid rgba(249,112,102,0.1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 14, height: 14, borderRadius: 4,
                background: `linear-gradient(135deg, ${FF_CORAL}, ${FF_VIOLET})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, color: "#fff",
              }}>&#9834;</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: FF_WHITE, fontFamily: FF_FONT }}>Voice Pipeline</div>
            </div>
            <div style={{
              background: "rgba(249,112,102,0.12)", border: "1px solid rgba(249,112,102,0.3)",
              borderRadius: 8, padding: "2px 6px",
              fontSize: 6, fontWeight: 600, color: FF_CORAL, fontFamily: FF_FONT,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>RECORDING</div>
          </div>

          {/* Waveform */}
          <div style={{ padding: "8px 10px 6px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 2, height: 24,
            }}>
              {Array.from({ length: barCount }).map((_, i) => {
                const visibleFraction = clamp(waveProgress * barCount - i, 0, 1);
                const barH = 4 + Math.sin(i * 0.9 + t * 4) * 6 + 6;
                const isGradient = i < gradientBars;
                return (
                  <div key={i} style={{
                    width: 3, height: barH * visibleFraction,
                    borderRadius: 1.5,
                    background: isGradient
                      ? `linear-gradient(180deg, ${FF_CORAL}, ${FF_VIOLET})`
                      : FF_DIM,
                    opacity: isGradient ? 0.9 : 0.35,
                    transition: "height 0.1s ease",
                  }} />
                );
              })}
            </div>
          </div>

          {/* Transcription */}
          <div style={{
            padding: "4px 10px 8px",
            borderTop: "1px solid rgba(249,112,102,0.08)",
          }}>
            <div style={{
              fontSize: 7, color: FF_WHITE, fontFamily: FF_MONO,
              lineHeight: 1.5, opacity: textOp,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
            }}>
              Replaced condenser fan motor...
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, textAlign: "center", opacity: lblOp, transform: `translateY(${lblY}px)` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: FF_WHITE, fontFamily: FF_FONT }}>AI voice-to-form</div>
      </div>
    </div>
  );
}

// Scene 4: Features
function SceneFeaturesFF() {
  const { localTime: t, duration: d } = useSprite();
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  const features = [
    { label: "wa-sqlite", sub: "Client DB", color: FF_CORAL },
    { label: "Auto", sub: "Sync Engine", color: FF_VIOLET },
    { label: "44px+", sub: "Touch Targets", color: "#FBBF24" },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: FF_DIM, fontFamily: FF_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          PWA
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: FF_WHITE, fontFamily: FF_FONT, letterSpacing: "-0.025em" }}>
          Built for the Field
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {features.map((f, i) => {
          const delay = 0.4 + i * 0.22;
          const pOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
          const pY = animate({ from: 30, to: 0, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          return (
            <div key={i} style={{ opacity: pOp, transform: `translateY(${pY}px)` }}>
              <div style={{
                width: 72, borderRadius: 10,
                background: `${f.color}08`, border: `1px solid ${f.color}20`,
                padding: "12px 6px", textAlign: "center",
              }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: f.color,
                  fontFamily: FF_MONO, marginBottom: 4, lineHeight: 1.2,
                }}>{f.label}</div>
                <div style={{ fontSize: 8, fontWeight: 500, color: FF_DIM, fontFamily: FF_FONT }}>{f.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 5: Architecture Pipeline
function ScenePipeline() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const stack = ["Next.js", "React", "sqlite", "Whisper", "GPT"];
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: FF_DIM, fontFamily: FF_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          Senior Capstone
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: FF_WHITE, fontFamily: FF_FONT, letterSpacing: "-0.025em" }}>
          End-to-End
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {stack.map((label, i) => {
          const delay = 0.4 + i * 0.18;
          const sOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.35, ease: Easing.easeOutCubic })(t);
          const sSc = animate({ from: 0.7, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutBack })(t);
          const arrowOp = animate({ from: 0, to: 1, start: delay + 0.2, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          const isLast = i === stack.length - 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ opacity: sOp, transform: `scale(${sSc})`, textAlign: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: isLast
                    ? `linear-gradient(135deg, rgba(249,112,102,0.15), rgba(168,85,247,0.1))`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isLast ? "rgba(249,112,102,0.3)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    fontSize: 6.5, fontWeight: 700, color: isLast ? FF_CORAL_LIGHT : FF_WHITE,
                    fontFamily: FF_FONT, lineHeight: 1.2,
                  }}>{label}</div>
                </div>
              </div>
              {!isLast && (
                <div style={{ opacity: arrowOp, padding: "0 2px", color: FF_CORAL, fontSize: 9, fontWeight: 300 }}>&#8594;</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEndFF() {
  const { localTime: t, duration: d } = useSprite();
  const logoOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutCubic })(t);
  const logoSc = animate({ from: 0.7, to: 1, start: 0, end: 0.6, ease: Easing.easeOutBack })(t);
  const glowAmt = animate({ from: 0, to: 0.9, start: 0.3, end: 0.8, ease: Easing.easeOutCubic })(t);
  const tagOp = animate({ from: 0, to: 1, start: 0.4, end: 0.85, ease: Easing.easeOutCubic })(t);
  const tagY = animate({ from: 20, to: 0, start: 0.4, end: 0.85, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, marginBottom: 12 }}>
        <FFMonogram size={40} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: FF_WHITE, fontFamily: FF_FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        Fieldwork, streamlined.
      </div>
    </div>
  );
}

// Animated background
function AnimatedBGFF() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.22) * 18;
  const y = 50 + Math.cos(t * 0.32) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(249,112,102,0.07) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

function FieldFlowScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: FF_BG, overflow: "hidden" }}>
      <AnimatedBGFF />
      <Sprite start={0.2} end={3.3}><SceneLogoFF /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneWordsFF /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneVoicePipeline /></Sprite>
      <Sprite start={8.2} end={11.5}><SceneFeaturesFF /></Sprite>
      <Sprite start={11.0} end={13.8}><ScenePipeline /></Sprite>
      <Sprite start={13.3} end={14.8}><SceneEndFF /></Sprite>
    </div>
  );
}

export default function FieldFlowVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <FieldFlowScenes />
    </CardStage>
  );
}
