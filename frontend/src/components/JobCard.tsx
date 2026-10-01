import React from 'react';
import { JobPost } from '../types';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistanceString } from '../utils/distance';
import { Phone, MapPin, Calendar, Clock, Briefcase, Bookmark, BookmarkCheck } from 'lucide-react';

interface JobCardProps {
  job: JobPost;
  onSelect?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const { openCallModal, currentLocation, setSelectedJobForDetail, toggleSaveJob, isJobSaved } = useApp();

  const saved = isJobSaved(job.id);

  // Calculate distance between user's current location and job location
  const distanceKm = calculateDistanceKm(
    currentLocation.lat,
    currentLocation.lng,
    job.latitude,
    job.longitude
  );

  const formattedDistance = formatDistanceString(distanceKm);

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedJobForDetail(job);
    }
  };

  return (
    <div className="zilo-job-card" onClick={handleCardClick}>
      {/* Top Header Row with Category Pill & Distance */}
      <div className="zilo-job-header">
        <span className="zilo-skill-chip">{job.requiredWorkerSkill}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="meta-distance">{formattedDistance}</span>
          <button
            type="button"
            className={`save-bookmark-btn ${saved ? 'saved' : ''}`}
            onClick={handleToggleSave}
            title={saved ? 'Remove from saved' : 'Save job'}
          >
            {saved ? <BookmarkCheck size={16} color="#2563eb" /> : <Bookmark size={16} color="#64748b" />}
          </button>
        </div>
      </div>

      {/* Main Job Title */}
      <h3 className="zilo-job-title">{job.jobTitle}</h3>

      {/* Employer Info */}
      <div className="zilo-employer-row">
        <span className="employer-label">Employer:</span>
        <strong className="employer-name">{job.employerName}</strong>
      </div>

      {/* Key Specifications Grid */}
      <div className="zilo-job-specs">
        <div className="job-spec-item">
          <MapPin size={14} className="meta-icon" />
          <span>{job.workLocation}</span>
        </div>

        <div className="job-spec-item highlight-pay">
          <span className="currency-symbol">💰</span>
          <strong>₹{job.salary.amount}/{job.salary.unit}</strong>
        </div>

        <div className="job-spec-item">
          <Calendar size={14} className="meta-icon" />
          <span>{job.workDuration}</span>
        </div>

        <div className="job-spec-item">
          <Briefcase size={14} className="meta-icon" />
          <span>{job.experienceRequiredYears}+ Years Exp</span>
        </div>
      </div>

      {/* Work Site Photo if uploaded */}
      {job.jobPhoto && (
        <div style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
          <img src={job.jobPhoto} alt={job.jobTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Short Job Description */}
      <p className="zilo-job-desc">{job.jobDescription}</p>

      {/* Direct Employer Phone Display */}
      <div className="zilo-phone-preview">
        <span className="contact-label">Contact:</span>
        <span className="contact-phone">📞 {job.mobile}</span>
      </div>

      {/* Action Buttons: View Details & CALL EMPLOYER (Strictly NO apply button) */}
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
          title={`Call ${job.employerName} directly at ${job.mobile}`}
        >
          <Phone size={15} className="phone-icon-pulse" />
          <span>CALL EMPLOYER</span>
        </button>
      </div>
    </div>
  );
};
