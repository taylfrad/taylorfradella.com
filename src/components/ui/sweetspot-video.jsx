import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp, VIDEO_FONT_STACK } from "./video-stage";

const SS_GREEN = "#22c55e";
const SS_GREEN_DARK = "#16a34a";
const SS_GREEN_LIGHT = "#4ade80";
const SS_BG = "#0a0f0a";
const SS_WHITE = "#f5f5f7";
const SS_DIM = "rgba(210,220,210,0.5)";
const SS_FONT = VIDEO_FONT_STACK;

function SSMonogram({ size = 100, glow = 0 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: `linear-gradient(145deg, ${SS_GREEN_LIGHT}, ${SS_GREEN} 55%, ${SS_GREEN_DARK})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(34,197,94,${0.5 * glow}), 0 0 ${70 * glow}px rgba(34,197,94,${0.18 * glow}), 0 8px 30px rgba(0,0,0,0.5)`
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
        fontFamily: SS_FONT, lineHeight: 1, letterSpacing: "0.03em",
        position: "relative", zIndex: 1,
      }}>SS</span>
    </div>
  );
}

// Scene 1: Logo Reveal
function SceneLogoSS() {
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
          <SSMonogram size={48} glow={glowAmt} />
        </div>
        <div style={{
          fontSize: 28, fontWeight: 700, color: SS_WHITE,
          letterSpacing: `${tracking}em`, fontFamily: SS_FONT, lineHeight: 1,
          opacity: nameOp, transform: `translateX(${nameX}px)`,
        }}>SweetSpot</div>
      </div>
      <div style={{
        marginTop: 10, fontSize: 8, fontWeight: 400, color: SS_DIM, fontFamily: SS_FONT,
        letterSpacing: "0.25em", textTransform: "uppercase",
        opacity: subOp, transform: `translateY(${subY}px)`,
      }}>Intelligent Glucose Monitoring</div>
    </div>
  );
}

