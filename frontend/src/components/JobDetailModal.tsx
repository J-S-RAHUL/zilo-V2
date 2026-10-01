import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistanceString } from '../utils/distance';
import {
  Phone,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Calendar,
  X,
  User,
  AlertTriangle,
  Mail,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export const JobDetailModal: React.FC = () => {
  const {
    selectedJobForDetail,
    setSelectedJobForDetail,
    currentLocation,
    openCallModal,
    setReportTarget,
    toggleSaveJob,
    isJobSaved
  } = useApp();

  if (!selectedJobForDetail) return null;

  const job = selectedJobForDetail;
  const saved = isJobSaved(job.id);

  const distanceKm = calculateDistanceKm(
    currentLocation.lat,
    currentLocation.lng,
    job.latitude,
    job.longitude
  );

  const handleCall = () => {
    window.location.href = `tel:${job.mobile.replace(/\D/g, '')}`;
    openCallModal({
      id: job.id,
      type: 'job',
      phone: job.mobile,
      name: job.employerName,
      title: job.jobTitle,
      subtitle: `${job.requiredWorkerSkill} • ${job.workDuration}`,
      location: job.workLocation,
      rate: `₹${job.salary.amount}/${job.salary.unit}`
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedJobForDetail(null)}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="job-detail-banner">
          <button
            onClick={() => setSelectedJobForDetail(null)}
            className="modal-close-round"
            title="Close"
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="zilo-skill-chip" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              {job.requiredWorkerSkill}
            </span>
            <span className="meta-distance" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              📍 {job.city} ({formatDistanceString(distanceKm)})
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: '12px' }}>
            {job.jobTitle}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              <span>Employer: <strong>{job.employerName}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Bar with Prominent CALL EMPLOYER (NO apply button) */}
        <div className="detail-action-bar">
          <div className="detail-pay-highlight">
            <span className="pay-caption">Offered Payment</span>
            <span className="pay-val">
              ₹{job.salary.amount}
              <small>/{job.salary.unit}</small>
            </span>
          </div>

          <div className="detail-action-buttons">
            <button
              type="button"
              className={`save-bookmark-btn ${saved ? 'saved' : ''}`}
              onClick={() => toggleSaveJob(job.id)}
              style={{ padding: '10px 14px', borderRadius: '12px' }}
            >
              {saved ? <BookmarkCheck size={18} color="#2563eb" /> : <Bookmark size={18} color="#64748b" />}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '6px' }}>
                {saved ? 'Saved' : 'Save Job'}
              </span>
            </button>

            <button
              onClick={handleCall}
              className="btn-call-hero-prominent"
              title="Call employer phone directly"
            >
              <Phone size={18} className="phone-pulse" />
              <span>📞 CALL EMPLOYER ({job.mobile})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          {/* Key Job Specifications */}
          <div className="detail-section">
            <h4 className="detail-section-title">Job Overview</h4>
            <div className="job-specs-overview-grid">
              <div className="overview-spec-box">
                <MapPin size={18} color="#2563eb" />
                <div>
                  <div className="spec-label">Work Location</div>
                  <div className="spec-value">{job.workLocation}</div>
                </div>
              </div>

              <div className="overview-spec-box">
                <Calendar size={18} color="#2563eb" />
                <div>
                  <div className="spec-label">Start Date & Duration</div>
                  <div className="spec-value">{job.workDate} • {job.workDuration}</div>
                </div>
              </div>

              <div className="overview-spec-box">
                <Clock size={18} color="#2563eb" />
                <div>
                  <div className="spec-label">Working Hours</div>
                  <div className="spec-value">{job.workingHours || 'Standard Day Shift'}</div>
                </div>
              </div>

              <div className="overview-spec-box">
                <Briefcase size={18} color="#2563eb" />
                <div>
                  <div className="spec-label">Experience Required</div>
                  <div className="spec-value">{job.experienceRequiredYears}+ Years Experience</div>
                </div>
              </div>

              {job.workersNeeded > 1 && (
                <div className="overview-spec-box">
                  <Users size={18} color="#b45309" />
                  <div>
                    <div className="spec-label">Workers Required</div>
                    <div className="spec-value">{job.workersNeeded} Workers</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Job Description */}
          <div className="detail-section">
            <h4 className="detail-section-title">Full Job Description</h4>
            <p className="detail-text" style={{ whiteSpace: 'pre-line' }}>{job.jobDescription}</p>
          </div>

          {/* Work Site Photo */}
          {job.jobPhoto && (
            <div className="detail-section">
              <h4 className="detail-section-title">Work Site / Job Photo</h4>
              <div style={{ maxHeight: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: '8px' }}>
                <img src={job.jobPhoto} alt={job.jobTitle} style={{ width: '100%', height: '100%', maxHeight: '300px', objectFit: 'cover' }} />
              </div>
            </div>
          )}

          {/* Additional Requirements */}
          {job.additionalRequirements && (
            <div className="detail-section">
              <h4 className="detail-section-title">Tools & Requirements</h4>
              <p className="detail-text">{job.additionalRequirements}</p>
            </div>
          )}

          {/* Employer Contact Information */}
          <div className="detail-section">
            <h4 className="detail-section-title">Direct Employer Contact</h4>
            <div className="contact-box-card">
              <div className="contact-row">
                <User size={16} color="#64748b" />
                <span>Contact Person: <strong>{job.employerName}</strong></span>
              </div>
              <div className="contact-row">
                <Phone size={16} color="#16a34a" />
                <span>Mobile Number: <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>+91 {job.mobile}</strong></span>
              </div>
              {job.email && (
                <div className="contact-row">
                  <Mail size={16} color="#64748b" />
                  <span>Email: {job.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-sticky-footer">
          <button
            onClick={() => setReportTarget({ type: 'job', id: job.id, title: job.jobTitle })}
            className="report-link-btn"
          >
            <AlertTriangle size={14} /> Report Job Listing
          </button>

          <button
            onClick={handleCall}
            className="btn-call-now"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Phone size={17} /> 📞 CALL EMPLOYER ({job.mobile})
          </button>
        </div>
      </div>
    </div>
  );
};
