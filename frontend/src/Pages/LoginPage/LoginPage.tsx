import React, { useState, useEffect, useRef } from 'react'
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../Context/useAuth';

type LoginFormInputs = {
  userName: string;
  password: string;
}

const validation = Yup.object({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
})

/* ── Spotlight: mouse-tracking radial glow (Aceternity) ── */
const Spotlight = ({ dark }: { dark: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement!;
    const move = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const opacity = dark ? '0.07' : '0.09';
      el.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(16,185,129,${opacity}), transparent 60%)`;
    };
    parent.addEventListener('mousemove', move);
    return () => parent.removeEventListener('mousemove', move);
  }, [dark]);
  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 0, borderRadius: 'inherit', transition: 'background 0.08s ease',
    }} />
  );
};

/* ── Moving border button (Aceternity conic gradient animation) ── */
const MovingBorderBtn = ({ children, type, dark }: { children: React.ReactNode; type?: "submit" | "button"; dark: boolean }) => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    let frame: number;
    const tick = () => { setAngle(a => (a + 1.4) % 360); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  
  const internalBg = dark ? "#111827" : "#ffffff";
  const hoverBg = dark ? "#1f2937" : "#f0fdf4";
  const textColor = dark ? "#f9fafb" : "#0a0a0a";

  return (
    <div style={{
      position: 'relative', padding: '2.5px', borderRadius: '12px',
      background: `conic-gradient(from ${angle}deg, #10b981, #6ee7b7, ${dark ? '#070b0f' : '#ffffff'}, #34d399, #10b981)`,
    }}>
      <button type={type} style={{
        width: '100%', padding: '0.82rem 1rem', background: internalBg,
        border: 'none', borderRadius: '10px',
        fontFamily: "'Geist', 'Inter', sans-serif",
        fontSize: '14px', fontWeight: 700, color: textColor,
        cursor: 'pointer', letterSpacing: '0.01em',
        transition: 'background 0.2s, transform 0.1s',
        position: 'relative', zIndex: 1,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
        onMouseLeave={e => { e.currentTarget.style.background = internalBg; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.985)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {children}
      </button>
    </div>
  );
};

/* ── Glowing input on focus ── */
const GlowInput = ({ id, type, placeholder, hasError, reg, dark }: {
  id: string; type: string; placeholder: string; hasError?: boolean; reg: any; dark: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  
  const bg = dark 
    ? (focused ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)") 
    : (focused ? "#f0fdf4" : "#fafafa");
  const border = focused 
    ? "#10b981" 
    : hasError ? "#fca5a5" : (dark ? "rgba(255,255,255,0.1)" : "#e5e7eb");
  const textColor = dark ? "#f3f4f6" : "#111827";

  return (
    <div style={{ position: 'relative' }}>
      {focused && (
        <div style={{
          position: 'absolute', inset: -2, borderRadius: '12px', zIndex: 0,
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          filter: 'blur(6px)', opacity: dark ? 0.2 : 0.3,
        }} />
      )}
      <input
        id={id} type={type} placeholder={placeholder} {...reg}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', padding: '0.76rem 1rem',
          border: `1.5px solid ${border}`,
          borderRadius: '10px', outline: 'none',
          background: bg,
          fontFamily: "'Geist', 'Inter', sans-serif",
          fontSize: '0.92rem', color: textColor, boxSizing: 'border-box' as const,
          transition: 'all 0.2s',
        }}
      />
    </div>
  );
};

/* ── Ticker tape data ── */
const TICKERS = [
  { sym: 'AAPL', val: '+1.24%', up: true }, { sym: 'TSLA', val: '-0.83%', up: false },
  { sym: 'NVDA', val: '+3.71%', up: true }, { sym: 'MSFT', val: '+0.52%', up: true },
  { sym: 'AMZN', val: '+1.09%', up: true }, { sym: 'GOOGL', val: '-0.21%', up: false },
  { sym: 'META', val: '+2.14%', up: true }, { sym: 'BRK.B', val: '+0.44%', up: true },
  { sym: 'JPM', val: '-0.61%', up: false }, { sym: 'V', val: '+0.87%', up: true },
];

