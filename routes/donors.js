const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Donor = require('../models/Donor');

// =======================
// 🩸 DONOR REGISTRATION (your existing code)
// =======================
router.post('/register', async (req, res) => {
  try {
    const { fullName, age, bloodGroup, phone, password, weight } = req.body;
    const exists = await Donor.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const eligibility = age >= 18 && weight >= 50;

    const donor = new Donor({
      fullName,
      age,
      bloodGroup,
      phone,
      passwordHash,
      weight,
      eligibility
    });

    await donor.save();
    res.status(201).json({ message: 'Donor Registered Successfully', donorId: donor._id });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// =======================
// 🔍 DONOR SEARCH (for hospital use)
// =======================
// Example: GET /api/donors/search?q=A+
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query (blood group) required' });
    }

    // Find donors whose bloodGroup matches query (case-insensitive)
    const donors = await Donor.find({
      bloodGroup: { $regex: query, $options: 'i' }
    });

    if (!donors.length) {
      return res.status(404).json({ message: 'No donors found for this blood group' });
    }

    res.json(donors);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ message: 'Server error while searching donors' });
  }
});

module.exports = router;
