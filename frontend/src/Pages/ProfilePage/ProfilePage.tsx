import React, { useEffect, useState } from 'react';
import { getProfileAPI, updateProfileAPI } from '../../Services/AuthService';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';

const ProfilePage = () => {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState({ userName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getProfileAPI();
    if (res?.data) {
      setProfile(res.data);
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const oldUsername = user?.userName;
    const res = await updateProfileAPI(profile.userName, profile.email);
    
    if (res) {
      toast.success("Database Updated / Refreshing Session", {
        icon: <span>💾</span>,
        style: {
          borderRadius: 0,
          background: "#1f2228",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }
      });

      // If the username changed, the current token is invalid for the new identity.
      // We must force a relogin as requested by the user.
      if (oldUsername !== profile.userName) {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    }
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div style={{ background: '#1f2228', minHeight: '100vh', color: '#ffffff', padding: '120px 40px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
           <h2 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>Terminal / Identity</h2>
           <h1 style={{ fontFamily: "'Geist Mono', monospace", fontSize: '48px', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>USER PROFILE</h1>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>Identifier</label>
              <input 
                value={profile.userName} 
                onChange={e => setProfile({...profile, userName: e.target.value})}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 0', color: '#ffffff', fontFamily: "'Geist Mono', monospace", fontSize: 16, outline: 'none' }}
              />
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>Communication Node (Email)</label>
              <input 
                value={profile.email} 
                onChange={e => setProfile({...profile, email: e.target.value})}
                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 0', color: '#ffffff', fontFamily: "'Geist Mono', monospace", fontSize: 16, outline: 'none' }}
              />
           </div>

           <button 
             disabled={saving}
             style={{ alignSelf: 'flex-start', padding: '12px 32px', background: '#ffffff', color: '#1f2228', border: 'none', fontFamily: "'Geist Mono', monospace", fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.4px', cursor: 'pointer', transition: 'opacity 0.2s' }}
             onMouseEnter={e=>e.currentTarget.style.opacity='0.9'}
             onMouseLeave={e=>e.currentTarget.style.opacity='1'}
           >
             {saving ? "Transmitting..." : "Update Credentials"}
           </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
