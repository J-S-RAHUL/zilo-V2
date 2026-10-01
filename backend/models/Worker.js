import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: '', index: true },
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  portfolioImages: [{ type: String }],
  mobile: { type: String, required: true, trim: true },
  primarySkill: { type: String, required: true, index: true },
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 1, min: 0 },
  dailyWage: { type: Number, default: 500, min: 0 },
  expectedPayUnit: { type: String, default: 'day' },
  location: { type: String, default: '' },
  city: { type: String, required: true, index: true },
  coordinates: {
    lat: { type: Number, default: 16.5062 },
    lng: { type: Number, default: 80.6480 }
  },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true, index: true },
  availabilityText: { type: String, default: 'Available Today' },
  distanceKm: { type: Number, default: 2.0 },
  bio: { type: String, default: '' },
  profileCategory: { type: String, enum: ['extra_hands', 'service'], default: 'service' },
  isOnlineToWork: { type: Boolean, default: true },
  isEducated: { type: Boolean, default: false },
  educationTitle: { type: String, default: '' },
  freeTimeDetails: { type: String, default: '' },
  businessName: { type: String, default: '' },
  serviceType: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for search functionality
workerSchema.index({
  name: 'text',
  primarySkill: 'text',
  skills: 'text',
  location: 'text',
  city: 'text'
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
