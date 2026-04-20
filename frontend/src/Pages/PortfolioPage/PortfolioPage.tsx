import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";

/* ─────────────────────────────────────────────────────────
   FinEdge — Portfolio Page
   Extracted from the Hero section with full dark/light support
   ───────────────────────────────────────────────────────── */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
@keyframes fade-up-1 { 0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1} }
`;

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

const t = (dark: boolean, light: string, darkVal: string) => dark ? darkVal : light;

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finedge-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );
  const [investedAmounts, setInvestedAmounts] = useState<Record<string, number>>({
    NVDA: 5049.0, AAPL: 3882.5, MSFT: 2560.0, TSLA: 3150.0,
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({
    NVDA: ["Holding long. AI thesis intact. 🚀"],
    AAPL: [],
    MSFT: ["Azure revenue is the moat."],
    TSLA: ["Watching EV margin recovery closely."],
  });

  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finedge-theme-change", handler);
    return () => window.removeEventListener("finedge-theme-change", handler);
  }, []);

  useEffect(() => {
    if (!document.getElementById("portfolio-page-styles")) {
      const el = document.createElement("style");
      el.id = "portfolio-page-styles";
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
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

  const bg           = t(dark, "#f8fafc",             "#070b0f");
  const surface      = t(dark, "#ffffff",              "#0f1520");
  const border       = t(dark, "rgba(15,23,42,0.09)",  "rgba(255,255,255,0.07)");
  const textPrimary  = t(dark, "#0f172a", "#f1f5f9");
  const textSecondary = t(dark, "#475569", "#64748b");
  const textMuted    = t(dark, "#94a3b8", "#475569");
  const green        = "#10b981";
  const greenBg      = t(dark, "rgba(16,185,129,0.07)", "rgba(16,185,129,0.08)");
  const greenBorder  = t(dark, "rgba(16,185,129,0.25)", "rgba(16,185,129,0.2)");
  const cardShadow   = t(dark, "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.07)", "none");
  const inputBg      = t(dark, "rgba(248,250,252,0.8)", "rgba(255,255,255,0.04)");
  const inputBorder  = t(dark, "rgba(15,23,42,0.12)",   "rgba(255,255,255,0.08)");

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
          
          {(user?.userName?.charAt(0)?.toUpperCase() ?? "") + (user?.userName?.slice(1) ?? "")}'s{" "}
          <span
            style={{
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
            }}
          >
            Portfolio
          </span>
        </h1>
        <p style={{ fontSize: 15, color: textSecondary, maxWidth: 560, marginBottom: 36, lineHeight: 1.65 }}>
          Track your investments, monitor performance, and share your takes on your holdings.
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 80px", animation: "fade-up-1 0.4s ease both" }}>
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
    </section>
  );
};

export default PortfolioPage;
