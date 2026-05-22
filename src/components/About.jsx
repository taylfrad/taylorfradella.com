// ─── Content ───────────────────────────────────────────────────────────────────
const BIO = [
  "I'm a software developer and Computer Science student at Southeastern Louisiana University, graduating in 2026. I build polished, user-focused web and mobile applications, and I'm just as interested in the strategy behind technology as the code itself. How it gets adopted, where it actually creates value, and how to bridge the gap between technical teams and the people they serve.",
  "I have a strong eye for design and care about craft, whether that's a clean interface or well-structured systems under the hood.",
];

const HOBBIES =
  "When I step away from code, I'm usually still building something. Spinning up a new service on my homelab, experimenting with networking hardware, or taking apart a piece of tech to see how it works. I'm a perpetual tinkerer, happiest with a project in front of me, digital or otherwise. And when I'm not tinkering, I'm probably hanging out with my dog Otis.";

const VALUES = [
  {
    title: "🛠️ Craft is the product.",
    body: "Great software isn't just functional. It's considered. Every pixel, every interaction, every line of code deserves intention.",
  },
  {
    title: "🧱 Build to understand.",
    body: "I learn best by building. Whether it's self-hosting on my own hardware or picking apart a new framework, curiosity is the point.",
  },
  {
    title: "🌉 Bridge the gap.",
    body: "Technology only matters when it reaches people. I think about how things get adopted, where they create real value, and who they're actually for.",
  },
  {
    title: "🚀 Stay restless.",
    body: "Comfort zones don't ship anything interesting. I gravitate toward problems that push me somewhere I haven't been.",
  },
];

const EDUCATION = [
  {
    title: "B.S. Computer Science, Pre-MBA Concentration",
    org: "Southeastern Louisiana University",
    period: "Expected 2026",
  },
];

const RESUME_PDF = "/docs/TaylorFradellaResume.pdf";

// ─── Shared primitives ────────────────────────────────────────────────────────
function Overline({ children, style }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.32em",
        color: "var(--text-tertiary)",
        margin: 0,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function ValueItem({ title, body }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          margin: "0 0 4px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function ExperienceEntry({ title, org, period }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        {title}{" "}
        <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
          @ {org}
        </span>
      </p>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-tertiary)",
          margin: "2px 0 0 0",
        }}
      >
        {period}
      </p>
    </div>
  );
}

function ResumeLink({ style }) {
  return (
    <a
      href={RESUME_PDF}
      download="TaylorFradellaResume.pdf"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 15,
        fontWeight: 500,
        color: "var(--text-primary)",
        textDecoration: "none",
        cursor: "pointer",
        padding: 0,
        ...style,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download resume
    </a>
  );
}

// ─── About — Two-Column layout (Michelle Gore-inspired) ────────────────────────
// Left:  avatar + intro + bio + hobbies + education + resume
// Right: values list + Otis photo
export default function About() {

  return (
    <section
      aria-label="About Taylor Fradella"
      className="about-reveal relative w-full px-4 pb-20 sm:px-6 md:px-8 md:pb-28"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div
        className="about-grid"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(0px, 3vw, 32px)",
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          columnGap: "clamp(32px, 5vw, 64px)",
          alignItems: "start",
        }}
      >
        {/* ── Left Column ──────────────────────────────────────── */}
        <div className="about-reveal__left">
          <div>
            <img
              src="/images/taylor-photo.webp"
              alt="Taylor Fradella"
              width={180}
              height={180}
              loading="lazy"
              decoding="async"
              style={{
                width: "clamp(120px, 28vw, 180px)",
                height: "clamp(120px, 28vw, 180px)",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--card-border)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                display: "block",
              }}
            />

            <Overline style={{ marginTop: 32 }}>A Little About Me</Overline>
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 34px)",
                fontWeight: 700,
                letterSpacing: "-0.015em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
                margin: "10px 0 24px 0",
              }}
            >
              Hi, I'm Taylor.
            </h2>

            {BIO.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  margin: "0 0 16px 0",
                  textWrap: "pretty",
                }}
              >
                {p}
              </p>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Overline style={{ marginBottom: 12 }}>Outside of Work</Overline>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                margin: 0,
                textWrap: "pretty",
              }}
            >
              {HOBBIES}
            </p>
          </div>

          <div style={{ marginTop: 48 }}>
            <Overline style={{ marginBottom: 16 }}>Education</Overline>
            {EDUCATION.map((exp, i) => (
              <ExperienceEntry key={i} {...exp} />
            ))}

            <ResumeLink style={{ marginTop: 12 }} />
          </div>
        </div>

        {/* ── Right Column ─────────────────────────────────────── */}
        <div className="about-reveal__right">
          <div>
            <Overline>What I Believe</Overline>
            <div style={{ marginTop: 20, marginBottom: 40 }}>
              {VALUES.map((v, i) => (
                <ValueItem key={i} {...v} />
              ))}
            </div>
          </div>

          <div>
            <img
              src="/images/otis.webp"
              alt="Otis the dog"
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
