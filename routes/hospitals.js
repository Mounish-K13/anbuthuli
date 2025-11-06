const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');

// =======================
// 🏥 HOSPITAL REGISTRATION
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;

    // Check if hospital username already exists
    const exists = await Hospital.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new hospital
    const hospital = new Hospital({ name, username, phone, passwordHash });
    await hospital.save();

    res.status(201).json({ message: 'Hospital registered successfully' });
  } catch (err) {
    console.error('Error registering hospital:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// =======================
// 🔐 HOSPITAL LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find hospital by username
    const hospital = await Hospital.findOne({ username });
    if (!hospital) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const match = await bcrypt.compare(password, hospital.passwordHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: hospital._id, username: hospital.username }, process.env.JWT_SECRET, {
      expiresIn: '12h'
    });

    // ✅ Return clean response for frontend
    res.json({
      message: 'Login successful',
      token,
      hospital: { id: hospital._id, name: hospital.name, username: hospital.username }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// =======================
// 🔒 VERIFY TOKEN (optional helper)
// =======================
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, hospitalId: decoded.id });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
