import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio";
import { PortfolioGet } from "../../Models/Portfolio";
import { portfolioDeleteAPI, portfolioGetAPI, portfolioUpdateAPI } from "../../Services/PortfolioService";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc — Portfolio Page (xAI Redesign - Dynamic Edition)
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@keyframes fe-fade-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fe-grid-breathe { 0%,100%{opacity:0.2} 50%{opacity:0.4} }
`;

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>(null);
  const [activeHolding, setActiveHolding] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: { quantity: number; purchasePrice: number } }>({});

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
      .then((res) => { 
        if (res?.data) {
          setPortfolioValues(res.data);
          // Initialize edit values
          const ev: { [key: string]: { quantity: number; purchasePrice: number } } = {};
          res.data.forEach(item => {
            ev[item.symbol] = { quantity: item.quantity, purchasePrice: item.purchasePrice };
          });
          setEditValues(ev);
        }
      })
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

  const handleUpdatePosition = (symbol: string) => {
    const values = editValues[symbol];
    if (values) {
      portfolioUpdateAPI(symbol, values.quantity, values.purchasePrice)
        .then((res) => {
          if (res?.status === 200) {
            toast.success(`${symbol} position updated!`);
            getPortfolio();
          }
        })
        .catch(() => toast.error(`Failed to update ${symbol} position`));
    }
  };

  const handleInputChange = (symbol: string, field: 'quantity' | 'purchasePrice', value: string) => {
    const num = parseFloat(value) || 0;
    setEditValues(prev => ({
      ...prev,
      [symbol]: {
        ...prev[symbol],
        [field]: num
      }
    }));
  };

  // Calculations
  const totalValue = portfolioValues?.reduce((s, i) => s + (i.quantity * i.purchase), 0) || 0;
  const totalCost  = portfolioValues?.reduce((s, i) => s + (i.quantity * i.purchasePrice), 0) || 0;
  const totalGain  = totalValue - totalCost;
  const totalPct   = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : "0.00";

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
            { l: "MARKET VALUE",    v: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { l: "COST BASIS",      v: `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { l: "UNREALISED P&L",  v: `${totalGain >= 0 ? "+" : ""}$${totalGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, c: totalGain >= 0 ? green : "#ef4444" },
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
            {portfolioValues?.map((inv, idx) => {
              const gain = (inv.purchase - inv.purchasePrice) * inv.quantity;
              const isUp = gain >= 0;
              const isOpen = activeHolding === inv.symbol;
              const currentEdit = editValues[inv.symbol] || { quantity: inv.quantity, purchasePrice: inv.purchasePrice };

              return (
                <div key={inv.symbol} style={{ background: isOpen ? "rgba(255,255,255,0.04)" : surface, transition: "background 0.2s" }}>
                  <div 
                    onClick={() => setActiveHolding(isOpen ? null : inv.symbol)}
                    style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "100px 1fr 120px 120px 120px 150px", gap: 24, padding: "24px 32px", alignItems: "center", cursor: "pointer" }}
                  >
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14, color: isUp ? green : "#ef4444" }}>{inv.symbol}</div>
                    <div style={{ fontSize: 14, color: textPrimary, display: isMobile ? "none" : "block" }}>{inv.companyName}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>SHARES</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>{inv.quantity}</div>
                    </div>
                    <div style={{ textAlign: "right", display: isMobile ? "none" : "block" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>AVG_COST</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>${inv.purchasePrice.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>PRICE</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14 }}>${inv.purchase.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 4 }}>P&L</div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14, color: isUp ? green : "#ef4444" }}>{isUp ? "+" : ""}${gain.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                  
                  {isOpen && (
                    <div style={{ padding: "0 32px 32px", animation: "fe-fade-up 0.3s both" }}>
                      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 24 }} />
                      
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 32, alignItems: "flex-end" }}>
                         <div>
                            <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 8, textTransform: "uppercase" }}>Adjust Lots</div>
                            <input 
                               type="number" 
                               value={currentEdit.quantity}
                               onChange={(e) => handleInputChange(inv.symbol, 'quantity', e.target.value)}
                               onClick={(e) => e.stopPropagation()}
                               style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`, padding: "12px", color: textPrimary, fontFamily: "'Geist Mono', monospace", fontSize: 14 }}
                            />
                         </div>
                         <div>
                            <div style={{ fontSize: 9, color: textMuted, fontFamily: "'Geist Mono', monospace", marginBottom: 8, textTransform: "uppercase" }}>Purchase Price ($)</div>
                            <input 
                               type="number" 
                               step="0.01"
                               value={currentEdit.purchasePrice}
                               onChange={(e) => handleInputChange(inv.symbol, 'purchasePrice', e.target.value)}
                               onClick={(e) => e.stopPropagation()}
                               style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`, padding: "12px", color: textPrimary, fontFamily: "'Geist Mono', monospace", fontSize: 14 }}
                            />
                         </div>
                         <div style={{ display: "flex", gap: 12 }}>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleUpdatePosition(inv.symbol); }}
                               style={{ flex: 1, padding: "12px 24px", background: "#ffffff", color: "#1f2228", border: "none", fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}
                            >
                               Update Position
                            </button>
                            <button 
                               style={{ padding: "12px 24px", background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}
                            >
                               Analyze
                            </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {(!portfolioValues || portfolioValues.length === 0) && (
                <div style={{ background: surface, padding: 48, textAlign: "center", border: `1px dashed ${border}` }}>
                    <p style={{ color: textMuted, fontFamily: "'Geist Mono', monospace", fontSize: 12 }}>NO ACTIVE POSITIONS DETECTED</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;