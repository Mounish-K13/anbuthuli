// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const donorsRouter = require('./routes/donors');
const hospitalsRouter = require('./routes/hospitals');
const feedbackRouter = require('./routes/feedback');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Routers
app.use('/api/donors', donorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/feedback', feedbackRouter);

// ✅ Default route
app.get('/', (req, res) => res.send('Anbu Thuli Backend is Running'));

// ✅ NEW: Donor Search API for Hospitals
// This route will be called from the frontend: /api/donors/search?q=A+
const Donor = require('./models/Donor'); // Make sure you have a Donor model

app.get('/api/donors/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Please enter a search query (e.g., blood group)' });
    }

    // Find donors whose bloodGroup matches the query (case-insensitive)
    const donors = await Donor.find({
      bloodGroup: { $regex: query, $options: 'i' }
    });

    res.json(donors);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error while searching donors' });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
