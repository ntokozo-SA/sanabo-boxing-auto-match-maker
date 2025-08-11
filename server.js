const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { demoDataAPI } = require('./utils/demoData');
require('dotenv').config();

const app = express();

// Import routes
const boxerRoutes = require('./routes/boxers');
const matchRoutes = require('./routes/matches');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const connectDB = async () => {
  try {
    // Try to connect to MongoDB Atlas first, then fallback to local
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sanabo:boxing123@cluster0.mongodb.net/sanabo-boxing?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('⚠️  MongoDB not available. Using in-memory storage for demo purposes.');
    console.log('💡 To use persistent storage, install MongoDB or set up MongoDB Atlas.');
    
    // For demo purposes, we'll continue without MongoDB
    // In a real app, you'd want to exit here
    // process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/boxers', boxerRoutes);
app.use('/api/matches', matchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sanabo Boxing Matchmaking API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Sanabo Boxing Matchmaking Server running on port ${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🥊 Boxers API: http://localhost:${PORT}/api/boxers`);
  console.log(`🏆 Matches API: http://localhost:${PORT}/api/matches`);
  
  // Initialize all boxers to ensure they have proper records
  try {
    const allBoxers = demoDataAPI.initializeAllBoxers();
    console.log(`✅ Initialized ${allBoxers.length} boxers with proper records`);
  } catch (error) {
    console.error('❌ Error initializing boxers:', error);
  }
});

module.exports = app; 