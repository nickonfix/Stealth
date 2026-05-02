import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc — Markets / News Page (xAI Redesign)
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@keyframes fade-up-1 { 0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1} }
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
    tag: "Analysis", tagColor: "rgba(255,255,255,0.4)",
    headline: "Apple Eyes AI Integration in Next iPhone Supercycle",
    sub: "Analysts raise price targets citing services growth",
    time: "1h ago", stock: "AAPL", change: "+0.66%",
  },
  {
    tag: "Macro", tagColor: "rgba(255,255,255,0.4)",
    headline: "Treasury Yields Drop as Bond Market Prices In Easing",
    sub: "10-year yield falls to 4.2%, lowest in 3 months",
    time: "2h ago", stock: "TLT", change: "+0.94%",
  },
  {
    tag: "IPO", tagColor: "rgba(255,255,255,0.4)",
    headline: "Reddit Surges 48% in Debut, Valued at $8.6 Billion",
    sub: "Social media platform sees strong retail demand",
    time: "3h ago", stock: "RDDT", change: "+48.0%",
  },
  {
    tag: "Commodities", tagColor: "rgba(255,255,255,0.4)",
    headline: "Gold Hits Record $2,220 on Safe-Haven Demand",
    sub: "Central bank buying accelerates amid geopolitical risks",
    time: "4h ago", stock: "GLD", change: "+1.12%",
  },
];

const MarketsPage: React.FC = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
  }, []);

  const bg           = "#1f2228";
  const surface      = "rgba(255,255,255,0.02)";
  const border       = "rgba(255,255,255,0.1)";
  const textPrimary  = "#ffffff";
  const textMuted    = "rgba(255,255,255,0.4)";
  const green        = "#10b981";

  const isMobile = viewportWidth < 768;

  return (
    <section
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Geist Sans', sans-serif",
        color: textPrimary,
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "100px 24px 48px" : "120px 40px 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ 
            fontFamily: "'Geist Mono', monospace", 
            fontSize: '12px', 
            color: textMuted, 
            letterSpacing: '0.3em', 
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Terminal / Markets
          </h2>
          <h1
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: textPrimary,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            MARKET <span style={{ color: textMuted }}>SIGNALS</span>
          </h1>
        </div>
        <p style={{ fontSize: 16, color: textMuted, maxWidth: 560, lineHeight: 1.5 }}>
          Raw data streams filtered for institutional-grade clarity. 
          Real-time intelligence for the modern investor.
        </p>
      </div>

      {/* News Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 24px 80px" : "0 40px 100px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 1,
            background: border,
            border: `1px solid ${border}`,
            animation: "fade-up-1 0.4s ease both",
          }}
        >
          {NEWS.map((n, idx) => (
            <div
              key={idx}
              style={{
                background: surface,
                padding: 32,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = surface; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: 10, 
                    fontWeight: 500,
                    color: "#ffffff",
                    fontFamily: "'Geist Mono', monospace",
                    border: `1px solid rgba(255,255,255,0.2)`,
                    padding: "4px 10px",
                    letterSpacing: "0.1em", 
                    textTransform: "uppercase",
                  }}
                >
                  {n.tag}
                </span>
                <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" }}>{n.time}</span>
              </div>

              <h3 style={{ fontFamily: "'Geist Sans', sans-serif", fontWeight: 500, fontSize: 18, color: textPrimary, lineHeight: 1.4, marginBottom: 12 }}>
                {n.headline}
              </h3>
              <p style={{ fontSize: 14, color: textMuted, lineHeight: 1.5, marginBottom: 24 }}>{n.sub}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#ffffff", letterSpacing: "1px" }}>{n.stock}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: n.change.startsWith("+") ? green : "#ef4444" }}>
                  {n.change}
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
