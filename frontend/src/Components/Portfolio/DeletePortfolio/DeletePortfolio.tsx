import React, { SyntheticEvent, useState } from "react";

interface Props {
  onPortfolioDelete: (e: SyntheticEvent) => void;
  portfolioValue: string;
  dark?: boolean;
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue, dark = false }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const border   = dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.09)";
  const surface  = dark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.03)";

  return (
    <form onSubmit={onPortfolioDelete}>
      <input hidden readOnly value={portfolioValue} />
      <button
        type="submit"
        onMouseEnter={() => { setHovered(true); setConfirming(true); }}
        onMouseLeave={() => { setHovered(false); setTimeout(() => setConfirming(false), 200); }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: confirming ? "6px 12px" : "6px 10px",
          borderRadius: 8,
          border: hovered ? "1px solid rgba(239,68,68,0.35)" : `1px solid ${border}`,
          background: hovered ? "rgba(239,68,68,0.07)" : surface,
          color: hovered ? "#ef4444" : dark ? "#64748b" : "#94a3b8",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          whiteSpace: "nowrap",
          boxShadow: hovered ? "0 0 0 3px rgba(239,68,68,0.08)" : "none",
        }}
      >
        {confirming ? (
          <>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Remove
          </>
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 3.5h9M5 3.5V2.5a1 1 0 012 0v1M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7a1 1 0 001 .9h4a1 1 0 001-.9l.5-7"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default DeletePortfolio;