import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────
   Finarc — Markets / News Page
   Extracted from the Hero section with full dark/light support
   ───────────────────────────────────────────────────────── */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@keyframes fade-up-1 { 0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1} }
@keyframes pulse-green { 0%,100%{opacity:1}50%{opacity:0.4} }
`;

const NEWS = [
  {
    tag: "Breaking", tagColor: "#ef4444",
    headline: "Fed Signals Rate Cut as Inflation Cools to 2.4%",
    sub: "Markets rally on dovish pivot — S&P 500 up 1.8%",
    time: "2m ago", stock: "SPY", change: "+1.82%",
  },
  {
    tag: "Earnings", tagColor: "#10b981",
    headline: "NVIDIA Beats Q3 Estimates by 23% on AI Chip Demand",
    sub: "Data center revenue surges 206% year-over-year",
    time: "18m ago", stock: "NVDA", change: "+2.52%",
  },
  {
    tag: "Analysis", tagColor: "#3b82f6",
    headline: "Apple Eyes AI Integration in Next iPhone Supercycle",
    sub: "Analysts raise price targets citing services growth",
    time: "1h ago", stock: "AAPL", change: "+0.66%",
  },
  {
    tag: "Macro", tagColor: "#f59e0b",
    headline: "Treasury Yields Drop as Bond Market Prices In Easing",
    sub: "10-year yield falls to 4.2%, lowest in 3 months",
    time: "2h ago", stock: "TLT", change: "+0.94%",
  },
  {
    tag: "IPO", tagColor: "#8b5cf6",
    headline: "Reddit Surges 48% in Debut, Valued at $8.6 Billion",
    sub: "Social media platform sees strong retail demand",
    time: "3h ago", stock: "RDDT", change: "+48.0%",
  },
  {
    tag: "Commodities", tagColor: "#06b6d4",
    headline: "Gold Hits Record $2,220 on Safe-Haven Demand",
    sub: "Central bank buying accelerates amid geopolitical risks",
    time: "4h ago", stock: "GLD", change: "+1.12%",
  },
];

const t = (dark: boolean, light: string, darkVal: string) => dark ? darkVal : light;

const MarketsPage: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finarc-theme-change", handler);
    return () => window.removeEventListener("finarc-theme-change", handler);
  }, []);

  useEffect(() => {
    if (!document.getElementById("markets-page-styles")) {
      const el = document.createElement("style");
      el.id = "markets-page-styles";
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
  }, []);

  const bg           = t(dark, "#f8fafc",             "#070b0f");
  const surface      = t(dark, "#ffffff",              "#0f1520");
  const border       = t(dark, "rgba(15,23,42,0.09)",  "rgba(255,255,255,0.07)");
  const border2      = t(dark, "rgba(15,23,42,0.06)",  "rgba(255,255,255,0.05)");
  const textPrimary  = t(dark, "#0f172a", "#f1f5f9");
  const textSecondary = t(dark, "#475569", "#64748b");
  const textMuted    = t(dark, "#94a3b8", "#475569");
  const green        = "#10b981";
  const greenBg      = t(dark, "rgba(16,185,129,0.07)", "rgba(16,185,129,0.08)");
  const greenBorder  = t(dark, "rgba(16,185,129,0.25)", "rgba(16,185,129,0.2)");
  const cardShadow   = t(dark, "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.07)", "none");
  const cardShadowHover = t(dark, "0 4px 20px rgba(15,23,42,0.12)", "0 0 0 1px rgba(16,185,129,0.2)");

  return (
    <section
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: textPrimary,
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: greenBg, border: `1px solid ${greenBorder}`,
              borderRadius: 999, padding: "5px 14px",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: green, animation: "pulse-green 2s infinite", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: green, letterSpacing: "0.08em" }}>
              LIVE
            </span>
          </div>
        </div>

        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: textPrimary,
            marginBottom: 8,
            transition: "color 0.3s",
          }}
        >
          Market{" "}
          <span
            style={{
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
            }}
          >
            News
          </span>
        </h1>
        <p style={{ fontSize: 15, color: textSecondary, maxWidth: 560, marginBottom: 36, lineHeight: 1.65 }}>
          Signal-filtered headlines from the markets that matter. Stay informed without the noise.
        </p>
      </div>

      {/* News Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
            animation: "fade-up-1 0.4s ease both",
          }}
        >
          {NEWS.map((n, idx) => (
            <div
              key={idx}
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                boxShadow: cardShadow,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = greenBorder;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = cardShadowHover;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = border;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = cardShadow;
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: 10, fontWeight: 700,
                    color: n.tagColor,
                    background: `${n.tagColor}14`,
                    border: `1px solid ${n.tagColor}28`,
                    padding: "3px 10px", borderRadius: 999,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}
                >
                  {n.tag}
                </span>
                <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace" }}>{n.time}</span>
              </div>

              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, color: textPrimary, lineHeight: 1.45, marginBottom: 8 }}>
                {n.headline}
              </h3>
              <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.65, marginBottom: 16 }}>{n.sub}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${border2}` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: textMuted }}>{n.stock}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: n.change.startsWith("+") ? green : "#f87171" }}>
                  {n.change.startsWith("+") ? "▲" : "▼"} {n.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketsPage;
