import React, { ChangeEvent, SyntheticEvent, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc Search — Premium search page
   Aceternity-inspired: spotlight cursor glow, shimmer border, animated bg
   Dark mode: listens for "finarc-theme-change" + reads localStorage
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

@keyframes fe-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes fe-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes fe-fade-up-2 {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes fe-ticker-scroll {
  0%   { transform: translateX(0);    }
  100% { transform: translateX(-50%); }
}
@keyframes fe-grid-breathe {
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 0.65; }
}
@keyframes fe-border-spin {
  to { --angle: 360deg; }
}
@keyframes fe-tag-in {
  from { opacity: 0; transform: scale(0.85) translateY(6px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
@keyframes fe-cursor-glow {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

const SUGGESTIONS = [
  { label: "Apple Inc",       sym: "AAPL" },
  { label: "NVIDIA Corp",     sym: "NVDA" },
  { label: "Tesla Inc",       sym: "TSLA" },
  { label: "Microsoft",       sym: "MSFT" },
  { label: "Amazon",          sym: "AMZN" },
  { label: "Alphabet",        sym: "GOOGL" },
];

const TRENDING = [
  { sym: "NVDA",  chg: "+2.52%", up: true  },
  { sym: "AAPL",  chg: "+0.66%", up: true  },
  { sym: "TSLA",  chg: "-1.27%", up: false },
  { sym: "MSFT",  chg: "+0.99%", up: true  },
  { sym: "AMZN",  chg: "+1.50%", up: true  },
  { sym: "GOOGL", chg: "-0.52%", up: false },
  { sym: "META",  chg: "+1.60%", up: true  },
  { sym: "SPY",   chg: "+1.82%", up: true  },
];

const SECTORS = ["Tech", "Health", "Finance", "Energy", "Consumer", "Utilities"];

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Props> = ({ onSearchSubmit, search, handleSearchChange }) => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );
  const [focused, setFocused]           = useState(false);
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const styleRef    = useRef(false);

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
      styleRef.current = true;
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finarc-theme-change", handler);
    return () => window.removeEventListener("finarc-theme-change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleSuggestion = (sym: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (inputRef.current && nativeInputValueSetter) {
      nativeInputValueSetter.call(inputRef.current, sym);
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
    inputRef.current?.focus();
  };

  const bg          = dark ? "#070b0f"            : "#f8fafc";
  const surface     = dark ? "#0f1520"            : "#ffffff";
  const surface2    = dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)";
  const border      = dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.09)";
  const borderFocus = "#10b981";
  const textPrimary = dark ? "#f1f5f9"            : "#0f172a";
  const textSub     = dark ? "#64748b"            : "#64748b";
  const textMuted   = dark ? "#334155"            : "#94a3b8";
  const green       = "#10b981";
  const greenBg     = dark ? "rgba(16,185,129,0.1)"  : "rgba(16,185,129,0.07)";
  const greenBorder = dark ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.2)";
  const shadow      = dark ? "none" : "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(15,23,42,0.06)";
  const gridColor   = dark ? "rgba(16,185,129,0.04)" : "rgba(15,23,42,0.04)";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        background: bg,
        minHeight: "560px",
        paddingBottom: "80px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      {/* ── Spotlight ── */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          width: 600, height: 600,
          borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 60%)",
          transform: `translate(${cursorPos.x - 300}px, ${cursorPos.y - 300}px)`,
          transition: "transform 0.08s linear",
          opacity: cursorVisible ? 1 : 0,
        }}
      />

      {/* ── Background Patterns ── */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: "56px 56px", animation: "fe-grid-breathe 7s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 900, height: 400, background: dark ? "radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 70%)" : "radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "80px 32px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: greenBg, border: `1px solid ${greenBorder}`, borderRadius: 999, padding: "5px 14px", marginBottom: 20, animation: "fe-tag-in 0.5s both" }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: green, letterSpacing: "0.07em" }}>REAL-TIME MARKET DATA</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1, color: textPrimary, textAlign: "center", marginBottom: 32, animation: "fe-fade-up 0.6s both" }}>
          Find your next <span style={{ backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>opportunity.</span>
        </h1>

        {/* Search Input Card */}
        <div style={{ position: "relative", width: "100%", maxWidth: 680, animation: "fe-fade-up 0.6s 0.1s both", marginBottom: 40 }}>
           <form onSubmit={onSearchSubmit} style={{ background: surface, borderRadius: 16, border: focused ? "1.5px solid #10b981" : `1.5px solid ${border}`, padding: "6px", display: "flex", alignItems: "center", gap: 8, boxShadow: shadow, transition: "all 0.3s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: focused ? greenBg : surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke={focused ? "#10b981" : textSub} strokeWidth="1.6"/><path d="M12.5 12.5L16 16" stroke={focused ? "#10b981" : textSub} strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <input ref={inputRef} type="text" placeholder="Search ticker or company..." value={search} onChange={handleSearchChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, fontWeight: 500, color: textPrimary, padding: "10px 4px" }} />
              <button type="submit" style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 700, cursor: "pointer", border: "none" }}>Search</button>
           </form>
        </div>

        {/* Compact Grid for Tickers & Sectors */}
        <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, animation: "fe-fade-up-2 0.6s 0.2s both" }}>
          
          {/* Left: Popular */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.1em", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>POPULAR SEARCHES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.sym} onClick={()=>handleSuggestion(s.sym)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: surface, border: `1px solid ${border}`, borderRadius: 10, cursor: "pointer", transition: "0.2s" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: green, background: greenBg, padding: "2px 6px", borderRadius: 4 }}>{s.sym}</span>
                  <span style={{ fontSize: 12, color: textPrimary, fontWeight: 500 }}>{s.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sectors */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.1em", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>FILTER BY SECTOR</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SECTORS.map(s => (
                <button key={s} onClick={()=>setActiveSector(activeSector === s ? null : s)} style={{ padding: "6px 12px", borderRadius: 8, border: activeSector === s ? `1px solid ${green}` : `1px solid ${border}`, background: activeSector === s ? greenBg : surface2, color: activeSector === s ? green : textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>{s}</button>
              ))}
            </div>
          </div>

        </div>

        {/* Stat Row */}
        <div style={{ display: "flex", gap: 40, marginTop: 48, animation: "fe-fade-up-2 0.6s 0.3s both" }}>
          {[{v: "12,400+", l: "Companies"}, {v: "Real-time", l: "Data"}, {v: "Free", l: "Access"}].map(st => (
            <div key={st.l}>
              <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary, fontFamily: "'DM Mono', monospace" }}>{st.v}</div>
              <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{st.l}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Gradient Fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(transparent, ${bg})`, pointerEvents: "none" }} />
    </section>
  );
};

export default Search;