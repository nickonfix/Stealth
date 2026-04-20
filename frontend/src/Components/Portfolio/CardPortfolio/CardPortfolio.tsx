import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import DeletePortfolio from "../DeletePortfolio/DeletePortfolio";
import { PortfolioGet } from "../../../Models/Portfolio";

interface Props {
  portfolioValue: PortfolioGet;
  onPortfolioDelete: (e: SyntheticEvent) => void;
  dark?: boolean;
  index?: number;
}

/* Tiny static sparklines per-letter hash so each card looks different */
const getSparkline = (sym: string): string => {
  const seed = sym.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const pts = Array.from({ length: 7 }, (_, i) => {
    const y = 28 - ((seed * (i + 1) * 17) % 24);
    return `${i * 8},${y}`;
  });
  return "M" + pts.join(" L");
};

const CardPortfolio = ({ portfolioValue, onPortfolioDelete, dark = false, index = 0 }: Props) => {
  const [hovered, setHovered] = useState(false);

  const surface     = dark ? "#0f1520"                    : "#ffffff";
  const border      = dark ? "rgba(255,255,255,0.08)"     : "rgba(15,23,42,0.09)";
  const borderHover = dark ? "rgba(16,185,129,0.3)"       : "rgba(16,185,129,0.25)";
  const textPrimary = dark ? "#f1f5f9"                    : "#0f172a";
  const textMuted   = dark ? "#475569"                    : "#94a3b8";
  const green       = "#10b981";
  const greenBg     = dark ? "rgba(16,185,129,0.1)"       : "rgba(16,185,129,0.07)";
  const greenBorder = dark ? "rgba(16,185,129,0.25)"      : "rgba(16,185,129,0.2)";
  const shadow      = dark ? "none"                       : "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(15,23,42,0.06)";
  const shadowHover = dark
    ? "0 0 0 1px rgba(16,185,129,0.2), 0 8px 24px rgba(16,185,129,0.08)"
    : "0 4px 20px rgba(15,23,42,0.1), 0 0 0 1px rgba(16,185,129,0.15)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: surface,
        border: `1px solid ${hovered ? borderHover : border}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: hovered ? shadowHover : shadow,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.34,1.2,0.64,1)",
        animation: `fe-card-in 0.45s ${index * 0.06 + 0.1}s cubic-bezier(0.34,1.1,0.64,1) both`,
        overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: 60, height: 60,
          background: hovered
            ? "radial-gradient(circle at top right, rgba(16,185,129,0.12) 0%, transparent 70%)"
            : "transparent",
          transition: "background 0.3s",
          pointerEvents: "none",
        }}
      />

      {/* Top row: symbol badge + sparkline */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: hovered ? greenBg : dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
            border: `1px solid ${hovered ? greenBorder : border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Mono', monospace",
            fontSize: portfolioValue.symbol.length > 3 ? 9 : 11,
            fontWeight: 500,
            color: hovered ? green : dark ? "#64748b" : "#94a3b8",
            letterSpacing: "0.03em",
            transition: "all 0.2s",
          }}
        >
          {portfolioValue.symbol}
        </div>

        {/* Mini sparkline */}
        <svg viewBox="0 0 48 36" style={{ width: 70, height: 32, opacity: hovered ? 1 : 0.55, transition: "opacity 0.2s" }}>
          <path
            d={getSparkline(portfolioValue.symbol)}
            fill="none"
            stroke={green}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Company link */}
      <div>
        <Link
          to={`/company/${portfolioValue}/company-profile`}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 20,
            fontWeight: 400,
            color: textPrimary,
            textDecoration: "none",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            transition: "color 0.2s",
            display: "block",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = green)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = textPrimary)}
        >
          {portfolioValue.symbol}
        </Link>
        <div style={{ fontSize: 11, color: textMuted, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>
          View company profile →
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)" }} />

      {/* Footer: actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          to={`/company/${portfolioValue}/company-profile`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: green,
            textDecoration: "none",
            background: greenBg,
            border: `1px solid ${greenBorder}`,
            padding: "5px 12px",
            borderRadius: 7,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(16,185,129,0.14)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = greenBg;
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Analyse
        </Link>

        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
          dark={dark}
        />
      </div>
    </div>
  );
};

export default CardPortfolio;