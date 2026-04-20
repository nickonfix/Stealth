import React, { SyntheticEvent } from "react";
import CardPortfolio from "../CardPortfolio/CardPortfolio";

interface Props {
  portfolioValues: string[];
  onPortfolioDelete: (e: SyntheticEvent) => void;
  dark?: boolean;
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete, dark = false }: Props) => {
  const textPrimary = dark ? "#f1f5f9"  : "#0f172a";
  const textMuted   = dark ? "#475569"  : "#94a3b8";
  const border      = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)";
  const surface     = dark ? "#0f1520"  : "#ffffff";
  const green       = "#10b981";
  const greenBg     = dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.06)";
  const greenBorder = dark ? "rgba(16,185,129,0.2)"  : "rgba(16,185,129,0.18)";
  const shadow      = dark ? "none" : "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(15,23,42,0.06)";

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: greenBg, border: `1px solid ${greenBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 11L5 7l3 3 5-6" stroke={green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: textPrimary, letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
              Watchlist
            </h2>
            <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontFamily: "'DM Mono', monospace" }}>
              {portfolioValues.length} {portfolioValues.length === 1 ? "company" : "companies"} tracked
            </p>
          </div>
        </div>

        {portfolioValues.length > 0 && (
          <div
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: textMuted,
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
              border: `1px solid ${border}`,
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            {portfolioValues.length} / 20 slots
          </div>
        )}
      </div>

      {/* Grid or empty state */}
      {portfolioValues.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {portfolioValues.map((val, i) => (
            <CardPortfolio
              key={val}
              portfolioValue={val}
              onPortfolioDelete={onPortfolioDelete}
              dark={dark}
              index={i}
            />
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div
          style={{
            background: surface,
            border: `1.5px dashed ${border}`,
            borderRadius: 18,
            padding: "52px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            boxShadow: shadow,
            transition: "background 0.3s",
          }}
        >
          {/* Animated icon */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: 16,
                background: greenBg, border: `1px solid ${greenBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 17L8 11l4 4 9-10" stroke={green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: 20,
                border: `1px solid ${greenBorder}`,
                animation: "fe-pulse-ring 2.2s ease-out infinite",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: textPrimary, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Your watchlist is empty
            </p>
            <p style={{ fontSize: 13, color: textMuted, margin: 0, lineHeight: 1.65, maxWidth: 320 }}>
              Search for companies and add them to track their performance here.
            </p>
          </div>

          <a
            href="/search"
            style={{
              marginTop: 4,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 20px",
              borderRadius: 9,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(16,185,129,0.28)",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 6px 20px rgba(16,185,129,0.38)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 14px rgba(16,185,129,0.28)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.4" />
              <path d="M9.5 9.5L12 12" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Search companies
          </a>
        </div>
      )}
    </div>
  );
};

export default ListPortfolio;