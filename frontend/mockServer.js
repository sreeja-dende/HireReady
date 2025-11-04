import express from "express";
import cors from "cors";
import crypto from "crypto";
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Mock data
const users = [
  { id: 1, username: 'student1', email: 'student@example.com', password: 'password', role: 'Student', resetToken: null },
  { id: 2, username: 'placement1', email: 'placement@example.com', password: 'password', role: 'Placement Cell', resetToken: null }
];

const questions = { /* same as your previous mock data */ };
const resources = [ /* same as your previous mock data */ ];
const scores = [];

// Helper: Normalize role
const normalizeRole = (role) => {
  if (!role) return role;
  if (role.toLowerCase() === "std") return "Student";
  if (role.toLowerCase() === "placement cell") return "Placement Cell";
  return role;
};

// Register endpoints
app.post("/api/auth/register", (req, res) => {
  let { username, email, password, role } = req.body;
  role = normalizeRole(role);

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    role
  };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login endpoints
app.post("/api/auth/login", (req, res) => {
  let { email, password, role } = req.body;
  role = normalizeRole(role);

  const user = users.find(u => u.email === email && u.password === password && u.role === role);

  if (user) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  console.log('Forgot password request received:', { email: req.body.email });
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format - only allow standard email formats like gmail.com, yahoo.com, etc.
    // Reject @example.com and similar demo domains
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if it's a demo domain
    const demoDomains = ['example.com', 'test.com', 'demo.com', 'sample.com'];
    const domain = email.split('@')[1];
    if (demoDomains.includes(domain)) {
      return res.status(400).json({ error: 'Demo email addresses are not allowed. Please use a real email address.' });
    }

    const user = users.find(u => u.email === email);
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
      console.log(`Password reset link for ${email}: ${resetUrl}`);
    }

    res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetUrl: user ? `http://localhost:5173/reset-password/${user.resetToken}` : null
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password reset request' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  console.log('Reset password request received');
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = users.find(u => u.resetToken === token);
    if (user) {
      user.password = password;
      user.resetToken = null; // Clear the token after use
      console.log(`Password reset successful for token: ${token}`);
      res.status(200).json({ message: 'Password reset successfully' });
    } else {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Other APIs: Questions, Submit, Resources, Analytics (keep as-is)
app.get("/api/questions/:role", (req, res) => {
  const role = req.params.role;
  res.json(questions[role] || []);
});

app.post("/api/submit", (req, res) => {
  const { userId, questionId, code, score, type } = req.body;
  const newScore = {
    id: scores.length + 1,
    userId,
    questionId,
    code,
    score: score || Math.floor(Math.random() * 100),
    type,
    timestamp: new Date()
  };
  scores.push(newScore);
  res.json({ message: "Submission successful", score: newScore.score });
});

app.get("/api/resources", (req, res) => res.json(resources));

// Updated POST /api/resources to handle both JSON and multipart/form-data
app.post("/api/resources", upload.single('file'), (req, res) => {
  try {
    const { title, type, description, uploadedBy } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({ error: 'Title, type, and description are required' });
    }

    const newResource = {
      id: resources.length + 1,
      title,
      type,
      description,
      uploadedBy: uploadedBy || 'Unknown',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };

    resources.push(newResource);
    res.status(201).json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ error: 'Server error during resource addition' });
  }
});

app.get("/api/analytics/student/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userScores = scores.filter(s => s.userId === userId);
  const codingScore = userScores.filter(s => s.questionId).reduce((acc, s) => acc + s.score, 0) / Math.max(userScores.filter(s => s.questionId).length, 1);
  const aptitudeScore = userScores.filter(s => s.type === 'aptitude').reduce((acc, s) => acc + s.score, 0) / Math.max(userScores.filter(s => s.type === 'aptitude').length, 1);
  const participationScore = Math.min(userScores.length * 10, 100);

  res.json({
    coding: Math.round(codingScore || 0),
    aptitude: Math.round(aptitudeScore || 0),
    participation: participationScore,
    weeklyProgress: [
      { week: 'Week 1', coding: 20, aptitude: 15, participation: 10 },
      { week: 'Week 2', coding: 35, aptitude: 30, participation: 25 },
      { week: 'Week 3', coding: 55, aptitude: 50, participation: 40 },
      { week: 'Week 4', coding: 75, aptitude: 80, participation: 60 }
    ],
    topicWise: [
      { name: 'Arrays', value: 85 },
      { name: 'Strings', value: 70 },
      { name: 'Trees', value: 60 },
      { name: 'Graphs', value: 45 },
      { name: 'DP', value: 30 }
    ]
  });
});

app.get("/api/analytics/placement", (req, res) => {
  const allScores = scores;
  const avgCoding = allScores.filter(s => s.questionId).reduce((acc, s) => acc + s.score, 0) / Math.max(allScores.filter(s => s.questionId).length, 1);
  const avgAptitude = allScores.filter(s => s.type === 'aptitude').reduce((acc, s) => acc + s.score, 0) / Math.max(allScores.filter(s => s.type === 'aptitude').length, 1);
  const avgParticipation = Math.min(allScores.length * 5, 100);

  res.json({
    averageCoding: Math.round(avgCoding || 0),
    averageAptitude: Math.round(avgAptitude || 0),
    averageParticipation: avgParticipation,
    totalStudents: users.filter(u => u.role === 'Student').length,
    totalSubmissions: allScores.length
  });
});

app.listen(3001, () => console.log("Mock API running on port 3001"));
