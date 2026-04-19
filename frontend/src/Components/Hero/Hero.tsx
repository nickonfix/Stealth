import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   FinEdge Hero — White / Dark Dual Theme
   Listens for "finedge-theme-change" CustomEvent dispatched by Navbar.
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
  { sym: "NVDA",  price: "875.40", chg: "+21.50", pct: "+2.52%" },
  { sym: "TSLA",  price: "248.50", chg: "-3.20",  pct: "-1.27%" },
  { sym: "MSFT",  price: "415.90", chg: "+4.10",  pct: "+0.99%" },
  { sym: "AMZN",  price: "185.60", chg: "+2.75",  pct: "+1.50%" },
  { sym: "GOOGL", price: "172.80", chg: "-0.90",  pct: "-0.52%" },
  { sym: "META",  price: "527.40", chg: "+8.30",  pct: "+1.60%" },
  { sym: "BRK.B", price: "402.10", chg: "+1.05",  pct: "+0.26%" },
  { sym: "JPM",   price: "202.50", chg: "-1.40",  pct: "-0.69%" },
];

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
];

const INVESTMENTS = [
  { sym: "NVDA", name: "NVIDIA Corp", shares: 12, avg: 421.0,  current: 875.4,  alloc: 38 },
  { sym: "AAPL", name: "Apple Inc",   shares: 25, avg: 155.2,  current: 189.3,  alloc: 27 },
  { sym: "MSFT", name: "Microsoft",   shares: 8,  avg: 320.0,  current: 415.9,  alloc: 22 },
  { sym: "TSLA", name: "Tesla Inc",   shares: 15, avg: 210.0,  current: 248.5,  alloc: 13 },
];

