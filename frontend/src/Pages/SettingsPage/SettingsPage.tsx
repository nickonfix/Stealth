import React from 'react';
import { Link } from 'react-router-dom';

const SettingsItem = ({ to, title, description, icon }: { to: string; title: string; description: string; icon: string }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: 24, padding: '32px',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
    textDecoration: 'none', transition: 'all 0.2s',
  }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
    <div style={{ fontSize: 24, opacity: 0.6 }}>{icon}</div>
    <div style={{ flex: 1 }}>
       <h3 style={{ fontFamily: "'Geist Mono', monospace", fontSize: 16, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{title}</h3>
       <p style={{ fontFamily: "'Geist Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{description}</p>
    </div>
    <div style={{ color: '#ffffff', fontSize: 18 }}>→</div>
  </Link>
);

const SettingsPage = () => {
  return (
    <div style={{ background: '#1f2228', minHeight: '100vh', color: '#ffffff', padding: '120px 40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
           <h2 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>Terminal / Config</h2>
           <h1 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '48px', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>SETTINGS</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
           <SettingsItem 
             to="/profile" 
             title="Identity / Profile" 
             description="Update your username, email, and public identifier." 
             icon="👤"
           />
           <SettingsItem 
             to="/forgot-password" 
             title="Security / Passcode" 
             description="Reset your access credentials and security protocols." 
             icon="🔑"
           />
           <SettingsItem 
             to="/notifications" 
             title="Signals / Alerts" 
             description="Manage real-time push notifications and data updates." 
             icon="🔔"
           />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
