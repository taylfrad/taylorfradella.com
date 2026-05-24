import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp, VIDEO_FONT_STACK } from "./video-stage";

const TC_GREEN = "#43A047";
const TC_GREEN_DARK = "#2E7D32";
const TC_GREEN_LIGHT = "#66BB6A";
const TC_BG = "#050908";
const TC_WHITE = "#f5f5f7";
const TC_DIM = "rgba(200,220,210,0.5)";
const TC_FONT = VIDEO_FONT_STACK;

function TCMonogram({ size = 100, glow = 0 }) {
  const r = size * 0.18;
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: `linear-gradient(145deg, ${TC_GREEN_LIGHT}, ${TC_GREEN} 55%, ${TC_GREEN_DARK})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(67,160,71,${0.5 * glow}), 0 0 ${70 * glow}px rgba(67,160,71,${0.18 * glow}), 0 8px 30px rgba(0,0,0,0.5)`
        : "0 8px 30px rgba(0,0,0,0.5)",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
        backgroundSize: `${size / 8}px ${size / 8}px`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 25% 18%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />
      <span style={{
        color: "#fff", fontSize: size * 0.36, fontWeight: 700,
        fontFamily: TC_FONT, lineHeight: 1, letterSpacing: "0.05em",
        position: "relative", zIndex: 1,
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }}>TC</span>
    </div>
  );
}

// Scene 1: Logo Reveal
function SceneLogoTC() {
  const { localTime: t, duration: d } = useSprite();
  const iconScale = animate({ from: 0, to: 1, start: 0, end: 0.8, ease: Easing.easeOutBack })(t);
  const iconOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutQuad })(t);
  const glowAmt = clamp(animate({ from: 0, to: 1, start: 0.5, end: 1.0, ease: Easing.easeOutQuad })(t), 0, 1);
  const nameOp = animate({ from: 0, to: 1, start: 0.6, end: 1.2, ease: Easing.easeOutCubic })(t);
  const nameX = animate({ from: 40, to: 0, start: 0.6, end: 1.3, ease: Easing.easeOutCubic })(t);
  const tracking = animate({ from: 0.3, to: 0.14, start: 0.6, end: 1.4, ease: Easing.easeOutCubic })(t);
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
          <TCMonogram size={48} glow={glowAmt} />
        </div>
        <div style={{ opacity: nameOp, transform: `translateX(${nameX}px)` }}>
          <div style={{
            fontSize: 28, fontWeight: 700, color: TC_WHITE,
            letterSpacing: `${tracking}em`, fontFamily: TC_FONT, lineHeight: 1,
          }}>TAYLCRAFT</div>
        </div>
      </div>
      <div style={{
        marginTop: 12, fontSize: 9, fontWeight: 400, color: TC_DIM, fontFamily: TC_FONT,
        letterSpacing: "0.25em", textTransform: "uppercase",
        opacity: subOp, transform: `translateY(${subY}px)`,
      }}>
        Private Minecraft Server
      </div>
    </div>
  );
}

