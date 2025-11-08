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
    unique: true, // enforces unique usernames
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

// ✅ Optional helper method for password verification
hospitalSchema.methods.verifyPassword = async function (password, bcrypt) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Hospital', hospitalSchema);
