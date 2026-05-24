import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp, VIDEO_FONT_STACK } from "./video-stage";

const LD_RED = "#c20000";
const LD_RED_DARK = "#8a0000";
const LD_RED_LIGHT = "#e63333";
const LD_BG = "#0a0000";
const LD_WHITE = "#f5f5f7";
const LD_DIM = "rgba(220,210,210,0.5)";
const LD_FONT = VIDEO_FONT_STACK;

function LDMonogram({ size = 100, glow = 0 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: `linear-gradient(145deg, ${LD_RED_LIGHT}, ${LD_RED} 55%, ${LD_RED_DARK})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(194,0,0,${0.5 * glow}), 0 0 ${70 * glow}px rgba(194,0,0,${0.2 * glow}), 0 8px 30px rgba(0,0,0,0.5)`
        : "0 8px 30px rgba(0,0,0,0.5)",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 25% 18%, rgba(255,255,255,0.15) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />
      <span style={{
        color: "#fff", fontSize: size * 0.36, fontWeight: 700,
        fontFamily: LD_FONT, lineHeight: 1, letterSpacing: "0.05em",
        position: "relative", zIndex: 1,
      }}>LD</span>
    </div>
  );
}

// Scene 1: Logo Reveal
function SceneLogoLD() {
  const { localTime: t, duration: d } = useSprite();
  const iconScale = animate({ from: 0, to: 1, start: 0, end: 0.8, ease: Easing.easeOutBack })(t);
  const iconOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutQuad })(t);
  const glowAmt = clamp(animate({ from: 0, to: 1, start: 0.5, end: 1.0, ease: Easing.easeOutQuad })(t), 0, 1);
  const nameOp = animate({ from: 0, to: 1, start: 0.6, end: 1.2, ease: Easing.easeOutCubic })(t);
  const nameX = animate({ from: 30, to: 0, start: 0.6, end: 1.3, ease: Easing.easeOutCubic })(t);
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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ transform: `scale(${iconScale})`, opacity: iconOp }}>
          <LDMonogram size={52} glow={glowAmt} />
        </div>
        <div style={{ opacity: nameOp, transform: `translateX(${nameX}px)` }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: LD_WHITE, letterSpacing: `${tracking}em`, fontFamily: LD_FONT, lineHeight: 1 }}>
            LIONS DEN
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: LD_DIM, letterSpacing: "0.32em", fontFamily: LD_FONT, marginTop: 4 }}>
            CINEMAS
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 14, fontSize: 9, fontWeight: 400, color: LD_DIM, fontFamily: LD_FONT,
        letterSpacing: "0.25em", textTransform: "uppercase",
        opacity: subOp, transform: `translateY(${subY}px)`,
      }}>Full-Stack Cinema Platform</div>
    </div>
  );
}