// Scene 2: Feature Words
function SceneWordsTC() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Host.", delay: 0.15, color: TC_WHITE },
    { text: "Play.", delay: 0.6, color: TC_WHITE },
    { text: "Explore.", delay: 1.05, color: TC_GREEN_LIGHT },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 20, opacity: exitOp,
    }}>
      {words.map((w, i) => {
        const op = animate({ from: 0, to: 1, start: w.delay, end: w.delay + 0.3, ease: Easing.easeOutCubic })(t);
        const sc = animate({ from: 0.6, to: 1, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutBack })(t);
        const y = animate({ from: 40, to: 0, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutCubic })(t);
        return (
          <div key={i} style={{
            fontSize: 36, fontWeight: 700, color: w.color,
            fontFamily: TC_FONT, letterSpacing: "-0.02em",
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Scene 3: Server Status
function SceneStatus() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 120, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 ? Math.sin((t - 0.7) * 2) * 3 : 0;
  const lblOp = animate({ from: 0, to: 1, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const lblY = animate({ from: 15, to: 0, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

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
        <MiniStatusCard />
      </div>
      <div style={{ marginTop: 16, textAlign: "center", opacity: lblOp, transform: `translateY(${lblY}px)` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TC_WHITE, fontFamily: TC_FONT }}>
          Live server status
        </div>
      </div>
    </div>
  );
}

// Compact status card for the small bento card
function MiniStatusCard() {
  return (
    <div style={{
      width: 180, borderRadius: 12, overflow: "hidden",
      background: "#0d1510", border: "1px solid rgba(67,160,71,0.15)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
    }}>
      <div style={{
        padding: "10px 12px 8px",
        borderBottom: "1px solid rgba(67,160,71,0.1)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: 3,
            background: TC_GREEN, boxShadow: `0 0 6px ${TC_GREEN}88`,
          }} />
          <div style={{ fontSize: 10, fontWeight: 600, color: TC_WHITE, fontFamily: TC_FONT }}>Online</div>
        </div>
        <div style={{
          background: "rgba(67,160,71,0.12)", border: "1px solid rgba(67,160,71,0.3)",
          borderRadius: 10, padding: "2px 8px",
          fontSize: 8, fontWeight: 600, color: TC_GREEN, fontFamily: TC_FONT,
        }}>1.21.4</div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 8, color: TC_DIM, fontFamily: TC_FONT, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>
          Players
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: TC_GREEN, fontFamily: TC_FONT, lineHeight: 1 }}>4</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: TC_DIM, fontFamily: TC_FONT }}>/20</span>
        </div>
      </div>
    </div>
  );
}

// Scene 4: Features
function SceneFeatures() {
  const { localTime: t, duration: d } = useSprite();
  const features = ["Live Status", "Whitelist", "Dynmap"];
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.5, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: TC_DIM, fontFamily: TC_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 6 }}>
          Landing Page
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: TC_WHITE, fontFamily: TC_FONT, letterSpacing: "-0.025em" }}>
          Everything You Need
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {features.map((f, i) => {
          const delay = 0.4 + i * 0.22;
          const pOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
          const pY = animate({ from: 30, to: 0, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          return (
            <div key={i} style={{ opacity: pOp, transform: `translateY(${pY}px)` }}>
              <div style={{
                width: 80, borderRadius: 10,
                background: "rgba(67,160,71,0.04)", border: "1px solid rgba(67,160,71,0.12)",
                padding: "14px 8px", textAlign: "center",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, margin: "0 auto 8px",
                  background: `linear-gradient(135deg, ${TC_GREEN}22, ${TC_GREEN_DARK}15)`,
                  border: `1px solid ${TC_GREEN}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: TC_GREEN_LIGHT,
                }}>{["●", "◆", "◼"][i]}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: TC_WHITE, fontFamily: TC_FONT }}>{f}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 5: Infrastructure
function SceneInfra() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const stack = ["MC", "Node", "nginx", "Caddy"];
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: TC_DIM, fontFamily: TC_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 6 }}>
          Self-Hosted
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: TC_WHITE, fontFamily: TC_FONT, letterSpacing: "-0.025em" }}>
          Homelab Stack
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
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
                  width: 44, height: 44, borderRadius: 10,
                  background: isLast ? "linear-gradient(135deg, rgba(67,160,71,0.15), rgba(67,160,71,0.06))" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isLast ? "rgba(67,160,71,0.3)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: TC_WHITE, fontFamily: TC_FONT, lineHeight: 1.2 }}>{label}</div>
                </div>
              </div>
              {!isLast && (
                <div style={{ opacity: arrowOp, padding: "0 4px", color: TC_GREEN, fontSize: 10, fontWeight: 300 }}>
                  &#8594;
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEndTC() {
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
      <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, marginBottom: 14 }}>
        <TCMonogram size={40} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 16, fontWeight: 600, color: TC_WHITE, fontFamily: TC_FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        Your world,<br />always online.
      </div>
    </div>
  );
}

// Animated background
function AnimatedBGTC() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.22) * 18;
  const y = 50 + Math.cos(t * 0.32) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(67,160,71,0.07) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

// Main composition
function TaylCraftScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: TC_BG, overflow: "hidden" }}>
      <AnimatedBGTC />
      <Sprite start={0.2} end={3.3}><SceneLogoTC /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneWordsTC /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneStatus /></Sprite>
      <Sprite start={8.2} end={11.5}><SceneFeatures /></Sprite>
      <Sprite start={11.0} end={13.8}><SceneInfra /></Sprite>
      <Sprite start={13.3} end={14.8}><SceneEndTC /></Sprite>
    </div>
  );
}

// Exported hover video component
export default function TaylCraftVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <TaylCraftScenes />
    </CardStage>
  );
}
