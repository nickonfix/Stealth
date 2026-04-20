import React, { SyntheticEvent, useState, useEffect } from "react";

interface Props {
  onPortfolioCreate: (e: SyntheticEvent) => void;
  symbol: string;
  dark?: boolean;
}

const AddPortfolio = ({ onPortfolioCreate, symbol, dark: darkProp }: Props) => {
  /* If dark prop isn't passed (e.g. used standalone on search page), read theme independently */
  const [dark, setDark] = useState<boolean>(() => {
    if (darkProp !== undefined) return darkProp;
    if (typeof window !== "undefined") {
      return localStorage.getItem("Finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);

  /* Sync if prop changes */
  useEffect(() => {
    if (darkProp !== undefined) setDark(darkProp);
  }, [darkProp]);

  /* Listen to theme events if no prop */
  useEffect(() => {
    if (darkProp !== undefined) return;
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("Finarc-theme-change", handler);
    return () => window.removeEventListener("Finarc-theme-change", handler);
  }, [darkProp]);

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
          padding: "10px 22px",
          borderRadius: 10,
          border: added
            ? "1px solid rgba(16,185,129,0.4)"
            : hovered
            ? "1px solid rgba(16,185,129,0.5)"
            : dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.12)",
          background: added
            ? "rgba(16,185,129,0.1)"
            : hovered
            ? "linear-gradient(135deg, #10b981, #059669)"
            : dark ? "rgba(255,255,255,0.06)" : "#ffffff",
          color: added
            ? "#10b981"
            : hovered
            ? "#ffffff"
            : dark ? "#94a3b8" : "#334155",
          fontSize: 13.5,
          fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: added ? "default" : "pointer",
          transition: "all 0.22s ease",
          outline: "none",
          boxShadow: hovered && !added
            ? "0 4px 16px rgba(16,185,129,0.3)"
            : added
            ? "0 0 0 3px rgba(16,185,129,0.12)"
            : dark ? "none" : "0 1px 3px rgba(15,23,42,0.08)",
          transform: hovered && !added ? "translateY(-1px)" : "translateY(0)",
          letterSpacing: "-0.01em",
        }}
      >
        {added ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3 6-6" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add to Watchlist
          </>
        )}
      </button>
    </form>
  );
};

export default AddPortfolio;