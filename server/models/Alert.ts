import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    location: { type: String, required: true },
    parameter: { type: String, required: true },
    operator: { type: String, required: true },
    threshold: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Alert = mongoose.model('Alert', alertSchema);
