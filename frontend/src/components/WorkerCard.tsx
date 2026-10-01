import React from 'react';
import { WorkerProfile } from '../types';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistanceString } from '../utils/distance';
import {
  Phone,
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Wrench,
  Clock,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';

interface WorkerCardProps {
  worker: WorkerProfile;
  onSelect?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelect }) => {
  const {
    openCallModal,
    currentLocation,
    setSelectedWorkerForDetail,
    toggleWorkerOnlineStatus,
    currentUser
  } = useApp();

  const isMyProfile = currentUser
    ? (currentUser.id && worker.userId === currentUser.id) ||
      (currentUser.mobile && (worker.mobile === currentUser.mobile || worker.mobile.replace(/\D/g, '') === currentUser.mobile.replace(/\D/g, ''))) ||
      (currentUser.email && worker.email && worker.email.toLowerCase() === currentUser.email.toLowerCase())
    : false;

  const distanceKm = calculateDistanceKm(
    currentLocation.lat,
    currentLocation.lng,
    worker.latitude,
    worker.longitude
  );

  const formattedDistance = formatDistanceString(distanceKm);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${worker.mobile.replace(/\D/g, '')}`;
    openCallModal({
      id: worker.id,
      type: 'worker',
      phone: worker.mobile,
      name: worker.businessName || worker.fullName,
      title: `${worker.mainSkill} (${worker.experienceYears} Years Experience)`,
      location: worker.location,
      rate: `₹${worker.expectedPayment.amount}/${worker.expectedPayment.unit}`,
      avatar: worker.profilePhoto
    });
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedWorkerForDetail(worker);
    }
  };

  const handleToggleOnline = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWorkerOnlineStatus(worker.id);
  };

  const isExtraHands = worker.profileCategory === 'extra_hands';

  return (
    <div
      className="zilo-worker-card"
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        border: isMyProfile && isExtraHands ? '2px solid #10b981' : undefined,
        boxShadow: isMyProfile && isExtraHands ? '0 8px 24px rgba(16, 185, 129, 0.18)' : undefined
      }}
    >
      {/* If this is the current user's single allowed Extra Hands profile */}
      {isMyProfile && isExtraHands && (
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            padding: '7px 12px',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
            letterSpacing: '0.02em'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>⭐ YOUR ACTIVE PROFILE</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.68rem' }}>
              1 Kept
            </span>
          </span>
          <button
            type="button"
            onClick={handleToggleOnline}
            style={{
              background: worker.isOnlineToWork ? '#fee2e2' : '#dcfce7',
              color: worker.isOnlineToWork ? '#dc2626' : '#15803d',
              border: 'none',
              borderRadius: '8px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Click to toggle your online status"
          >
            {worker.isOnlineToWork ? '🔴 Set Offline' : '🟢 Set Online'}
          </button>
        </div>
      )}

      {/* Top Banner Image */}
      <div className="zilo-card-img-wrap" style={{ position: 'relative' }}>
        <img
          src={worker.profilePhoto}
          alt={worker.fullName}
          className="zilo-card-img"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Badge top-left */}
        <span
          className="zilo-skill-chip"
          style={{
            background: isExtraHands ? '#10b981' : '#2563eb',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isExtraHands ? <Sparkles size={12} /> : <Wrench size={12} />}
          {worker.mainSkill}
        </span>

        {/* Status indicator top-right */}
        {isExtraHands ? (
          isMyProfile ? (
            <button
              type="button"
              onClick={handleToggleOnline}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: worker.isOnlineToWork ? 'rgba(16, 185, 129, 0.95)' : 'rgba(100, 116, 139, 0.9)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)'
              }}
              title="Click to toggle your online status"
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: worker.isOnlineToWork ? '#ffffff' : '#cbd5e1'
                }}
              />
              <span>{worker.isOnlineToWork ? '🟢 Online (Click to Offline)' : '⚪ Offline'}</span>
            </button>
          ) : (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(16, 185, 129, 0.95)',
                color: 'white',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#ffffff'
                }}
              />
              <span>🟢 Online to Work</span>
            </span>
          )
        ) : (
          <span
            className="zilo-status-pill available"
            style={{
              background: 'rgba(37, 99, 235, 0.95)',
              color: 'white'
            }}
          >
            ⚡ All-Time Business
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="zilo-card-body">
        {/* Name, Business and Verification */}
        <div className="zilo-card-header-row">
          <div className="zilo-worker-title-group">
            <h3 className="zilo-worker-name" style={{ fontSize: '1.1rem' }}>
              {worker.businessName || worker.fullName}
            </h3>
            {worker.businessName && worker.fullName !== worker.businessName && (
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Contact: {worker.fullName}
              </span>
            )}
          </div>

          {worker.isVerified && (
            <span className="zilo-verified-badge" title="Verified Direct Contact">
              <ShieldCheck size={14} />
              Verified
            </span>
          )}
        </div>

        {/* Education Badge for Extra Hands (Requirement 3) */}
        {isExtraHands && (
          <div style={{ marginTop: '6px', marginBottom: '4px' }}>
            {worker.isEducated ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#1d4ed8'
                }}
              >
                <GraduationCap size={13} /> 🎓 Educated ({worker.educationTitle || 'Graduate'})
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#475569'
                }}
              >
                🛠️ General / Standard Helper
              </span>
            )}
          </div>
        )}

        {/* Free Time Slot details if Extra Hands */}
        {isExtraHands && worker.freeTimeDetails && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#059669',
              background: '#ecfdf5',
              padding: '4px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              fontWeight: 600
            }}
          >
            <Clock size={12} />
            <span>{worker.freeTimeDetails}</span>
          </div>
        )}

        {/* Rating Row */}
        <div className="zilo-rating-row" style={{ marginTop: '8px' }}>
          <div className="zilo-stars">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span className="zilo-rating-num">{worker.rating.toFixed(1)}</span>
            <span className="zilo-review-count">({worker.reviewCount || 24} reviews)</span>
          </div>
        </div>

        {/* Location & Experience Meta */}
        <div className="zilo-meta-list">
          <div className="zilo-meta-item">
            <MapPin size={14} className="meta-icon" />
            <span className="meta-location">{worker.location}</span>
            <span className="meta-distance">{formattedDistance}</span>
          </div>

          <div className="zilo-meta-item">
            <Briefcase size={14} className="meta-icon" />
            <span>{worker.experienceYears} Years Experience</span>
          </div>
        </div>

        {/* Expected Payment Row — only for Skilled Workers & Service Providers, not Extra Hands */}
        {!isExtraHands && (
          <div className="zilo-price-box">
            <span className="price-label">Service rate:</span>
            <span className="price-amount">
              ₹{worker.expectedPayment.amount}
              <span className="price-unit">/{worker.expectedPayment.unit}</span>
            </span>
          </div>
        )}

        {/* Skill Tags */}
        <div className="zilo-skills-cloud">
          {(worker.otherSkills && worker.otherSkills.length > 0
            ? worker.otherSkills.slice(0, 3)
            : ['Reliable', 'Prompt Service', 'Direct Contact']
          ).map((skill, idx) => (
            <span key={idx} className="zilo-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions Footer: View Details & CALL NOW */}
      <div className="zilo-card-actions">
        <button
          type="button"
          className="zilo-btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
        </button>

        <button
          type="button"
          className="zilo-btn-call-now"
          onClick={handleCall}
          title={`Call ${worker.businessName || worker.fullName} directly`}
        >
          <Phone size={15} className="phone-icon-pulse" />
          <span>CALL NOW</span>
        </button>
      </div>
    </div>
  );
};
