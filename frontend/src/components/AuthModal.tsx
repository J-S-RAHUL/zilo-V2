import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PRESENTATION_USERS } from '../data/seedData';
import { Users, Briefcase, Phone, X, Lock, Mail, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { GoogleIcon, GoogleAuthModal } from './GoogleAuthModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, setCurrentView, showToast, authModalMode } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode || 'login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [selectedGoal, setSelectedGoal] = useState<'employer' | 'worker'>('employer');
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Sync mode if changed from external trigger
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showToast('Please enter your Email/Mobile and Password.');
      return;
    }

    const demoUser = {
      id: `user-${Date.now()}`,
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Verified User',
      mobile: loginIdentifier.replace(/\D/g, '').length === 10 ? loginIdentifier : '9876543210',
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@example.com`,
      role: 'employer' as const,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(demoUser);
    showToast(`Welcome back, ${demoUser.name}!`);
    onClose();
    setCurrentView('dashboard');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupMobile.trim() || !signupPassword.trim()) {
      showToast('Please fill in your name, 10-digit mobile number, and password.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: signupName.trim(),
      mobile: signupMobile.trim(),
      email: signupEmail.trim() || `${signupName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      role: selectedGoal,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newUser);
    showToast(`Welcome to Zilo, ${signupName}! Account created.`);
    onClose();

    if (selectedGoal === 'employer') {
      setCurrentView('post-job');
    } else {
      setCurrentView('create-worker');
    }
  };

  const setQuickDemoUser = (role: 'employer' | 'worker') => {
    if (role === 'employer') {
      setCurrentUser({
        id: 'user-ramesh',
        name: 'Ramesh',
        mobile: '9876543210',
        email: 'ramesh@example.com',
        role: 'employer',
        createdAt: '2026-09-15T10:00:00Z'
      });
      showToast('Logged in as Employer (Ramesh)');
    } else {
      setCurrentUser({
        id: 'user-ravi',
        name: 'Ravi Kumar',
        mobile: '9876543211',
        email: 'ravi.kumar@example.com',
        role: 'worker',
        createdAt: '2026-09-10T08:30:00Z'
      });
      showToast('Logged in as Worker (Ravi Kumar)');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header with Mode Tabs */}
        <div className="auth-modal-header">
          <div className="auth-brand-logo">
            <span className="z-mark">Z</span>
            <span className="z-name">ZILO</span>
          </div>

          <button onClick={onClose} className="auth-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle: Login vs Sign Up */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-mode-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form-body">
            <div className="auth-intro">
              <h3>Welcome back</h3>
              <p>Sign in to post jobs, view worker contacts, and manage your activity.</p>
            </div>

            {/* Google 1-Click Login Option */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '11px',
                fontSize: '0.94rem',
                fontWeight: 700,
                color: '#1f2937',
                cursor: 'pointer',
                marginBottom: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0 1.25rem', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Email / Mobile Number</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. 9876543210 or name@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Login
            </button>

            <div className="auth-switch-prompt">
              <span>Don't have an account? </span>
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Login with all User Mails */}
            <div className="quick-demo-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="demo-label" style={{ fontWeight: 700, color: '#1e293b' }}>⚡ 1-Click Demo Accounts (Presentation):</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{DEMO_PRESENTATION_USERS.length} Profiles</span>
              </div>
              <div className="demo-users-pills-list">
                {DEMO_PRESENTATION_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="demo-account-pill-btn"
                    onClick={() => {
                      setCurrentUser({
                        id: u.id,
                        name: u.name,
                        mobile: u.mobile,
                        email: u.email,
                        role: u.role,
                        education: u.education,
                        educationDegree: u.educationDegree,
                        avatar: u.avatarPhoto,
                        createdAt: '2026-09-15T10:00:00Z'
                      });
                      showToast(`✨ Logged in as ${u.name} (${u.email})!`);
                      onClose();
                      if (u.primaryActionView === 'admin') {
                        setCurrentView('admin');
                      } else {
                        setCurrentView('dashboard');
                      }
                    }}
                    title={`Log in as ${u.name} (${u.email})`}
                  >
                    <div className="pill-left">
                      <span className="pill-name">{u.name}</span>
                      <span className="pill-mail">{u.email}</span>
                    </div>
                    <span className="pill-role" style={{ color: u.badgeColor }}>
                      {u.category === 'employer' && '🏢 Employer'}
                      {u.category === 'tradesman' && '🛠️ Tradesman'}
                      {u.category === 'extra_hands' && '🎓 Student'}
                      {u.category === 'service' && '💼 Service'}
                      {u.category === 'admin' && '🛡️ Admin'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="auth-form-body">
            <div className="auth-intro">
              <h3>Create your Zilo account</h3>
              <p>Direct worker-to-employer connections with zero commission.</p>
            </div>

            {/* Question: What are you looking for? (Required by prompt) */}
            <div className="auth-goal-question">
              <label className="goal-label">What are you looking for?</label>
              <div className="goal-options-grid">
                <div
                  className={`goal-card ${selectedGoal === 'employer' ? 'selected' : ''}`}
                  onClick={() => setSelectedGoal('employer')}
                >
                  <div className="goal-icon-box">
                    <Users size={20} />
                  </div>
                  <strong>I Need Workers</strong>
                  <span>Post jobs & call skilled workers directly</span>
                </div>

                <div
                  className={`goal-card ${selectedGoal === 'worker' ? 'selected' : ''}`}
                  onClick={() => setSelectedGoal('worker')}
                >
                  <div className="goal-icon-box">
                    <Briefcase size={20} />
                  </div>
                  <strong>I'm Looking for Work</strong>
                  <span>List your skill & get direct phone calls</span>
                </div>
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                placeholder="e.g. Ramesh or Ravi Kumar"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Mobile Number (For direct calls)</label>
              <div className="auth-input-wrap">
                <Phone size={16} className="auth-input-icon" />
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="10-digit mobile number"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Email Address (Optional)</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account
            </button>

            <div className="auth-switch-prompt">
              <span>Already have an account? </span>
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setMode('login')}
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => {
          setIsGoogleModalOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
