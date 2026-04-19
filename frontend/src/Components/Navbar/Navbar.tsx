import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

/* ─────────────────────────────────────────────────────────
   FinEdge Navbar — White / Dark Dual Theme
   Fonts: Instrument Serif (logo) + Plus Jakarta Sans (ui)
   Accent: Emerald #10b981
   Dark mode: toggled via document.documentElement.classList + localStorage
   ───────────────────────────────────────────────────────── */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`;

export const NAV_LINKS = [
  { to: "/search",    label: "Search"    },
  { to: "/markets",   label: "Markets"   },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/news",      label: "News"      },
  { to: "/screener",  label: "Screener"  },
];

/* ─── Reusable desktop NavLink ─── */
const NavLink = ({
  to,
  children,
  dark,
}: {
  to: string;
  children: React.ReactNode;
  dark: boolean;
}) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: active
          ? dark ? "#f1f5f9" : "#0f172a"
          : hovered
          ? dark ? "#e2e8f0" : "#0f172a"
          : dark ? "#64748b" : "#64748b",
        textDecoration: "none",
        background: active
          ? dark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)"
          : hovered
          ? dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.04)"
          : "transparent",
        transition: "all 0.18s ease",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: "absolute",
            bottom: 5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#10b981",
          }}
        />
      )}
    </Link>
  );
};

/* ── Sun / Moon SVG icons ── */
const SunIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.5" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l-1.06 1.06M4.11 11.89l-1.06 1.06"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 10A6.5 6.5 0 016 2.5a6.5 6.5 0 100 11 6.5 6.5 0 007.5-3.5z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════ MAIN NAVBAR ═══════════════════════ */
const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarHover, setAvatarHover]   = useState(false);
  const [dark, setDark]                 = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("finedge-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [themeHover, setThemeHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname }                = useLocation();

  /* Sync dark class on <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("finedge-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("finedge-theme", "light");
    }
    // Dispatch event so Hero can listen
    window.dispatchEvent(new CustomEvent("finedge-theme-change", { detail: { dark } }));
  }, [dark]);

  /* Inject Google Fonts once */
  useEffect(() => {
    if (!document.getElementById("finedge-navbar-fonts")) {
      const s = document.createElement("style");
      s.id = "finedge-navbar-fonts";
      s.textContent = FONT_IMPORT;
      document.head.appendChild(s);
    }
  }, []);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close panels on route change */
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = user?.userName?.[0]?.toUpperCase() ?? "U";

  /* ── Dropdown menu item ── */
  const DropItem = ({
    to,
    icon,
    label,
    danger,
  }: {
    to?: string;
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
  }) => {
    const [h, setH] = useState(false);
    const base: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 12px",
      borderRadius: 8,
      fontSize: 13,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 500,
      textDecoration: "none",
      transition: "background 0.15s",
      cursor: "pointer",
      background: h
        ? dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.04)"
        : "transparent",
      color: danger ? "#ef4444" : dark ? "#cbd5e1" : "#334155",
    };
    if (to) {
      return (
        <Link to={to} style={base} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
          {icon}{label}
        </Link>
      );
    }
    return (
      <button
        onClick={logout}
        style={{ ...base, border: "none", width: "100%", textAlign: "left" }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
      >
        {icon}{label}
      </button>
    );
  };

  /* ── derived colors ── */
  const bg = dark
    ? scrolled ? "rgba(10,14,20,0.97)" : "rgba(10,14,20,0.85)"
    : scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)";

  const border = dark
    ? scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.05)"
    : scrolled ? "1px solid rgba(15,23,42,0.09)" : "1px solid rgba(15,23,42,0.05)";

  const shadow = scrolled
    ? dark
      ? "0 1px 0 rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.35)"
      : "0 1px 0 rgba(0,0,0,0.03), 0 6px 28px rgba(15,23,42,0.07)"
    : "none";

  return (
    <>
      <style>{`
        ${FONT_IMPORT}
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes toggleSlide { from { transform:scale(0.7) rotate(-30deg); opacity:0 } to { transform:scale(1) rotate(0); opacity:1 } }
        .fe-desktop { display:flex !important; }
        .fe-mobile-btn { display:none !important; }
        @media (max-width:1023px) {
          .fe-desktop { display:none !important; }
          .fe-mobile-btn { display:flex !important; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 100,
          background: bg,
          backdropFilter: "saturate(200%) blur(20px)",
          WebkitBackdropFilter: "saturate(200%) blur(20px)",
          borderBottom: border,
          boxShadow: shadow,
          transition: "all 0.3s ease",
        }}
      >
        {/* Emerald gradient top rule */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, #34d399 30%, #10b981 50%, #34d399 70%, transparent 100%)",
            opacity: scrolled ? 1 : 0.55,
            transition: "opacity 0.3s",
          }}
        />

        <nav
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 32px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* ══ LOGO ══ */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(16,185,129,0.32), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <polyline points="2,15 6,9 10,12 17,4" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="4" r="2" fill="white" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: dark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Fin<span style={{ color: "#10b981" }}>Edge</span>
            </span>
          </Link>

          {/* ══ CENTER NAV LINKS ══ */}
          <div className="fe-desktop" style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} dark={dark}>{label}</NavLink>
            ))}
          </div>

          {/* ══ RIGHT: Theme toggle + Auth ══ */}
          <div className="fe-desktop" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>

            {/* ── DARK MODE TOGGLE ── */}
            <button
              onClick={() => setDark((v) => !v)}
              onMouseEnter={() => setThemeHover(true)}
              onMouseLeave={() => setThemeHover(false)}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 10,
                border: dark
                  ? themeHover ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.1)"
                  : themeHover ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(15,23,42,0.12)",
                background: dark
                  ? themeHover ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.06)"
                  : themeHover ? "rgba(16,185,129,0.06)" : "rgba(248,250,252,0.9)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
                boxShadow: themeHover ? "0 0 0 3px rgba(16,185,129,0.12)" : "none",
                flexShrink: 0,
              }}
            >
              <span key={dark ? "moon" : "sun"} style={{ animation: "toggleSlide 0.25s ease both", display: "flex" }}>
                {dark
                  ? <SunIcon color={themeHover ? "#10b981" : "#f59e0b"} />
                  : <MoonIcon color={themeHover ? "#10b981" : "#64748b"} />
                }
              </span>
            </button>

            {isLoggedIn() ? (
              /* Avatar + dropdown */
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "5px 12px 5px 5px", borderRadius: 999,
                    border: avatarHover || dropdownOpen
                      ? "1px solid rgba(16,185,129,0.4)"
                      : dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
                    background: avatarHover || dropdownOpen
                      ? "rgba(16,185,129,0.08)"
                      : dark ? "rgba(255,255,255,0.05)" : "rgba(248,250,252,0.8)",
                    cursor: "pointer", outline: "none", transition: "all 0.2s ease",
                    boxShadow: avatarHover || dropdownOpen ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: "white", boxShadow: "0 1px 6px rgba(16,185,129,0.35)", flexShrink: 0,
                    }}
                  >
                    {initial}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: dark ? "#e2e8f0" : "#1e293b", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.userName}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }}>
                    <path d="M2 4.5l4 3 4-3" stroke={dark ? "#64748b" : "#94a3b8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0, width: 220,
                      background: dark ? "#0f172a" : "white",
                      borderRadius: 14,
                      border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                      boxShadow: dark
                        ? "0 4px 8px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.06), 0 24px 48px rgba(15,23,42,0.1)",
                      padding: "6px",
                      animation: "dropIn 0.16s ease both",
                    }}
                  >
                    <div style={{ padding: "10px 12px 12px", marginBottom: 4, borderBottom: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15,23,42,0.06)" }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: dark ? "#f1f5f9" : "#0f172a" }}>{user?.userName}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Investor Account</p>
                    </div>

                    <DropItem
                      to="/profile"
                      icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.5" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4"/><path d="M2 13c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4" strokeLinecap="round"/></svg>}
                      label="Profile"
                    />
                    <DropItem
                      to="/portfolio"
                      icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="5" width="12" height="8.5" rx="1.5" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4"/><path d="M5 5V3.5A2.5 2.5 0 0110 3.5V5" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4" strokeLinecap="round"/></svg>}
                      label="My Portfolio"
                    />
                    <DropItem
                      to="/settings"
                      icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3 3l1 1M11 11l1 1M11 3l-1 1M4 11l-1 1" stroke={dark?"#94a3b8":"#64748b"} strokeWidth="1.4" strokeLinecap="round"/></svg>}
                      label="Settings"
                    />

                    <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)", margin: "6px 0" }} />

                    <DropItem
                      danger
                      icon={<svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      label="Sign out"
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: "7px 18px", borderRadius: 8,
                    fontSize: 13.5, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: dark ? "#94a3b8" : "#334155",
                    textDecoration: "none",
                    border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.11)",
                    background: "transparent", transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.04)";
                    el.style.borderColor = dark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.2)";
                    el.style.color = dark ? "#f1f5f9" : "#0f172a";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.11)";
                    el.style.color = dark ? "#94a3b8" : "#334155";
                  }}
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 18px", borderRadius: 8,
                    fontSize: 13.5, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "white", textDecoration: "none",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(16,185,129,0.28)",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-1px)";
                    el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1), 0 8px 28px rgba(16,185,129,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(16,185,129,0.28)";
                  }}
                >
                  Get started
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* ══ MOBILE: Theme + Hamburger ══ */}
          <div className="fe-mobile-btn" style={{ alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setDark((v) => !v)}
              style={{
                width: 34, height: 34, borderRadius: 8, border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.12)",
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(248,250,252,0.9)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span key={dark ? "moon" : "sun"} style={{ animation: "toggleSlide 0.25s ease both", display: "flex" }}>
                {dark ? <SunIcon color="#f59e0b" /> : <MoonIcon color="#64748b" />}
              </span>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              style={{
                padding: "7px", borderRadius: 8,
                border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
                background: menuOpen
                  ? dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.04)"
                  : dark ? "rgba(255,255,255,0.05)" : "white",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.18s",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {menuOpen
                  ? <path d="M4 4l12 12M16 4L4 16" stroke={dark ? "#94a3b8" : "#334155"} strokeWidth="1.8" strokeLinecap="round" />
                  : <path d="M3 6h14M3 10h14M3 14h14" stroke={dark ? "#94a3b8" : "#334155"} strokeWidth="1.8" strokeLinecap="round" />
                }
              </svg>
            </button>
          </div>
        </nav>

        {/* ══ MOBILE MENU ══ */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: menuOpen ? 560 : 0,
            opacity: menuOpen ? 1 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
            borderTop: menuOpen ? dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.07)" : "none",
            background: dark ? "rgba(10,14,20,0.99)" : "rgba(255,255,255,0.99)",
          }}
        >
          <div style={{ padding: "14px 20px 22px", display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ margin: "0 0 6px 12px", fontSize: 10, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Navigate
            </p>

            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: 10,
                    fontSize: 14, fontWeight: active ? 700 : 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: active ? "#059669" : dark ? "#cbd5e1" : "#334155",
                    background: active ? "rgba(16,185,129,0.08)" : "transparent",
                    borderLeft: active ? "3px solid #10b981" : "3px solid transparent",
                    textDecoration: "none", marginBottom: 1,
                  }}
                >
                  {label}
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
              );
            })}

            <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)", margin: "10px 0 12px" }} />

            {isLoggedIn() ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderRadius: 10, background: dark ? "rgba(255,255,255,0.04)" : "rgba(248,250,252,0.9)", border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.07)", marginBottom: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "white", flexShrink: 0 }}>
                    {initial}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: dark ? "#f1f5f9" : "#0f172a" }}>{user?.userName}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 11, color: "#94a3b8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Investor Account</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(254,242,242,0.8)", fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#dc2626", cursor: "pointer" }}
                >
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to="/login" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 10, border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.12)", fontSize: 14, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: dark ? "#cbd5e1" : "#334155", textDecoration: "none", background: dark ? "rgba(255,255,255,0.04)" : "white" }}>
                  Log in
                </Link>
                <Link to="/register" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "white", textDecoration: "none", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
                  Get started — it's free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: 62 }} />
    </>
  );
};

export default Navbar;