// Scene 2: Feature Words
function SceneWordsLD() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Browse.", delay: 0.15, color: LD_WHITE },
    { text: "Book.", delay: 0.6, color: LD_WHITE },
    { text: "Enjoy.", delay: 1.05, color: LD_RED_LIGHT },
  ];
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 24, opacity: exitOp,
    }}>
      {words.map((w, i) => {
        const op = animate({ from: 0, to: 1, start: w.delay, end: w.delay + 0.3, ease: Easing.easeOutCubic })(t);
        const sc = animate({ from: 0.6, to: 1, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutBack })(t);
        const y = animate({ from: 30, to: 0, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutCubic })(t);
        return (
          <div key={i} style={{
            fontSize: 42, fontWeight: 700, color: w.color,
            fontFamily: LD_FONT, letterSpacing: "-0.02em",
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Scene 3: Mini Ticket
function SceneTicket() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 120, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 ? Math.sin((t - 0.7) * 2) * 3 : 0;
  const lblOp = animate({ from: 0, to: 1, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const lblY = animate({ from: 12, to: 0, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{
        transform: `translateY(${cardY + floatY}px) scale(${cardSc})`, opacity: cardOp,
      }}>
        <div style={{
          width: 180, borderRadius: 12, overflow: "hidden",
          background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
        }}>
          <div style={{
            height: 56, position: "relative",
            background: `linear-gradient(140deg, ${LD_RED_DARK} 0%, ${LD_BG} 60%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 20 }}>&#127916;</div>
              <div style={{
                background: `linear-gradient(135deg, ${LD_RED}, ${LD_RED_DARK})`,
                borderRadius: 3, padding: "1px 6px",
                fontSize: 6, fontWeight: 600, color: "#fff", fontFamily: LD_FONT,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Now Showing</div>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 8px", position: "relative" }}>
            <div style={{ position: "absolute", left: -4, top: -3, width: 6, height: 6, borderRadius: 3, background: LD_BG }} />
            <div style={{ position: "absolute", right: -4, top: -3, width: 6, height: 6, borderRadius: 3, background: LD_BG }} />
          </div>
          <div style={{ padding: "10px 12px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: LD_WHITE, fontFamily: LD_FONT, marginBottom: 2 }}>
              The Dark Knight Returns
            </div>
            <div style={{ fontSize: 7, color: LD_DIM, fontFamily: LD_FONT, marginBottom: 8 }}>
              Aud. 3 &middot; 7:30 PM &middot; Tonight
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              {[{ l: "Seats", v: "F7, F8" }, { l: "Type", v: "Standard" }, { l: "Total", v: "$24" }].map((s, i) => (
                <div key={i} style={{ textAlign: i === 2 ? "right" : "left" }}>
                  <div style={{ fontSize: 6, color: LD_DIM, fontFamily: LD_FONT, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 1 }}>{s.l}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: i === 2 ? LD_RED_LIGHT : LD_WHITE, fontFamily: LD_FONT }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 1, justifyContent: "center", opacity: 0.25, marginTop: 4 }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: 10, background: LD_WHITE, borderRadius: 0.5 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, textAlign: "center", opacity: lblOp, transform: `translateY(${lblY}px)` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: LD_WHITE, fontFamily: LD_FONT }}>Seamless ticketing</div>
      </div>
    </div>
  );
}

// Scene 4: Cross-Platform
function ScenePlatforms() {
  const { localTime: t, duration: d } = useSprite();
  const items = [
    { label: "Mobile", icon: "\u{1F4F1}", sub: "iOS & Android" },
    { label: "Web", icon: "\u{1F5A5}\uFE0F", sub: "Responsive" },
    { label: "Admin", icon: "\u2699\uFE0F", sub: "Dashboard" },
  ];
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
        <div style={{ fontSize: 8, color: LD_DIM, fontFamily: LD_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          Multi-Platform
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: LD_WHITE, fontFamily: LD_FONT, letterSpacing: "-0.025em" }}>
          Every Screen
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {items.map((p, i) => {
          const delay = 0.4 + i * 0.22;
          const pOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
          const pY = animate({ from: 30, to: 0, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          return (
            <div key={i} style={{ opacity: pOp, transform: `translateY(${pY}px)` }}>
              <div style={{
                width: 88, borderRadius: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                padding: "14px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: LD_WHITE, fontFamily: LD_FONT, marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 7, color: LD_RED_LIGHT, fontFamily: LD_FONT, fontWeight: 600 }}>{p.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 5: Tech Stack Radial
function SceneTechStack() {
  const { localTime: t, duration: d } = useSprite();
  const stack = ["React Native", "Node.js", "Express", "PostgreSQL", "JWT", "REST"];
  const hdrOp = animate({ from: 0, to: 1, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0.1, end: 0.45, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const ringOp = animate({ from: 0, to: 1, start: 0.3, end: 0.7, ease: Easing.easeOutCubic })(t);
  const ringSc = animate({ from: 0.6, to: 1, start: 0.3, end: 0.7, ease: Easing.easeOutBack })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: LD_DIM, fontFamily: LD_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 4 }}>
          Architecture
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: LD_WHITE, fontFamily: LD_FONT }}>Built to Scale</div>
      </div>
      <div style={{
        position: "relative", width: 220, height: 120,
        opacity: ringOp, transform: `scale(${ringSc})`,
      }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${LD_RED}, ${LD_RED_DARK})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(194,0,0,0.3)",
        }}>
          <span style={{ color: "#fff", fontSize: 8, fontWeight: 700, fontFamily: LD_FONT }}>LD</span>
        </div>
        {stack.map((label, i) => {
          const angle = (i / stack.length) * Math.PI * 2 - Math.PI / 2;
          const cx = 110 + Math.cos(angle) * 88;
          const cy = 60 + Math.sin(angle) * 48;
          const delay = 0.5 + i * 0.1;
          const nOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.3, ease: Easing.easeOutCubic })(t);
          const nSc = animate({ from: 0.5, to: 1, start: delay, end: delay + 0.35, ease: Easing.easeOutBack })(t);
          return (
            <div key={i} style={{
              position: "absolute", left: cx, top: cy,
              transform: `translate(-50%, -50%) scale(${nSc})`, opacity: nOp, textAlign: "center",
            }}>
              <div style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "4px 8px", fontSize: 7, fontWeight: 600,
                color: LD_WHITE, fontFamily: LD_FONT, whiteSpace: "nowrap",
              }}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEndLD() {
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
        <LDMonogram size={44} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 18, fontWeight: 600, color: LD_WHITE, fontFamily: LD_FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        Your cinema,<br />connected.
      </div>
    </div>
  );
}

function AnimatedBGLD() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.22) * 18;
  const y = 50 + Math.cos(t * 0.32) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(194,0,0,0.08) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

function LionsDenScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: LD_BG, overflow: "hidden" }}>
      <AnimatedBGLD />
      <Sprite start={0.2} end={3.3}><SceneLogoLD /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneWordsLD /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneTicket /></Sprite>
      <Sprite start={8.2} end={11.5}><ScenePlatforms /></Sprite>
      <Sprite start={11.0} end={13.8}><SceneTechStack /></Sprite>
      <Sprite start={13.3} end={14.8}><SceneEndLD /></Sprite>
    </div>
  );
}

export default function LionsDenVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <LionsDenScenes />
    </CardStage>
  );
}
