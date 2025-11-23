const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: String,
  alt: String
}, { _id: false });

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, default: 'cat' },
  breed: String,
  age: Number,
  sex: { type: String, enum: ['male','female','unknown'], default: 'unknown' },
  description: String,
  vaccinated: { type: Boolean, default: false },
  sterilized: { type: Boolean, default: false },
  status: { type: String, enum: ['available','reserved','adopted'], default: 'available' },
  photos: [photoSchema],
  location: String,
}, { timestamps: true });

module.exports = mongoose.model('Cat', catSchema);