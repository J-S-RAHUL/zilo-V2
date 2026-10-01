import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, X } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportTarget, setReportTarget, addReport } = useApp();
  const [reason, setReason] = useState('Fraudulent / Advance fee scam attempt');
  const [details, setDetails] = useState('');

  if (!reportTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport(
      reportTarget.type,
      reportTarget.id,
      reportTarget.title,
      `${reason} - ${details}`
    );
    setReportTarget(null);
    setDetails('');
  };

  const reportReasons = [
    'Demanding advance registration or interview fees (Scam)',
    'Wrong or unreachable phone number',
    'Fake profile / impersonation',
    'Abusive or unprofessional behavior',
    'Misleading job salary or work hours',
    'Other security concern'
  ];

  return (
    <div className="modal-overlay" onClick={() => setReportTarget(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={22} color="#dc2626" />
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#991b1b' }}>Report Listing</h3>
              <p style={{ fontSize: '0.78rem', color: '#b91c1c' }}>
                Keep Zilo 100% safe, verified, and scam-free
              </p>
            </div>
          </div>
          <button
            onClick={() => setReportTarget(null)}
            style={{ padding: '6px', borderRadius: '50%', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#334155',
              marginBottom: '1rem',
              border: '1px solid #e2e8f0'
            }}>
              Reporting: <strong>{reportTarget.title}</strong> ({reportTarget.type})
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Report</label>
              <select
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {reportReasons.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Provide any context to help our moderation team investigate..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setReportTarget(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ background: '#dc2626', borderColor: '#dc2626' }}
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
