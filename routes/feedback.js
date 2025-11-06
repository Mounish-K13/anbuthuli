const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const fb = new Feedback({ name, email, message });
    await fb.save();
    res.status(201).json({ message: 'Feedback Received' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
