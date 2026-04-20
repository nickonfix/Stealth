import React, { ChangeEvent, SyntheticEvent, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   FinEdge Search — Premium search page
   Aceternity-inspired: spotlight cursor glow, shimmer border, animated bg
   Dark mode: listens for "finedge-theme-change" + reads localStorage
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
@keyframes fe-pulse-ring {
  0%   { transform: scale(1);    opacity: 0.6; }
  100% { transform: scale(1.55); opacity: 0;   }
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

/* ── Suggested search pills ── */
const SUGGESTIONS = [
  { label: "Apple Inc",       sym: "AAPL" },
  { label: "NVIDIA Corp",     sym: "NVDA" },
  { label: "Tesla Inc",       sym: "TSLA" },
  { label: "Microsoft",       sym: "MSFT" },
  { label: "Amazon",          sym: "AMZN" },
  { label: "Alphabet",        sym: "GOOGL" },
  { label: "Meta Platforms",  sym: "META" },
  { label: "Berkshire",       sym: "BRK.B" },
  { label: "JPMorgan",        sym: "JPM"  },
];

/* ── Trending tickers strip ── */
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

/* ── Sector pills ── */
const SECTORS = ["Technology", "Healthcare", "Financials", "Energy", "Consumer", "Utilities", "Real Estate"];

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Props> = ({ onSearchSubmit, search, handleSearchChange }) => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finedge-theme") === "dark" ||
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

  /* Inject keyframes once */
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
      styleRef.current = true;
    }
  }, []);

  /* Listen for Navbar theme toggle */
  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finedge-theme-change", handler);
    return () => window.removeEventListener("finedge-theme-change", handler);
  }, []);

  /* Spotlight cursor tracking */
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  /* Pill click → fill input */
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

  /* ── Derived theme tokens ── */
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
  const shadow      = dark
    ? "none"
    : "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(15,23,42,0.06)";
  const focusShadow = `0 0 0 4px rgba(16,185,129,${dark ? "0.15" : "0.1"}), 0 8px 32px rgba(16,185,129,${dark ? "0.12" : "0.08"})`;
  const gridColor   = dark ? "rgba(16,185,129,0.04)" : "rgba(15,23,42,0.04)";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
      style={{
        position: "relative",
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      {/* ── Aceternity spotlight cursor glow ── */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 0,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 60%)",
          transform: `translate(${cursorPos.x - 300}px, ${cursorPos.y - 300}px)`,
          transition: "transform 0.08s linear",
          opacity: cursorVisible ? 1 : 0,
          animation: cursorVisible ? "fe-cursor-glow 0.3s ease both" : "none",
        }}
      />

      {/* ── Animated grid background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          animation: "fe-grid-breathe 7s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Hero radial glow ── */}
      <div
        style={{
          position: "absolute",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: 900, height: 500,
          background: dark
            ? "radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ════════════════════════════════
          TRENDING TICKER STRIP
      ════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderBottom: `1px solid ${border}`,
          background: dark ? "rgba(0,0,0,0.3)" : "rgba(248,250,252,0.8)",
          backdropFilter: "blur(8px)",
          height: 38,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* "Trending" badge */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 16px",
            borderRight: `1px solid ${border}`,
            height: "100%",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: green, display: "inline-block" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: green, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>
            TRENDING
          </span>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 40, animation: "fe-ticker-scroll 22s linear infinite", whiteSpace: "nowrap" }}>
            {[...TRENDING, ...TRENDING].map((tk, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: textSub, fontWeight: 500 }}>{tk.sym}</span>
                <span style={{ color: tk.up ? green : "#f87171", fontSize: 10 }}>
                  {tk.up ? "▲" : "▼"} {tk.chg}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 760,
          margin: "0 auto",
          padding: "72px 32px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Badge ── */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: greenBg,
            border: `1px solid ${greenBorder}`,
            borderRadius: 999,
            padding: "5px 14px",
            marginBottom: 28,
            animation: "fe-tag-in 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke={green} strokeWidth="1.3" />
            <path d="M6 4v3M6 8.5v.5" stroke={green} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: green, letterSpacing: "0.07em" }}>
            12,400+ COMPANIES · REAL-TIME DATA
          </span>
        </div>

        {/* ── Headline ── */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(36px, 5.5vw, 58px)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: textPrimary,
            textAlign: "center",
            marginBottom: 14,
            animation: "fe-fade-up 0.6s 0.15s cubic-bezier(0.16,1,0.3,1) both",
            transition: "color 0.3s",
          }}
        >
          Find any{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #10b981 0%, #0891b2 50%, #10b981 100%)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              animation: "fe-shimmer 4s linear infinite",
              display: "inline-block",
            }}
          >
            stock
          </span>
          , instantly.
        </h1>

        <p
          style={{
            fontSize: 16,
            color: textSub,
            textAlign: "center",
            maxWidth: 460,
            lineHeight: 1.7,
            marginBottom: 44,
            fontWeight: 400,
            animation: "fe-fade-up 0.6s 0.25s cubic-bezier(0.16,1,0.3,1) both",
            transition: "color 0.3s",
          }}
        >
          Search by company name or ticker symbol. Access fundamentals,
          live prices, earnings, and analyst ratings.
        </p>

        {/* ════════ ACETERNITY SHIMMER BORDER SEARCH CARD ════════ */}
        <div
          style={{
            position: "relative",
            width: "100%",
            animation: "fe-fade-up 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Animated shimmer border wrapper */}
          <div
            style={{
              position: "absolute",
              inset: -1.5,
              borderRadius: 18,
              background: focused
                ? `conic-gradient(from var(--angle, 0deg), transparent 20%, ${green} 40%, #0891b2 60%, transparent 80%)`
                : "transparent",
              animation: focused ? "fe-border-spin 3s linear infinite" : "none",
              opacity: focused ? 1 : 0,
              transition: "opacity 0.3s",
              zIndex: 0,
            }}
          />

          {/* Outer glow ring when focused */}
          {focused && (
            <>
              <div style={{ position: "absolute", inset: -1.5, borderRadius: 18, background: `linear-gradient(135deg, ${green}22, #0891b222)`, zIndex: 0 }} />
              <div style={{ position: "absolute", inset: -8, borderRadius: 22, background: `radial-gradient(ellipse, rgba(16,185,129,${dark ? "0.12" : "0.08"}) 0%, transparent 70%)`, zIndex: -1, pointerEvents: "none" }} />
            </>
          )}

          {/* Card itself */}
          <form
            onSubmit={onSearchSubmit}
            style={{
              position: "relative",
              zIndex: 1,
              background: surface,
              borderRadius: 16,
              border: focused ? `1.5px solid ${borderFocus}` : `1.5px solid ${border}`,
              padding: "6px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: focused ? focusShadow : shadow,
              transition: "border-color 0.25s, box-shadow 0.25s, background 0.3s",
            }}
          >
            {/* Search icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: focused ? greenBg : surface2,
                border: `1px solid ${focused ? greenBorder : border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.25s, border-color 0.25s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke={focused ? green : textSub} strokeWidth="1.6" />
                <path d="M12.5 12.5L16 16" stroke={focused ? green : textSub} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              placeholder="Search companies or tickers…"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 16,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                color: textPrimary,
                caretColor: green,
                padding: "10px 4px",
                transition: "color 0.3s",
              }}
            />

            {/* Clear button */}
            {search && (
              <button
                type="button"
                onClick={() => {
                  handleSearchChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
                  inputRef.current?.focus();
                }}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: surface2, border: `1px solid ${border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.07)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = surface2)}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke={textSub} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* Submit button */}
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 22px",
                borderRadius: 11,
                border: "none",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "0 2px 12px rgba(16,185,129,0.3)",
                transition: "transform 0.18s, box-shadow 0.18s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-1px)";
                el.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 2px 12px rgba(16,185,129,0.3)";
              }}
            >
              Search
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>

        {/* ── Keyboard hint ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            animation: "fe-fade-up-2 0.5s 0.45s both",
          }}
        >
          <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace" }}>Press</span>
          {["↵", "Enter"].map((k, i) => (
            <kbd
              key={i}
              style={{
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: textSub,
                background: surface2,
                border: `1px solid ${border}`,
                borderRadius: 5,
                padding: "2px 7px",
                boxShadow: dark ? "none" : "0 1px 0 rgba(15,23,42,0.08)",
                display: i === 1 ? "none" : "inline-block",
              }}
            >
              {k}
            </kbd>
          ))}
          <span style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace" }}>to search</span>
        </div>

        {/* ════════ SECTOR FILTER PILLS ════════ */}
        <div
          style={{
            width: "100%",
            marginTop: 40,
            animation: "fe-fade-up-2 0.5s 0.5s both",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: textMuted,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 14,
              textAlign: "center",
              transition: "color 0.3s",
            }}
          >
            Filter by sector
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {SECTORS.map((s) => {
              const active = activeSector === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveSector(active ? null : s)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    border: active ? `1px solid ${green}` : `1px solid ${border}`,
                    background: active ? greenBg : surface2,
                    color: active ? green : textSub,
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "-0.01em",
                    outline: "none",
                    boxShadow: active ? `0 0 0 3px rgba(16,185,129,${dark ? "0.12" : "0.08"})` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = greenBorder;
                      el.style.color = green;
                      el.style.background = greenBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = border;
                      el.style.color = textSub;
                      el.style.background = surface2;
                    }
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════ SUGGESTED COMPANIES ════════ */}
        <div
          style={{
            width: "100%",
            marginTop: 44,
            animation: "fe-fade-up-2 0.5s 0.6s both",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: textMuted,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 16,
              textAlign: "center",
              transition: "color 0.3s",
            }}
          >
            Popular searches
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s.sym}
                onClick={() => handleSuggestion(s.sym)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: surface,
                  border: `1px solid ${border}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxShadow: shadow,
                  animation: `fe-tag-in 0.4s ${0.05 * i + 0.65}s both`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = greenBorder;
                  el.style.background = greenBg;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = `0 4px 16px rgba(16,185,129,${dark ? "0.12" : "0.08"})`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = border;
                  el.style.background = surface;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = shadow;
                }}
              >
                {/* Ticker badge */}
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: greenBg,
                    border: `1px solid ${greenBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9.5,
                    fontWeight: 500,
                    color: green,
                    flexShrink: 0,
                    letterSpacing: "0.03em",
                  }}
                >
                  {s.sym}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, transition: "color 0.3s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: textSub, fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
                    {s.sym}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ════════ STAT ROW ════════ */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 52,
            width: "100%",
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: shadow,
            animation: "fe-fade-up-2 0.5s 1s both",
            transition: "background 0.3s, border-color 0.3s",
          }}
        >
          {[
            { v: "12,400+", l: "Public companies" },
            { v: "Real-time", l: "Price data"      },
            { v: "20 years", l: "Historical data"  },
            { v: "Free",     l: "No credit card"   },
          ].map(({ v, l }, i, arr) => (
            <div
              key={l}
              style={{
                flex: 1,
                padding: "20px 16px",
                textAlign: "center",
                borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none",
                transition: "border-color 0.3s",
              }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: textPrimary, marginBottom: 4, transition: "color 0.3s" }}>{v}</div>
              <div style={{ fontSize: 11, color: textMuted, letterSpacing: "0.04em", transition: "color 0.3s" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom gradient ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 80,
          background: `linear-gradient(transparent, ${bg})`,
          pointerEvents: "none",
          transition: "background 0.3s",
        }}
      />
    </section>
  );
};

export default Search;