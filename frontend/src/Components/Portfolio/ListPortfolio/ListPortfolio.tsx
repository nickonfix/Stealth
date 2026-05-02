import React, { SyntheticEvent } from "react";
import CardPortfolio from "../CardPortfolio/CardPortfolio";
import { PortfolioGet } from "../../../Models/Portfolio";

interface Props {
  portfolioValues: PortfolioGet[];
  onPortfolioDelete: (e: SyntheticEvent) => void;
  dark?: boolean;
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete }: Props) => {
  const textPrimary = "#ffffff";
  const textMuted   = "rgba(255,255,255,0.4)";
  const border      = "rgba(255,255,255,0.1)";

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, background: "#ffffff", borderRadius: 0 }} />
          <div>
            <h2 style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 300, fontSize: 18, color: textPrimary, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Watchlist
            </h2>
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontFamily: "'Geist Mono', monospace",
            color: textMuted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {portfolioValues.length} / 20 ALLOCATED
        </div>
      </div>

      {/* Grid or empty state */}
      {portfolioValues.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 1px,
            background: border,
            border: `1px solid ${border}`,
          }}
        >
          {portfolioValues.map((val, i) => (
            <CardPortfolio
              key={val.symbol}
              portfolioValue={val}
              onPortfolioDelete={onPortfolioDelete}
              dark={true}
              index={i}
            />
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div
          style={{
            background: "rgba(255,255,255,0.01)",
            border: `1px dashed ${border}`,
            padding: "80px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 14, color: textPrimary, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Terminal empty
            </p>
            <p style={{ fontSize: 12, color: textMuted, margin: 0, fontFamily: "'Geist Sans', sans-serif" }}>
              No assets tracked in the current session.
            </p>
          </div>

          <a
            href="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              background: "#ffffff",
              color: "#1f2228",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1.4px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Initiate Search
          </a>
        </div>
      )}
    </div>
  );
};

export default ListPortfolio;