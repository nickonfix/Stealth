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

const getSparkline = (sym: string): string => {
  const seed = sym.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const pts = Array.from({ length: 7 }, (_, i) => {
    const y = 28 - ((seed * (i + 1) * 17) % 24);
    return `${i * 8},${y}`;
  });
  return "M" + pts.join(" L");
};

const CardPortfolio = ({ portfolioValue, onPortfolioDelete, index = 0 }: Props) => {
  const [hovered, setHovered] = useState(false);

  const surface     = "rgba(255,255,255,0.02)";
  const border      = "rgba(255,255,255,0.1)";
  const borderHover = "rgba(255,255,255,0.2)";
  const textPrimary = "#ffffff";
  const textMuted   = "rgba(255,255,255,0.4)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "rgba(255,255,255,0.04)" : surface,
        border: `1px solid ${hovered ? borderHover : border}`,
        borderRadius: 0,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.2s ease",
        animation: `fe-card-in 0.4s ${index * 0.05}s ease-out both`,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to={`/company/${portfolioValue.symbol}/company-profile`}
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 18,
              fontWeight: 300,
              color: textPrimary,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {portfolioValue.symbol}
          </Link>
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Geist Mono', monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: "1px" }}>
            Terminal / Active
          </span>
        </div>

        <svg viewBox="0 0 48 36" style={{ width: 60, height: 28, opacity: hovered ? 1 : 0.4, transition: "opacity 0.2s" }}>
          <path
            d={getSparkline(portfolioValue.symbol)}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Link
          to={`/company/${portfolioValue.symbol}/company-profile`}
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 11,
            fontFamily: "'Geist Mono', monospace",
            color: hovered ? "#1f2228" : "#ffffff",
            textDecoration: "none",
            background: hovered ? "#ffffff" : "transparent",
            border: `1px solid ${hovered ? "#ffffff" : "rgba(255,255,255,0.2)"}`,
            padding: "8px 12px",
            borderRadius: 0,
            transition: "all 0.2s",
            textTransform: "uppercase",
            letterSpacing: "1.4px",
          }}
        >
          Inspect
        </Link>

        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
          dark={true}
        />
      </div>
    </div>
  );
};

export default CardPortfolio;