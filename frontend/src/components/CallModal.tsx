import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Copy, Check, MessageSquare, ShieldCheck, X, ExternalLink } from 'lucide-react';

export const CallModal: React.FC = () => {
  const { callModal, closeCallModal, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!callModal) return null;

  const cleanPhone = callModal.phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : `+91 ${cleanPhone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(callModal.phone);
    setCopied(true);
    showToast('📋 Phone number copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${callModal.name}, I saw your ${callModal.title} on Zilo and would like to speak directly.`
  );
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="modal-overlay" onClick={closeCallModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Phone size={22} className="phone-pulse" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Direct Phone Contact</h3>
              <p style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                Instant Connection • Zero Middleman
              </p>
            </div>
          </div>
          <button
            onClick={closeCallModal}
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: '#64748b',
              background: '#f1f5f9'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          {callModal.avatar && (
            <img
              src={callModal.avatar}
              alt={callModal.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 12px',
                border: '3px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
          )}

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            {callModal.name}
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>
            {callModal.title}
          </p>
          {callModal.location && (
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              📍 {callModal.location}
            </p>
          )}

          {/* Highlighted Phone Box */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '2px solid #86efac',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Verified Direct Phone Number
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.03em' }}>
              {formattedPhone}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Primary Call Dialer */}
            <a
              href={`tel:${cleanPhone}`}
              className="btn-call-now btn-call-lg"
              style={{ width: '100%' }}
              onClick={() => showToast(`Calling ${callModal.name}...`)}
            >
              <Phone size={22} className="phone-pulse" />
              Call Now ({cleanPhone})
            </a>

            {/* Quick Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={handleCopy}
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.88rem' }}
              >
                {copied ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy Number'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.88rem', color: '#15803d', borderColor: '#86efac', background: '#f0fdf4' }}
              >
                <MessageSquare size={18} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Trust reassurance banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '1.5rem',
            padding: '10px',
            borderRadius: '8px',
            background: '#f8fafc',
            fontSize: '0.8rem',
            color: '#64748b'
          }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Zilo connects you directly. You negotiate and finalize terms on call.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
