import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { reviewWorkerTarget, setReviewWorkerTarget, addReview, currentUser } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || 'Local Employer');
  const [reviewerMobile, setReviewerMobile] = useState(currentUser?.mobile || '');

  if (!reviewWorkerTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview(
      reviewWorkerTarget.id,
      rating,
      comment,
      reviewerName,
      reviewerMobile
    );

    setReviewWorkerTarget(null);
    setComment('');
  };

  return (
    <div className="modal-overlay" onClick={() => setReviewWorkerTarget(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Rate & Review Worker</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              For {reviewWorkerTarget.fullName} ({reviewWorkerTarget.mainSkill})
            </p>
          </div>
          <button
            onClick={() => setReviewWorkerTarget(null)}
            style={{ padding: '6px', borderRadius: '50%', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Star selector */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                How was the worker's service & punctuality?
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ padding: '4px' }}
                  >
                    <Star
                      size={32}
                      fill={star <= rating ? '#f59e0b' : 'none'}
                      color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', marginTop: '6px' }}>
                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {rating === 3 && '⭐⭐⭐ Average'}
                {rating === 2 && '⭐⭐ Below Expectations'}
                {rating === 1 && '⭐ Poor'}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Ramesh (Employer)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Mobile Number (Optional)</label>
              <input
                type="tel"
                className="form-input"
                value={reviewerMobile}
                onChange={(e) => setReviewerMobile(e.target.value)}
                placeholder="e.g. 9876543210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Review & Feedback</label>
              <textarea
                required
                rows={4}
                className="form-textarea"
                placeholder="Share your experience: Were they on time? Did they bring tools? Was the work completed cleanly?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setReviewWorkerTarget(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
