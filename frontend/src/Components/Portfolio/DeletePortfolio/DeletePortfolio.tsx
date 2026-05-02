import React, { SyntheticEvent, useState } from "react";

interface Props {
  onPortfolioDelete: (e: SyntheticEvent) => void;
  portfolioValue: string;
  dark?: boolean;
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <form onSubmit={onPortfolioDelete}>
      <input hidden readOnly value={portfolioValue} />
      <button
        type="submit"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "8px 12px",
          borderRadius: 0,
          border: hovered ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          background: hovered ? "rgba(239,68,68,0.1)" : "transparent",
          color: hovered ? "#ef4444" : "rgba(255,255,255,0.3)",
          fontSize: 10,
          fontWeight: 500,
          fontFamily: "'Geist Mono', monospace",
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {hovered ? "Purge" : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default DeletePortfolio;