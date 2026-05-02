import React, { ChangeEvent, SyntheticEvent, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Finarc Search — xAI Redesign
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@keyframes fe-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes fe-fade-up-2 {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes fe-grid-breathe {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 0.3; }
}
@keyframes fe-tag-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
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

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Props> = ({ onSearchSubmit, search, handleSearchChange }) => {
  const [focused, setFocused]           = useState(false);
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
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

  const bg          = "#1f2228";
  const surface     = "rgba(255,255,255,0.03)";
  const border      = "rgba(255,255,255,0.1)";
  const textPrimary = "#ffffff";
  const textSub     = "rgba(255,255,255,0.5)";
  const gridColor   = "rgba(255,255,255,0.03)";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
      style={{
        position: "relative",
        background: bg,
        minHeight: "500px",
        paddingBottom: "60px",
        fontFamily: "'Geist Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Spotlight ── */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          transform: `translate(${cursorPos.x - 400}px, ${cursorPos.y - 400}px)`,
          transition: "transform 0.1s linear",
          opacity: cursorVisible ? 1 : 0,
          zIndex: 1,
        }}
      />

      {/* ── Background Patterns ── */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: "40px 40px", animation: "fe-grid-breathe 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "100px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid rgba(255,255,255,0.15)`, padding: "4px 12px", marginBottom: 24, animation: "fe-tag-in 0.5s both" }}>
          <span style={{ fontSize: 10, fontWeight: 500, fontFamily: "'Geist Mono', monospace", color: "#ffffff", letterSpacing: "0.15em", textTransform: "uppercase" }}>Intelligence / Terminal</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 300, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1, color: textPrimary, textAlign: "center", marginBottom: 40, animation: "fe-fade-up 0.6s both", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          Market <span style={{ color: "rgba(255,255,255,0.4)" }}>Analysis</span> & Search
        </h1>

        {/* Search Input Card */}
        <div style={{ position: "relative", width: "100%", maxWidth: 640, animation: "fe-fade-up 0.6s 0.1s both", marginBottom: 48 }}>
           <form onSubmit={onSearchSubmit} style={{ background: "transparent", borderBottom: `1px solid ${focused ? "#ffffff" : border}`, padding: "12px 0", display: "flex", alignItems: "center", gap: 16, transition: "all 0.3s" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={focused ? "#ffffff" : textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input ref={inputRef} type="text" placeholder="ENTER TICKER..." value={search} onChange={handleSearchChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 18, fontFamily: "'Geist Mono', monospace", fontWeight: 300, color: textPrimary, textTransform: "uppercase", letterSpacing: "1px" }} />
              <button type="submit" style={{ padding: "8px 24px", background: "#ffffff", color: "#1f2228", fontWeight: 500, fontFamily: "'Geist Mono', monospace", fontSize: 13, cursor: "pointer", border: "none", textTransform: "uppercase", letterSpacing: "1.4px", transition: "opacity 0.2s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Execute</button>
           </form>
        </div>

        {/* Suggestions Row */}
        <div style={{ width: "100%", maxWidth: 640, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", animation: "fe-fade-up-2 0.6s 0.2s both" }}>
          {SUGGESTIONS.map(s => (
            <button key={s.sym} onClick={()=>handleSuggestion(s.sym)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: surface, border: `1px solid ${border}`, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.background = surface; e.currentTarget.style.borderColor = border; }}>
              <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", fontWeight: 500, color: "#ffffff" }}>{s.sym}</span>
              <span style={{ fontSize: 11, color: textSub, fontWeight: 400 }}>{s.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Bottom Gradient Fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(transparent, ${bg})`, pointerEvents: "none" }} />
    </section>
  );
};

export default Search;