// Scene 2: Feature Words
function SceneWordsSS() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Monitor.", delay: 0.15, color: SS_WHITE },
    { text: "Analyze.", delay: 0.6, color: SS_WHITE },
    { text: "Predict.", delay: 1.05, color: SS_GREEN_LIGHT },
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
            fontFamily: SS_FONT, letterSpacing: "-0.02em",
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Scene 3: Mini Dashboard
function SceneDashboard() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 100, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 ? Math.sin((t - 0.7) * 2) * 3 : 0;
  const lblOp = animate({ from: 0, to: 1, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const lblY = animate({ from: 12, to: 0, start: 1.4, end: 1.9, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  // Mini chart
  const pts = [120, 135, 128, 142, 155, 148, 130, 118, 125, 138, 145, 132, 120, 115, 128, 140];
  const cW = 140, cH = 40, minV = 90, maxV = 180;
  const pathD = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * cW;
    const y = 2 + (1 - (v - minV) / (maxV - minV)) * (cH - 4);
    return (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }).join(" ");

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
          width: 170, borderRadius: 12, overflow: "hidden",
          background: "#141a14", border: "1px solid rgba(34,197,94,0.15)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
        }}>
          <div style={{
            padding: "8px 10px 6px",
            borderBottom: "1px solid rgba(34,197,94,0.1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 6, color: SS_DIM, fontFamily: SS_FONT, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>
                Current
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: SS_GREEN, fontFamily: SS_FONT, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>128</span>
                <span style={{ fontSize: 8, fontWeight: 500, color: SS_DIM, fontFamily: SS_FONT }}>mg/dL</span>
              </div>
            </div>
            <div style={{
              background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 8, padding: "2px 6px",
              fontSize: 7, fontWeight: 600, color: SS_GREEN, fontFamily: SS_FONT,
            }}>In Range</div>
          </div>
          <div style={{ padding: "6px 10px" }}>
            <div style={{ fontSize: 6, color: SS_DIM, fontFamily: SS_FONT, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
              Trend
            </div>
            <svg width={cW} height={cH} viewBox={`0 0 ${cW} ${cH}`} style={{ display: "block" }}>
              <path d={pathD} fill="none" stroke={SS_GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" }} />
              <circle cx={cW} cy={2 + (1 - (140 - minV) / (maxV - minV)) * (cH - 4)} r="3" fill={SS_GREEN} stroke="#141a14" strokeWidth="1.5" />
            </svg>
          </div>
          <div style={{
            padding: "6px 10px 8px",
            borderTop: "1px solid rgba(34,197,94,0.08)",
            display: "flex", justifyContent: "space-between",
          }}>
            {[{ l: "Avg", v: "132" }, { l: "Low", v: "115" }, { l: "High", v: "155" }, { l: "TIR", v: "87%" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 5, color: SS_DIM, fontFamily: SS_FONT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 1 }}>{s.l}</div>
                <div style={{ fontSize: 8, fontWeight: 600, color: SS_WHITE, fontFamily: SS_FONT, fontVariantNumeric: "tabular-nums" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, textAlign: "center", opacity: lblOp, transform: `translateY(${lblY}px)` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SS_WHITE, fontFamily: SS_FONT }}>Real-time glucose</div>
        <div style={{ fontSize: 8, fontWeight: 400, color: SS_DIM, fontFamily: SS_FONT, marginTop: 3 }}>Dexcom API + Raspberry Pi</div>
      </div>
    </div>
  );
}

// Scene 4: AI Insights
function SceneAI() {
  const { localTime: t, duration: d } = useSprite();
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const items = ["Patterns", "Predict", "Insights"];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: SS_DIM, fontFamily: SS_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          Artificial Intelligence
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: SS_WHITE, fontFamily: SS_FONT, letterSpacing: "-0.025em" }}>
          AI Health Insights
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {items.map((title, i) => {
          const delay = 0.4 + i * 0.22;
          const pOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
          const pY = animate({ from: 30, to: 0, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          return (
            <div key={i} style={{ opacity: pOp, transform: `translateY(${pY}px)` }}>
              <div style={{
                width: 72, borderRadius: 10,
                background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)",
                padding: "12px 6px", textAlign: "center",
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{["\u{1F4CA}", "\u{1F52E}", "\u{1F4A1}"][i]}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: SS_WHITE, fontFamily: SS_FONT }}>{title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 5: Hardware Pipeline
function SceneHardware() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const stack = ["Dexcom", "Pi", "Python", "Grok"];
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: SS_DIM, fontFamily: SS_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          Data Pipeline
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: SS_WHITE, fontFamily: SS_FONT, letterSpacing: "-0.025em" }}>
          End-to-End
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {stack.map((label, i) => {
          const delay = 0.4 + i * 0.2;
          const sOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.35, ease: Easing.easeOutCubic })(t);
          const sSc = animate({ from: 0.7, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutBack })(t);
          const arrowOp = animate({ from: 0, to: 1, start: delay + 0.2, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          const isLast = i === stack.length - 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ opacity: sOp, transform: `scale(${sSc})`, textAlign: "center" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: isLast ? "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.06))" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isLast ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: SS_WHITE, fontFamily: SS_FONT, lineHeight: 1.2 }}>{label}</div>
                </div>
              </div>
              {!isLast && (
                <div style={{ opacity: arrowOp, padding: "0 3px", color: SS_GREEN, fontSize: 9, fontWeight: 300 }}>&#8594;</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEndSS() {
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
        <SSMonogram size={40} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: SS_WHITE, fontFamily: SS_FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        Smarter health,<br />in real time.
      </div>
    </div>
  );
}

// Animated background
function AnimatedBGSS() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.22) * 18;
  const y = 50 + Math.cos(t * 0.32) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(34,197,94,0.07) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

function SweetSpotScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: SS_BG, overflow: "hidden" }}>
      <AnimatedBGSS />
      <Sprite start={0.2} end={3.3}><SceneLogoSS /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneWordsSS /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneDashboard /></Sprite>
      <Sprite start={8.2} end={11.5}><SceneAI /></Sprite>
      <Sprite start={11.0} end={13.8}><SceneHardware /></Sprite>
      <Sprite start={13.3} end={14.8}><SceneEndSS /></Sprite>
    </div>
  );
}

export default function SweetSpotVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <SweetSpotScenes />
    </CardStage>
  );
}
