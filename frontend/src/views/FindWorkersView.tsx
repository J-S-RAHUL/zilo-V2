import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WorkerCard } from '../components/WorkerCard';
import { calculateDistanceKm, POPULAR_LOCATIONS } from '../utils/distance';
import {
  Search,
  MapPin,
  ChevronRight,
  Sparkles,
  Wrench,
  GraduationCap,
  PlusCircle,
  X,
  Phone,
  Clock,
  Briefcase,
  CheckCircle2,
  Users,
  ShieldCheck,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';

export const FindWorkersView: React.FC = () => {
  const {
    workers,
    currentLocation,
    setCurrentLocation,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    currentUser,
    addExtraHandsProfile,
    removeExtraHandsProfile,
    addServiceProfile,
    updateUserEducation,
    toggleWorkerOnlineStatus,
    openAuthModal,
    showToast
  } = useApp();

  // User's own Extra Hands Profile (STRICT RULE: ONLY 1 PROFILE CAN BE KEPT PER USER)
  const myExtraHandsProfile = useMemo(() => {
    if (!currentUser) return null;
    const targetUserId = currentUser.id;
    const targetMobile = (currentUser.mobile || '').trim();
    const targetEmail = (currentUser.email || '').trim().toLowerCase();

    return (
      workers.find(
        (w) =>
          w.profileCategory === 'extra_hands' &&
          ((targetUserId && w.userId === targetUserId) ||
           (targetMobile && (w.mobile === targetMobile || w.mobile.replace(/\D/g, '') === targetMobile.replace(/\D/g, ''))) ||
           (targetEmail && w.email && w.email.toLowerCase() === targetEmail))
      ) || null
    );
  }, [workers, currentUser]);

  // Primary Mode: 'extra_hands' vs 'services_provided' (Requirement 2)
  const [activeMode, setActiveMode] = useState<'extra_hands' | 'services_provided'>('extra_hands');

  // In Extra Hands: 'all' vs 'educated' (Requirement 3)
  const [extraHandsFilter, setExtraHandsFilter] = useState<'all' | 'educated'>('all');

  // In Services Provided: category filter (Requirement 4)
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');

  // Sort & Search
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'recent'>('rating');

  // Modal for adding services profile
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Requirement: "only with button they should put their profile in online and offline"
  const handleToggleMyOnlineStatus = () => {
    if (!currentUser) {
      showToast('Please sign in or select an account to put your profile online.');
      openAuthModal('login');
      return;
    }

    if (myExtraHandsProfile) {
      // Toggle online status directly
      toggleWorkerOnlineStatus(myExtraHandsProfile.id);
    } else {
      // Create user's 1 profile and put them ONLINE immediately!
      const isEducated = currentUser.education === 'educated';
      addExtraHandsProfile({
        userId: currentUser.id,
        fullName: currentUser.name,
        mobile: currentUser.mobile,
        email: currentUser.email,
        mainSkill: isEducated ? 'Academic & Digital Assistance' : 'Free Time General Helper',
        otherSkills: isEducated ? ['Tutoring', 'Computer Work', 'Office Help'] : ['Flexible Assistance', 'Prompt Service'],
        freeTimeDetails: 'Evenings & Weekends (Available Now)',
        expectedPayment: { amount: isEducated ? 250 : 300, unit: 'hour' },
        workDescription: isEducated
          ? 'Educated candidate available to work in free time with high dedication.'
          : 'Ready and dedicated to work in free time.',
        isOnlineToWork: true,
        isEducated: isEducated,
        educationTitle: isEducated
          ? (currentUser.educationDegree || 'Educated (Degree / College)')
          : 'Standard / Non-formal',
        location: currentLocation.name,
        city: currentLocation.name
      });
    }
  };

  // Form state for Services Provided
  const [srvBusinessName, setSrvBusinessName] = useState('');
  const [srvContactName, setSrvContactName] = useState(currentUser?.name || '');
  const [srvMobile, setSrvMobile] = useState(currentUser?.mobile || '');
  const [srvCategory, setSrvCategory] = useState('AC Service');
  const [srvExpYears, setSrvExpYears] = useState(5);
  const [srvRate, setSrvRate] = useState(400);
  const [srvRateUnit, setSrvRateUnit] = useState<'job' | 'day'>('job');
  const [srvDesc, setSrvDesc] = useState('All-time professional service business with fast direct phone bookings.');
  const [srvLocation, setSrvLocation] = useState(currentLocation.name);

  // Keep form name in sync with user if user logs in
  React.useEffect(() => {
    if (currentUser) {
      if (!srvContactName) setSrvContactName(currentUser.name);
      if (!srvMobile) setSrvMobile(currentUser.mobile);
    }
  }, [currentUser]);

  // Handle Add Services Provided Profile (Requirement 4)
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvBusinessName.trim() || !srvMobile.trim()) {
      showToast('Please enter your business/service name and mobile number.');
      return;
    }

    addServiceProfile({
      businessName: srvBusinessName.trim(),
      fullName: srvContactName.trim() || srvBusinessName.trim(),
      mobile: srvMobile.trim(),
      mainSkill: srvCategory,
      serviceType: srvCategory.toLowerCase().replace(/\s+/g, '_'),
      experienceYears: Number(srvExpYears),
      expectedPayment: { amount: Number(srvRate), unit: srvRateUnit },
      workDescription: srvDesc.trim(),
      location: srvLocation.trim() || currentLocation.name,
      city: currentLocation.name
    });

    setIsServiceModalOpen(false);
  };

  // Filtered workers calculation
  const displayedWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        if (!w.isVisible) return false;

        // 1. Primary Mode filtering (Extra Hands vs Services Provided)
        if (activeMode === 'extra_hands') {
          if (w.profileCategory !== 'extra_hands') return false;

          // Requirement: "dont show the people who are in offline"
          // ONLY show workers who are online!
          if (!w.isOnlineToWork) {
            return false;
          }

          // Requirement 3: "if they are educated in there main login profile it should add them in 'educated' in extra hands section , if not educated in profile in should add them in 'all' in extra hands"
          if (extraHandsFilter === 'educated' && !w.isEducated) {
            return false;
          }
        } else {
          // Services Provided
          if (w.profileCategory !== 'service') return false;

          // Category filter in Services Provided
          if (selectedServiceCategory !== 'all') {
            const cat = selectedServiceCategory.toLowerCase();
            const skill = (w.mainSkill || '').toLowerCase();
            const srvType = (w.serviceType || '').toLowerCase();
            const biz = (w.businessName || '').toLowerCase();

            if (!skill.includes(cat) && !srvType.includes(cat) && !biz.includes(cat)) {
              return false;
            }
          }
        }

        // 2. Search query matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            w.fullName.toLowerCase().includes(q) ||
            w.mainSkill.toLowerCase().includes(q) ||
            (w.businessName && w.businessName.toLowerCase().includes(q)) ||
            (w.educationTitle && w.educationTitle.toLowerCase().includes(q)) ||
            w.location.toLowerCase().includes(q) ||
            w.city.toLowerCase().includes(q) ||
            w.otherSkills?.some((s) => s.toLowerCase().includes(q)) ||
            w.workDescription.toLowerCase().includes(q);

          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'distance') {
          const distA = calculateDistanceKm(currentLocation.lat, currentLocation.lng, a.latitude, a.longitude);
          const distB = calculateDistanceKm(currentLocation.lat, currentLocation.lng, b.latitude, b.longitude);
          return distA - distB;
        }
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [
    workers,
    activeMode,
    extraHandsFilter,
    selectedServiceCategory,
    searchQuery,
    sortBy,
    currentLocation
  ]);

  // Counts for Badges (Only Online workers are counted for Extra Hands)
  const onlineExtraHands = workers.filter((w) => w.profileCategory === 'extra_hands' && w.isOnlineToWork);
  const extraHandsCount = onlineExtraHands.length;
  const servicesCount = workers.filter((w) => w.profileCategory === 'service').length;
  const educatedCount = onlineExtraHands.filter((w) => w.isEducated).length;

  const servicesCategoriesList = [
    { id: 'all', label: 'All Services', icon: '⚡' },
    { id: 'plumber', label: 'Plumber', icon: '🚿' },
    { id: 'carpenter', label: 'Carpenter', icon: '🪚' },
    { id: 'ac', label: 'AC Service', icon: '❄️' },
    { id: 'lift', label: 'Lift Worker', icon: '🛗' },
    { id: 'electrician', label: 'Electrician', icon: '⚡' },
    { id: 'painter', label: 'Painter', icon: '🎨' },
    { id: 'mason', label: 'Mason', icon: '🧱' },
    { id: 'other', label: 'Other Trades', icon: '🔧' }
  ];

  return (
    <div className="zilo-search-marketplace-page" style={{ paddingBottom: '4rem' }}>
      <div className="container">
        {/* ==================================================
            BREADCRUMB: Home > Find Work
            ================================================== */}
        <div className="zilo-breadcrumb" style={{ marginBottom: '1.25rem' }}>
          <button type="button" onClick={() => setCurrentView('home')} className="bc-link">
            Home
          </button>
          <ChevronRight size={14} className="bc-sep" />
          <span className="bc-current">Find Work</span>
        </div>

        {/* ==================================================
            REPLACED FILTERS WITH: "EXTRA HANDS" & "SERVICES PROVIDED" BUTTONS
            (Requirement 2: remove filters in "find work" and replace with "extra hands" (button) , "services provided")
            ================================================== */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Top Bar with Main Toggle Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '1.5rem'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#2563eb',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '2px'
                }}
              >
                Choose Category
              </span>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                Find Work & Services
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b' }}>
                {activeMode === 'extra_hands'
                  ? 'People working in their free time with online availability & education classification.'
                  : 'Full-time professionals & service businesses (Plumber, Carpenter, AC Service, Lift Worker, Electrician & more).'}
              </p>
            </div>

            {/* TWO PRIMARY BUTTONS: "Extra Hands" & "Services Provided" */}
            <div
              style={{
                display: 'inline-flex',
                background: '#f1f5f9',
                padding: '6px',
                borderRadius: '18px',
                gap: '8px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {/* Button 1: Extra Hands */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode('extra_hands');
                  setSearchQuery('');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '1rem',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  background:
                    activeMode === 'extra_hands'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'transparent',
                  color: activeMode === 'extra_hands' ? '#ffffff' : '#475569',
                  boxShadow:
                    activeMode === 'extra_hands'
                      ? '0 6px 18px rgba(16, 185, 129, 0.35)'
                      : 'none',
                  transform: activeMode === 'extra_hands' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <Sparkles size={18} />
                <span>Extra Hands</span>
                <span
                  style={{
                    background: activeMode === 'extra_hands' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeMode === 'extra_hands' ? '#ffffff' : '#64748b',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  {extraHandsCount}
                </span>
              </button>

              {/* Button 2: Services Provided */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode('services_provided');
                  setSearchQuery('');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '1rem',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  background:
                    activeMode === 'services_provided'
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : 'transparent',
                  color: activeMode === 'services_provided' ? '#ffffff' : '#475569',
                  boxShadow:
                    activeMode === 'services_provided'
                      ? '0 6px 18px rgba(37, 99, 235, 0.35)'
                      : 'none',
                  transform: activeMode === 'services_provided' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <Wrench size={18} />
                <span>Services Provided</span>
                <span
                  style={{
                    background: activeMode === 'services_provided' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeMode === 'services_provided' ? '#ffffff' : '#64748b',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  {servicesCount}
                </span>
              </button>
            </div>
          </div>

          {/* Sub-controls based on Selected Button */}
          {activeMode === 'extra_hands' ? (
            /* ==================================================
               MODE 1: EXTRA HANDS (Requirement 3)
               - Sub-filters: "All" and "Educated"
               - Online to work in free time indicator
               - "+ Put Profile in Extra Hands" CTA
               ================================================== */
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                {/* "All" vs "Educated" Sub-Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>
                    Filter:
                  </span>

                  {/* "All" button */}
                  <button
                    type="button"
                    onClick={() => setExtraHandsFilter('all')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: extraHandsFilter === 'all' ? '#10b981' : '#cbd5e1',
                      background: extraHandsFilter === 'all' ? '#ecfdf5' : '#ffffff',
                      color: extraHandsFilter === 'all' ? '#047857' : '#475569',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    All Extra Hands ({extraHandsCount})
                  </button>

                  {/* "Educated" button (Requirement 3) */}
                  <button
                    type="button"
                    onClick={() => setExtraHandsFilter('educated')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: extraHandsFilter === 'educated' ? '#2563eb' : '#cbd5e1',
                      background: extraHandsFilter === 'educated' ? '#eff6ff' : '#ffffff',
                      color: extraHandsFilter === 'educated' ? '#1d4ed8' : '#475569',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                    title="Shows workers who are verified Educated in their main login profile"
                  >
                    <GraduationCap size={16} />
                    <span>🎓 Educated ({educatedCount})</span>
                  </button>
                </div>

                {/* Requirement: "only with button they should put their profile in online and offline" */}
                <button
                  type="button"
                  onClick={handleToggleMyOnlineStatus}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: myExtraHandsProfile?.isOnlineToWork
                      ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                      : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '11px 22px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: myExtraHandsProfile?.isOnlineToWork
                      ? '0 6px 18px rgba(22, 163, 74, 0.4)'
                      : '0 4px 14px rgba(30, 41, 59, 0.25)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  title={
                    myExtraHandsProfile?.isOnlineToWork
                      ? 'Click to turn OFFLINE (hides your profile)'
                      : 'Click to put your profile ONLINE to work in free time'
                  }
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: myExtraHandsProfile?.isOnlineToWork ? '#4ade80' : '#94a3b8',
                      boxShadow: myExtraHandsProfile?.isOnlineToWork ? '0 0 10px #4ade80' : 'none'
                    }}
                  />
                  <span>
                    {myExtraHandsProfile?.isOnlineToWork
                      ? '🟢 You are ONLINE to Work (Click to Go Offline)'
                      : '⚪ You are OFFLINE (Click to Go ONLINE)'}
                  </span>
                </button>
              </div>

              {/* USER PROFILE STATUS BANNER (Online vs Offline) */}
              {currentUser && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    background: myExtraHandsProfile?.isOnlineToWork
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
                      : '#f8fafc',
                    border: '2px solid',
                    borderColor: myExtraHandsProfile?.isOnlineToWork ? '#16a34a' : '#cbd5e1',
                    borderRadius: '16px',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: myExtraHandsProfile?.isOnlineToWork
                      ? '0 4px 14px rgba(22, 163, 74, 0.12)'
                      : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={
                        myExtraHandsProfile?.profilePhoto ||
                        currentUser.avatar ||
                        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={currentUser.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid',
                        borderColor: myExtraHandsProfile?.isOnlineToWork ? '#16a34a' : '#94a3b8'
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: myExtraHandsProfile?.isOnlineToWork ? '#16a34a' : '#64748b',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          {myExtraHandsProfile?.isOnlineToWork ? '🟢 YOU ARE ONLINE' : '⚪ YOU ARE OFFLINE'}
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: myExtraHandsProfile?.isOnlineToWork ? '#064e3b' : '#1e293b' }}>
                          {currentUser.name}
                        </strong>
                        {currentUser.education === 'educated' ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              padding: '2px 8px',
                              borderRadius: '10px'
                            }}
                          >
                            🎓 In Educated
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '2px 8px',
                              borderRadius: '10px'
                            }}
                          >
                            🛠️ In All
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: myExtraHandsProfile?.isOnlineToWork ? '#dcfce7' : '#e2e8f0',
                            color: myExtraHandsProfile?.isOnlineToWork ? '#15803d' : '#475569',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}
                        >
                          {myExtraHandsProfile?.isOnlineToWork ? 'Visible in Search' : 'Hidden from Search'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: myExtraHandsProfile?.isOnlineToWork ? '#065f46' : '#64748b', marginTop: '3px' }}>
                        {myExtraHandsProfile?.isOnlineToWork
                          ? `Employers in ${currentLocation.name} can now call you directly. Toggle offline anytime to pause calls.`
                          : 'Your profile is currently hidden from Extra Hands search. Click the button to put your profile online to work.'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleToggleMyOnlineStatus}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: myExtraHandsProfile?.isOnlineToWork ? '#dc2626' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'white'
                        }}
                      />
                      <span>
                        {myExtraHandsProfile?.isOnlineToWork ? '⚪ Set Offline' : '🟢 Go Online to Work'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notice regarding Education matching & Online only policy */}
              <div
                style={{
                  marginTop: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >
                <span>💡</span>
                <span>
                  <strong>Online-Only Rule:</strong> Offline profiles are hidden. Put your profile online/offline directly with the button. If Educated in your login profile, you are placed in <strong>"Educated"</strong>; otherwise in <strong>"All"</strong>.
                </span>
                {currentUser && (
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: currentUser.education === 'educated' ? '#1d4ed8' : '#16a34a' }}>
                    Your Login Profile: {currentUser.education === 'educated' ? '🎓 Educated' : '🛠️ Standard'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* ==================================================
               MODE 2: SERVICES PROVIDED (Requirement 4)
               - Categories for Plumber, Carpenter, AC Service, Lift Worker, Electrician, etc.
               - "+ Add Service / Business Profile" CTA
               ================================================== */
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginRight: '4px' }}>
                    Trade:
                  </span>
                  {servicesCategoriesList.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedServiceCategory(sc.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: selectedServiceCategory === sc.id ? '#2563eb' : '#cbd5e1',
                        background: selectedServiceCategory === sc.id ? '#eff6ff' : '#ffffff',
                        color: selectedServiceCategory === sc.id ? '#1d4ed8' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{sc.icon}</span>
                      <span>{sc.label}</span>
                    </button>
                  ))}
                </div>

                {/* Action: "+ List Your Service / Business" */}
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <PlusCircle size={17} />
                  <span>+ Add Service / Business Profile</span>
                </button>
              </div>

              {/* Requirement 4 explanation */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🛠️</span>
                <span>
                  <strong>Requirement 4 Active:</strong> Services business all-time profiles: Plumber, Carpenter, AC Service, Lift Worker, Electrician & other specialized trades.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            SEARCH, LOCATION & SORT BAR
            ================================================== */}
        <div className="results-top-bar" style={{ marginBottom: '1.5rem' }}>
          {/* Search Input */}
          <div className="results-search-wrap">
            <Search size={18} className="results-search-icon" />
            <input
              type="text"
              className="results-search-input"
              placeholder={
                activeMode === 'extra_hands'
                  ? 'Search extra hands by skill, tutor, data entry, helper...'
                  : 'Search plumber, carpenter, AC service, lift worker, electrician...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Location Selector */}
          <div className="results-location-chip" title="Active location">
            <MapPin size={15} color="#2563eb" />
            <select
              value={currentLocation.name}
              onChange={(e) => {
                const found = POPULAR_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setCurrentLocation(found);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="results-sort-wrap">
            <span className="sort-label">Sort by:</span>
            <select
              className="results-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="rating">Highest Rating</option>
              <option value="distance">Nearest to Me</option>
              <option value="recent">Newly Added</option>
            </select>
          </div>
        </div>

        {/* ==================================================
            SECTION TITLE & RESULTS COUNT
            ================================================== */}
        <div className="results-title-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 className="results-main-title" style={{ fontSize: '1.4rem' }}>
              {activeMode === 'extra_hands'
                ? extraHandsFilter === 'educated'
                  ? '🎓 Educated Extra Hands'
                  : 'All Extra Hands (Free Time Workers)'
                : selectedServiceCategory !== 'all'
                ? `⚡ ${selectedServiceCategory.toUpperCase()} Services Provided`
                : 'All Services Provided (All Time Businesses)'}
            </h2>
          </div>
          <span className="results-counter-pill">
            {displayedWorkers.length} {displayedWorkers.length === 1 ? 'Profile' : 'Profiles'} Listed
          </span>
        </div>

        {/* ==================================================
            CARDS GRID (Requirement 3 & 4)
            ================================================== */}
        {displayedWorkers.length === 0 ? (
          <div className="empty-results-box" style={{ background: '#ffffff', borderRadius: '20px', padding: '3rem 2rem' }}>
            <Users size={48} className="empty-icon" />
            <h3>No Profiles Found in this Category</h3>
            <p style={{ maxWidth: '500px', margin: '8px auto', color: '#64748b' }}>
              {activeMode === 'extra_hands'
                ? 'Be the first to put your profile in Extra Hands to work in your free time.'
                : 'No service business listed matching your criteria. Add your service business now.'}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {activeMode === 'extra_hands' ? (
                <button
                  type="button"
                  className="zilo-btn-cta primary"
                  onClick={handleToggleMyOnlineStatus}
                  style={{
                    background: myExtraHandsProfile?.isOnlineToWork
                      ? '#dc2626'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff'
                  }}
                >
                  <Sparkles size={16} />
                  <span>
                    {myExtraHandsProfile?.isOnlineToWork
                      ? '⚪ Set My Profile Offline'
                      : '🟢 Put My Profile Online to Work'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="zilo-btn-cta primary"
                  onClick={() => setIsServiceModalOpen(true)}
                >
                  <PlusCircle size={16} />
                  <span>Add Service Profile</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="zilo-workers-grid-3">
            {displayedWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==================================================
          MODAL 2: ADD SERVICES PROVIDED (Requirement 4)
          ================================================== */}
      {isServiceModalOpen && (
        <div className="modal-overlay" onClick={() => setIsServiceModalOpen(false)}>
          <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Add Services Business Profile
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    For full-time service businesses (Plumber, Carpenter, AC Service, Lift Worker, Electrician, etc.)
                  </p>
                </div>
              </div>
              <button onClick={() => setIsServiceModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Service Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={srvBusinessName}
                    onChange={(e) => setSrvBusinessName(e.target.value)}
                    placeholder="e.g. CoolWave AC Care or Sri Sai Plumber"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Primary Trade / Service *
                  </label>
                  <select
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  >
                    <option value="AC Service">❄️ AC Service & Repair</option>
                    <option value="Plumber">🚿 Plumber & Sanitation</option>
                    <option value="Carpenter">🪚 Carpenter & Modular Work</option>
                    <option value="Lift Worker">🛗 Lift Worker & Maintenance</option>
                    <option value="Electrician">⚡ Electrician & Wiring</option>
                    <option value="Painter">🎨 Painter & Wall Putty</option>
                    <option value="Mason">🧱 Mason & Tile Worker</option>
                    <option value="Appliance Repair">🔧 Appliance Repair</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={srvContactName}
                    onChange={(e) => setSrvContactName(e.target.value)}
                    placeholder="e.g. Ramesh or Ravi"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Phone Number for Customer Calls *
                  </label>
                  <input
                    type="tel"
                    required
                    value={srvMobile}
                    onChange={(e) => setSrvMobile(e.target.value)}
                    placeholder="10-digit contact number"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Years in Service Business
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={srvExpYears}
                    onChange={(e) => setSrvExpYears(Number(e.target.value) || 1)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Standard / Starting Rate (₹)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="number"
                      min="100"
                      value={srvRate}
                      onChange={(e) => setSrvRate(Number(e.target.value) || 0)}
                      style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                    <select
                      value={srvRateUnit}
                      onChange={(e: any) => setSrvRateUnit(e.target.value)}
                      style={{ width: '90px', padding: '9px 6px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="job">/ Job</option>
                      <option value="day">/ Day</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  City / Service Area *
                </label>
                <input
                  type="text"
                  required
                  value={srvLocation}
                  onChange={(e) => setSrvLocation(e.target.value)}
                  placeholder="e.g. Benz Circle, Patamata, Vijayawada & surroundings"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Service Description & Specialties
                </label>
                <textarea
                  rows={2}
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="Describe your emergency services, equipment, AMC options, and specialties..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                Publish Service Business Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
