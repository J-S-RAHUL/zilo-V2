import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  workersNeeded: { type: Number, default: 1, min: 1 },
  wage: { type: Number, required: true, min: 0 },
  wageUnit: { type: String, default: 'day' },
  location: { type: String, default: '' },
  city: { type: String, required: true, index: true },
  employerName: { type: String, required: true, trim: true },
  employerPhone: { type: String, required: true, trim: true },
  duration: { type: String, default: '1 Day' },
  experienceRequired: { type: String, default: 'Any' },
  isUrgent: { type: Boolean, default: false },
  description: { type: String, default: '' },
  jobPhoto: { type: String, default: '' },
  status: { type: String, enum: ['active', 'closed'], default: 'active', index: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for search
jobSchema.index({
  title: 'text',
  category: 'text',
  location: 'text',
  city: 'text',
  description: 'text'
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
