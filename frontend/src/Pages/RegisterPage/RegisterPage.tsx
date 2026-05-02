import React, { useState } from 'react'
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../Context/useAuth';
import { Link } from 'react-router-dom';

type RegisterFormInputs = {
  email: string;
  userName: string;
  password: string;
}

const validation = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  userName: Yup.string().required("Username required"),
  password: Yup.string().required("Password required")
})

/* ── Glowing input on focus ── */
const GlowInput = ({ id, type, placeholder, hasError, reg }: {
  id: string; type: string; placeholder: string; hasError?: boolean; reg: any;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} type={type} placeholder={placeholder} {...reg}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '14px 0',
          border: 'none',
          borderBottom: `1px solid ${focused ? "#ffffff" : hasError ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
          background: 'transparent',
          fontFamily: "'Geist Mono', monospace",
          fontSize: '15px', color: '#ffffff', boxSizing: 'border-box' as const,
          transition: 'all 0.2s',
          outline: 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      />
    </div>
  );
};

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: yupResolver(validation),
    defaultValues: { email: '', userName: '', password: '' }
  });

  const handleRegister = (form: RegisterFormInputs) => registerUser(form.email, form.userName, form.password);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1f2228', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background patterns */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        zIndex: 1,
        animation: 'lp-fade-up 0.6s ease-out both'
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <h2 style={{ 
            fontFamily: "'Geist Mono', monospace", 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.4)', 
            letterSpacing: '0.3em', 
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Terminal / Registration
          </h2>
          <h1 style={{ 
            fontFamily: "'Geist Mono', monospace", 
            fontSize: '48px', 
            fontWeight: 300,
            color: '#ffffff', 
            letterSpacing: '-0.02em', 
            textTransform: 'uppercase',
            margin: 0
          }}>
            FINARC
          </h1>
        </div>

        {/* Card */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '48px 40px',
          position: 'relative'
        }}>
          <h3 style={{ 
            fontFamily: "'Geist Mono', monospace", 
            fontSize: '18px', 
            fontWeight: 300, 
            color: '#ffffff', 
            marginBottom: '32px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Create <span style={{ color: 'rgba(255,255,255,0.4)' }}>Account</span>
          </h3>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', 
                marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: "'Geist Sans', sans-serif"
              }} htmlFor="email">Email</label>
              <GlowInput
                id="email" type="email" placeholder="EMAIL_ADDRESS"
                hasError={!!errors.email} reg={register("email")}
              />
              {errors.email && (
                <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', fontFamily: "'Geist Mono', monospace" }}>{errors.email.message}</p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', 
                marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: "'Geist Sans', sans-serif"
              }} htmlFor="userName">ID</label>
              <GlowInput
                id="userName" type="text" placeholder="USER_IDENTIFIER"
                hasError={!!errors.userName} reg={register("userName")}
              />
              {errors.userName && (
                <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', fontFamily: "'Geist Mono', monospace" }}>{errors.userName.message}</p>
              )}
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ 
                  fontSize: '10px', color: 'rgba(255,255,255,0.4)', 
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  fontFamily: "'Geist Sans', sans-serif"
                }} htmlFor="password">Passcode</label>
                <Link to="/forgot-password" style={{ 
                  fontSize: '9px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
                  fontFamily: "'Geist Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em'
                }} onMouseEnter={e=>e.currentTarget.style.color='#ffffff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
                  Forgot?
                </Link>
              </div>
              <GlowInput
                id="password" type="password" placeholder="••••••••"
                hasError={!!errors.password} reg={register("password")}
              />
              {errors.password && (
                <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '8px', fontFamily: "'Geist Mono', monospace" }}>{errors.password.message}</p>
              )}
            </div>

            <button type="submit" style={{ 
              width: '100%', padding: '16px', background: '#ffffff', color: '#1f2228',
              border: 'none', fontFamily: "'Geist Mono', monospace", fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', textTransform: 'uppercase',
              letterSpacing: '1.4px', transition: 'opacity 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.opacity='0.9'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              Register Account
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to="/login" style={{ 
              fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              fontFamily: "'Geist Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px'
            }} onMouseEnter={e=>e.currentTarget.style.color='#ffffff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
              Return to Login ←
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lp-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;