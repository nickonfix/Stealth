import React, { useState, useEffect } from "react";

const t = (dark: boolean, light: string, darkVal: string) => dark ? darkVal : light;

const PlaceholderPage: React.FC<{ title: string; subtitle: string; icon: string }> = ({ title, subtitle, icon }) => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("finarc-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
    window.addEventListener("finarc-theme-change", handler);
    return () => window.removeEventListener("finarc-theme-change", handler);
  }, []);

  const bg          = t(dark, "#f8fafc",  "#070b0f");
  const textPrimary = t(dark, "#0f172a",  "#f1f5f9");
  const textMuted   = t(dark, "#94a3b8",  "#475569");
  const green       = "#10b981";
  const greenBg     = t(dark, "rgba(16,185,129,0.07)", "rgba(16,185,129,0.08)");
  const greenBorder = t(dark, "rgba(16,185,129,0.25)", "rgba(16,185,129,0.2)");

  return (
    <section
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s ease",
        padding: 40,
      }}
    >
      <div
        style={{
          width: 80, height: 80, borderRadius: 20,
          background: greenBg, border: `1px solid ${greenBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, marginBottom: 24,
        }}
      >
        {icon}
      </div>
      <h1
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(32px, 4vw, 48px)",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: textPrimary,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 15, color: textMuted, textAlign: "center", maxWidth: 440, lineHeight: 1.65 }}>
        {subtitle}
      </p>
      <div
        style={{
          marginTop: 32, padding: "8px 20px",
          background: greenBg, border: `1px solid ${greenBorder}`,
          borderRadius: 999, fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          color: green, letterSpacing: "0.06em",
        }}
      >
        COMING SOON
      </div>
    </section>
  );
};

export default PlaceholderPage;
