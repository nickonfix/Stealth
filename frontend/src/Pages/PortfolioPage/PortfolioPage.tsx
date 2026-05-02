import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio";
import { PortfolioGet } from "../../Models/Portfolio";
import { portfolioDeleteAPI, portfolioGetAPI } from "../../Services/PortfolioService";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc — Portfolio Page (xAI Redesign)
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@keyframes fe-fade-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fe-grid-breathe { 0%,100%{opacity:0.2} 50%{opacity:0.4} }
`;

const INVESTMENTS = [
  { sym: "NVDA", name: "NVIDIA Corp",  shares: 12, avg: 421.0,  current: 875.4,  alloc: 38 },
  { sym: "AAPL", name: "Apple Inc",    shares: 25, avg: 155.2,  current: 189.3,  alloc: 27 },
  { sym: "MSFT", name: "Microsoft",    shares: 8,  avg: 320.0,  current: 415.9,  alloc: 22 },
  { sym: "TSLA", name: "Tesla Inc",    shares: 15, avg: 210.0,  current: 248.5,  alloc: 13 },
];



const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>(null);
  const [activeHolding, setActiveHolding] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    getPortfolio();
  }, []);

  const getPortfolio = () => {
    portfolioGetAPI()
      .then((res) => { if (res?.data) setPortfolioValues(res.data); })
      .catch(() => toast.warning("Could not get portfolio values!"));
  };

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
  }, []);

  const handlePortfolioDelete = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const sym = (form.querySelectorAll("input")[0] as HTMLInputElement)?.value;
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

  const bg           = "#1f2228";
  const surface      = "rgba(255,255,255,0.02)";
  const border       = "rgba(255,255,255,0.1)";
  const textPrimary  = "#ffffff";
  const textMuted    = "rgba(255,255,255,0.4)";
  const green        = "#10b981";

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1100;

  const displayName = user?.userName ? user.userName.toUpperCase() : "TERMINAL";

  return (
    <section style={{ background: bg, minHeight: "100vh", fontFamily: "'Geist Sans', sans-serif", color: textPrimary, position: "relative", overflow: "hidden" }}>
      {/* Background patterns */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", animation: "fe-grid-breathe 10s infinite", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: isMobile ? "100px 24px 80px" : "120px 40px 100px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 64, animation: "fe-fade-up 0.6s both" }}>
          <h2 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: textMuted, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>
            ID / {displayName}
          </h2>
          <h1 style={{ fontFamily: "'Geist Mono', monospace", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: textPrimary, textTransform: "uppercase", margin: 0 }}>
            FINARC <span style={{ color: textMuted }}>PORTFOLIO</span>
          </h1>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 1, background: border, border: `1px solid ${border}`, marginBottom: 48, animation: "fe-fade-up 0.6s 0.1s both" }}>
          {[
            { l: "MARKET VALUE",    v: `$${totalValue.toLocaleString()}` },
            { l: "COST BASIS",      v: `$${totalCost.toLocaleString()}` },
            { l: "UNREALISED P&L",  v: `${totalGain >= 0 ? "+" : ""}$${totalGain.toLocaleString()}`, c: totalGain >= 0 ? green : "#ef4444" },
            { l: "PERFORMANCE",     v: `${Number(totalPct) >= 0 ? "+" : ""}${totalPct}%`, c: Number(totalPct) >= 0 ? green : "#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ background: surface, padding: 32 }}>
              <div style={{ fontSize: 10, color: textMuted, fontFamily: "'Geist Mono', monospace", letterSpacing: "1px", marginBottom: 16 }}>{s.l}</div>
              <div style={{ fontSize: 24, fontFamily: "'Geist Mono', monospace", fontWeight: 300, color: s.c || textPrimary }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Watchlist Section */}
        <div style={{ marginBottom: 80, animation: "fe-fade-up 0.6s 0.2s both" }}>
           <ListPortfolio portfolioValues={portfolioValues || []} onPortfolioDelete={handlePortfolioDelete} />
        </div>

        {/* Holdings Tracker */}
        <div style={{ animation: "fe-fade-up 0.6s 0.3s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
            <div style={{ width: 10, height: 10, background: "#ffffff" }} />
            <h2 style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 300, fontSize: 18, color: textPrimary, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>ACTIVE POSITIONS</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 1, background: border, border: `1px solid ${border}` }}>
            {INVESTMENTS.map((inv, idx) => {
              const gain = (inv.current - inv.avg) * inv.shares;
              const isUp = gain >= 0;
              const isOpen = activeHolding === inv.sym;

              return (
                <div key={inv.sym} style={{ background: isOpen ? "rgba(255,255,255,0.04)" : surface, transition: "background 0.2s" }}>
                  <div 
                    onClick={() => setActiveHolding(isOpen ? null : inv.sym)}
                    style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "100px 1fr 120px 120px 120px 150px", gap: 24, padding: "24px 32px", alignItems: "center", cursor: "pointer" }}
                  >
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14, color: isUp ? green : "#ef4444" }}>{inv.sym}</div>
                    <div style={{ fontSize: 14, color: textPrimary, display: isMobile ? "none" : "block" }}>{inv.name}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>SHARES</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>{inv.shares}</div>
                    </div>
                    <div style={{ textAlign: "right", display: isMobile ? "none" : "block" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>AVG_COST</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>${inv.avg.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>PRICE</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>${inv.current.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>P&L</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14, color: isUp ? green : "#ef4444" }}>{isUp ? "+" : ""}${gain.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {isOpen && (
                    <div style={{ padding: "0 32px 32px", animation: "fe-fade-up 0.3s both" }}>
                      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 24 }} />
                      <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                         <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ fontSize: 10, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 8, textTransform: "uppercase" }}>Asset Allocation</div>
                            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", position: "relative" }}>
                               <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${inv.alloc}%`, background: "#ffffff" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                               <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: textMuted }}>0%</span>
                               <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", color: "#ffffff" }}>{inv.alloc}%</span>
                            </div>
                         </div>
                         <div style={{ display: "flex", gap: 12 }}>
                            <button style={{ padding: "8px 24px", background: "#ffffff", color: "#1f2228", border: "none", fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}>Execute Trade</button>
                            <button style={{ padding: "8px 24px", background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}>Analyze</button>
                         </div>
                      </div>
                    </div>
                  )}
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