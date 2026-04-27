import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc Hero — White / Dark Dual Theme
   Listens for "Finarc-theme-change" CustomEvent dispatched by Navbar.
   Also reads localStorage on mount.
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@keyframes ticker         { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
@keyframes pulse-green    { 0%,100%{opacity:1}50%{opacity:0.4} }
@keyframes float-up       { 0%{transform:translateY(8px);opacity:0}100%{transform:translateY(0);opacity:1} }
@keyframes beam-x         { 0%{left:-20%}100%{left:120%} }
@keyframes beam-x2        { 0%{left:-30%}100%{left:130%} }
@keyframes scanline       { 0%,100%{top:-2px}50%{top:102%} }
@keyframes card-float     { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }
@keyframes slide-in-left  { 0%{transform:translateX(-40px);opacity:0}100%{transform:translateX(0);opacity:1} }
@keyframes slide-in-right { 0%{transform:translateX(40px);opacity:0}100%{transform:translateX(0);opacity:1} }
@keyframes fade-up-1      { 0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1} }
@keyframes badge-pop      { 0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1} }
`;

/* ── Data ── */
const TICKERS = [
  { sym: "AAPL",  price: "189.30", chg: "+1.24", pct: "+0.66%" },
  { sym: "NVDA",  price: "234.40", chg: "+21.50", pct: "+2.52%" },
  { sym: "TSLA",  price: "248.50", chg: "-3.20",  pct: "-1.27%" },
  { sym: "MSFT",  price: "415.90", chg: "+4.10",  pct: "+0.99%" },
  { sym: "AMZN",  price: "185.60", chg: "+2.75",  pct: "+1.50%" },
  { sym: "GOOGL", price: "172.80", chg: "-0.90",  pct: "-0.52%" },
  { sym: "META",  price: "527.40", chg: "+8.30",  pct: "+1.60%" },
  { sym: "BRK.B", price: "402.10", chg: "+1.05",  pct: "+0.26%" },
  { sym: "JPM",   price: "202.50", chg: "-1.40",  pct: "-0.69%" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Theme token helpers — returns correct value for light / dark
───────────────────────────────────────────────────────────────────────────── */
const t = (dark: boolean, light: string, darkVal: string) => dark ? darkVal : light;

/* ═══════════════════════ COMPONENT ═══════════════════════ */
const Hero: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );
  const [livePrice, setLivePrice] = useState(875.4);
  const styleInjected = useRef(false);

  /* Listen for Navbar theme changes */
  useEffect(() => {
    const handler = (e: Event) => {
      setDark((e as CustomEvent).detail.dark);
    };
    window.addEventListener("finarc-theme-change", handler);
    return () => window.removeEventListener("finarc-theme-change", handler);
  }, []);

/* Inject keyframes once */
useEffect(() => {
  if (!styleInjected.current) {
    const el = document.createElement("style");
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleInjected.current = true;
  }
  const interval = setInterval(() => {
    setLivePrice((p: number) => parseFloat((p + (Math.random() - 0.48) * 1.2).toFixed(2)));
  }, 1800);
  return () => clearInterval(interval);
}, []);

/* Sync body background with theme */
useEffect(() => {
  document.body.style.background = dark ? "#070b0f" : "#f8fafc";
  document.documentElement.style.background = dark ? "#070b0f" : "#f8fafc";
}, [dark]);

  /* ── Derived theme tokens ── */
  const bg         = t(dark, "#f8fafc",          "#070b0f");
  const surface    = t(dark, "#ffffff",           "#0f1520");
  const surface2   = t(dark, "#f1f5f9",           "#131c28");
  const border     = t(dark, "rgba(15,23,42,0.09)", "rgba(255,255,255,0.07)");
  const border2    = t(dark, "rgba(15,23,42,0.06)", "rgba(255,255,255,0.05)");
  const textPrimary   = t(dark, "#0f172a", "#f1f5f9");
  const textSecondary = t(dark, "#475569", "#64748b");
  const textMuted     = t(dark, "#94a3b8", "#475569");
  const tickerBg = t(dark, "rgba(248,250,252,0.9)", "transparent");
  //const tickerBg      = t(dark, "rgba(248,250,252,0.9)",  "rgba(0,0,0,0.4)");
  //const tickerBorder  = t(dark, "rgba(15,23,42,0.09)",    "rgba(16,185,129,0.12)");
  const green         = "#10b981";
  const greenBg       = t(dark, "rgba(16,185,129,0.07)",  "rgba(16,185,129,0.08)");
  const greenBorder   = t(dark, "rgba(16,185,129,0.25)",  "rgba(16,185,129,0.2)");
  const cardShadow    = t(dark, "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.07)", "none");
  const cardShadowHover = t(dark, "0 4px 20px rgba(15,23,42,0.12)", "0 0 0 1px rgba(16,185,129,0.2)");

  return (
    // <section
    //   style={{
    //     background: bg,
    //     minHeight: "100vh",
    //     fontFamily: "'Plus Jakarta Sans', sans-serif",
    //     color: textPrimary,
    //     position: "relative",
    //     overflow: "hidden",
    //     transition: "background 0.3s ease, color 0.3s ease",
    //   }}
    // >

      <section
        style={{
          background: bg,
          height: "100vh",        // ← was minHeight, change to height
          overflow: "hidden",     // ← add this
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: textPrimary,
          position: "relative",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
  
      {/* ── Decorative background: light = soft grid, dark = green grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: dark
            ? "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          opacity: dark ? 1 : 0.7,
        }}
      />

      {/* ── Radial glow ── */}
      <div
        style={{
          position: "absolute",
          top: "25%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 900, height: 600,
          background: dark
            ? "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Scan beams (dark only) */}
      {dark && (
        <>
          <div style={{ position: "absolute", top: "20%", height: 1, width: "30%", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)", animation: "beam-x 8s linear infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "65%", height: 1, width: "20%", background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.15), transparent)", animation: "beam-x2 12s linear 2s infinite", pointerEvents: "none" }} />
        </>
      )}

      {/* ════════════════════════════════
          TICKER BAR
      ════════════════════════════════ */}
      {/* <div
        style={{
          borderBottom: dark ? "none" : `1px solid ${tickerBorder}`,
          // borderBottom: dark && !scrolled ? "none" : `1px solid ${c.border}`,
          // borderBottom: `1px solid ${tickerBorder}`,
          background: tickerBg,
          backdropFilter: "blur(8px)",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
          transition: "background 0.3s",
        }}
      > */}

        <div
          style={{
            borderBottom: "none",
            // 1. Make background transparent in light mode
            background: dark ? tickerBg : "transparent", 
            // 2. Remove blur in light mode
            backdropFilter: dark ? "blur(1px)" : "none",
            WebkitBackdropFilter: dark ? "blur(1px)" : "none",
            overflow: "hidden",
            height: 40,
            display: "flex",
            alignItems: "center",
            transition: "background 0.3s",
            position: "relative",
            zIndex: 1, // Keep it below the Navbar
          }}
        >
        <div style={{ display: "flex", gap: 48, animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...TICKERS, ...TICKERS].map((t_, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: textSecondary, fontWeight: 500 }}>{t_.sym}</span>
              <span style={{ color: textPrimary }}>{t_.price}</span>
              <span style={{ color: t_.chg.startsWith("+") ? green : "#f87171", fontSize: 10 }}>
                {t_.chg.startsWith("+") ? "▲" : "▼"} {t_.pct}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          MAIN HERO CONTENT
      ════════════════════════════════ */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 40px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── LEFT: HEADLINE ── */}
        <div style={{ animation: "slide-in-left 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: greenBg,
              border: `1px solid ${greenBorder}`,
              borderRadius: 999,
              padding: "5px 14px",
              marginBottom: 28,
              animation: "badge-pop 0.5s 0.3s both",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: green, animation: "pulse-green 2s infinite", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: green, letterSpacing: "0.08em" }}>
              MARKETS OPEN · NYSE · NASDAQ
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(42px, 5vw, 66px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: textPrimary,
              marginBottom: 24,
              transition: "color 0.3s",
            }}
          >
            Invest with{" "}
            <span
              style={{
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
              }}
            >
              clarity,
            </span>
            <br />
            not noise.
          </h1>

          <p style={{ fontSize: 17, color: textSecondary, lineHeight: 1.75, maxWidth: 440, marginBottom: 40, fontWeight: 400, transition: "color 0.3s" }}>
            Track real-time stock data, read signal-filtered news, share your
            positions, and discuss market moves — all without the noise of social media.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              to="/search"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontSize: 15, fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 10,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 20px rgba(16,185,129,0.32)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(16,185,129,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(16,185,129,0.32)";
              }}
            >
              Start Investing Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span style={{ fontSize: 13, color: textMuted }}>No credit card · Free forever</span>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", gap: 36, marginTop: 48 }}>
            {[
              { v: "2.4M+", l: "Active investors" },
              { v: "$8.2B", l: "Portfolio value tracked" },
              { v: "99.8%", l: "Uptime SLA" },
            ].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: textPrimary, fontWeight: 500, transition: "color 0.3s" }}>{v}</div>
                <div style={{ fontSize: 11, color: textMuted, marginTop: 3, transition: "color 0.3s" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: LIVE DASHBOARD CARD ── */}
        <div style={{ animation: "slide-in-right 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
          {/* Featured stock card */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 20,
              padding: 28,
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              animation: "card-float 5s ease-in-out infinite",
              boxShadow: cardShadow,
              transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
            }}
          >
            {/* Scan line (dark only) */}
            {dark && (
              <div
                style={{
                  position: "absolute", left: 0, right: 0, height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)",
                  animation: "scanline 6s linear infinite",
                  pointerEvents: "none",
                }}
              />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: greenBg, color: green, padding: "3px 10px", borderRadius: 4, border: `1px solid ${greenBorder}` }}>
                    NVDA
                  </span>
                  <span style={{ fontSize: 12, color: textMuted }}>NASDAQ</span>
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 13, color: textSecondary }}>NVIDIA Corporation</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 32, fontWeight: 500, color: textPrimary, transition: "color 0.3s", lineHeight: 1 }}>
                  ${livePrice.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: livePrice > 875.4 ? green : "#f87171", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                  {livePrice > 875.4 ? "▲" : "▼"} {Math.abs(livePrice - 875.4).toFixed(2)} ({(((livePrice - 875.4) / 875.4) * 100).toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <svg viewBox="0 0 200 60" style={{ width: "100%", height: 60, display: "block", marginBottom: 16 }}>
              <defs>
                <linearGradient id="nvda-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={dark ? "0.25" : "0.15"} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,45 L20,40 L40,32 L60,35 L80,25 L100,18 L120,22 L140,14 L160,10 L180,8 L200,5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <path d="M0,45 L20,40 L40,32 L60,35 L80,25 L100,18 L120,22 L140,14 L160,10 L180,8 L200,5 L200,60 L0,60 Z" fill="url(#nvda-g)" />
            </svg>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { l: "Market Cap", v: "$2.15T" },
                { l: "P/E Ratio",  v: "67.4"   },
                { l: "Vol (M)",    v: "42.3M"   },
              ].map(({ l, v }) => (
                <div key={l} style={{ background: surface2, borderRadius: 10, padding: "10px 12px", border: `1px solid ${border2}`, transition: "background 0.3s" }}>
                  <div style={{ fontSize: 10, color: textMuted, marginBottom: 4, letterSpacing: "0.06em" }}>{l.toUpperCase()}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: textPrimary }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini ticker cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TICKERS.slice(1, 5).map((tk) => (
              <div
                key={tk.sym}
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  boxShadow: cardShadow,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = greenBorder;
                  (e.currentTarget as HTMLElement).style.background = greenBg;
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadowHover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = border;
                  (e.currentTarget as HTMLElement).style.background = surface;
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                }}
              >
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: textSecondary, fontWeight: 500 }}>{tk.sym}</div>
                  <div style={{ fontSize: 15, color: textPrimary, marginTop: 2 }}>${tk.price}</div>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: tk.chg.startsWith("+") ? green : "#f87171",
                    background: tk.chg.startsWith("+")
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(248,113,113,0.1)",
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                >
                  {tk.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
          background: `linear-gradient(transparent, ${bg})`,
          pointerEvents: "none", transition: "background 0.3s",
        }}
      />
            {/* ── Made with love credit ── */}
            <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "20px 40px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "color 0.3s" }}>
          Made with
        </span>
        <span style={{ fontSize: 15, animation: "pulse-green 2s infinite" }}>❤️</span>
        <span style={{ fontSize: 13, color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "color 0.3s" }}>
          by
        </span>
        <a
          href="https://github.com/nickonfix"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: green,
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.814 1.102.814 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          nickonfix
        </a>
      </div>
    </section>
  );
};

export default Hero;

