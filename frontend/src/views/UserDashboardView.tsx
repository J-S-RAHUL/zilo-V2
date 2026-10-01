import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { processImageFile } from '../utils/imageUtils';
import {
  LayoutDashboard,
  User,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  Trash2,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Calendar,
  Bookmark,
  Users,
  Eye,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  Camera,
  Upload
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    currentUser,
    workers,
    jobs,
    callHistory,
    savedJobIds,
    toggleSaveJob,
    clearCallHistory,
    openCallModal,
    toggleWorkerAvailability,
    toggleWorkerVisibility,
    deleteJob,
    toggleJobStatus,
    createOrUpdateWorkerProfile,
    showToast,
    setCurrentView,
    updateUserEducation
  } = useApp();

  const dashFileInputRef = useRef<HTMLInputElement>(null);

  // Mode: Employer vs Worker dashboard
  const [dashboardRole, setDashboardRole] = useState<'employer' | 'worker'>(
    currentUser?.role === 'worker' ? 'worker' : 'employer'
  );

  // Sub-tabs for Employer
  const [employerTab, setEmployerTab] = useState<'posted-jobs' | 'profile'>('posted-jobs');
  const [jobStatusFilter, setJobStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  // Sub-tabs for Worker
  const [workerTab, setWorkerTab] = useState<'profile' | 'saved-jobs' | 'call-history'>('profile');

  // Matching user's worker profile or demo fallback
  const myWorkerProfile =
    workers.find((w) => w.userId === currentUser?.id || w.fullName.toLowerCase().includes(currentUser?.name.toLowerCase() || '')) ||
    workers[0];

  const handleWorkerPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !myWorkerProfile) return;
    try {
      const processed = await processImageFile(file, 600, 0.85);
      createOrUpdateWorkerProfile({
        ...myWorkerProfile,
        profilePhoto: processed.dataUrl
      });
      showToast('📸 Profile photo updated from file!');
    } catch (err: any) {
      showToast(err.message || 'Error updating photo.');
    } finally {
      if (dashFileInputRef.current) dashFileInputRef.current.value = '';
    }
  };

  // Jobs posted by this employer
  const myJobs = jobs.filter(
    (j) => j.userId === currentUser?.id || j.employerName.toLowerCase().includes(currentUser?.name.toLowerCase() || '')
  );

  const activeJobs = myJobs.filter((j) => j.status === 'active');
  const completedJobs = myJobs.filter((j) => j.status === 'closed');

  // Saved jobs list
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="zilo-dashboard-page">
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Dashboard Top Header */}
        <div className="dashboard-top-header">
          <div>
            <div className="dash-title-row">
              <div className="dash-icon-box">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h1 className="dash-title">ZILO Dashboard</h1>
                <p className="dash-subtitle">
                  Logged in as <strong>{currentUser?.name}</strong> • 📞 {currentUser?.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher: Employer vs Worker Dashboard */}
          <div className="dash-role-selector">
            <button
              type="button"
              className={`role-tab-btn ${dashboardRole === 'employer' ? 'active' : ''}`}
              onClick={() => setDashboardRole('employer')}
            >
              <Briefcase size={16} />
              <span>Employer Dashboard</span>
            </button>

            <button
              type="button"
              className={`role-tab-btn ${dashboardRole === 'worker' ? 'active' : ''}`}
              onClick={() => setDashboardRole('worker')}
            >
              <User size={16} />
              <span>Worker Dashboard</span>
            </button>
          </div>
        </div>

        {/* ==================================================
            EMPLOYER DASHBOARD
            - My Posted Jobs (Active Jobs, Completed Jobs)
            - My Profile
            - Find Workers
            - Post Job
            ================================================== */}
        {dashboardRole === 'employer' && (
          <div className="employer-dashboard-content">
            {/* Quick Stat Bar */}
            <div className="dash-stats-grid">
              <div className="stat-card">
                <div className="stat-num">{myJobs.length}</div>
                <div className="stat-label">Total Posted Requirements</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#16a34a' }}>{activeJobs.length}</div>
                <div className="stat-label">Active Requirements</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#64748b' }}>{completedJobs.length}</div>
                <div className="stat-label">Completed / Closed</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#2563eb' }}>
                  {myJobs.reduce((sum, j) => sum + (j.callClicksCount || 0), 0)}
                </div>
                <div className="stat-label">Direct Worker Phone Calls</div>
              </div>
            </div>

            {/* Navigation & Action Bar */}
            <div className="dash-nav-action-bar">
              <div className="dash-sub-tabs">
                <button
                  type="button"
                  className={`dash-sub-tab ${employerTab === 'posted-jobs' ? 'active' : ''}`}
                  onClick={() => setEmployerTab('posted-jobs')}
                >
                  My Posted Jobs ({myJobs.length})
                </button>
                <button
                  type="button"
                  className={`dash-sub-tab ${employerTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setEmployerTab('profile')}
                >
                  My Profile
                </button>
              </div>

              <div className="dash-quick-cta-group">
                <button
                  type="button"
                  className="zilo-btn-secondary"
                  onClick={() => setCurrentView('find-workers')}
                >
                  <Users size={16} />
                  <span>Find Workers</span>
                </button>
                <button
                  type="button"
                  className="zilo-btn-primary"
                  onClick={() => setCurrentView('post-job')}
                >
                  <PlusCircle size={16} />
                  <span>Post Job</span>
                </button>
              </div>
            </div>

            {/* Sub-tab: Posted Jobs */}
            {employerTab === 'posted-jobs' && (
              <div className="posted-jobs-section">
                {/* Filter pills: All, Active, Completed */}
                <div className="status-filter-pills">
                  <button
                    type="button"
                    className={`status-pill-btn ${jobStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setJobStatusFilter('all')}
                  >
                    All ({myJobs.length})
                  </button>
                  <button
                    type="button"
                    className={`status-pill-btn ${jobStatusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setJobStatusFilter('active')}
                  >
                    Active Jobs ({activeJobs.length})
                  </button>
                  <button
                    type="button"
                    className={`status-pill-btn ${jobStatusFilter === 'closed' ? 'active' : ''}`}
                    onClick={() => setJobStatusFilter('closed')}
                  >
                    Completed Jobs ({completedJobs.length})
                  </button>
                </div>

                {myJobs.length === 0 ? (
                  <div className="empty-dash-card">
                    <Briefcase size={40} color="#94a3b8" />
                    <h3>No Requirements Posted Yet</h3>
                    <p>Post a job with your budget and location to receive direct calls from skilled workers.</p>
                    <button
                      type="button"
                      className="zilo-btn-primary"
                      onClick={() => setCurrentView('post-job')}
                      style={{ marginTop: '1rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>Post a Job Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="posted-jobs-list">
                    {myJobs
                      .filter((j) => (jobStatusFilter === 'all' ? true : j.status === jobStatusFilter))
                      .map((job) => (
                        <div key={job.id} className="posted-job-manage-card">
                          <div className="manage-card-main">
                            <div className="manage-header-line">
                              <span className={`status-tag ${job.status === 'active' ? 'active' : 'closed'}`}>
                                {job.status === 'active' ? '🟢 Active Listing' : '⚪ Completed / Closed'}
                              </span>
                              <span className="zilo-skill-chip">{job.requiredWorkerSkill}</span>
                            </div>

                            <h3 className="manage-job-title">{job.jobTitle}</h3>

                            <div className="manage-job-meta">
                              <span>📍 {job.workLocation}</span>
                              <span>💰 ₹{job.salary.amount}/{job.salary.unit}</span>
                              <span>⏱️ {job.workDuration}</span>
                              <span>📞 Calls: {job.callClicksCount || 0}</span>
                            </div>

                            <p className="manage-job-desc">{job.jobDescription}</p>
                          </div>

                          <div className="manage-card-actions">
                            <button
                              type="button"
                              className="manage-toggle-status-btn"
                              onClick={() => toggleJobStatus(job.id)}
                            >
                              {job.status === 'active' ? 'Mark Completed' : 'Reactivate'}
                            </button>

                            <button
                              type="button"
                              className="manage-delete-btn"
                              onClick={() => deleteJob(job.id)}
                              title="Delete requirement"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab: Employer Profile */}
            {employerTab === 'profile' && (
              <div className="profile-section-card">
                <h3 className="section-sub-title">Employer Profile Details</h3>
                <div className="profile-details-grid">
                  <div className="detail-item">
                    <span className="item-label">Contact Name</span>
                    <strong className="item-val">{currentUser?.name}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Mobile Number (Public for workers to call)</span>
                    <strong className="item-val">📞 +91 {currentUser?.mobile}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Email Address</span>
                    <strong className="item-val">{currentUser?.email}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Account Role</span>
                    <strong className="item-val">Employer / Hiring</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Education Status in Profile</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <strong className="item-val" style={{ color: currentUser?.education === 'educated' ? '#1d4ed8' : '#475569' }}>
                        {currentUser?.education === 'educated'
                          ? `🎓 Educated (${currentUser.educationDegree || 'Degree/College'})`
                          : '🛠️ Not Educated / Standard'}
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          const nextEdu = currentUser?.education === 'educated' ? 'not_educated' : 'educated';
                          updateUserEducation(nextEdu, nextEdu === 'educated' ? 'Graduate / Degree' : 'Standard');
                        }}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          color: '#2563eb',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Switch to {currentUser?.education === 'educated' ? 'Not Educated' : 'Educated'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            WORKER DASHBOARD
            - My Profile
            - Find Jobs
            - Saved Jobs
            - My Availability
            - Profile Views
            - Call History
            ================================================== */}
        {dashboardRole === 'worker' && (
          <div className="worker-dashboard-content">
            {/* Worker Quick Stat Bar */}
            <div className="dash-stats-grid">
              <div className="stat-card">
                <div className="stat-num">{myWorkerProfile?.reviewCount || 24}</div>
                <div className="stat-label">Reviews & Ratings (⭐ {myWorkerProfile?.rating.toFixed(1) || '4.8'})</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#2563eb' }}>
                  {myWorkerProfile?.isAvailable ? '142' : '88'}
                </div>
                <div className="stat-label">Profile Views This Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#16a34a' }}>{callHistory.length}</div>
                <div className="stat-label">Direct Calls Recorded</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#f59e0b' }}>{savedJobs.length}</div>
                <div className="stat-label">Saved Jobs</div>
              </div>
            </div>

            {/* Availability Toggle Banner (Requirement: My Availability) */}
            <div className={`availability-toggle-banner ${myWorkerProfile?.isAvailable ? 'available' : 'busy'}`}>
              <div className="avail-info">
                <div className="avail-status-title">
                  {myWorkerProfile?.isAvailable ? '🟢 Available for Direct Calls' : '🔴 Currently Unavailable'}
                </div>
                <div className="avail-status-desc">
                  {myWorkerProfile?.isAvailable
                    ? 'Employers searching in your city can see your phone number and call you directly.'
                    : 'Your phone number is temporarily masked so you do not receive incoming calls while busy.'}
                </div>
              </div>

              <button
                type="button"
                className="avail-toggle-btn"
                onClick={() => {
                  if (myWorkerProfile) toggleWorkerAvailability(myWorkerProfile.id);
                }}
              >
                {myWorkerProfile?.isAvailable ? (
                  <>
                    <ToggleRight size={28} color="#16a34a" />
                    <span>Set Busy</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={28} color="#94a3b8" />
                    <span>Set Available</span>
                  </>
                )}
              </button>
            </div>

            {/* Worker Dashboard Nav & Sub-tabs */}
            <div className="dash-nav-action-bar">
              <div className="dash-sub-tabs">
                <button
                  type="button"
                  className={`dash-sub-tab ${workerTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setWorkerTab('profile')}
                >
                  My Profile
                </button>
                <button
                  type="button"
                  className={`dash-sub-tab ${workerTab === 'saved-jobs' ? 'active' : ''}`}
                  onClick={() => setWorkerTab('saved-jobs')}
                >
                  Saved Jobs ({savedJobs.length})
                </button>
                <button
                  type="button"
                  className={`dash-sub-tab ${workerTab === 'call-history' ? 'active' : ''}`}
                  onClick={() => setWorkerTab('call-history')}
                >
                  Call History ({callHistory.length})
                </button>
              </div>

              <div className="dash-quick-cta-group">
                <button
                  type="button"
                  className="zilo-btn-secondary"
                  onClick={() => setCurrentView('find-jobs')}
                >
                  <Briefcase size={16} />
                  <span>Find Jobs</span>
                </button>
                <button
                  type="button"
                  className="zilo-btn-primary"
                  onClick={() => setCurrentView('create-worker')}
                >
                  <User size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Sub-tab 1: My Profile */}
            {workerTab === 'profile' && myWorkerProfile && (
              <div className="profile-view-box">
                <div className="worker-profile-summary-header">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={myWorkerProfile.profilePhoto}
                      alt={myWorkerProfile.fullName}
                      className="worker-sum-avatar"
                    />
                    <button
                      type="button"
                      onClick={() => dashFileInputRef.current?.click()}
                      title="Upload new photo from files"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        background: '#2563eb',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Camera size={15} />
                    </button>
                    <input
                      type="file"
                      ref={dashFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleWorkerPhotoChange}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 className="worker-sum-name">{myWorkerProfile.fullName}</h2>
                      <button
                        type="button"
                        onClick={() => dashFileInputRef.current?.click()}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          color: '#2563eb',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Upload size={12} /> Add photo from files
                      </button>
                    </div>
                    <div className="worker-sum-role">🔨 {myWorkerProfile.mainSkill} ({myWorkerProfile.experienceYears} Years Exp)</div>
                    <div className="worker-sum-rating">
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <span>{myWorkerProfile.rating.toFixed(1)} Rating ({myWorkerProfile.reviewCount || 24} Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="profile-details-grid">
                  <div className="detail-item">
                    <span className="item-label">Mobile Number</span>
                    <strong className="item-val">📞 +91 {myWorkerProfile.mobile}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Base Location</span>
                    <strong className="item-val">📍 {myWorkerProfile.location}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Expected Payment</span>
                    <strong className="item-val" style={{ color: '#16a34a' }}>
                      ₹{myWorkerProfile.expectedPayment.amount}/{myWorkerProfile.expectedPayment.unit}
                    </strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Work Type Preference</span>
                    <strong className="item-val">{myWorkerProfile.workType}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="item-label">Profile Education Status</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <strong className="item-val" style={{ color: currentUser?.education === 'educated' ? '#1d4ed8' : '#475569' }}>
                        {currentUser?.education === 'educated'
                          ? `🎓 Educated (${currentUser.educationDegree || 'Degree/College'})`
                          : '🛠️ Not Educated / Standard'}
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          const nextEdu = currentUser?.education === 'educated' ? 'not_educated' : 'educated';
                          updateUserEducation(nextEdu, nextEdu === 'educated' ? 'Graduate / Degree' : 'Standard');
                        }}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          color: '#2563eb',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Switch to {currentUser?.education === 'educated' ? 'Not Educated' : 'Educated'}
                      </button>
                    </div>
                  </div>
                  <div className="detail-item full-width">
                    <span className="item-label">About Me</span>
                    <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px' }}>
                      {myWorkerProfile.workDescription}
                    </p>
                  </div>
                  <div className="detail-item full-width">
                    <span className="item-label">Skills</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span className="primary-skill-tag">{myWorkerProfile.mainSkill}</span>
                      {myWorkerProfile.otherSkills?.map((s, idx) => (
                        <span key={idx} className="secondary-skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Saved Jobs */}
            {workerTab === 'saved-jobs' && (
              <div className="saved-jobs-section">
                {savedJobs.length === 0 ? (
                  <div className="empty-dash-card">
                    <Bookmark size={40} color="#94a3b8" />
                    <h3>No Saved Jobs</h3>
                    <p>Browse open work requirements and bookmark them to keep employer contacts handy.</p>
                    <button
                      type="button"
                      className="zilo-btn-primary"
                      onClick={() => setCurrentView('find-jobs')}
                      style={{ marginTop: '1rem' }}
                    >
                      <Briefcase size={16} />
                      <span>Browse Jobs</span>
                    </button>
                  </div>
                ) : (
                  <div className="saved-jobs-list">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="posted-job-manage-card">
                        <div className="manage-card-main">
                          <div className="manage-header-line">
                            <span className="zilo-skill-chip">{job.requiredWorkerSkill}</span>
                            <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>
                              ₹{job.salary.amount}/{job.salary.unit}
                            </span>
                          </div>

                          <h3 className="manage-job-title">{job.jobTitle}</h3>
                          <div className="manage-job-meta">
                            <span>Employer: <strong>{job.employerName}</strong></span>
                            <span>📍 {job.workLocation}</span>
                            <span>⏱️ {job.workDuration}</span>
                          </div>
                          <p className="manage-job-desc">{job.jobDescription}</p>
                        </div>

                        <div className="manage-card-actions">
                          <button
                            type="button"
                            className="zilo-btn-call-now"
                            onClick={() => {
                              window.location.href = `tel:${job.mobile.replace(/\D/g, '')}`;
                              openCallModal({
                                id: job.id,
                                type: 'job',
                                phone: job.mobile,
                                name: job.employerName,
                                title: job.jobTitle,
                                location: job.workLocation,
                                rate: `₹${job.salary.amount}/${job.salary.unit}`
                              });
                            }}
                          >
                            <Phone size={14} />
                            <span>Call Employer ({job.mobile})</span>
                          </button>

                          <button
                            type="button"
                            className="manage-delete-btn"
                            onClick={() => toggleSaveJob(job.id)}
                            title="Remove from saved"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 3: Call History (Requirement: Call History) */}
            {workerTab === 'call-history' && (
              <div className="call-history-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 className="section-sub-title" style={{ margin: 0 }}>Direct Phone Contacts Log</h3>
                  {callHistory.length > 0 && (
                    <button
                      type="button"
                      className="clear-filters-link"
                      onClick={clearCallHistory}
                    >
                      Clear Log
                    </button>
                  )}
                </div>

                {callHistory.length === 0 ? (
                  <div className="empty-dash-card">
                    <PhoneCall size={40} color="#94a3b8" />
                    <h3>No Calls Recorded</h3>
                    <p>When you click "CALL NOW" on any worker or job posting, the direct call log appears here.</p>
                  </div>
                ) : (
                  <div className="call-history-list">
                    {callHistory.map((item) => (
                      <div key={item.id} className="call-log-card">
                        <div className="call-log-left">
                          <div className="call-icon-wrap">
                            <PhoneCall size={18} color="#16a34a" />
                          </div>
                          <div>
                            <div className="call-contact-name">{item.targetName}</div>
                            <div className="call-contact-sub">{item.targetSkillOrTitle}</div>
                            <div className="call-contact-meta">
                              <span>📍 {item.location}</span>
                              {item.rate && <span>💰 {item.rate}</span>}
                              <span>🕒 {new Date(item.calledAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="call-log-right">
                          <button
                            type="button"
                            className="zilo-btn-call-now"
                            onClick={() => {
                              window.location.href = `tel:${item.phone.replace(/\D/g, '')}`;
                            }}
                          >
                            <Phone size={14} />
                            <span>Call Again (+91 {item.phone})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
