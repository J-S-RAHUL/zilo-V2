import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleIcon, GoogleAuthModal } from './GoogleAuthModal';
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  GraduationCap,
  Sparkles,
  Wrench,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User
} from 'lucide-react';

export const GoogleHeroLoginBanner: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    setCurrentView,
    logout,
    updateUserEducation,
    showToast,
    workers
  } = useApp();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEducation, setSignupEducation] = useState<'educated' | 'not_educated'>('educated');
  const [signupDegree, setSignupDegree] = useState('Degree / College Graduate');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Please enter your mobile or email.');
      return;
    }

    const isEmail = identifier.includes('@');
    const demoUser = {
      id: `user-${Date.now()}`,
      name: isEmail ? identifier.split('@')[0] : 'Verified User',
      mobile: identifier.replace(/\D/g, '').length === 10 ? identifier : '9876543210',
      email: isEmail ? identifier : `${identifier}@example.com`,
      role: 'worker' as const,
      education: 'educated' as const,
      educationDegree: 'College Graduate',
      createdAt: new Date().toISOString()
    };

    setCurrentUser(demoUser);
    showToast(`Welcome back, ${demoUser.name}!`);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupMobile.trim()) {
      showToast('Please enter your name and 10-digit mobile number.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: signupName.trim(),
      mobile: signupMobile.trim(),
      email: `${signupName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      role: 'worker' as const,
      education: signupEducation,
      educationDegree: signupEducation === 'educated' ? signupDegree : 'Standard / Non-formal',
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newUser);
    showToast(`Account created! Welcome, ${newUser.name}.`);
  };

  const handleQuickDemo = (demoType: 'ramesh' | 'priya' | 'ravi') => {
    if (demoType === 'ramesh') {
      setCurrentUser({
        id: 'user-ramesh',
        name: 'Ramesh',
        mobile: '9876543210',
        email: 'ramesh@example.com',
        role: 'employer',
        education: 'educated',
        educationDegree: 'MBA Graduate',
        createdAt: '2026-09-15T10:00:00Z'
      });
      showToast('Logged in as Ramesh (Employer - Educated)');
    } else if (demoType === 'priya') {
      setCurrentUser({
        id: 'user-priya',
        name: 'Priya Sharma',
        mobile: '9876543212',
        email: 'priya.sharma@example.com',
        role: 'worker',
        education: 'educated',
        educationDegree: 'B.Sc Computer Science',
        createdAt: '2026-09-20T11:00:00Z'
      });
      showToast('Logged in as Priya (Extra Hands - Educated Profile)');
    } else {
      setCurrentUser({
        id: 'user-ravi',
        name: 'Ravi Kumar',
        mobile: '9876543211',
        email: 'ravi.kumar@example.com',
        role: 'worker',
        education: 'not_educated',
        educationDegree: 'Vocational Skilled Trades',
        createdAt: '2026-09-10T08:30:00Z'
      });
      showToast('Logged in as Ravi Kumar (Services - Carpenter)');
    }
  };

  const myExtraHandsProfile = currentUser
    ? workers.find(
        (w) =>
          w.profileCategory === 'extra_hands' &&
          ((currentUser.id && w.userId === currentUser.id) ||
           (currentUser.mobile && (w.mobile === currentUser.mobile || w.mobile.replace(/\D/g, '') === currentUser.mobile.replace(/\D/g, ''))) ||
           (currentUser.email && w.email && w.email.toLowerCase() === currentUser.email.toLowerCase()))
      )
    : null;

  return (
    <>
      <section
        className="google-hero-login-section"
        style={{
          padding: '0 1.25rem',
          marginTop: '-1.5rem',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div className="container" style={{ maxWidth: '1180px' }}>
          {!currentUser ? (
            /* ==================================================
               NOT LOGGED IN: Complete Down Login Section
               ================================================== */
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(37, 99, 235, 0.04)'
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#2563eb',
                        letterSpacing: '0.06em'
                      }}
                    >
                      Instant Account Access
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.72rem',
                        color: '#16a34a',
                        background: '#dcfce7',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 700
                      }}
                    >
                      <ShieldCheck size={12} /> Direct Contact Promise
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    Sign in to Zilo
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                    Connect directly with free-time helpers in <strong>Extra Hands</strong> or full-time businesses in <strong>Services Provided</strong>.
                  </p>
                </div>

                {/* 1-Click Continue with Google Button */}
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#ffffff',
                    color: '#1f2937',
                    border: '2px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 24px',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <GoogleIcon size={20} />
                  <span>Continue with Google</span>
                  <ArrowRight size={16} color="#64748b" />
                </button>
              </div>

              {/* Direct Form & Demo Login Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                  alignItems: 'start'
                }}
              >
                {/* Left: Direct Login / Signup Form with Education selection */}
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        background: authTab === 'login' ? '#2563eb' : '#f1f5f9',
                        color: authTab === 'login' ? '#ffffff' : '#64748b'
                      }}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthTab('signup')}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        background: authTab === 'signup' ? '#2563eb' : '#f1f5f9',
                        color: authTab === 'signup' ? '#ffffff' : '#64748b'
                      }}
                    >
                      New User Sign Up
                    </button>
                  </div>

                  {authTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Mobile Number or Email
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                          <input
                            type="text"
                            placeholder="e.g. 9876543210 or yourname@gmail.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px 10px 36px',
                              borderRadius: '10px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                          <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px 10px 36px',
                              borderRadius: '10px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          marginTop: '4px',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        Sign In Now
                      </button>
                    </form>
                  ) : (
                    /* SIGN UP FORM WITH EDUCATION SELECTION */
                    <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma or Ravi Kumar"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.88rem'
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value)}
                          maxLength={10}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.88rem'
                          }}
                          required
                        />
                      </div>

                      {/* Education Qualification in Main Login Profile (Requirement 3) */}
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                          🎓 Education Qualification in Profile:
                        </label>
                        <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: '#64748b' }}>
                          If marked <strong>Educated</strong>, your profile is added to <strong>"Educated"</strong> in Extra Hands. If not educated, you will be in <strong>"All"</strong>.
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSignupEducation('educated')}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '8px',
                              border: '2px solid',
                              borderColor: signupEducation === 'educated' ? '#2563eb' : '#cbd5e1',
                              background: signupEducation === 'educated' ? '#eff6ff' : '#ffffff',
                              color: signupEducation === 'educated' ? '#2563eb' : '#475569',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            🎓 Educated (Graduate/Student)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupEducation('not_educated')}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '8px',
                              border: '2px solid',
                              borderColor: signupEducation === 'not_educated' ? '#16a34a' : '#cbd5e1',
                              background: signupEducation === 'not_educated' ? '#f0fdf4' : '#ffffff',
                              color: signupEducation === 'not_educated' ? '#16a34a' : '#475569',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            🛠️ Not Educated / Standard
                          </button>
                        </div>

                        {signupEducation === 'educated' && (
                          <input
                            type="text"
                            placeholder="Degree/Field (e.g. B.Sc, B.Tech, Degree, Intermediate)"
                            value={signupDegree}
                            onChange={(e) => setSignupDegree(e.target.value)}
                            style={{
                              width: '100%',
                              marginTop: '8px',
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        )}
                      </div>

                      <button
                        type="submit"
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '11px',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        Create Account & Proceed
                      </button>
                    </form>
                  )}
                </div>

                {/* Right: Quick Demo 1-Click Access */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="#2563eb" />
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      Fast 1-Click Demo Logins
                    </h3>
                  </div>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                    Switch between demo profiles to test Extra Hands ("Educated" vs "All") and Services Provided:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Demo 1: Priya - Extra Hands (Educated) */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('priya')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#bfdbfe';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.3rem' }}>🎓</span>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                            Priya Sharma (Educated Profile)
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>
                            B.Sc Graduate • Extra Hands • Online to work
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                        🟢 Online
                      </span>
                    </button>

                    {/* Demo 2: Ravi Kumar - Services / Carpenter */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('ravi')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.3rem' }}>🪚</span>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                            Ravi Kumar (Standard / Not Educated)
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Master Carpenter • Full-Time Services Business
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                        Services
                      </span>
                    </button>

                    {/* Demo 3: Ramesh - Employer */}
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('ramesh')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.3rem' }}>👔</span>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                            Ramesh (Employer - Educated)
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Direct Employer • Hiring & Calling Workers
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                        Employer
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================================================
               LOGGED IN: Connected Account Bar with Education Badge & Fast Access
               ================================================== */
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '24px',
                padding: '1.5rem 2rem',
                boxShadow: '0 12px 30px -8px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                {/* User Info with Education status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff`}
                    alt={currentUser.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #2563eb',
                      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        Welcome, {currentUser.name}
                      </h3>

                      {/* Education Badge from Main Profile */}
                      {currentUser.education === 'educated' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#1d4ed8'
                          }}
                          title="Your profile is marked as Educated (added under 'Educated' in Extra Hands)"
                        >
                          <GraduationCap size={14} /> 🎓 Educated ({currentUser.educationDegree || 'Degree/College'})
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#475569'
                          }}
                          title="Your profile is marked as Not Educated / Standard (added under 'All' in Extra Hands)"
                        >
                          🛠️ Standard / Non-formal Profile
                        </span>
                      )}
                      {/* Extra Hands 1 Profile Status Badge */}
                      {myExtraHandsProfile ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: '#065f46'
                          }}
                          title="Only 1 profile can be kept in Extra Hands per account"
                        >
                          <Sparkles size={13} color="#059669" /> Extra Hands (1 Kept):{' '}
                          {myExtraHandsProfile.isOnlineToWork ? '🟢 Online' : '⚪ Offline'}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#64748b'
                          }}
                        >
                          Extra Hands: 0 Kept (1 Allowed)
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '3px' }}>
                      📞 +91 {currentUser.mobile} • Role: <strong>{currentUser.role.toUpperCase()}</strong> •{' '}
                      <button
                        type="button"
                        onClick={() => {
                          const nextEdu = currentUser.education === 'educated' ? 'not_educated' : 'educated';
                          updateUserEducation(nextEdu, nextEdu === 'educated' ? 'Graduate / Degree' : 'Standard');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          padding: 0
                        }}
                      >
                        Toggle Education to {currentUser.education === 'educated' ? 'Not Educated' : 'Educated'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: Extra Hands & Services Provided */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Button 1: Extra Hands */}
                  <button
                    type="button"
                    onClick={() => setCurrentView('find-workers')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Sparkles size={16} />
                    <span>
                      {myExtraHandsProfile
                        ? `Extra Hands (${myExtraHandsProfile.isOnlineToWork ? '🟢 Online' : '⚪ Offline'} • 1 Kept)`
                        : 'Extra Hands (+ Put 1 Profile)'}
                    </span>
                  </button>

                  {/* Button 2: Services Provided */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('find-workers');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <Wrench size={16} />
                    <span>Services Provided (All Time)</span>
                  </button>

                  {/* Dashboard link */}
                  <button
                    type="button"
                    onClick={() => setCurrentView('dashboard')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </button>

                  {/* Switch Account */}
                  <button
                    type="button"
                    onClick={logout}
                    title="Sign out / Switch account"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      color: '#64748b',
                      border: 'none',
                      padding: '10px 10px',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={14} /> Exit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Google Sign-in Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </>
  );
};
