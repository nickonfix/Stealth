import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

const FONTS = `
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css');
  @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/style.css');
`;

export const NAV_LINKS = [
  { to: "/search",    label: "SEARCH"    },
  { to: "/markets",   label: "MARKETS"   },
  { to: "/portfolio", label: "PORTFOLIO" },
  { to: "/news",      label: "NEWS"      },
];

/* ─── Palette ─── */
const D = {
  bg:         "#1f2228",
  bgScrolled: "rgba(31,34,40,0.96)",
  surface:    "rgba(255,255,255,0.02)",
  surfaceHov: "rgba(255,255,255,0.05)",
  border:     "rgba(255,255,255,0.1)",
  borderHov:  "rgba(255,255,255,0.2)",
  text:       "#ffffff",
  muted:      "rgba(255,255,255,0.4)",
  accent:     "#ffffff",
};

/* ─── NavLink ─── */
const NavLink = ({ to, label, c }: { to: string; label: string; c: typeof D }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  const [hov, setHov] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center",
        padding: "8px 16px",
        fontFamily: "'Geist Mono', monospace",
        fontSize: 12, fontWeight: 400,
        color: active ? c.text : hov ? "rgba(255,255,255,0.5)" : c.text,
        textDecoration: "none",
        transition: "color 0.2s",
        letterSpacing: "1.4px",
      }}
    >
      {active && (
        <span style={{
          position: "absolute", bottom: 0, left: 16, right: 16,
          height: 1, background: "#ffffff",
        }} />
      )}
      <span style={{ position: "relative" }}>{label}</span>
    </Link>
  );
};

/* ─── Logo mark ─── */
const LogoMark = () => (
  <div style={{
    width: 24, height: 24, borderRadius: 0, flexShrink: 0,
    background: "#ffffff",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{ width: 12, height: 12, background: "#1f2228" }} />
  </div>
);

/* ══════════════════════ MAIN ══════════════════════ */
const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const dropRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const c = D;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("finarc-theme", "dark");
    window.dispatchEvent(new CustomEvent("finarc-theme-change", { detail: { dark: true } }));
  }, []);

  useEffect(() => {
    if (!document.getElementById("fn2-fonts")) {
      const s = document.createElement("style");
      s.id = "fn2-fonts"; s.textContent = FONTS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <>
      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        background: scrolled ? c.bgScrolled : "transparent",
        transition: "all 0.3s",
      }}>
        <nav style={{
          maxWidth: 1440, margin: "0 auto",
          padding: "0 24px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* ══ LOGO ══ */}
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
            <LogoMark />
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 16, fontWeight: 500,
              letterSpacing: "0.2em", color: "#ffffff", textTransform: "uppercase"
            }}>
              FINARC
            </span>
          </Link>

          {/* ══ DESKTOP NAV ══ */}
          <div className="fn2-desk" style={{ 
            display: viewportWidth > 1023 ? "flex" : "none",
            alignItems: "center", gap: 8 
          }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} label={label} c={c} />
            ))}
            
            <div style={{ width:1, height:16, background:c.border, margin: "0 16px" }}/>

            {isLoggedIn() ? (
              <div style={{ position:"relative" }} ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"6px 12px", borderRadius:0,
                    border:`1px solid ${dropdownOpen ? "#ffffff" : "rgba(255,255,255,0.1)"}`,
                    background: dropdownOpen ? "#ffffff" : "transparent",
                    cursor:"pointer", outline:"none", transition:"all 0.2s",
                  }}
                >
                  <span style={{
                    fontSize:12, fontWeight:500, fontFamily:"'Geist Mono', monospace",
                    color: dropdownOpen ? "#1f2228" : "#ffffff", letterSpacing: "1px",
                    textTransform: "uppercase"
                  }}>{user?.userName}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transition:"transform 0.2s", transform:dropdownOpen?"rotate(180deg)":"none" }}>
                    <path d="M2 3.5l3 3 3-3" stroke={dropdownOpen ? "#1f2228" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 1px)", right:0, width:200,
                    background: "#1f2228",
                    border:`1px solid rgba(255,255,255,0.1)`,
                    padding:0, animation:"fn2-drop 0.2s ease both", overflow:"hidden",
                  }}>
                    {[
                      { to:"/portfolio", label:"PORTFOLIO" },
                      { to:"/settings",  label:"SETTINGS" },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} style={{
                        display: "block", padding: "12px 16px",
                        fontFamily: "'Geist Mono', monospace", fontSize: 11,
                        color: "rgba(255,255,255,0.5)", textDecoration: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        letterSpacing: "1.4px",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.color="#ffffff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
                        {label}
                      </Link>
                    ))}
                    <button onClick={logout} style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "12px 16px", background: "transparent", border: "none",
                      fontFamily: "'Geist Mono', monospace", fontSize: 11,
                      color: "#ef4444", cursor: "pointer", letterSpacing: "1.4px",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                      SIGN OUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Link to="/login" style={{
                  padding:"8px 16px", borderRadius:0,
                  fontFamily:"'Geist Mono', monospace",
                  fontSize:12, fontWeight:400, letterSpacing:"1.4px",
                  color: "#ffffff", textDecoration:"none",
                  border:`1px solid rgba(255,255,255,0.1)`,
                  textTransform: "uppercase", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  LOG IN
                </Link>
                <Link to="/register" style={{
                  padding:"8px 20px", borderRadius:0,
                  fontFamily:"'Geist Mono', monospace",
                  fontSize:12, fontWeight:500, letterSpacing:"1.4px",
                  color: "#1f2228", textDecoration:"none",
                  background: "#ffffff", textTransform: "uppercase",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                  JOIN
                </Link>
              </div>
            )}
          </div>

          {/* ══ MOBILE TRIGGER ══ */}
          <div style={{ display: viewportWidth <= 1023 ? "flex" : "none" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: "transparent", border: "none", color: "#ffffff", cursor: "pointer"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M4 8h16M4 16h16"/>}
              </svg>
            </button>
          </div>
        </nav>

        {/* ══ MOBILE MENU ══ */}
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#1f2228", borderBottom: `1px solid ${c.border}`,
          maxHeight: menuOpen ? "100vh" : 0, opacity: menuOpen ? 1 : 0,
          overflow: "hidden", transition: "all 0.3s ease",
        }}>
          <div style={{ padding: "24px" }}>
             {NAV_LINKS.map(link => (
               <Link key={link.to} to={link.to} style={{
                 display: "block", padding: "16px 0",
                 fontFamily: "'Geist Mono', monospace", fontSize: 14,
                 color: "#ffffff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                 letterSpacing: "2px", textTransform: "uppercase"
               }}>
                 {link.label}
               </Link>
             ))}
             {!isLoggedIn() && (
               <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                 <Link to="/login" style={{ textAlign: "center", padding: "14px", border: "1px solid #ffffff", color: "#ffffff", textDecoration: "none", fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: "2px" }}>LOG IN</Link>
                 <Link to="/register" style={{ textAlign: "center", padding: "14px", background: "#ffffff", color: "#1f2228", textDecoration: "none", fontFamily: "'Geist Mono', monospace", fontSize: 12, letterSpacing: "2px" }}>JOIN</Link>
               </div>
             )}
          </div>
        </div>
      </header>

      {pathname !== "/" && <div style={{ height: 72 }} />}
      <style>{`
        @keyframes fn2-drop { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </>
  );
};

export default Navbar;