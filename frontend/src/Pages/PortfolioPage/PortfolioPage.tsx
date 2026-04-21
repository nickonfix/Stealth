import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio";
import { PortfolioGet } from "../../Models/Portfolio";
import { portfolioDeleteAPI, portfolioGetAPI } from "../../Services/PortfolioService";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────────────────
   Finarc — Portfolio Page
   Sections: Summary bar → Watchlist → Holdings tracker
   Dark mode: synced via "Finarc-theme-change" CustomEvent
   ───────────────────────────────────────────────────────── */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

@keyframes fe-fade-up    { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fe-slide-down { from{transform:translateY(-10px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fe-card-in    { from{transform:translateY(12px) scale(0.97);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
@keyframes fe-pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
@keyframes fe-shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes fe-grid-breathe { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
@keyframes fe-bar-grow   { from{width:0} to{width:var(--bar-w)} }
`;

const INVESTMENTS = [
  { sym: "NVDA", name: "NVIDIA Corp",  shares: 12, avg: 421.0,  current: 875.4,  alloc: 38 },
  { sym: "AAPL", name: "Apple Inc",    shares: 25, avg: 155.2,  current: 189.3,  alloc: 27 },
  { sym: "MSFT", name: "Microsoft",    shares: 8,  avg: 320.0,  current: 415.9,  alloc: 22 },
  { sym: "TSLA", name: "Tesla Inc",    shares: 15, avg: 210.0,  current: 248.5,  alloc: 13 },
];

const SPARKLINES: Record<string, string> = {
  NVDA: "M0,30 L8,28 L16,20 L24,22 L32,15 L40,10 L48,5",
  AAPL: "M0,25 L8,22 L16,25 L24,18 L32,20 L40,16 L48,14",
  MSFT: "M0,28 L8,26 L16,24 L24,20 L32,22 L40,18 L48,15",
  TSLA: "M0,15 L8,20 L16,18 L24,25 L32,22 L40,28 L48,30",
};

const tk = (dark: boolean, light: string, d: string) => (dark ? d : light);

/* ── Donut chart for allocation ── */
const DonutChart = ({ investments, dark }: { investments: typeof INVESTMENTS; dark: boolean }) => {
  const COLORS = ["#10b981", "#0891b2", "#8b5cf6", "#f59e0b"];
  const size = 120, r = 44, cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)"} strokeWidth="14" />
        {investments.map((inv, i) => {
          const dash = (inv.alloc / 100) * circumference;
          const gap  = circumference - dash;
          const seg = (
            <circle
              key={inv.sym}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={COLORS[i]}
              strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", fill: dark ? "#f1f5f9" : "#0f172a", fontWeight: 500 }}>
          100%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 9, fontFamily: "'Plus Jakarta Sans', sans-serif", fill: dark ? "#64748b" : "#94a3b8" }}>
          allocated
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {investments.map((inv, i) => (
          <div key={inv.sym} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: dark ? "#64748b" : "#94a3b8" }}>{inv.sym}</span>
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: dark ? "#f1f5f9" : "#0f172a", marginLeft: "auto", minWidth: 32, textAlign: "right" }}>{inv.alloc}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
const PortfolioPage: React.FC = () => {
  const { user } = useAuth();

  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );

  /* watchlist state (in real app these come from props/API) */
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>(null);

  const [investedAmounts, setInvestedAmounts] = useState<Record<string, number>>({
    NVDA: 5049.0, AAPL: 3882.5, MSFT: 2560.0, TSLA: 3150.0,
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [comments, setComments]           = useState<Record<string, string[]>>({
    NVDA: ["Holding long. AI thesis intact. 🚀"],
    AAPL: [],
    MSFT: ["Azure revenue is the moat."],
    TSLA: ["Watching EV margin recovery closely."],
  });
  const [activeHolding, setActiveHolding] = useState<string | null>(null);

  /* Theme listener */
  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finarc-theme-change", handler);
    return () => window.removeEventListener("finarc-theme-change", handler);
  }, []);

  useEffect(() => {
    getPortfolio();
  }, []);

  const getPortfolio = () => {
    portfolioGetAPI()
      .then((res) => {
        if (res?.data) {
          setPortfolioValues(res.data);
        }
      })
      .catch((e) => {
        toast.warning("Could not get portfolio values!");
      });
  };

  /* Keyframes injection */
  useEffect(() => {
    if (!document.getElementById("portfolio-page-kf")) {
      const el = document.createElement("style");
      el.id = "portfolio-page-kf";
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
  }, []);

  /* Watchlist delete handler (demo) */
  const handlePortfolioDelete = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll("input");
    const sym = inputs[0]?.value;
    if (sym) {
      portfolioDeleteAPI(sym).then((res) => {
        if (res?.status === 200) {
          toast.success("Stock deleted from Portfolio!");
          getPortfolio();
        }
      });
    }
  };

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

  /* ── Derived tokens ── */
  const bg            = tk(dark, "#f8fafc",                   "#070b0f");
  const surface       = tk(dark, "#ffffff",                   "#0f1520");
  const surface2      = tk(dark, "#f1f5f9",                   "#131c28");
  const border        = tk(dark, "rgba(15,23,42,0.09)",       "rgba(255,255,255,0.07)");
  const border2       = tk(dark, "rgba(15,23,42,0.06)",       "rgba(255,255,255,0.05)");
  const textPrimary   = tk(dark, "#0f172a",                   "#f1f5f9");
  const textSecondary = tk(dark, "#475569",                   "#64748b");
  const textMuted     = tk(dark, "#94a3b8",                   "#475569");
  const green         = "#10b981";
  const greenBg       = tk(dark, "rgba(16,185,129,0.07)",     "rgba(16,185,129,0.08)");
  const greenBorder   = tk(dark, "rgba(16,185,129,0.25)",     "rgba(16,185,129,0.2)");
  const cardShadow    = tk(dark, "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(15,23,42,0.07)", "none");
  const inputBg       = tk(dark, "rgba(248,250,252,0.9)",     "rgba(255,255,255,0.04)");
  const inputBorder   = tk(dark, "rgba(15,23,42,0.12)",       "rgba(255,255,255,0.08)");
  const gridColor     = tk(dark, "rgba(15,23,42,0.035)",      "rgba(16,185,129,0.04)");

  const displayName = user?.userName
    ? (user.userName.charAt(0).toUpperCase() + user.userName.slice(1))
    : "Your";

  return (
    <section
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: textPrimary,
        transition: "background 0.3s ease, color 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background grid ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "fe-grid-breathe 8s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Radial glow ── */}
      <div
        style={{
          position: "fixed",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: 800, height: 400,
          background: dark
            ? "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "52px 40px 80px" }}>

        {/* ════════════════════════════════
            PAGE HEADER
        ════════════════════════════════ */}
        <div style={{ marginBottom: 48, animation: "fe-slide-down 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: greenBg, border: `1px solid ${greenBorder}`,
                borderRadius: 999, padding: "4px 12px",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: green, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: green, letterSpacing: "0.08em" }}>
                LIVE PORTFOLIO
              </span>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: textPrimary,
              marginBottom: 10,
              transition: "color 0.3s",
            }}
          >
            {displayName}'s{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 50%, #10b981 100%)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                animation: "fe-shimmer 5s linear infinite",
              }}
            >
              Portfolio
            </span>
          </h1>
          <p style={{ fontSize: 15, color: textSecondary, maxWidth: 480, lineHeight: 1.7, transition: "color 0.3s" }}>
            Monitor your holdings, track performance, and manage your watchlist all in one place.
          </p>
        </div>

        {/* ════════════════════════════════
            SUMMARY CARDS ROW
        ════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 40,
            animation: "fe-fade-up 0.5s 0.1s both",
          }}
        >
          {[
            { l: "Total Value",    v: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, sub: "Portfolio market value", color: undefined },
            { l: "Total Invested", v: `$${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,  sub: "Cost basis",             color: undefined },
            {
              l: "Unrealised P&L",
              v: `${totalGain >= 0 ? "+" : ""}$${totalGain.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
              sub: "Open position gains",
              color: totalGain >= 0 ? green : "#f87171",
            },
            {
              l: "Total Return",
              v: `${Number(totalPct) >= 0 ? "+" : ""}${totalPct}%`,
              sub: "All-time performance",
              color: Number(totalPct) >= 0 ? green : "#f87171",
            },
          ].map(({ l, v, sub, color }, i) => (
            <div
              key={l}
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: cardShadow,
                animation: `fe-card-in 0.45s ${i * 0.07 + 0.15}s both`,
                transition: "background 0.3s, border-color 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent line */}
              {color && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}88, transparent)` }} />
              )}
              <div style={{ fontSize: 10, color: textMuted, letterSpacing: "0.07em", marginBottom: 10, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 500, color: color ?? textPrimary, lineHeight: 1, marginBottom: 6 }}>{v}</div>
              <div style={{ fontSize: 11, color: textMuted }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════
            TWO-COLUMN: ALLOCATION + WATCHLIST
        ════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 20,
            marginBottom: 40,
            animation: "fe-fade-up 0.5s 0.25s both",
          }}
        >
          {/* Allocation donut */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 18,
              padding: "22px 24px",
              boxShadow: cardShadow,
              transition: "background 0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: green }} />
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: "0.01em" }}>
                Allocation
              </h3>
            </div>
            <DonutChart investments={INVESTMENTS} dark={dark} />
          </div>

          {/* Watchlist */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 18,
              padding: "22px 24px",
              boxShadow: cardShadow,
              transition: "background 0.3s",
            }}
          >
            <ListPortfolio
              portfolioValues={portfolioValues || []}
              onPortfolioDelete={handlePortfolioDelete}
              dark={dark}
            />
          </div>
        </div>

        {/* ════════════════════════════════
            HOLDINGS TRACKER
        ════════════════════════════════ */}
        <div style={{ animation: "fe-fade-up 0.5s 0.4s both" }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: greenBg, border: `1px solid ${greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="2" y="6" width="11" height="7" rx="1.5" stroke={green} strokeWidth="1.3" />
                <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke={green} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: textPrimary, letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>Holdings</h2>
              <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontFamily: "'DM Mono', monospace" }}>
                {INVESTMENTS.length} active positions
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {INVESTMENTS.map((inv, idx) => {
              const gain    = (inv.current - inv.avg) * inv.shares;
              const gainPct = (((inv.current - inv.avg) / inv.avg) * 100).toFixed(2);
              const isUp    = gain >= 0;
              const isOpen  = activeHolding === inv.sym;

              return (
                <div
                  key={inv.sym}
                  style={{
                    background: surface,
                    border: `1px solid ${isOpen ? (isUp ? greenBorder : "rgba(248,113,113,0.3)") : border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: isOpen ? (isUp ? `0 0 0 1px ${greenBorder}, ${cardShadow}` : `0 0 0 1px rgba(248,113,113,0.2), ${cardShadow}`) : cardShadow,
                    transition: "all 0.25s ease",
                    animation: `fe-card-in 0.4s ${idx * 0.06 + 0.45}s both`,
                  }}
                >
                  {/* Clickable header row */}
                  <div
                    onClick={() => setActiveHolding(isOpen ? null : inv.sym)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto auto auto",
                      gap: 20,
                      alignItems: "center",
                      padding: "18px 24px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {/* Symbol badge */}
                    <div
                      style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: isUp ? greenBg : "rgba(248,113,113,0.07)",
                        border: `1px solid ${isUp ? greenBorder : "rgba(248,113,113,0.2)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                        color: isUp ? green : "#f87171", letterSpacing: "0.02em",
                      }}
                    >
                      {inv.sym}
                    </div>

                    {/* Name + sparkline */}
                    <div>
                      <div style={{ fontSize: 15, color: textPrimary, fontWeight: 600, marginBottom: 2 }}>{inv.name}</div>
                      <svg viewBox="0 0 48 36" style={{ width: 72, height: 22 }}>
                        <path d={SPARKLINES[inv.sym]} fill="none" stroke={isUp ? green : "#f87171"} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Shares */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: textMuted, marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>SHARES</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: textSecondary }}>{inv.shares}</div>
                    </div>

                    {/* Avg cost */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: textMuted, marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>AVG COST</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: textSecondary }}>${inv.avg.toFixed(2)}</div>
                    </div>

                    {/* Current */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: textMuted, marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>PRICE</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: textPrimary }}>${inv.current.toFixed(2)}</div>
                    </div>

                    {/* P&L + chevron */}
                    <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, color: textMuted, marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>P&L</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: isUp ? green : "#f87171", fontWeight: 600 }}>
                          {isUp ? "+" : ""}${gain.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7 }}>({isUp ? "+" : ""}{gainPct}%)</span>
                        </div>
                      </div>
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        style={{ transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}
                      >
                        <path d="M3 5l4 4 4-4" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* ── Expanded detail panel ── */}
                  <div
                    style={{
                      maxHeight: isOpen ? 320 : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                    }}
                  >
                    <div style={{ borderTop: `1px solid ${border2}`, padding: "18px 24px 20px" }}>
                      {/* Allocation bar */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>Portfolio Allocation</span>
                          <span style={{ fontSize: 11, color: textSecondary, fontFamily: "'DM Mono', monospace" }}>{inv.alloc}%</span>
                        </div>
                        <div style={{ height: 5, background: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.07)", borderRadius: 3, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${inv.alloc}%`,
                              borderRadius: 3,
                              background: isUp ? "linear-gradient(90deg, #10b981, #0891b2)" : "linear-gradient(90deg, #f87171, #fb923c)",
                              animation: isOpen ? "fe-bar-grow 0.6s cubic-bezier(0.34,1.2,0.64,1) both" : "none",
                              ["--bar-w" as string]: `${inv.alloc}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Investment input row */}
                      <div
                        style={{
                          display: "flex", gap: 10, alignItems: "center", marginBottom: 16,
                          padding: "11px 16px", background: inputBg,
                          borderRadius: 10, border: `1px solid ${inputBorder}`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: textMuted, whiteSpace: "nowrap" }}>My investment:</span>
                        <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace" }}>$</span>
                        <input
                          type="number"
                          value={investedAmounts[inv.sym]}
                          onChange={(e) => setInvestedAmounts((prev) => ({ ...prev, [inv.sym]: parseFloat(e.target.value) || 0 }))}
                          style={{ background: "transparent", border: "none", outline: "none", fontFamily: "'DM Mono', monospace", fontSize: 14, color: textPrimary, width: 100 }}
                        />
                        <span style={{ fontSize: 11, color: textMuted, marginLeft: "auto" }}>
                          Current value:{" "}
                          <span style={{ color: textSecondary, fontFamily: "'DM Mono', monospace" }}>
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
                            placeholder={`Your take on ${inv.sym}…`}
                            value={commentInputs[inv.sym] || ""}
                            onChange={(e) => setCommentInputs((prev) => ({ ...prev, [inv.sym]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleComment(inv.sym)}
                            style={{
                              flex: 1, background: inputBg, border: `1px solid ${inputBorder}`,
                              borderRadius: 8, padding: "9px 14px", fontSize: 13,
                              color: textPrimary, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          />
                          <button
                            onClick={() => handleComment(inv.sym)}
                            style={{
                              background: greenBg, border: `1px solid ${greenBorder}`,
                              borderRadius: 8, padding: "9px 18px", fontSize: 13,
                              color: green, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.14)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = greenBg)}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;