const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EcoTrack Server running on port ${PORT}`);
});
