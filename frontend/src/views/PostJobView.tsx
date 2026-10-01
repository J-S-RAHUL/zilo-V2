import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentUnit } from '../types';
import { POPULAR_LOCATIONS } from '../utils/distance';
import { ParsedJobRequirement } from '../utils/aiParser';
import { ImageFileUpload } from '../components/ImageFileUpload';
import {
  PlusCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface PostJobViewProps {
  onOpenAiModal: () => void;
  parsedAiData: ParsedJobRequirement | null;
  onClearParsedAiData: () => void;
}

export const PostJobView: React.FC<PostJobViewProps> = ({
  onOpenAiModal,
  parsedAiData,
  onClearParsedAiData
}) => {
  const { currentUser, categories, postNewJob, setCurrentView, currentLocation, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Worker Required
  const [workerType, setWorkerType] = useState('Carpenter');
  const [workersNeeded, setWorkersNeeded] = useState(1);
  const [experienceRequiredYears, setExperienceRequiredYears] = useState(2);

  // Step 2: Job Details
  const [jobTitle, setJobTitle] = useState('Carpenter Required');
  const [jobDescription, setJobDescription] = useState(
    'Need an experienced carpenter for furniture woodwork, cabinet fitting, and door lock adjustments.'
  );
  const [workDate, setWorkDate] = useState('Immediate / Next 2 Days');
  const [workDuration, setWorkDuration] = useState('3 Days');
  const [workingHours, setWorkingHours] = useState('9:00 AM - 6:00 PM');
  const [additionalRequirements, setAdditionalRequirements] = useState(
    'Must bring basic tools (measuring tape, drill, hand saw).'
  );
  const [jobPhoto, setJobPhoto] = useState<string>('');

  // Step 3: Location & Payment
  const [workLocation, setWorkLocation] = useState(`${currentLocation.name}`);
  const [city, setCity] = useState(currentLocation.name);
  const [salaryAmount, setSalaryAmount] = useState(800);
  const [salaryUnit, setSalaryUnit] = useState<PaymentUnit>('day');

  // Step 4: Contact Details
  const [employerName, setEmployerName] = useState(currentUser?.name || 'Ramesh Kumar');
  const [mobile, setMobile] = useState(currentUser?.mobile || '9876543210');
  const [email, setEmail] = useState(currentUser?.email || 'ramesh@example.com');

  // Populate from AI Voice Assistant if used
  React.useEffect(() => {
    if (parsedAiData) {
      setJobTitle(parsedAiData.jobTitle);
      setWorkerType(parsedAiData.requiredWorkerSkill);
      setWorkersNeeded(parsedAiData.workersNeeded);
      setWorkLocation(parsedAiData.workLocation);
      setCity(parsedAiData.city);
      setWorkDuration(parsedAiData.workDuration);
      setSalaryAmount(parsedAiData.salaryAmount);
      setSalaryUnit(parsedAiData.salaryUnit);
      setExperienceRequiredYears(parsedAiData.experienceRequiredYears);
      if (parsedAiData.jobDescription) setJobDescription(parsedAiData.jobDescription);
      showToast('✨ Form pre-filled from AI dictation!');
      onClearParsedAiData();
    }
  }, [parsedAiData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || mobile.replace(/\D/g, '').length < 10) {
      showToast('Please provide a valid 10-digit mobile number so workers can call you.');
      return;
    }

    postNewJob({
      userId: currentUser?.id || `user-emp-${Date.now()}`,
      employerName,
      mobile,
      email,
      jobTitle,
      requiredWorkerSkill: workerType,
      jobDescription,
      workersNeeded: Number(workersNeeded),
      workLocation,
      city,
      latitude: currentLocation.lat + (Math.random() - 0.5) * 0.03,
      longitude: currentLocation.lng + (Math.random() - 0.5) * 0.03,
      workDate,
      workDuration,
      workingHours,
      salary: {
        amount: Number(salaryAmount),
        unit: salaryUnit
      },
      experienceRequiredYears: Number(experienceRequiredYears),
      additionalRequirements,
      jobPhoto: jobPhoto || undefined,
      status: 'active'
    });

    showToast('🎉 Requirement published! Workers can now call you directly.');
    setCurrentView('dashboard');
  };

  const stepsList = [
    { num: 1, title: 'Worker Required' },
    { num: 2, title: 'Job Details' },
    { num: 3, title: 'Location & Payment' },
    { num: 4, title: 'Contact Details' }
  ];

  return (
    <div className="zilo-form-page">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div className="form-page-header">
          <div>
            <h1 className="form-main-title">Post a Worker Requirement</h1>
            <p className="form-main-subtitle">
              Publish your requirement with your direct phone number. Zero platform commission.
            </p>
          </div>

          <button
            type="button"
            className="ai-dictate-btn"
            onClick={onOpenAiModal}
            title="Dictate requirement using AI"
          >
            <Sparkles size={16} />
            <span>AI Voice Helper</span>
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="wizard-progress-bar">
          {stepsList.map((st) => (
            <div
              key={st.num}
              className={`wizard-step-item ${currentStep === st.num ? 'active' : ''} ${currentStep > st.num ? 'completed' : ''}`}
              onClick={() => {
                if (st.num < currentStep) setCurrentStep(st.num as any);
              }}
            >
              <div className="wizard-step-circle">
                {currentStep > st.num ? <CheckCircle2 size={16} /> : `0${st.num}`}
              </div>
              <span className="wizard-step-title">{st.title}</span>
            </div>
          ))}
        </div>

        {/* Form Body Box */}
        <div className="zilo-form-card">
          <form onSubmit={handleSubmit}>
            {/* ==================================================
                STEP 1: WORKER REQUIRED
                ================================================== */}
            {currentStep === 1 && (
              <div className="wizard-form-step">
                <div className="step-heading-row">
                  <h2 className="step-section-heading">Step 1: Worker Required</h2>
                  <span className="step-counter-tag">1 of 4</span>
                </div>

                {/* Worker Type */}
                <div className="form-field-group">
                  <label className="form-label">
                    Worker Type / Trade <span className="req">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={workerType}
                    onChange={(e) => {
                      setWorkerType(e.target.value);
                      if (jobTitle === 'Carpenter Required') {
                        setJobTitle(`${e.target.value} Required`);
                      }
                    }}
                  >
                    {[
                      'Carpenter',
                      'Electrician',
                      'Plumber',
                      'Mason',
                      'Painter',
                      'Driver',
                      'House Cleaner',
                      'Construction Worker',
                      'Mechanic',
                      'Welder',
                      'Tailor',
                      'Shop Helper',
                      'General Worker',
                      'Other'
                    ].map((trade) => (
                      <option key={trade} value={trade}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Workers Needed */}
                <div className="form-field-group">
                  <label className="form-label">
                    Number of Workers Needed <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    className="form-control"
                    value={workersNeeded}
                    onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                    required
                  />
                  <span className="field-hint">Specify how many people you need on-site.</span>
                </div>

                {/* Experience Required */}
                <div className="form-field-group">
                  <label className="form-label">
                    Minimum Experience Required <span className="req">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={experienceRequiredYears}
                    onChange={(e) => setExperienceRequiredYears(Number(e.target.value))}
                  >
                    <option value={0}>Any / Fresher welcome</option>
                    <option value={1}>1+ Years Experience</option>
                    <option value={2}>2+ Years Experience</option>
                    <option value={3}>3+ Years Experience</option>
                    <option value={5}>5+ Years Experience</option>
                    <option value={10}>10+ Years (Master craftsman)</option>
                  </select>
                </div>

                <div className="wizard-btn-footer single">
                  <button
                    type="button"
                    className="zilo-btn-primary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <span>Next: Job Details</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 2: JOB DETAILS
                ================================================== */}
            {currentStep === 2 && (
              <div className="wizard-form-step">
                <div className="step-heading-row">
                  <h2 className="step-section-heading">Step 2: Job Details</h2>
                  <span className="step-counter-tag">2 of 4</span>
                </div>

                {/* Job Title */}
                <div className="form-field-group">
                  <label className="form-label">
                    Job Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Carpenter Required for Wardrobe Work"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Job Description */}
                <div className="form-field-group">
                  <label className="form-label">
                    Description <span className="req">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Describe what specific work needs to be completed..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Work Date & Duration in 2 cols */}
                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label className="form-label">Work Date / Starting</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tomorrow Morning or Immediate"
                      value={workDate}
                      onChange={(e) => setWorkDate(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 3 Days or 1 Month"
                      value={workDuration}
                      onChange={(e) => setWorkDuration(e.target.value)}
                    />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="form-field-group">
                  <label className="form-label">Working Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 9:00 AM - 6:00 PM"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                  />
                </div>

                {/* Additional Requirements */}
                <div className="form-field-group">
                  <label className="form-label">Additional Requirements</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Must bring own drill and measuring tape"
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                  />
                </div>

                {/* Work Site Photo Upload */}
                <ImageFileUpload
                  value={jobPhoto}
                  onChange={setJobPhoto}
                  label="Work Site Photo (Optional - Add from files)"
                  helperText="Upload a photo from your files/device showing the work site or repair item so workers understand the job."
                  variant="card"
                />

                <div className="wizard-btn-footer dual">
                  <button
                    type="button"
                    className="zilo-btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="zilo-btn-primary"
                    onClick={() => setCurrentStep(3)}
                  >
                    <span>Next: Location & Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 3: LOCATION & PAYMENT
                ================================================== */}
            {currentStep === 3 && (
              <div className="wizard-form-step">
                <div className="step-heading-row">
                  <h2 className="step-section-heading">Step 3: Location & Payment</h2>
                  <span className="step-counter-tag">3 of 4</span>
                </div>

                {/* Location */}
                <div className="form-field-group">
                  <label className="form-label">
                    Work Location / Address <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Benz Circle, Vijayawada"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    required
                  />
                </div>

                {/* City Selection */}
                <div className="form-field-group">
                  <label className="form-label">City</label>
                  <select
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name}, {loc.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment (Amount and Unit) */}
                <div className="form-field-group">
                  <label className="form-label">
                    Payment / Wage <span className="req">*</span>
                  </label>
                  <div className="pay-input-combined">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      className="form-control amount-input"
                      placeholder="Amount"
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(Number(e.target.value))}
                      required
                    />
                    <select
                      className="form-control unit-select"
                      value={salaryUnit}
                      onChange={(e) => setSalaryUnit(e.target.value as PaymentUnit)}
                    >
                      <option value="day">per Day</option>
                      <option value="month">per Month</option>
                      <option value="hour">per Hour</option>
                      <option value="job">fixed per Job</option>
                    </select>
                  </div>
                  <span className="field-hint">Clear pay attracts verified workers faster.</span>
                </div>

                <div className="wizard-btn-footer dual">
                  <button
                    type="button"
                    className="zilo-btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="zilo-btn-primary"
                    onClick={() => setCurrentStep(4)}
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 4: CONTACT DETAILS
                ================================================== */}
            {currentStep === 4 && (
              <div className="wizard-form-step">
                <div className="step-heading-row">
                  <h2 className="step-section-heading">Step 4: Contact Details</h2>
                  <span className="step-counter-tag">4 of 4</span>
                </div>

                <div className="contact-notice-box">
                  <Phone size={18} color="#16a34a" />
                  <div>
                    <strong>Direct Contact Promise:</strong> Workers will see your phone number and call you directly to discuss and confirm the job.
                  </div>
                </div>

                {/* Employer Name */}
                <div className="form-field-group">
                  <label className="form-label">
                    Employer Name / Organization <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="form-field-group">
                  <label className="form-label">
                    Mobile Number (For direct calls) <span className="req">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <span className="prefix-span">+91</span>
                    <input
                      type="tel"
                      className="form-control with-prefix"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-field-group">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Review summary box */}
                <div className="summary-review-card">
                  <h4>Requirement Summary</h4>
                  <div className="summary-grid">
                    <div><strong>Job:</strong> {jobTitle}</div>
                    <div><strong>Worker:</strong> {workerType} ({workersNeeded} needed)</div>
                    <div><strong>Pay:</strong> ₹{salaryAmount}/{salaryUnit}</div>
                    <div><strong>Location:</strong> {workLocation}</div>
                    {jobPhoto && (
                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <img src={jobPhoto} alt="Site" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>✓ Site photo attached</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="wizard-btn-footer dual">
                  <button
                    type="button"
                    className="zilo-btn-secondary"
                    onClick={() => setCurrentStep(3)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="zilo-btn-post-final"
                  >
                    <PlusCircle size={18} />
                    <span>POST JOB</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
