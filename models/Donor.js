const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  passwordHash: { type: String },
  weight: { type: Number },
  eligibility: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Add a case-insensitive search helper (optional)
donorSchema.statics.searchByBloodGroup = function (query) {
  return this.find({ bloodGroup: { $regex: query, $options: 'i' } });
};

module.exports = mongoose.model('Donor', donorSchema);
