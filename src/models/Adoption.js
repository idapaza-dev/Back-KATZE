const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  reason: String,
  documents: [String],
  status: { type: String, enum: ['pending','in_progress','approved','rejected'], default: 'pending' },
  history: [{ status: String, note: String, at: Date, by: String }],
}, { timestamps: true });

module.exports = mongoose.model('Adoption', adoptionSchema);