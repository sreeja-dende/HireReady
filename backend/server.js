const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
//app.use(cors({ origin: "http://localhost:5177", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const resourceRoutes = require('./routes/resources');
const analyticsRoutes = require('./routes/analytics');
const { submitCoding, submitAptitude, submitSoftSkills, submitMockInterview, recordParticipation, executeCode } = require('./controllers/submitController');

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);

// Submit routes
app.post('/api/submit/coding', submitCoding);
app.post('/api/submit/aptitude', submitAptitude);
app.post('/api/submit/soft-skills', submitSoftSkills);
app.post('/api/submit/mock-interview', submitMockInterview);
app.post('/api/submit/participation', recordParticipation);
app.post('/api/execute', executeCode);

// Connect to MongoDB (optional for mock server)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.log('No MongoDB URI provided, running in mock mode');
  // For demo purposes, we'll use mock data since MongoDB is not available
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
