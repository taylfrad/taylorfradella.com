import { CardStage, Sprite, useSprite, useTime, animate, Easing, clamp } from "./video-stage";

const TF_NAVY = "#0F172A";
const TF_TEAL = "#4A8EB7";
const TF_CYAN = "#2C6F85";
const TF_WHITE = "#f5f5f7";
const TF_DIM = "rgba(209,213,219,0.55)";
const TF_FONT = "'Inter', -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const P_BLUE = "#0071e3";
const P_RED = "#c20000";
const P_GREEN = "#22c55e";
const P_WORKLY = "#b3363d";
const P_TAYLCRAFT = "#43A047";
const P_FRADELLA = "#7C3AED";
const P_FIELDFLOW = "#F97066";

function TFMonogram({ size = 100, glow = 0 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.24,
      background: `linear-gradient(145deg, ${TF_TEAL}, ${TF_CYAN} 60%, #1e5a8a)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: glow > 0
        ? `0 0 ${30 * glow}px rgba(74,142,183,${0.5 * glow}), 0 0 ${70 * glow}px rgba(44,111,133,${0.2 * glow}), 0 8px 30px rgba(0,0,0,0.4)`
        : "0 8px 30px rgba(0,0,0,0.4)",
      flexShrink: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 25% 18%, rgba(255,255,255,0.18) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />
      <span style={{
        color: "#fff", fontSize: size * 0.38, fontWeight: 700,
        fontFamily: TF_FONT, lineHeight: 1, letterSpacing: "0.04em",
        position: "relative", zIndex: 1,
      }}>TF</span>
    </div>
  );
}

// Scene 1: Name Reveal
function SceneName() {
  const { localTime: t, duration: d } = useSprite();
  const iconScale = animate({ from: 0, to: 1, start: 0, end: 0.8, ease: Easing.easeOutBack })(t);
  const iconOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutQuad })(t);
  const glowAmt = clamp(animate({ from: 0, to: 1, start: 0.5, end: 1.0, ease: Easing.easeOutQuad })(t), 0, 1);
  const nameOp = animate({ from: 0, to: 1, start: 0.7, end: 1.3, ease: Easing.easeOutCubic })(t);
  const nameX = animate({ from: 30, to: 0, start: 0.7, end: 1.4, ease: Easing.easeOutCubic })(t);
  const tracking = animate({ from: 0.28, to: 0.12, start: 0.7, end: 1.5, ease: Easing.easeOutCubic })(t);
  const subOp = animate({ from: 0, to: 1, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const subY = animate({ from: 12, to: 0, start: 1.5, end: 2.0, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);
  const exitScale = animate({ from: 1, to: 0.92, start: d - 0.6, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp, transform: `scale(${exitScale})`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ transform: `scale(${iconScale})`, opacity: iconOp }}>
          <TFMonogram size={64} glow={glowAmt} />
        </div>
        <div style={{ opacity: nameOp, transform: `translateX(${nameX}px)` }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: TF_WHITE, letterSpacing: `${tracking}em`, fontFamily: TF_FONT, lineHeight: 1 }}>TAYLOR</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: TF_WHITE, letterSpacing: `${tracking}em`, fontFamily: TF_FONT, lineHeight: 1 }}>FRADELLA</div>
        </div>
      </div>
      <div style={{
        marginTop: 14, fontSize: 11, fontWeight: 400, color: TF_DIM, fontFamily: TF_FONT,
        letterSpacing: "0.28em", textTransform: "uppercase",
        opacity: subOp, transform: `translateY(${subY}px)`,
      }}>UI Engineer &middot; Portfolio</div>
    </div>
  );
}

// Scene 2: Tagline Words
function SceneTagline() {
  const { localTime: t, duration: d } = useSprite();
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);
  const words = [
    { text: "Thoughtful UX.", delay: 0.15, color: TF_WHITE },
    { text: "Clean code.", delay: 0.6, color: TF_WHITE },
    { text: "Fast apps.", delay: 1.05, color: TF_TEAL },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 6, opacity: exitOp,
    }}>
      {words.map((w, i) => {
        const op = animate({ from: 0, to: 1, start: w.delay, end: w.delay + 0.3, ease: Easing.easeOutCubic })(t);
        const sc = animate({ from: 0.6, to: 1, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutBack })(t);
        const y = animate({ from: 30, to: 0, start: w.delay, end: w.delay + 0.45, ease: Easing.easeOutCubic })(t);
        return (
          <div key={i} style={{
            fontSize: 42, fontWeight: 700, color: w.color,
            fontFamily: TF_FONT, letterSpacing: "-0.025em", lineHeight: 1.05,
            opacity: op, transform: `scale(${sc}) translateY(${y}px)`,
          }}>{w.text}</div>
        );
      })}
    </div>
  );
}

// Scene 3: Glass Surface Demo
function SceneGlass() {
  const { localTime: t, duration: d } = useSprite();
  const cardY = animate({ from: 100, to: 0, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const cardOp = animate({ from: 0, to: 1, start: 0, end: 0.45, ease: Easing.easeOutCubic })(t);
  const cardSc = animate({ from: 0.88, to: 1, start: 0, end: 0.7, ease: Easing.easeOutCubic })(t);
  const floatY = t > 0.7 ? Math.sin((t - 0.7) * 2.2) * 3 : 0;
  const labelOp = animate({ from: 0, to: 1, start: 1.2, end: 1.7, ease: Easing.easeOutCubic })(t);
  const labelY = animate({ from: 12, to: 0, start: 1.2, end: 1.7, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{
        transform: `translateY(${cardY + floatY}px) scale(${cardSc})`, opacity: cardOp, position: "relative",
      }}>
        <div style={{
          width: 220, borderRadius: 14, overflow: "hidden",
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.35), inset 0 0.5px 0 rgba(255,255,255,0.1)",
        }}>
          <div style={{
            height: 48, background: "linear-gradient(135deg, rgba(74,142,183,0.25), rgba(44,111,133,0.15))",
            padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.12)", borderRadius: 4, padding: "2px 7px",
              fontSize: 8, color: TF_WHITE, fontWeight: 600, fontFamily: TF_FONT,
              display: "inline-flex", alignItems: "center", gap: 4,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: "#34d399" }} />
              Live
            </div>
          </div>
          <div style={{ padding: "10px 14px 14px" }}>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", fontFamily: TF_FONT, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 4 }}>
              Selected Work
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: TF_WHITE, fontFamily: TF_FONT, marginBottom: 4, lineHeight: 1.2 }}>
              Personal Portfolio
            </div>
            <div style={{ fontSize: 8, color: TF_DIM, fontFamily: TF_FONT, marginBottom: 8, lineHeight: 1.5 }}>
              Liquid glass, physics hero, motion
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["React", "Three.js", "Motion"].map((tag, i) => (
                <div key={i} style={{
                  padding: "2px 6px", borderRadius: 8,
                  border: "1px solid rgba(74,142,183,0.4)", fontSize: 7,
                  color: TF_TEAL, fontFamily: TF_FONT, fontWeight: 500,
                  background: "rgba(74,142,183,0.08)",
                }}>{tag}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: "center", opacity: labelOp, transform: `translateY(${labelY}px)` }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: TF_WHITE, fontFamily: TF_FONT }}>Liquid Glass UI</div>
        <div style={{ fontSize: 9, fontWeight: 400, color: TF_DIM, fontFamily: TF_FONT, marginTop: 4 }}>Frosted surfaces with graceful fallbacks</div>
      </div>
    </div>
  );
}

// Scene 4: Skills
function SceneSkills() {
  const { localTime: t, duration: d } = useSprite();
  const pillars = [
    { title: "UI", accent: P_BLUE },
    { title: "Full-Stack", accent: "#16a34a" },
    { title: "Quality", accent: "#d97706" },
    { title: "Cloud", accent: "#7c3aed" },
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
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)`, marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 8, color: TF_DIM, fontFamily: TF_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 6 }}>
          Capabilities
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TF_WHITE, fontFamily: TF_FONT }}>Skills</div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {pillars.map((p, i) => {
          const delay = 0.4 + i * 0.18;
          const pOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.4, ease: Easing.easeOutCubic })(t);
          const pY = animate({ from: 30, to: 0, start: delay, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          const barSc = animate({ from: 0, to: 1, start: delay + 0.1, end: delay + 0.5, ease: Easing.easeOutCubic })(t);
          return (
            <div key={i} style={{ opacity: pOp, transform: `translateY(${pY}px)`, width: 80 }}>
              <div style={{ width: "100%", height: 2, borderRadius: 1, background: p.accent, marginBottom: 8, transform: `scaleX(${barSc})`, transformOrigin: "left" }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: TF_WHITE, fontFamily: TF_FONT }}>{p.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 5: Projects List
function SceneProjects() {
  const { localTime: t, duration: d } = useSprite();
  const projects = [
    { title: "Personal Portfolio", role: "UI Engineer", accent: P_BLUE },
    { title: "Lions Den Cinemas", role: "Full-Stack Dev", accent: P_RED },
    { title: "SweetSpot", role: "IoT & AI Dev", accent: P_GREEN },
    { title: "Workly", role: "Mobile Dev", accent: P_WORKLY },
    { title: "TaylCraft", role: "Homelab Engineer", accent: P_TAYLCRAFT },
    { title: "Fradella.dev", role: "Full-Stack Engineer", accent: P_FRADELLA },
    { title: "FieldFlow", role: "Frontend Dev", accent: P_FIELDFLOW },
  ];
  const hdrOp = animate({ from: 0, to: 1, start: 0, end: 0.4, ease: Easing.easeOutCubic })(t);
  const hdrY = animate({ from: 20, to: 0, start: 0, end: 0.4, ease: Easing.easeOutCubic })(t);
  const countOp = animate({ from: 0, to: 1, start: 0.3, end: 0.7, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: exitOp, gap: 24,
    }}>
      {/* Left header */}
      <div style={{ opacity: hdrOp, transform: `translateY(${hdrY}px)` }}>
        <div style={{ fontSize: 7, color: TF_DIM, fontFamily: TF_FONT, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 5 }}>
          Selected Work
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: TF_WHITE, fontFamily: TF_FONT, lineHeight: 1 }}>Projects</div>
        <div style={{ marginTop: 6, height: 1, width: 32, borderRadius: 1, background: `linear-gradient(90deg, ${TF_TEAL}, transparent)` }} />
        <div style={{ marginTop: 8, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.06)", fontFamily: TF_FONT, lineHeight: 1, opacity: countOp }}>07</div>
      </div>
      {/* Project list */}
      <div style={{ display: "flex", flexDirection: "column", width: 200 }}>
        {projects.map((proj, i) => {
          const delay = 0.2 + i * 0.14;
          const rowOp = animate({ from: 0, to: 1, start: delay, end: delay + 0.25, ease: Easing.easeOutCubic })(t);
          const rowX = animate({ from: 16, to: 0, start: delay, end: delay + 0.3, ease: Easing.easeOutCubic })(t);
          const dotSc = animate({ from: 0, to: 1, start: delay + 0.08, end: delay + 0.25, ease: Easing.easeOutBack })(t);
          return (
            <div key={i} style={{
              opacity: rowOp, transform: `translateX(${rowX}px)`,
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 0",
              borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: 3, flexShrink: 0,
                background: proj.accent, boxShadow: `0 0 6px ${proj.accent}55`,
                transform: `scale(${dotSc})`,
              }} />
              <div style={{ flex: 1, fontSize: 10, fontWeight: 600, color: TF_WHITE, fontFamily: TF_FONT, lineHeight: 1.2 }}>
                {proj.title}
              </div>
              <div style={{ fontSize: 6, fontWeight: 500, color: TF_DIM, fontFamily: TF_FONT, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
                {proj.role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scene 6: End Card
function SceneEndTF() {
  const { localTime: t, duration: d } = useSprite();
  const logoOp = animate({ from: 0, to: 1, start: 0, end: 0.5, ease: Easing.easeOutCubic })(t);
  const logoSc = animate({ from: 0.7, to: 1, start: 0, end: 0.6, ease: Easing.easeOutBack })(t);
  const glowAmt = animate({ from: 0, to: 0.9, start: 0.3, end: 0.8, ease: Easing.easeOutCubic })(t);
  const tagOp = animate({ from: 0, to: 1, start: 0.4, end: 0.85, ease: Easing.easeOutCubic })(t);
  const tagY = animate({ from: 20, to: 0, start: 0.4, end: 0.85, ease: Easing.easeOutCubic })(t);
  const urlOp = animate({ from: 0, to: 1, start: 0.7, end: 1.1, ease: Easing.easeOutCubic })(t);
  const urlY = animate({ from: 12, to: 0, start: 0.7, end: 1.1, ease: Easing.easeOutCubic })(t);
  const exitOp = animate({ from: 1, to: 0, start: d - 0.5, end: d, ease: Easing.easeInCubic })(t);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exitOp,
    }}>
      <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, marginBottom: 16 }}>
        <TFMonogram size={52} glow={glowAmt} />
      </div>
      <div style={{
        fontSize: 22, fontWeight: 600, color: TF_WHITE, fontFamily: TF_FONT,
        letterSpacing: "-0.02em", textAlign: "center",
        opacity: tagOp, transform: `translateY(${tagY}px)`,
      }}>Designing profound<br />experiences.</div>
      <div style={{
        marginTop: 10, fontSize: 11, fontWeight: 400, color: TF_TEAL, fontFamily: TF_FONT,
        letterSpacing: "0.06em",
        opacity: urlOp, transform: `translateY(${urlY}px)`,
      }}>taylorfradella.com</div>
    </div>
  );
}

function AnimatedBGTF() {
  const t = useTime();
  const x = 50 + Math.sin(t * 0.22) * 18;
  const y = 50 + Math.cos(t * 0.32) * 12;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(44,111,133,0.12) 0%, transparent 55%)`,
      }} />
    </div>
  );
}

function TaylorScenes() {
  return (
    <div style={{ position: "absolute", inset: 0, background: TF_NAVY, overflow: "hidden" }}>
      <AnimatedBGTF />
      <Sprite start={0.2} end={3.3}><SceneName /></Sprite>
      <Sprite start={2.8} end={5.5}><SceneTagline /></Sprite>
      <Sprite start={5.0} end={8.7}><SceneGlass /></Sprite>
      <Sprite start={8.2} end={11.5}><SceneSkills /></Sprite>
      <Sprite start={11.0} end={13.8}><SceneProjects /></Sprite>
      <Sprite start={13.3} end={14.8}><SceneEndTF /></Sprite>
    </div>
  );
}

export default function TaylorVideo({ playing }) {
  return (
    <CardStage duration={15} playing={playing} loop>
      <TaylorScenes />
    </CardStage>
  );
}
