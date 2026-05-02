import React, { SyntheticEvent, useState } from "react";

interface Props {
  onPortfolioCreate: (e: SyntheticEvent) => void;
  symbol: string;
}

const AddPortfolio = ({ onPortfolioCreate, symbol }: Props) => {
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    onPortfolioCreate(e);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <input readOnly hidden value={symbol} />
      <button
        type="submit"
        disabled={added}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 20px",
          borderRadius: 0,
          border: "1px solid rgba(255,255,255,0.15)",
          background: added ? "rgba(255,255,255,0.05)" : hovered ? "#ffffff" : "transparent",
          color: added ? "rgba(255,255,255,0.4)" : hovered ? "#1f2228" : "#ffffff",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "'Geist Mono', monospace",
          cursor: added ? "default" : "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          textTransform: "uppercase",
          letterSpacing: "1.4px",
          opacity: added ? 0.6 : 1,
        }}
      >
        {added ? "Stored" : "Execute"}
      </button>
    </form>
  );
};

export default AddPortfolio;