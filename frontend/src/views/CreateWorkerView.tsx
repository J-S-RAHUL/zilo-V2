import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkType, PaymentUnit } from '../types';
import { ImageFileUpload } from '../components/ImageFileUpload';
import { MultiImageFileUpload } from '../components/MultiImageFileUpload';
import {
  UserCheck,
  Phone,
  Camera,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const CreateWorkerView: React.FC = () => {
  const { currentUser, workers, categories, createOrUpdateWorkerProfile, setCurrentView, currentLocation, showToast } = useApp();

  const existingProfile = workers.find((w) => w.userId === currentUser?.id);

  // Personal details
  const [fullName, setFullName] = useState(existingProfile?.fullName || currentUser?.name || 'Ravi Kumar');
  const [profilePhoto, setProfilePhoto] = useState(
    existingProfile?.profilePhoto ||
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=80'
  );
  const [portfolioImages, setPortfolioImages] = useState<string[]>(
    existingProfile?.portfolioImages || []
  );
  const [mobile, setMobile] = useState(existingProfile?.mobile || currentUser?.mobile || '9876543211');
  const [email, setEmail] = useState(existingProfile?.email || currentUser?.email || 'ravi.kumar@example.com');
  const [age, setAge] = useState(existingProfile?.age || 32);
  const [location, setLocation] = useState(existingProfile?.location || `${currentLocation.name}`);
  const [city, setCity] = useState(existingProfile?.city || currentLocation.name);

  // Work details
  const [mainSkill, setMainSkill] = useState('Carpenter');
  const [otherSkillsInput, setOtherSkillsInput] = useState('Modular Kitchen, Door Fitting, Wood Polish');
  const [experienceYears, setExperienceYears] = useState(5);
  const [previousWorkExperience, setPreviousWorkExperience] = useState(
    'Worked with Godrej Interior contractors for 3 years, freelance woodwork in Vijayawada for 2 years.'
  );
  const [workDescription, setWorkDescription] = useState(
    'Skilled in all types of residential and commercial carpentry. Specialized in modern modular wardrobes, kitchen cabinets, repair work, and plywood shuttering.'
  );

  // Preferences
  const [workType, setWorkType] = useState<WorkType>('Full-time');
  const [preferredLocation, setPreferredLocation] = useState(`${currentLocation.name}, nearby areas`);
  const [maxTravelDistanceKm, setMaxTravelDistanceKm] = useState(25);
  const [expectedAmount, setExpectedAmount] = useState(800);
  const [expectedUnit, setExpectedUnit] = useState<PaymentUnit>('day');
  const [preferredWorkingHours, setPreferredWorkingHours] = useState('9:00 AM - 6:00 PM');
  const [availableDays, setAvailableDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || mobile.replace(/\D/g, '').length < 10) {
      showToast('Please provide a valid 10-digit mobile number for employers to call you.');
      return;
    }

    const otherSkills = otherSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createOrUpdateWorkerProfile({
      userId: currentUser?.id || `user-worker-${Date.now()}`,
      fullName,
      profilePhoto,
      portfolioImages,
      mobile,
      email,
      age: Number(age),
      location,
      city,
      latitude: currentLocation.lat + (Math.random() - 0.5) * 0.04,
      longitude: currentLocation.lng + (Math.random() - 0.5) * 0.04,
      mainSkill,
      otherSkills,
      experienceYears: Number(experienceYears),
      previousWorkExperience,
      workDescription,
      workType,
      preferredLocation,
      maxTravelDistanceKm: Number(maxTravelDistanceKm),
      expectedPayment: {
        amount: Number(expectedAmount),
        unit: expectedUnit
      },
      preferredWorkingHours,
      availableDays,
      isAvailable,
      isVisible: true,
      isVerified: true
    });

    setCurrentView('find-workers');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#f5f3ff',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>
            Create Your Worker Profile
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
          Showcase your skills and contact number. Local employers in your area will discover your profile and call you directly for work.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Section 1: Personal Details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            1. Personal Details
          </h3>

          {/* Profile Photo Selector with File Upload & Presets */}
          <ImageFileUpload
            value={profilePhoto}
            onChange={(newPhoto) => setProfilePhoto(newPhoto)}
            label="Profile Photo *"
            helperText="Upload your real photo from your device/files (JPG, PNG, WebP) or select an avatar preset below."
            variant="circle"
            presets={sampleAvatars}
          />

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ravi Kumar"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number (Employers will call this) *</label>
              <input
                type="tel"
                required
                className="form-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9876543211"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                min="18"
                max="75"
                required
                className="form-input"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ravi.kumar@example.com"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Location (Area / Neighborhood) *</label>
              <input
                type="text"
                required
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Benz Circle, Vijayawada"
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                required
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Vijayawada"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Work Details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            2. Work & Skill Details
          </h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Main Skill / Trade *</label>
              <select
                required
                className="form-select"
                value={mainSkill}
                onChange={(e) => setMainSkill(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience (Years) *</label>
              <input
                type="number"
                min="0"
                max="40"
                required
                className="form-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Other Skills / Specializations (Comma separated)</label>
            <input
              type="text"
              className="form-input"
              value={otherSkillsInput}
              onChange={(e) => setOtherSkillsInput(e.target.value)}
              placeholder="e.g. Modular Kitchen, Door Fitting, Wood Polish"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Work Description *</label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Describe what services you provide, tools you have, specialties..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Work Experience & Projects</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={previousWorkExperience}
              onChange={(e) => setPreviousWorkExperience(e.target.value)}
              placeholder="Where have you worked previously? Mention any major projects or contractors."
            />
          </div>

          {/* Work Sample Photos from Files */}
          <MultiImageFileUpload
            images={portfolioImages}
            onChange={setPortfolioImages}
            maxImages={5}
            label="Work Photos & Portfolio (Optional - Add from files)"
            helperText="Upload photos of your previous work (furniture, electrical wiring, plumbing, paintings, etc.) to showcase your skills."
          />
        </div>

        {/* Section 3: Job Preferences */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            3. Job Preferences & Availability
          </h3>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Type of Work Wanted *</label>
              <select
                className="form-select"
                value={workType}
                onChange={(e: any) => setWorkType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary / Daily Wage</option>
                <option value="Both">Any / Open to Both</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Travel Distance Willing to Travel *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="2"
                  max="100"
                  required
                  className="form-input"
                  value={maxTravelDistanceKm}
                  onChange={(e) => setMaxTravelDistanceKm(parseInt(e.target.value, 10) || 5)}
                />
                <span style={{ fontWeight: 600, color: '#64748b' }}>km</span>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Expected Salary / Payment *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', fontWeight: 700 }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    required
                    className="form-input"
                    value={expectedAmount}
                    onChange={(e) => setExpectedAmount(parseInt(e.target.value, 10) || 0)}
                    style={{ paddingLeft: '28px' }}
                    placeholder="800"
                  />
                </div>
                <select
                  className="form-select"
                  value={expectedUnit}
                  onChange={(e: any) => setExpectedUnit(e.target.value)}
                  style={{ width: '130px' }}
                >
                  <option value="day">/ Day</option>
                  <option value="month">/ Month</option>
                  <option value="hour">/ Hour</option>
                  <option value="job">/ Job</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Working Hours</label>
              <input
                type="text"
                className="form-input"
                value={preferredWorkingHours}
                onChange={(e) => setPreferredWorkingHours(e.target.value)}
                placeholder="e.g. 9:00 AM - 6:00 PM"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Days for Work</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allWeekDays.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: availableDays.includes(d) ? '#2563eb' : '#f1f5f9',
                    color: availableDays.includes(d) ? 'white' : '#475569',
                    border: '1px solid',
                    borderColor: availableDays.includes(d) ? '#2563eb' : '#cbd5e1'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Card Preview */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
            <Eye size={16} /> Live Worker Card Preview
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={profilePhoto}
                alt={fullName}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {fullName}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  🔨 {mainSkill} • 📍 {location} • ⭐ {experienceYears} Years Experience
                </div>
                <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                  💰 Expected: ₹{expectedAmount}/{expectedUnit} • 🕒 Available: {workType}
                </div>
              </div>
            </div>

            <button type="button" className="btn-call-now btn-call-sm">
              <Phone size={14} /> Call {fullName.split(' ')[0]}
            </button>
          </div>
        </div>

        {/* Availability Status Section (Required by prompt) */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            Availability Status
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
            Control whether employers can see your phone number and call you right now.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: isAvailable ? '#16a34a' : '#e2e8f0',
                background: isAvailable ? '#f0fdf4' : 'white',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="workerAvailStatus"
                checked={isAvailable}
                onChange={() => setIsAvailable(true)}
              />
              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.95rem' }}>
                🟢 Available Now
              </span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: !isAvailable ? '#dc2626' : '#e2e8f0',
                background: !isAvailable ? '#fef2f2' : 'white',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="workerAvailStatus"
                checked={!isAvailable}
                onChange={() => setIsAvailable(false)}
              />
              <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.95rem' }}>
                🔴 Currently Unavailable
              </span>
            </label>
          </div>
        </div>

        {/* Submit button: CREATE PROFILE */}
        <button
          type="submit"
          className="zilo-btn-post-final"
          style={{ width: '100%', padding: '16px', fontSize: '1.1rem', justifyContent: 'center' }}
        >
          <UserCheck size={22} />
          <span>CREATE PROFILE</span>
        </button>
      </form>
    </div>
  );
};