const LoginPage = () => {
  const { loginUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(validation),
    defaultValues: { userName: '', password: '' }
  });

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

  const handleLogin = (form: LoginFormInputs) => loginUser(form.userName, form.password);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          background: ${dark ? "#070b0f" : "#ffffff"};
          font-family: 'Geist', 'Inter', sans-serif;
          display: flex; flex-direction: column;
          position: relative; overflow-x: hidden;
          transition: background 0.3s ease;
        }

        /* Aceternity dot-grid background */
        .lp-bg-dots {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(${dark ? "rgba(16,185,129,0.15)" : "#d1d5db"} 1px, transparent 1px);
          background-size: 26px 26px;
        }
        /* Radial vignette to fade dots at center */
        .lp-bg-fade {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(ellipse 75% 75% at 50% 55%,
            ${dark ? "rgba(7,11,15,0.92)" : "rgba(255,255,255,0.95)"} 0%,
            ${dark ? "rgba(7,11,15,0.6)" : "rgba(255,255,255,0.6)"} 55%,
            transparent 100%
          );
        }

        /* ── Ticker ── */
        .ticker-outer {
          position: relative; z-index: 10;
          border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.06)" : "#f3f4f6"};
          background: ${dark ? "rgba(0,0,0,0.3)" : "#fff"}; padding: 7px 0; overflow: hidden;
          backdrop-filter: blur(8px);
        }
        /* left/right fade masks */
        .ticker-outer::before, .ticker-outer::after {
          content: ''; position: absolute; top: 0; bottom: 0; z-index: 2; width: 80px;
          pointer-events: none;
        }
        .ticker-outer::before { left: 0; background: linear-gradient(to right, ${dark ? "#070b0f" : "#fff"}, transparent); }
        .ticker-outer::after  { right:0; background: linear-gradient(to left,  ${dark ? "#070b0f" : "#fff"}, transparent); }
        .ticker-track {
          display: flex; gap: 2.8rem;
          animation: ticker-scroll 28s linear infinite;
          width: max-content;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tick-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.73rem; font-weight: 500; letter-spacing: 0.05em; white-space: nowrap;
        }
        .tick-sym { color: ${dark ? "#94a3b8" : "#374151"}; }
        .tick-up  { color: #10b981; }
        .tick-dn  { color: #ef4444; }

        /* ── Center wrapper ── */
        .lp-center {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2.5rem 1.5rem 3rem;
          position: relative; z-index: 5;
        }

        /* ── Badge above card ── */
        .lp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: ${dark ? "rgba(16,185,129,0.1)" : "#f0fdf4"}; 
          border: 1px solid ${dark ? "rgba(16,185,129,0.2)" : "#bbf7d0"};
          border-radius: 999px; padding: 4px 14px 4px 10px;
          font-size: 0.73rem; font-weight: 500; color: ${dark ? "#10b981" : "#065f46"};
          letter-spacing: 0.04em; margin-bottom: 1.2rem;
          animation: fadeDown 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }
        .lp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10b981;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Card ── */
        .lp-card {
          width: 100%; max-width: 520px;
          background: ${dark ? "rgba(15,23,32,0.8)" : "rgba(255,255,255,0.78)"};
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"};
          border-radius: 22px; padding: 2.4rem 2.2rem 2rem;
          box-shadow: ${dark 
            ? "0 0 0 1px rgba(255,255,255,0.05) inset, 0 16px 48px rgba(0,0,0,0.4)" 
            : "0 0 0 1px rgba(255,255,255,0.5) inset, 0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)"};
          position: relative; overflow: hidden;
          animation: fadeUp 0.55s 0.05s cubic-bezier(.22,.68,0,1.2) both;
          transition: background 0.3s, border-color 0.3s;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* corner glow decoration */
        .lp-glow-corner {
          position: absolute; top: -80px; right: -80px;
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 68%);
          pointer-events: none;
        }

        /* ── Logo inside card ── */
        .lp-logo {
          display: flex; align-items: center; gap: 9px; margin-bottom: 1.8rem;
          position: relative; z-index: 1;
        }
        .lp-logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(16,185,129,0.35);
        }
        .lp-logo-icon svg { width: 18px; height: 18px; }
        .lp-logo-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem; color: ${dark ? "#f3f4f6" : "#0a0a0a"}; letter-spacing: -0.02em;
        }
        .lp-logo-name em { font-style: italic; color: #10b981; }

        /* ── Headings ── */
        .lp-head {
          font-family: 'Instrument Serif', serif;
          font-size: 2.3rem; font-weight: 400; color: ${dark ? "#fff" : "#0a0a0a"};
          letter-spacing: -0.035em; line-height: 1.12;
          margin-bottom: 0.3rem; position: relative; z-index: 1;
        }
        .lp-head em { font-style: italic; color: #10b981; }
        .lp-sub {
          font-size: 0.95rem; color: ${dark ? "#64748b" : "#6b7280"}; font-weight: 300;
          margin-bottom: 1.8rem; line-height: 1.5; position: relative; z-index: 1;
        }

        /* ── Fields ── */
        .lp-field { margin-bottom: 1rem; position: relative; z-index: 1; }
        .lp-label {
          display: block; font-size: 0.77rem; font-weight: 500;
          color: ${dark ? "#94a3b8" : "#374151"}; margin-bottom: 0.4rem; letter-spacing: 0.025em;
        }
        .lp-error {
          font-size: 0.73rem; color: #ef4444; margin-top: 0.28rem;
          display: flex; align-items: center; gap: 3px;
        }

        .lp-row {
          display: flex; align-items: center; justify-content: space-between;
          margin: 1rem 0 1.3rem; position: relative; z-index: 1;
        }
        .lp-remember { display: flex; align-items: center; gap: 7px; cursor: pointer; }
        .lp-remember input { accent-color: #10b981; width: 14px; height: 14px; cursor: pointer; }
        .lp-remember span { font-size: 0.8rem; color: ${dark ? "#64748b" : "#6b7280"}; }
        .lp-forgot {
          font-size: 0.8rem; color: #10b981; text-decoration: none; font-weight: 500;
        }
        .lp-forgot:hover { text-decoration: underline; }

        /* ── Divider ── */
        .lp-div {
          display: flex; align-items: center; gap: 10px;
          margin: 1.2rem 0 1rem; position: relative; z-index: 1;
        }
        .lp-div::before, .lp-div::after {
          content: ''; flex: 1; height: 1px; background: ${dark ? "rgba(255,255,255,0.06)" : "#f0f0f0"};
        }
        .lp-div span { font-size: 0.7rem; color: ${dark ? "#475569" : "#c4c4c4"}; letter-spacing: 0.07em; }

        .lp-signup {
          text-align: center; font-size: 0.82rem; color: ${dark ? "#64748b" : "#6b7280"};
          margin-top: 1rem; position: relative; z-index: 1;
        }
        .lp-signup a { color: #10b981; font-weight: 500; text-decoration: none; }
        .lp-signup a:hover { text-decoration: underline; }

        /* ── Stats below card ── */
        .lp-stats {
          display: flex; gap: 2rem; margin-top: 1.8rem;
          animation: fadeUp 0.55s 0.2s cubic-bezier(.22,.68,0,1.2) both;
        }
        .lp-stat { text-align: center; }
        .lp-stat-val {
          font-family: 'Instrument Serif', serif;
          font-size: 1.3rem; color: ${dark ? "#f3f4f6" : "#111827"}; letter-spacing: -0.02em;
        }
        .lp-stat-lbl { font-size: 0.7rem; color: ${dark ? "#475569" : "#9ca3af"}; margin-top: 2px; letter-spacing: 0.04em; }
        .lp-stat-sep { width: 1px; background: ${dark ? "rgba(255,255,255,0.08)" : "#f0f0f0"}; align-self: stretch; }
      `}</style>

      <div className="lp-root">
        {/* Dot-grid bg */}
        <div className="lp-bg-dots" />
        <div className="lp-bg-fade" />

        {/* Ticker */}
        <div className="ticker-outer">
          <div className="ticker-track">
            {[...TICKERS, ...TICKERS].map((tk, i) => (
              <span key={i} className="tick-item">
                <span className="tick-sym">{tk.sym}</span>
                <span className={tk.up ? 'tick-up' : 'tick-dn'}>{tk.val}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="lp-center">
          {/* Live badge */}
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            Markets are live
          </div>

          {/* Card */}
          <div className="lp-card">
            <Spotlight dark={dark} />
            <div className="lp-glow-corner" />

            {/* Logo */}
            <div className="lp-logo">
              <div className="lp-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="lp-logo-name">Trade<em>Folio</em></span>
            </div>

            <h1 className="lp-head">Welcome <em>back</em></h1>
            <p className="lp-sub">Sign in to your portfolio and market dashboard.</p>

            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="lp-field">
                <label className="lp-label" htmlFor="userName">Username</label>
                <GlowInput
                  id="userName" type="text" placeholder="your_username"
                  hasError={!!errors.userName} reg={register("userName")}
                  dark={dark}
                />
                {errors.userName && (
                  <p className="lp-error">⚠ {errors.userName.message}</p>
                )}
              </div>

              <div className="lp-field">
                <label className="lp-label" htmlFor="password">Password</label>
                <GlowInput
                  id="password" type="password" placeholder="••••••••"
                  hasError={!!errors.password} reg={register("password")}
                  dark={dark}
                />
                {errors.password && (
                  <p className="lp-error">⚠ {errors.password.message}</p>
                )}
              </div>

              <div className="lp-row">
                <label className="lp-remember">
                  <input type="checkbox" />
                  <span style={{ transition: 'color 0.3s' }}>Remember me</span>
                </label>
                <a href="/forgot-password" className="lp-forgot">Forgot password?</a>
              </div>

              <MovingBorderBtn type="submit" dark={dark}>
                Sign in to your portfolio →
              </MovingBorderBtn>
            </form>

            <div className="lp-div"><span>OR</span></div>

            <p className="lp-signup">
              New here?{' '}
              <a href="/register">Create a free account</a>
            </p>
          </div>

          {/* Stats strip */}
          <div className="lp-stats">
            {[
              { val: '$2.4B+', lbl: 'Assets tracked' },
              { val: '180K+', lbl: 'Investors' },
              { val: '99.9%', lbl: 'Uptime' },
            ].map((s, i) => (
              <React.Fragment key={s.lbl}>
                {i > 0 && <div className="lp-stat-sep" />}
                <div className="lp-stat">
                  <div className="lp-stat-val">{s.val}</div>
                  <div className="lp-stat-lbl">{s.lbl}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;