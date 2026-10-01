import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistanceString } from '../utils/distance';
import {
  Phone,
  Star,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Calendar,
  X,
  MessageSquare,
  AlertTriangle,
  Award
} from 'lucide-react';

export const WorkerDetailModal: React.FC = () => {
  const {
    selectedWorkerForDetail,
    setSelectedWorkerForDetail,
    currentLocation,
    openCallModal,
    reviews,
    setReviewWorkerTarget,
    setReportTarget
  } = useApp();

  if (!selectedWorkerForDetail) return null;

  const worker = selectedWorkerForDetail;
  const distanceKm = calculateDistanceKm(
    currentLocation.lat,
    currentLocation.lng,
    worker.latitude,
    worker.longitude
  );

  const workerReviews = reviews.filter((r) => r.workerId === worker.id);

  const handleCall = () => {
    window.location.href = `tel:${worker.mobile.replace(/\D/g, '')}`;
    openCallModal({
      id: worker.id,
      type: 'worker',
      phone: worker.mobile,
      name: worker.fullName,
      title: `${worker.mainSkill} • ${worker.experienceYears} Years Experience`,
      location: worker.location,
      rate: `₹${worker.expectedPayment.amount}/${worker.expectedPayment.unit}`,
      avatar: worker.profilePhoto
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedWorkerForDetail(null)}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Profile Header */}
        <div className="worker-detail-banner">
          <button
            onClick={() => setSelectedWorkerForDetail(null)}
            className="modal-close-round"
            title="Close"
          >
            <X size={20} />
          </button>

          <div className="worker-header-flex">
            <img
              src={worker.profilePhoto}
              alt={worker.fullName}
              className="worker-detail-avatar"
            />
            <div className="worker-header-meta">
              <div className="worker-name-line">
                <h2>{worker.fullName}</h2>
                {worker.isVerified && (
                  <span className="verified-pill">
                    <ShieldCheck size={14} /> Verified Worker
                  </span>
                )}
              </div>

              <div className="worker-skill-subtitle">
                🔨 {worker.mainSkill}
              </div>

              <div className="worker-rating-badge-row">
                <span className="rating-pill">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <strong>{worker.rating.toFixed(1)}</strong>
                  <span>({worker.reviewCount || 24} reviews)</span>
                </span>

                <span className={`status-pill ${worker.isAvailable ? 'available' : 'busy'}`}>
                  {worker.isAvailable ? '🟢 Available Now' : '🔴 Currently Unavailable'}
                </span>

                <span className="location-pill">
                  <MapPin size={13} /> {worker.location} ({formatDistanceString(distanceKm)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar with Prominent CALL NOW */}
        <div className="detail-action-bar">
          {worker.profileCategory !== 'extra_hands' && (
            <div className="detail-pay-highlight">
              <span className="pay-caption">Expected Payment</span>
              <span className="pay-val">
                ₹{worker.expectedPayment.amount}
                <small>/{worker.expectedPayment.unit}</small>
              </span>
            </div>
          )}

          <div className="detail-action-buttons">
            <button
              onClick={handleCall}
              className="btn-call-hero-prominent"
              title="Direct Phone Call"
            >
              <Phone size={18} className="phone-pulse" />
              <span>📞 CALL NOW ({worker.mobile})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          {/* About Section */}
          <div className="detail-section">
            <h4 className="detail-section-title">About Me</h4>
            <p className="detail-text">{worker.workDescription}</p>
          </div>

          {/* Skills Section */}
          <div className="detail-section">
            <h4 className="detail-section-title">Skills & Specializations</h4>
            <div className="skills-badge-list">
              <span className="primary-skill-tag">★ {worker.mainSkill} (Primary)</span>
              {worker.otherSkills?.map((s, idx) => (
                <span key={idx} className="secondary-skill-tag">{s}</span>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="detail-section">
            <h4 className="detail-section-title">Work Experience</h4>
            <div className="info-grid-2col">
              <div className="info-box-item">
                <Briefcase size={16} color="#2563eb" />
                <div>
                  <div className="info-box-label">Total Experience</div>
                  <div className="info-box-val">{worker.experienceYears} Years</div>
                </div>
              </div>

              <div className="info-box-item">
                <Clock size={16} color="#2563eb" />
                <div>
                  <div className="info-box-label">Preferred Hours</div>
                  <div className="info-box-val">{worker.preferredWorkingHours}</div>
                </div>
              </div>
            </div>

            {worker.previousWorkExperience && (
              <div className="past-work-box">
                <strong>Track Record:</strong> {worker.previousWorkExperience}
              </div>
            )}
          </div>

          {/* Portfolio & Work Photos */}
          {worker.portfolioImages && worker.portfolioImages.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Work Photos & Portfolio ({worker.portfolioImages.length})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginTop: '10px' }}>
                {worker.portfolioImages.map((pImg, idx) => (
                  <a
                    key={idx}
                    href={pImg}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      height: '100px',
                      display: 'block',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img
                      src={pImg}
                      alt={`Work sample ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Work Preferences & Availability */}
          <div className="detail-section">
            <h4 className="detail-section-title">Work Preferences & Availability</h4>
            <div className="info-grid-2col">
              <div className="pref-item">
                <span className="pref-label">Work Type:</span>
                <span className="pref-val">{worker.workType}</span>
              </div>
              <div className="pref-item">
                <span className="pref-label">Preferred Cities:</span>
                <span className="pref-val">{worker.preferredLocation}</span>
              </div>
              <div className="pref-item">
                <span className="pref-label">Max Travel Distance:</span>
                <span className="pref-val">{worker.maxTravelDistanceKm} km</span>
              </div>
              <div className="pref-item">
                <span className="pref-label">Available Days:</span>
                <span className="pref-val">{worker.availableDays.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="detail-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 className="detail-section-title" style={{ margin: 0 }}>Ratings & Direct Reviews ({workerReviews.length})</h4>
              <button
                onClick={() => setReviewWorkerTarget(worker)}
                className="add-review-btn"
              >
                + Leave a Review
              </button>
            </div>

            {workerReviews.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No reviews yet. Be the first to review after calling {worker.fullName}.</p>
            ) : (
              <div className="reviews-list">
                {workerReviews.map((rev) => (
                  <div key={rev.id} className="review-card-item">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{rev.reviewerName}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.82rem' }}>
                        <Star size={13} fill="#f59e0b" /> {rev.rating}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-sticky-footer">
          <button
            onClick={() => setReportTarget({ type: 'worker', id: worker.id, title: worker.fullName })}
            className="report-link-btn"
          >
            <AlertTriangle size={14} /> Report profile issue
          </button>

          <button
            onClick={handleCall}
            className="btn-call-now"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Phone size={17} /> 📞 CALL NOW ({worker.mobile})
          </button>
        </div>
      </div>
    </div>
  );
};
