import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp, VIDEO_FONT_STACK } from "./video-stage";

const RED = "#b3363d";
const RED_DARK = "#8a2329";
const RED_LIGHT = "#d44a52";
const FONT = VIDEO_FONT_STACK;

function WLogo({ size = 80, glow = 0 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: `linear-gradient(145deg, ${RED_LIGHT}, ${RED} 60%, ${RED_DARK})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(179,54,61,${0.55 * glow}), 0 0 ${70 * glow}px rgba(179,54,61,${0.2 * glow}), 0 8px 30px rgba(0,0,0,0.4)`
        : "0 8px 30px rgba(0,0,0,0.4)",
      flexShrink: 0,
    }}>
      <span style={{
        color: "#fff", fontSize: size * 0.48, fontWeight: 700,
        fontFamily: FONT, lineHeight: 1,
      }}>W</span>
    </div>
  );
}

// Scene 1: Logo Reveal
function SceneLogo() {
  const { localTime: t, duration: d } = useSprite();
  const iconScale = animate({ from: 0, to: 1, start: 0, end: 0.8, ease: Easing.easeOutBack })(t);
  const iconOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutQuad })(t);
  const glowAmt = clamp(animate({ from: 0, to: 1, start: 0.5, end: 1.0, ease: Easing.easeOutQuad })(t), 0, 1);
  const wordOp = animate({ from: 0, to: 1, start: 0.7, end: 1.3, ease: Easing.easeOutCubic })(t);
  const wordX = animate({ from: 30, to: 0, start: 0.7, end: 1.4, ease: Easing.easeOutCubic })(t);
  const tracking = animate({ from: 0.3, to: 0.14, start: 0.7, end: 1.5, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);
  const exitScale = animate({ from: 1, to: 0.92, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 14, opacity: exitOp, transform: `scale(${exitScale})`,
    }}>
      <div style={{ transform: `scale(${iconScale})`, opacity: iconOp }}>
        <WLogo size={48} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 32, fontWeight: 700, color: "#fff",
        letterSpacing: `${tracking}em`, fontFamily: FONT,
        opacity: wordOp, transform: `translateX(${wordX}px)`,
      }}>WORKLY</div>
    </div>
  );
}

