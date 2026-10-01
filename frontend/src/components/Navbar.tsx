import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_LOCATIONS } from '../utils/distance';
import { LanguageCode } from '../types';
import {
  Search,
  MapPin,
  Globe,
  Briefcase,
  Users,
  PlusCircle,
  LayoutDashboard,
  Shield,
  Crosshair,
  ChevronDown,
  Bell,
  LogOut,
  User,
  X,
  Zap,
  Mail
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentLocation,
    setCurrentLocation,
    useGpsLocation,
    language,
    setLanguage,
    currentUser,
    openAuthModal,
    logout,
    t,
    setSelectedCategory,
    setSearchQuery
  } = useApp();

  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' }
  ];

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navSearchInput.trim()) return;
    setSearchQuery(navSearchInput.trim());
    setCurrentView('find-workers');
    setShowQuickSearch(false);
  };

  const isLandingPage = currentView === 'home';

  return (
    <header className="zilo-navbar">
      <div className="container zilo-nav-inner">
        {/* Brand Logo */}
        <div
          className="zilo-brand"
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('home');
          }}
          title="ZILO Homepage"
        >
          <div className="zilo-brand-logo-mark">
            <span className="zilo-logo-symbol">Z</span>
          </div>
          <span className="zilo-brand-text">ZILO</span>
        </div>

        {/* Center Navigation Links */}
        <nav className="zilo-nav-links">
          <button
            type="button"
            className={`zilo-nav-link ${currentView === 'find-workers' ? 'active' : ''}`}
            onClick={() => setCurrentView('find-workers')}
          >
            Find Work (Extra Hands & Services)
          </button>

          <button
            type="button"
            className={`zilo-nav-link ${currentView === 'find-jobs' ? 'active' : ''}`}
            onClick={() => setCurrentView('find-jobs')}
          >
            Find Jobs
          </button>

          <button
            type="button"
            className={`zilo-nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            My Dashboard
          </button>

          {/* Post a Job button */}
          <button
            type="button"
            className={`zilo-nav-link-special ${currentView === 'post-job' ? 'active' : ''}`}
            onClick={() => setCurrentView('post-job')}
          >
            <PlusCircle size={15} />
            <span>Post a Job</span>
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="zilo-nav-right">
          {/* Quick Search trigger (Reference 2 Search icon) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="zilo-icon-btn"
              onClick={() => setShowQuickSearch(!showQuickSearch)}
              title="Quick Search"
            >
              <Search size={18} />
            </button>

            {showQuickSearch && (
              <form onSubmit={handleNavSearch} className="zilo-quick-search-dropdown">
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search workers or skills..."
                  value={navSearchInput}
                  onChange={(e) => setNavSearchInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="zilo-btn-xs-primary">Go</button>
              </form>
            )}
          </div>

          {/* Location Selector */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="zilo-location-btn"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              title="Change Discovery Location"
            >
              <MapPin size={15} className="zilo-pin-icon" />
              <span className="location-name">{currentLocation.name}</span>
              <ChevronDown size={13} color="#64748b" />
            </button>

            {showLocationMenu && (
              <div className="zilo-dropdown-menu location-menu">
                <div className="dropdown-header-title">Select Location</div>
                <button
                  type="button"
                  className="gps-quick-btn"
                  onClick={() => {
                    useGpsLocation();
                    setShowLocationMenu(false);
                  }}
                >
                  <Crosshair size={15} /> Use Live GPS
                </button>

                <div className="location-scroll-list">
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      className={`location-opt ${currentLocation.name === loc.name ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentLocation(loc);
                        setShowLocationMenu(false);
                      }}
                    >
                      <span>{loc.name}</span>
                      <span className="location-state-tag">{loc.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Picker */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="zilo-icon-btn lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              title="Select Language"
            >
              <Globe size={16} />
              <span className="lang-code">{language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="zilo-dropdown-menu lang-menu">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-opt ${language === l.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell with badge (Reference 2) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="zilo-icon-btn notify-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="zilo-bell-badge">2</span>
            </button>

            {showNotifications && (
              <div className="zilo-dropdown-menu notify-menu">
                <div className="dropdown-header-title">Notifications</div>
                <div className="notify-item unread">
                  <div className="notify-dot" />
                  <div>
                    <div className="notify-title">New Carpenter Jobs in Vijayawada</div>
                    <div className="notify-time">10 mins ago • 3 new postings</div>
                  </div>
                </div>
                <div className="notify-item">
                  <div className="notify-dot read" />
                  <div>
                    <div className="notify-title">Direct Dial Feature Active</div>
                    <div className="notify-time">Call employers & workers instantly with 1 tap</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login & Sign Up CTA */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="zilo-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Account Menu"
              >
                <span className="zilo-avatar-circle">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="zilo-nav-user-name">{currentUser.name}</span>
                <ChevronDown size={13} color="#64748b" />
              </button>

              {showUserMenu && (
                <div className="zilo-dropdown-menu user-menu">
                  <div className="user-dropdown-header">
                    <strong className="user-title">{currentUser.name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
                      <Mail size={12} />
                      <span>{currentUser.email}</span>
                    </div>
                    <span className="user-mobile">📞 +91 {currentUser.mobile}</span>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span className="user-role-badge">{currentUser.role.toUpperCase()} MODE</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px', background: currentUser.education === 'educated' ? '#eff6ff' : '#f1f5f9', color: currentUser.education === 'educated' ? '#1d4ed8' : '#475569' }}>
                        {currentUser.education === 'educated' ? '🎓 Educated' : '🛠️ Standard'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('dashboard');
                      setShowUserMenu(false);
                    }}
                    style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}
                  >
                    <Zap size={16} color="#2563eb" /> ⚡ Presentation Switcher (Mails)
                  </button>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('find-workers');
                      setShowUserMenu(false);
                    }}
                  >
                    <Briefcase size={16} /> Find Work (Extra Hands & Services)
                  </button>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('dashboard');
                      setShowUserMenu(false);
                    }}
                  >
                    <LayoutDashboard size={16} /> My Dashboard
                  </button>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('create-worker');
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={16} /> Worker Profile
                  </button>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('post-job');
                      setShowUserMenu(false);
                    }}
                  >
                    <Briefcase size={16} /> Post Requirement
                  </button>

                  <button
                    type="button"
                    className="menu-link-btn"
                    onClick={() => {
                      setCurrentView('admin');
                      setShowUserMenu(false);
                    }}
                  >
                    <Shield size={16} color="#dc2626" /> Admin Panel
                  </button>

                  <div className="menu-divider" />

                  <button
                    type="button"
                    className="menu-link-btn logout"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="zilo-auth-btns">
              <button
                type="button"
                className="zilo-btn-text"
                onClick={() => openAuthModal('login')}
              >
                Login
              </button>

              <button
                type="button"
                className="zilo-btn-signup"
                onClick={() => openAuthModal('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
