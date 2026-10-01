import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Users,
  Briefcase,
  AlertTriangle,
  FolderPlus,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Lock,
  Unlock,
  Eye,
  Flag
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    workers,
    jobs,
    categories,
    reports,
    callHistory,
    deleteJob,
    deleteWorker,
    deleteCategory,
    addCategory,
    resolveReport,
    toggleJobStatus,
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'jobs' | 'workers' | 'categories' | 'reports' | 'connections'>('overview');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatDesc.trim() || 'General specialized trade services');
    setNewCatName('');
    setNewCatDesc('');
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>
              Zilo Administration Panel
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            Platform moderation, fake profile detection, fraudulent job removal & category configuration.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'jobs', label: `💼 Jobs (${jobs.length})` },
            { id: 'workers', label: `🔨 Workers (${workers.length})` },
            { id: 'categories', label: `📁 Categories (${categories.length})` },
            { id: 'reports', label: `🚨 Reports (${pendingReports.length})` },
            { id: 'connections', label: `📞 Direct Calls (${callHistory.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: adminTab === tab.id ? 'white' : 'transparent',
                color: adminTab === tab.id ? '#dc2626' : '#64748b',
                boxShadow: adminTab === tab.id ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Overview */}
      {adminTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Active Workers</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2563eb', marginTop: '4px' }}>
                {workers.length}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>100% Direct Phone Enabled</span>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Job Requirements</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>
                {jobs.length}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Across Vijayawada & Guntur</span>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Worker Categories</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
                {categories.length}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Fully Admin-manageable</span>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Flagged / Reported</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626', marginTop: '4px' }}>
                {pendingReports.length}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 700 }}>Immediate Attention</span>
            </div>
          </div>

          {/* Direct Calls Platform Guarantees */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Platform Security & Anti-Fraud Protocol
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
              Zilo uses automatic wage anomaly detection and trigger word scanning to flag suspect advertisements.
              Admins can immediately delete fake listings with 1 click below.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Jobs Moderation */}
      {adminTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manage Job Postings ({jobs.length})</h3>
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: job.status === 'active' ? '#dcfce7' : '#f1f5f9',
                    color: job.status === 'active' ? '#15803d' : '#64748b'
                  }}>
                    {job.status}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{job.jobTitle}</h4>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                  Employer: <strong>{job.employerName}</strong> • 📱 {job.mobile} • 📍 {job.workLocation} • ₹{job.salary.amount}/{job.salary.unit}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                  {job.jobDescription}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleJobStatus(job.id)}
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                >
                  {job.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Remove fraudulent or fake job post"
                >
                  <Trash2 size={15} /> Remove Fraudulent Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Workers Moderation */}
      {adminTab === 'workers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manage Worker Profiles ({workers.length})</h3>

          {workers.map((w) => (
            <div
              key={w.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={w.profilePhoto}
                  alt={w.fullName}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{w.fullName}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    🔨 {w.mainSkill} • 📱 {w.mobile} • ⭐ {w.rating} ({w.reviewCount} revs) • 📍 {w.location}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => deleteWorker(w.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Delete fake profile"
                >
                  <Trash2 size={15} /> Remove Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Categories Configuration */}
      {adminTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Category Form */}
          <form
            onSubmit={handleAddCategory}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Add New Worker Category
            </h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Solar Technician, Gardner, Cook"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Solar panel roof installation and servicing"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> Add Category
            </button>
          </form>

          {/* List of existing categories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '10px'
          }}>
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.description}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteCategory(c.id)}
                  style={{ color: '#ef4444', padding: '6px' }}
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reports & Moderation Queue */}
      {adminTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Spam & Fake Profile Reports Queue</h3>

          {reports.length === 0 ? (
            <div style={{ background: 'white', padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
              No reports reported.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: rep.status === 'pending' ? '#fee2e2' : '#f1f5f9',
                      color: rep.status === 'pending' ? '#b91c1c' : '#64748b'
                    }}>
                      {rep.status}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                      Reported {rep.targetType}: {rep.targetTitle}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                    Reason: {rep.reason}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Reported by {rep.reportedBy} on {rep.date}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {rep.status === 'pending' && (
                    <>
                      <button
                        onClick={() => resolveReport(rep.id, 'resolved')}
                        className="btn-call-now btn-call-sm"
                        style={{ background: '#16a34a' }}
                      >
                        <CheckCircle size={15} /> Resolve & Clean
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'dismissed')}
                        className="btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Accepted Connections Data Logs */}
      {adminTab === 'connections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Platform Direct Phone Call Logs</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                All direct connection phone calls logged on the platform.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '4px 12px', borderRadius: '9999px' }}>
              {callHistory.length} Direct Calls
            </span>
          </div>

          {callHistory.length === 0 ? (
            <div style={{ background: 'white', padding: '2.5rem', textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              No direct calls recorded yet.
            </div>
          ) : (
            callHistory.map((call) => (
              <div
                key={call.id}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#dcfce7',
                      color: '#15803d',
                      textTransform: 'uppercase'
                    }}>
                      DIRECT CALL
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>
                      [{call.type.toUpperCase()}]
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                      {call.targetSkillOrTitle}
                    </h4>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                    Contact: <strong>{call.targetName}</strong> (📱 +91 {call.phone})
                    {call.rate && <span> • Rate: <strong style={{ color: '#16a34a' }}>{call.rate}</strong></span>}
                    {call.location && <span> • 📍 {call.location}</span>}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Called at: <strong>{new Date(call.calledAt).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
