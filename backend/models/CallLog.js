import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  callerRole: { type: String, default: 'employer' },
  callerName: { type: String, default: 'Anonymous' },
  targetId: { type: String, default: '' },
  targetName: { type: String, default: 'Direct Contact' },
  targetRole: { type: String, default: 'worker' },
  targetSkillOrTitle: { type: String, default: '' },
  phone: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const CallLog = mongoose.model('CallLog', callLogSchema);
export default CallLog;
