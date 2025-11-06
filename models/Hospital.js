const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Index for faster lookup during login
hospitalSchema.index({ username: 1 });

// ✅ Optional helper method to verify password
// (not required now, but useful for cleaner code later)
hospitalSchema.methods.verifyPassword = async function (password, bcrypt) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Hospital', hospitalSchema);
