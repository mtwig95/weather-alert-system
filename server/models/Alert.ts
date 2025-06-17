import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  location: { type: String, required: true },
  parameter: { type: String, required: true },
  operator: { type: String, required: true },
  threshold: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['triggered', 'not_triggered'], default: 'not_triggered' },
  lastChecked: { type: Date, default: null },
  email: { type: String, required: true },
  lastNotified: { type: Date, default: null },
});

export const Alert = mongoose.model('Alert', alertSchema);