// Scene 2: Feature Words
function SceneWords() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Swipe.", delay: 0.2, color: "#fff" },
    { text: "Match.", delay: 0.6, color: "#fff" },
    { text: "Apply.", delay: 1.0, color: RED_LIGHT },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 16, opacity: exitOp,
    }}>
      {words.map((w, i) => {
        const op = animate({ from: 0, to: 1, start: w.delay, end: w.delay + 0.3, ease: Easing.easeOutCubic })(t);
        const sc = animate({ from: 0.6, to: 1, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutBack })(t);
        const y = animate({ from: 30, to: 0, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutCubic })(t);
        return (
          <div key={i} style={{
            fontSize: 32, fontWeight: 700, color: w.color,
            fontFamily: FONT, letterSpacing: "-0.02em",
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Mini swipe card for the bento cell
function MiniSwipeCard() {
  return (
    <div style={{
      width: 140, background: "#fff", borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
    }}>
      <div style={{
        height: 48, position: "relative",
        background: `linear-gradient(140deg, ${RED_LIGHT} 0%, ${RED} 40%, ${RED_DARK} 100%)`,
        padding: 6,
      }}>
        <div style={{
          position: "relative", zIndex: 1,
          background: "rgba(0,0,0,0.22)", borderRadius: 4,
          padding: "2px 6px", fontSize: 7, color: "#fff",
          fontWeight: 600, fontFamily: FONT,
          display: "inline-flex", alignItems: "center", gap: 3,
        }}>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.7 }} />
          Senior
        </div>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1a1a", fontFamily: FONT, marginBottom: 3, lineHeight: 1.2 }}>
          Sr. Software Engineer
        </div>
        <div style={{ fontSize: 7, color: "#888", fontFamily: FONT, marginBottom: 6 }}>
          TechCorp &middot; San Francisco
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
          {["React", "Node", "Py"].map((tag, i) => (
            <div key={i} style={{
              padding: "2px 5px", borderRadius: 6,
              border: "1px solid #e5e5e5", fontSize: 7,
              color: "#666", fontFamily: FONT, fontWeight: 500,
            }}>{tag}</div>
          ))}
        </div>
        <div style={{ textAlign: "right", fontSize: 9, fontWeight: 700, color: RED, fontFamily: FONT }}>
          94% Match
        </div>
      </div>
    </div>
  );
}

function MiniBackCard() {
  return (
    <div style={{
      width: 140, height: 120, background: "#f8f8f8", borderRadius: 12,
      overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    }}>
      <div style={{ height: 48, background: "linear-gradient(140deg, #999 0%, #777 100%)" }} />
      <div style={{ padding: "8px 10px" }}>
        <div style={{ height: 8, width: "72%", background: "#e2e2e2", borderRadius: 2, marginBottom: 4 }} />
        <div style={{ height: 6, width: "48%", background: "#ececec", borderRadius: 2, marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 3 }}>
          {[24, 20, 18].map((w, i) => (
            <div key={i} style={{ height: 10, width: w, background: "#f0f0f0", borderRadius: 5 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Scene 3: Swipe Card
function SceneSwipe() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 120, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 && t < 1.4 ? Math.sin((t - 0.7) * 3) * 3 : 0;
  const swipeX = animate({ from: 0, to: 400, start: 1.4, end: 2.2, ease: Easing.easeInQuad })(t);
  const swipeRot = animate({ from: 0, to: 18, start: 1.4, end: 2.2, ease: Easing.easeInCubic })(t);
  const swipeFade = animate({ from: 1, to: 0, start: 1.9, end: 2.2, ease: Easing.easeInCubic })(t);
  const stampOp = animate({ from: 0, to: 1, start: 1.3, end: 1.7, ease: Easing.easeOutCubic })(t);
  const stampSc = animate({ from: 1.6, to: 1, start: 1.3, end: 1.7, ease: Easing.easeOutCubic })(t);
  const backSc = animate({ from: 0.93, to: 0.98, start: 1.4, end: 2.4, ease: Easing.easeOutCubic })(t);
  const backOp = animate({ from: 0.35, to: 0.7, start: 1.4, end: 2.4, ease: Easing.easeOutCubic })(t);
  const backY = animate({ from: 12, to: 4, start: 1.4, end: 2.4, ease: Easing.easeOutCubic })(t);
  const txtOp = animate({ from: 0, to: 1, start: 2.5, end: 3.0, ease: Easing.easeOutCubic })(t);
  const txtY = animate({ from: 12, to: 0, start: 2.5, end: 3.0, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ position: "relative", width: 140, height: 150 }}>
        <div style={{
          position: "absolute", left: 0, top: backY,
          transform: `scale(${backSc})`, opacity: backOp, transformOrigin: "center top",
        }}>
          <MiniBackCard />
        </div>
        <div style={{
          position: "absolute", left: 0, top: 0,
          transform: `translateY(${cardY + floatY}px) translateX(${swipeX}px) rotate(${swipeRot}deg) scale(${cardSc})`,
          opacity: cardOp * swipeFade, transformOrigin: "center 80%",
        }}>
          <MiniSwipeCard />
          {t > 1.2 && (
            <div style={{
              position: "absolute", inset: 0, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", background: `rgba(34,197,94,${stampOp * 0.08})`,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 800, color: "#22c55e",
                fontFamily: FONT, letterSpacing: "0.06em",
                border: "2px solid #22c55e", borderRadius: 4, padding: "2px 8px",
                transform: `rotate(-18deg) scale(${stampSc})`, opacity: stampOp,
                boxShadow: "0 0 12px rgba(34,197,94,0.25)",
              }}>INTERESTED</div>
            </div>
          )}
        </div>
      </div>
      <div style={{
        marginTop: 14, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)",
        fontFamily: FONT, opacity: txtOp, transform: `translateY(${txtY}px)`,
        textAlign: "center",
      }}>
        Swipe right on your future
      </div>
    </div>
  );
}

// Scene 4: Match Score
function SceneMatch() {
  const { localTime: t, duration: d } = useSprite();
  const ringSize = 100;
  const strokeW = 7;
  const radius = (ringSize - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutCubic })(t);
  const ringSc = animate({ from: 0.75, to: 1, start: 0, end: 0.6, ease: Easing.easeOutBack })(t);
  const fillProg = animate({ from: 0, to: 0.94, start: 0.4, end: 1.8, ease: Easing.easeInOutCubic })(t);
  const dashOffset = circumference * (1 - fillProg);
  const count = Math.round(fillProg * 100);
  const donePulse = t > 1.8 ? 1 + Math.sin((t - 1.8) * 5) * 0.025 : 1;
  const glowOp = fillProg * 0.5;
  const labelOp = animate({ from: 0, to: 1, start: 1.9, end: 2.3, ease: Easing.easeOutCubic })(t);
  const labelY = animate({ from: 12, to: 0, start: 1.9, end: 2.3, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{
        position: "relative", width: ringSize, height: ringSize,
        opacity: ringOp, transform: `scale(${ringSc * donePulse})`,
      }}>
        <svg width={ringSize} height={ringSize} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} />
          <circle cx={ringSize / 2} cy={ringSize / 2} r={radius}
            fill="none" stroke={RED_LIGHT} strokeWidth={strokeW}
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 ${10 + glowOp * 14}px rgba(179,54,61,${glowOp}))` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 26, fontWeight: 700, color: "#fff",
            fontFamily: FONT, lineHeight: 1, fontVariantNumeric: "tabular-nums",
          }}>{count}%</span>
        </div>
      </div>
      <div style={{
        marginTop: 14, textAlign: "center",
        opacity: labelOp, transform: `translateY(${labelY}px)`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: FONT }}>AI-Powered Match</div>
        <div style={{ fontSize: 9, fontWeight: 400, color: "rgba(255,255,255,0.45)", fontFamily: FONT, marginTop: 4 }}>
          Tailored to your skills
        </div>
      </div>
    </div>
  );
}

// Scene 5: Cover Letter
function SceneCoverLetter() {
  const { localTime: t, duration: d } = useSprite();
  const docOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutCubic })(t);
  const docY = animate({ from: 30, to: 0, start: 0, end: 0.65, ease: Easing.easeOutCubic })(t);
  const docSc = animate({ from: 0.92, to: 1, start: 0, end: 0.65, ease: Easing.easeOutCubic })(t);
  const lines = [
    "Dear Hiring Manager,",
    "",
    "I am writing to express my",
    "strong interest in the Senior",
    "Software Engineer position...",
  ];
  const tagOp = animate({ from: 0, to: 1, start: 2.0, end: 2.4, ease: Easing.easeOutCubic })(t);
  const tagY = animate({ from: 12, to: 0, start: 2.0, end: 2.4, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{
        width: 160, background: "#fff", borderRadius: 8,
        padding: "12px 14px 14px",
        boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
        opacity: docOp, transform: `translateY(${docY}px) scale(${docSc})`,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          background: `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
          borderRadius: 4, padding: "2px 6px", marginBottom: 8,
        }}>
          <span style={{ fontSize: 8, color: "#fff", lineHeight: 1 }}>&#10022;</span>
          <span style={{ fontSize: 7, fontWeight: 600, color: "#fff", fontFamily: FONT }}>AI Generated</span>
        </div>
        {lines.map((line, i) => {
          const lineStart = 0.5 + i * 0.28;
          const lineOp = animate({ from: 0, to: 1, start: lineStart, end: lineStart + 0.22, ease: Easing.easeOutCubic })(t);
          if (!line) return <div key={i} style={{ height: 6 }} />;
          const isLast = i === lines.length - 1;
          const showCursor = isLast && lineOp > 0.05 && lineOp < 0.92;
          return (
            <div key={i} style={{
              fontSize: 8, color: "#333", fontFamily: FONT,
              lineHeight: 1.7, opacity: lineOp, display: "flex", alignItems: "baseline",
            }}>
              <span>{line}</span>
              {showCursor && (
                <span style={{
                  display: "inline-block", width: 1, height: 8,
                  background: RED, marginLeft: 1, flexShrink: 0,
                  animation: "blink 0.7s step-end infinite",
                }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 14, textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: FONT }}>One-tap cover letter</div>
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEnd() {
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
        <WLogo size={44} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>
        Job search,<br />reimagined.
      </div>
    </div>
  );
}

// Animated background
function AnimatedBG() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.25) * 18;
  const y = 50 + Math.cos(t * 0.35) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(179,54,61,0.07) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

// Main composition
function WorklyScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      <AnimatedBG />
      <Sprite start={0.2} end={3.3}><SceneLogo /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneWords /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneSwipe /></Sprite>
      <Sprite start={8.2} end={11.2}><SceneMatch /></Sprite>
      <Sprite start={10.7} end={13.5}><SceneCoverLetter /></Sprite>
      <Sprite start={13.0} end={14.8}><SceneEnd /></Sprite>
    </div>
  );
}

export default function WorklyVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <WorklyScenes />
    </CardStage>
  );
}
