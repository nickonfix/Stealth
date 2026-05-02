import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600&display=swap');
`;

export const NAV_LINKS = [
  { to: "/search",    label: "Search"    },
  { to: "/markets",   label: "Markets"   },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/news",      label: "News"      },
  { to: "/screener",  label: "Screener"  },
];

/* ─── Palette ─── */
const D = {
  bg:         "#1f2228",
  bgScrolled: "rgba(31,34,40,0.96)",
  surface:    "rgba(255,255,255,0.04)",
  surfaceHov: "rgba(255,255,255,0.07)",
  border:     "rgba(255,255,255,0.1)",
  borderHov:  "rgba(255,255,255,0.2)",
  text:       "#ffffff",
  muted:      "rgba(255,255,255,0.5)",
  accent:     "#ffffff",
  accentDim:  "rgba(255,255,255,0.05)",
  accentGlow: "rgba(255,255,255,0.1)",
};

/* ─── NavLink with solid active slot ─── */
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
        padding: "6px 14px", borderRadius: 0,
        fontFamily: "'Geist Sans', sans-serif",
        fontSize: 14, fontWeight: 400,
        color: active ? c.text : hov ? "rgba(255,255,255,0.5)" : c.text,
        textDecoration: "none",
        transition: "color 0.15s",
        zIndex: 1,
      }}
    >
      {active && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: 0,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }} />
      )}
      {!active && hov && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: 8,
          background: c.surfaceHov,
        }} />
      )}
      <span style={{ position: "relative" }}>{label}</span>
    </Link>
  );
};

/* ─── Logo mark ─── */
const LogoMark = ({ c }: { c: typeof D }) => (
  <div style={{
    width: 32, height: 32, borderRadius: 0, flexShrink: 0,
    background: "transparent",
    border: `1px solid rgba(255,255,255,0.2)`,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </div>
);

/* ══════════════════════ MAIN ══════════════════════ */
const Navbar: React.FC = () => {

  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dark = true;
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const dropRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const c = D;
  const initial = user?.userName?.[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("finarc-theme", dark ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("finarc-theme-change", { detail: { dark } }));
  }, [dark]);

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

  const iconBtnStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: 34, height: 34, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: `1px solid ${c.border}`,
    background: c.surface,
    cursor: "pointer", outline: "none",
    transition: "border-color 0.2s, background 0.2s, color 0.2s",
    ...extra,
  });

  return (
    <>
      <style>{`
        ${FONTS}
        @keyframes fn2-drop {
          from { opacity:0; transform:translateY(-5px) scale(0.98) }
          to   { opacity:1; transform:translateY(0) scale(1) }
        }
        @keyframes fn2-icon {
          from { transform:scale(0.5) rotate(-30deg); opacity:0 }
          to   { transform:scale(1) rotate(0); opacity:1 }
        }
        .fn2-desk { display:flex !important; }
        .fn2-mob  { display:none  !important; }
        @media (max-width:1023px) {
          .fn2-desk { display:none  !important; }
          .fn2-mob  { display:flex  !important; }
        }
        .fn2-dropitem {
          display:flex; align-items:center; gap:10px;
          padding:8px 11px; border-radius:8px;
          font-size:13px; font-weight:400;
          font-family:'Outfit',sans-serif;
          text-decoration:none; cursor:pointer;
          width:100%; text-align:left; border:none; outline:none;
          transition:background 0.15s, color 0.15s;
        }
      `}</style>

      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,
        background: "transparent",                                   
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled
          ? dark ? "0 1px 48px rgba(0,0,0,0.6)" : "0 1px 24px rgba(15,23,42,0.08)"
          : "none",
        transition: "background 0.3s, box-shadow 0.3s",
      }}>

      {/* <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 100,


        // background: dark
        //   ? "#000000"
        //   : scrolled ? L.bgScrolled : "rgba(248,250,252,0.85)",
        // backdropFilter: dark ? "none" : "blur(20px) saturate(160%)",
        // WebkitBackdropFilter: dark ? "none" : "blur(20px) saturate(160%)",

        background: dark
        ? scrolled ? "rgba(7,11,15,0.95)" : "#070b0f"
        : scrolled ? L.bgScrolled : "transparent",

        // background: dark
        //  ? scrolled ? "rgba(6,8,15,0.6)" : "transparent"
        //  : scrolled ? L.bgScrolled : "transparent",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        //borderBottom: dark ? "none" : scrolled ? `1px solid ${c.border}` : "none",
        //borderBottom: `1px solid ${c.border}`,
        boxShadow: scrolled
          ? dark ? "0 1px 48px rgba(0,0,0,0.6)" : "0 1px 24px rgba(15,23,42,0.08)"
          : "none",
        transition: "background 0.3s, box-shadow 0.3s",
      }}> */}


        <nav style={{
          maxWidth: 1280, margin: "0 auto",
          padding: viewportWidth <= 1023 ? "0 14px" : "0 28px", height: 62,
          display: "grid", alignItems: "center",
          gridTemplateColumns: viewportWidth <= 1023 ? "1fr auto" : "1fr auto 1fr",
          gap: 20,
        }}>

          {/* ══ LOGO ══ */}
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0, justifySelf:"start" }}>
            <LogoMark c={c} />
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 19, fontWeight: 700,
              letterSpacing: "-0.04em", color: c.text, lineHeight: 1,
            }}>
              Fin<span style={{ color: c.accent }}>Arc</span>
            </span>
          </Link>

          {/* ══ CENTER pill ══ */}
          <div className="fn2-desk" style={{ justifyContent: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 8px",
            }}>
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} label={label} c={c} />
              ))}
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="fn2-desk" style={{ alignItems:"center", gap:8, flexShrink:0, justifySelf:"end" }}>


            <div style={{ width:1, height:20, background:c.border }}/>

            {isLoggedIn() ? (
              <div style={{ position:"relative" }} ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    display:"flex", alignItems:"center", gap:8,
                    padding:"4px 10px 4px 4px", borderRadius:99,
                    border:`1px solid ${dropdownOpen ? c.borderHov : c.border}`,
                    background: dropdownOpen ? c.accentDim : c.surface,
                    cursor:"pointer", outline:"none", transition:"all 0.2s",
                    boxShadow: dropdownOpen ? `0 0 0 3px ${c.accentGlow}` : "none",
                  }}
                  onMouseEnter={e => { if (!dropdownOpen) (e.currentTarget as HTMLElement).style.borderColor = c.borderHov; }}
                  onMouseLeave={e => { if (!dropdownOpen) (e.currentTarget as HTMLElement).style.borderColor = c.border; }}
                >
                  <span style={{
                    width:28, height:28, borderRadius:"50%", flexShrink:0,
                    background: c.accentDim,
                    border:`1px solid ${dark ? "rgba(34,211,165,0.25)" : "rgba(5,150,105,0.3)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:700, color:c.accent,
                    fontFamily:"'Outfit',sans-serif",
                  }}>{initial}</span>
                  <span style={{
                    fontSize:13, fontWeight:500, fontFamily:"'Outfit',sans-serif",
                    color:c.text, maxWidth:100, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap", letterSpacing:"-0.01em",
                  }}>{user?.userName}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transition:"transform 0.2s", transform:dropdownOpen?"rotate(180deg)":"none" }}>
                    <path d="M2 3.5l3 3 3-3" stroke={c.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 10px)", right:0, width:220,
                    background: dark ? "#0b0f1a" : "#ffffff",
                    border:`1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}`,
                    borderRadius:14,
                    boxShadow: dark
                      ? "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.8)"
                      : "0 0 0 1px rgba(0,0,0,0.03), 0 16px 48px rgba(15,23,42,0.12)",
                    padding:6, animation:"fn2-drop 0.18s ease both", overflow:"hidden",
                  }}>
                    {/* Subtle top radial glow */}
                    <div style={{
                      position:"absolute", top:0, left:0, right:0, height:80,
                      background:`radial-gradient(ellipse at 50% -20%, ${c.accentGlow} 0%, transparent 70%)`,
                      pointerEvents:"none",
                    }}/>

                    <div style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"10px 11px 13px",
                      borderBottom:`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(15,23,42,0.07)"}`,
                      marginBottom:4,
                    }}>
                      <span style={{
                        width:34, height:34, borderRadius:"50%",
                        background:c.accentDim,
                        border:`1px solid ${dark?"rgba(34,211,165,0.2)":"rgba(5,150,105,0.25)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:700, fontFamily:"'Outfit',sans-serif",
                        color:c.accent, flexShrink:0,
                      }}>{initial}</span>
                      <div>
                        <p style={{ margin:0, fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif", color:c.text }}>{user?.userName}</p>
                        <p style={{ margin:"2px 0 0", fontSize:11, color:c.muted, fontFamily:"'Outfit',sans-serif" }}>Investor Account</p>
                      </div>
                    </div>

                    {[
                      { to:"/profile",   label:"Profile",     d:<path d="M7.5 5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm-5 9c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/> },
                      { to:"/portfolio", label:"My Portfolio", d:<><rect x="1.5" y="5" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5V3.5A2.5 2.5 0 0110 3.5V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                      { to:"/settings",  label:"Settings",    d:<><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                    ].map(({ to, label, d }) => (
                      <Link key={to} to={to} className="fn2-dropitem"
                        style={{ color: dark?"#94a3b8":"#475569", background:"transparent" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background=c.surface; el.style.color=c.text; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="transparent"; el.style.color=dark?"#94a3b8":"#475569"; }}>
                        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">{d}</svg>
                        {label}
                      </Link>
                    ))}

                    <div style={{ height:1, background:dark?"rgba(255,255,255,0.06)":"rgba(15,23,42,0.07)", margin:"5px 0" }}/>

                    <button onClick={logout} className="fn2-dropitem"
                      style={{ color:"#f87171", background:"transparent" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(239,68,68,0.08)"; el.style.color="#ef4444"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="transparent"; el.style.color="#f87171"; }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5"
                          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <Link to="/login" style={{
                  padding:"8px 20px", borderRadius:0,
                  fontFamily:"'Geist Mono', monospace",
                  fontSize:13, fontWeight:400, letterSpacing:"1.4px",
                  color: "#ffffff",
                  textDecoration:"none",
                  border:`1px solid rgba(255,255,255,0.1)`,
                  background:"transparent", transition:"all 0.18s",
                  textTransform: "uppercase",
                }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.05)"; el.style.color="rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="transparent"; el.style.color="#ffffff"; }}>
                  Log in
                </Link>

                <Link to="/register" style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"8px 22px", borderRadius:0,
                  fontFamily:"'Geist Mono', monospace",
                  fontSize:13, fontWeight:500, letterSpacing:"1.4px",
                  color: "#1f2228",
                  textDecoration:"none",
                  background: "#ffffff",
                  transition:"opacity 0.2s",
                  textTransform: "uppercase",
                }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.opacity="0.9"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.opacity="1"; }}>
                  Get started
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* ══ MOBILE ══ */}
          <div className="fn2-mob" style={{ alignItems:"center", gap:7, justifySelf:"end", gridColumn: viewportWidth <= 1023 ? "2" : undefined }}>

            <button onClick={() => setMenuOpen(v => !v)}
              style={iconBtnStyle({
                color:c.muted,
                background:menuOpen?c.accentDim:c.surface,
                borderColor:menuOpen?c.borderHov:c.border,
              })}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {menuOpen
                  ? <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  : <><path d="M2 4.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                     <path d="M2 8h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                     <path d="M2 11.5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></>}
              </svg>
            </button>
          </div>
        </nav>

        <div style={{
          maxHeight: menuOpen ? 560 : 0, opacity: menuOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
          background: dark ? "rgba(7,11,15,0.82)" : "rgba(248,250,252,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ padding:"14px 18px 24px", display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{
              fontSize:9.5, fontWeight:600, letterSpacing:"0.1em",
              textTransform:"uppercase", fontFamily:"'Outfit',sans-serif",
              color:c.muted, marginLeft:10, marginBottom:6,
            }}>Navigation</span>

            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"11px 14px", borderRadius:10,
                  fontFamily:"'Outfit',sans-serif", fontSize:14,
                  fontWeight:active?600:400,
                  color:active?c.accent:dark?"#94a3b8":"#475569",
                  background:active?c.accentDim:"transparent",
                  borderLeft:`2px solid ${active?c.accent:"transparent"}`,
                  textDecoration:"none",
                }}>
                  {label}
                  {active && <span style={{ width:5, height:5, borderRadius:"50%", background:c.accent }}/>}
                </Link>
              );
            })}

            <div style={{ height:1, background:c.border, margin:"10px 0 12px" }}/>

            {isLoggedIn() ? (
              <>
                <div style={{
                  display:"flex", alignItems:"center", gap:11,
                  padding:"10px 12px", borderRadius:11,
                  background:c.surface, border:`1px solid ${c.border}`, marginBottom:8,
                }}>
                  <span style={{ width:34, height:34, borderRadius:"50%", background:c.accentDim, border:`1px solid ${dark?"rgba(34,211,165,0.2)":"rgba(5,150,105,0.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:c.accent, fontFamily:"'Outfit',sans-serif" }}>{initial}</span>
                  <div>
                    <p style={{ margin:0, fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif", color:c.text }}>{user?.userName}</p>
                    <p style={{ margin:"2px 0 0", fontSize:11, color:c.muted, fontFamily:"'Outfit',sans-serif" }}>Investor Account</p>
                  </div>
                </div>
                <button onClick={logout} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:"12px", borderRadius:10, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.06)", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600, color:"#f87171", cursor:"pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Sign out
                </button>
              </>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <Link to="/login" style={{ display:"block", textAlign:"center", padding:"12px", borderRadius:10, fontFamily:"'Outfit',sans-serif", border:`1px solid ${c.border}`, fontSize:14, fontWeight:500, color:dark?"#94a3b8":"#475569", textDecoration:"none", background:c.surface }}>Log in</Link>
                <Link to="/register" style={{ display:"block", textAlign:"center", padding:"12px", borderRadius:10, fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600, color:dark?"#052e16":"#ffffff", textDecoration:"none", background:dark?"linear-gradient(135deg,#22d3a5 0%,#0ea5e9 100%)":"linear-gradient(135deg,#059669 0%,#0284c7 100%)", boxShadow:"0 4px 20px rgba(34,211,165,0.22)" }}>Get started — it's free</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: 62 }} />
    </>
  );
};

export default Navbar;