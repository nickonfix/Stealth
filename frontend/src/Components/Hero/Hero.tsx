import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   xAI Inspired StarField Background
   Creates a subtle field of twinkling stars.
───────────────────────────────────────────────────────────────────────────── */
const StarField: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const starCount = 100;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            opacity: 0,
            animation: `xai-twinkle ${star.duration} infinite ease-in-out ${star.delay}`,
          }}
        />
      ))}
      <style>{`
        @keyframes xai-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Hero Component — xAI Redesign
───────────────────────────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  return (
    <section
      style={{
        backgroundColor: "#1f2228",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        textAlign: "center",
        padding: "0 24px",
        overflow: "hidden",
        fontFamily: "'Geist Sans', sans-serif",
      }}
    >
      <StarField />

      {/* Massive Monospace Display Type */}
      <div
        style={{
          zIndex: 1,
          animation: "xai-fade-in 1.2s ease-out both",
        }}
      >
        <h1
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "clamp(64px, 15vw, 240px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          FINARC
        </h1>
        
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "600px",
            margin: "24px auto 48px",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          The ultimate platform for professional investors. 
          Real-time intelligence, filtered for clarity.
        </p>

        {/* xAI Style Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/register"
            style={{
              backgroundColor: "#ffffff",
              color: "#1f2228",
              padding: "14px 32px",
              fontSize: "14px",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 500,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1.4px",
              borderRadius: "0px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            Get Started
          </Link>
          
          <Link
            to="/search"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "14px 32px",
              fontSize: "14px",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 500,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1.4px",
              borderRadius: "0px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { 
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.05)"; 
              (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.5)";
            }}
            onMouseLeave={(e) => { 
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; 
              (e.currentTarget as HTMLElement).style.color = "#ffffff";
            }}
          >
            Explore Markets
          </Link>
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes xai-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