const SPARKLINES: Record<string, string> = {
  NVDA: "M0,30 L8,28 L16,20 L24,22 L32,15 L40,10 L48,5",
  AAPL: "M0,25 L8,22 L16,25 L24,18 L32,20 L40,16 L48,14",
  MSFT: "M0,28 L8,26 L16,24 L24,20 L32,22 L40,18 L48,15",
  TSLA: "M0,15 L8,20 L16,18 L24,25 L32,22 L40,28 L48,30",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Theme token helpers — returns correct value for light / dark
───────────────────────────────────────────────────────────────────────────── */
const t = (dark: boolean, light: string, darkVal: string) => dark ? darkVal : light;

/* ═══════════════════════ COMPONENT ═══════════════════════ */
const Hero: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finedge-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );
  const [activeTab, setActiveTab]           = useState<"news" | "portfolio">("news");
  const [investedAmounts, setInvestedAmounts] = useState<Record<string, number>>({
    NVDA: 5049.0, AAPL: 3882.5, MSFT: 2560.0, TSLA: 3150.0,
  });
  const [commentInputs, setCommentInputs]   = useState<Record<string, string>>({});
  const [comments, setComments]             = useState<Record<string, string[]>>({
    NVDA: ["Holding long. AI thesis intact. 🚀"],
    AAPL: [],
    MSFT: ["Azure revenue is the moat."],
    TSLA: ["Watching EV margin recovery closely."],
  });
  const [livePrice, setLivePrice]           = useState(875.4);
  const styleInjected                       = useRef(false);

  /* Listen for Navbar theme changes */
  useEffect(() => {
    const handler = (e: Event) => {
      setDark((e as CustomEvent).detail.dark);
    };
    window.addEventListener("finedge-theme-change", handler);
    return () => window.removeEventListener("finedge-theme-change", handler);
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
      setLivePrice((p) => parseFloat((p + (Math.random() - 0.48) * 1.2).toFixed(2)));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const totalValue = INVESTMENTS.reduce((s, i) => s + i.shares * i.current, 0);
  const totalCost  = INVESTMENTS.reduce((s, i) => s + i.shares * i.avg, 0);
  const totalGain  = totalValue - totalCost;
  const totalPct   = ((totalGain / totalCost) * 100).toFixed(2);

  const handleComment = (sym: string) => {
    const text = (commentInputs[sym] || "").trim();
    if (!text) return;
    setComments((prev) => ({ ...prev, [sym]: [...(prev[sym] || []), text] }));
    setCommentInputs((prev) => ({ ...prev, [sym]: "" }));
  };

  /* ── Derived theme tokens ── */
  const bg         = t(dark, "#f8fafc",          "#070b0f");
  const surface    = t(dark, "#ffffff",           "#0f1520");
  const surface2   = t(dark, "#f1f5f9",           "#131c28");
  const border     = t(dark, "rgba(15,23,42,0.09)", "rgba(255,255,255,0.07)");
  const border2    = t(dark, "rgba(15,23,42,0.06)", "rgba(255,255,255,0.05)");
  const textPrimary   = t(dark, "#0f172a", "#f1f5f9");
  const textSecondary = t(dark, "#475569", "#64748b");
  const textMuted     = t(dark, "#94a3b8", "#475569");
  const tickerBg      = t(dark, "rgba(248,250,252,0.9)",  "rgba(0,0,0,0.4)");
  const tickerBorder  = t(dark, "rgba(15,23,42,0.09)",    "rgba(16,185,129,0.12)");
  const inputBg       = t(dark, "rgba(248,250,252,0.8)",  "rgba(255,255,255,0.04)");
  const inputBorder   = t(dark, "rgba(15,23,42,0.12)",    "rgba(255,255,255,0.08)");
  const green         = "#10b981";
  const greenBg       = t(dark, "rgba(16,185,129,0.07)",  "rgba(16,185,129,0.08)");
  const greenBorder   = t(dark, "rgba(16,185,129,0.25)",  "rgba(16,185,129,0.2)");
  const cardShadow    = t(dark, "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.07)", "none");
  const cardShadowHover = t(dark, "0 4px 20px rgba(15,23,42,0.12)", "0 0 0 1px rgba(16,185,129,0.2)");

  return (
    <section
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: textPrimary,
        position: "relative",
        overflow: "hidden",
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
      <div
        style={{
          borderBottom: `1px solid ${tickerBorder}`,
          background: tickerBg,
          backdropFilter: "blur(8px)",
          overflow: "hidden",
          height: 40,
          display: "flex",
          alignItems: "center",
          transition: "background 0.3s",
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

      {/* ════════════════════════════════
          NEWS + PORTFOLIO SECTION
      ════════════════════════════════ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 80px", position: "relative", zIndex: 2 }}>

        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, borderBottom: `1px solid ${border}` }}>
          {(["news", "portfolio"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 24px", fontSize: 13, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: activeTab === tab ? (dark ? "#f1f5f9" : "#0f172a") : textSecondary,
                borderBottom: activeTab === tab ? `2px solid ${green}` : "2px solid transparent",
                marginBottom: -1,
                transition: "color 0.2s",
                letterSpacing: "0.01em",
              }}
            >
              {tab === "news" ? "📰 Market News" : "💼 My Portfolio"}
            </button>
          ))}
        </div>

        {/* ── NEWS TAB ── */}
        {activeTab === "news" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, animation: "fade-up-1 0.4s ease both" }}>
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
        )}

        {/* ── PORTFOLIO TAB ── */}
        {activeTab === "portfolio" && (
          <div style={{ animation: "fade-up-1 0.4s ease both" }}>
            {/* Portfolio summary bar */}
            <div
              style={{
                background: dark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.05)",
                border: `1px solid ${greenBorder}`,
                borderRadius: 14,
                padding: "20px 28px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 24,
                marginBottom: 24,
                boxShadow: dark ? "none" : "0 1px 3px rgba(16,185,129,0.06)",
              }}
            >
              {[
                { l: "Total Value",    v: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}` },
                { l: "Total Invested", v: `$${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}` },
                { l: "Unrealised P&L", v: `${totalGain >= 0 ? "+" : ""}$${totalGain.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, color: totalGain >= 0 ? green : "#f87171" },
                { l: "Return",         v: `${Number(totalPct) >= 0 ? "+" : ""}${totalPct}%`, color: Number(totalPct) >= 0 ? green : "#f87171" },
              ].map(({ l, v, color }) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: textMuted, marginBottom: 6, letterSpacing: "0.06em" }}>{l.toUpperCase()}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: color ?? textPrimary }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Holdings */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {INVESTMENTS.map((inv) => {
                const gain    = (inv.current - inv.avg) * inv.shares;
                const gainPct = (((inv.current - inv.avg) / inv.avg) * 100).toFixed(2);
                const isUp    = gain >= 0;

                return (
                  <div
                    key={inv.sym}
                    style={{
                      background: surface,
                      border: `1px solid ${border}`,
                      borderRadius: 14,
                      padding: "20px 24px",
                      boxShadow: cardShadow,
                      transition: "background 0.3s, border-color 0.3s",
                    }}
                  >
                    {/* Row 1 */}
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto", gap: 20, alignItems: "center", marginBottom: 16 }}>
                      {/* Symbol avatar */}
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: greenBg,
                          border: `1px solid ${greenBorder}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: green,
                        }}
                      >
                        {inv.sym}
                      </div>

                      <div>
                        <div style={{ fontSize: 14, color: textPrimary, fontWeight: 600 }}>{inv.name}</div>
                        <svg viewBox="0 0 48 36" style={{ width: 80, height: 24 }}>
                          <path d={SPARKLINES[inv.sym]} fill="none" stroke={isUp ? green : "#f87171"} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: textMuted, marginBottom: 4 }}>SHARES</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: textSecondary }}>{inv.shares}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: textMuted, marginBottom: 4 }}>PRICE</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: textPrimary }}>${inv.current.toFixed(2)}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: textMuted, marginBottom: 4 }}>P&L</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: isUp ? green : "#f87171" }}>
                          {isUp ? "+" : ""}${gain.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.7 }}>({isUp ? "+" : ""}{gainPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Allocation bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ height: 4, background: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.07)", borderRadius: 2, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%", width: `${inv.alloc}%`, borderRadius: 2,
                            background: isUp
                              ? "linear-gradient(90deg, #10b981, #0891b2)"
                              : "linear-gradient(90deg, #f87171, #fb923c)",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 10, color: textMuted, marginTop: 4 }}>{inv.alloc}% portfolio allocation</div>
                    </div>

                    {/* Investment input */}
                    <div
                      style={{
                        display: "flex", gap: 10, alignItems: "center", marginBottom: 14,
                        padding: "12px 16px", background: inputBg,
                        borderRadius: 10, border: `1px solid ${inputBorder}`,
                        transition: "background 0.3s",
                      }}
                    >
                      <span style={{ fontSize: 12, color: textMuted, whiteSpace: "nowrap" }}>My investment:</span>
                      <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace" }}>$</span>
                      <input
                        type="number"
                        value={investedAmounts[inv.sym]}
                        onChange={(e) => setInvestedAmounts((prev) => ({ ...prev, [inv.sym]: parseFloat(e.target.value) || 0 }))}
                        style={{
                          background: "transparent", border: "none", outline: "none",
                          fontFamily: "'DM Mono', monospace", fontSize: 14, color: textPrimary, width: 100,
                        }}
                      />
                      <span style={{ fontSize: 11, color: textMuted, marginLeft: "auto" }}>
                        Current:{" "}
                        <span style={{ color: textSecondary }}>
                          ${(inv.shares * inv.current).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                        </span>
                      </span>
                    </div>

                    {/* Comments */}
                    <div>
                      {(comments[inv.sym] || []).map((c, ci) => (
                        <div
                          key={ci}
                          style={{
                            fontSize: 13, color: textSecondary, padding: "8px 12px",
                            background: dark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)",
                            borderRadius: 8, marginBottom: 6,
                            borderLeft: `2px solid ${greenBorder}`,
                          }}
                        >
                          💬 {c}
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input
                          type="text"
                          placeholder={`Your take on ${inv.sym}...`}
                          value={commentInputs[inv.sym] || ""}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [inv.sym]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleComment(inv.sym)}
                          style={{
                            flex: 1, background: inputBg,
                            border: `1px solid ${inputBorder}`,
                            borderRadius: 8, padding: "9px 14px",
                            fontSize: 13, color: textPrimary, outline: "none",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            transition: "background 0.3s",
                          }}
                        />
                        <button
                          onClick={() => handleComment(inv.sym)}
                          style={{
                            background: greenBg, border: `1px solid ${greenBorder}`,
                            borderRadius: 8, padding: "9px 18px",
                            fontSize: 13, color: green, cursor: "pointer",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600, transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.15)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = greenBg)}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
          background: `linear-gradient(transparent, ${bg})`,
          pointerEvents: "none", transition: "background 0.3s",
        }}
      />
    </section>
  );
};

export default Hero;