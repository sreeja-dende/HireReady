const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

// Global mock users array for persistence across requests
let mockUsers = [
  {
    id: '1',
    username: 'student1',
    email: 'student@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hashed 'password'
    role: 'Student',
    resetToken: null,
    jobRole: null
  },
  {
    id: '2',
    username: 'placement1',
    email: 'placement@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hashed 'password'
    role: 'Placement Cell',
    resetToken: null,
    jobRole: null
  }
];

// Export mockUsers for use in other modules
module.exports.mockUsers = mockUsers;

// // Helper function to get client IP address
// const getClientIP = (req) => {
//   return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
// };

// Helper function to map role input
const mapRole = (role) => {
  if (role.toLowerCase() === 'std') return 'Student';
  if (role.toLowerCase() === 'placement cell' || role.toLowerCase() === 'placement') return 'Placement Cell';
  return role; // fallback
};

// Register
router.post('/register', async (req, res) => {
  console.log('Registration request received:', { username: req.body.username, email: req.body.email, role: req.body.role });
  try {
    const { username, email, password, role, college, year, branch, cgpa, skills, phone, linkedin, github } = req.body;

    // Validate inputs
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const mappedRole = mapRole(role);
    if (!['Student', 'Placement Cell'].includes(mappedRole)) {
      return res.status(400).json({ error: 'Invalid role. Use "std" for Student or "placement cell" for Placement Cell' });
    }

    // Additional validation for students
    if (mappedRole === 'Student') {
      if (!college || !year || !branch || cgpa === undefined) {
        return res.status(400).json({ error: 'College, year, branch, and CGPA are required for students' });
      }
      if (cgpa < 0 || cgpa > 10) {
        return res.status(400).json({ error: 'CGPA must be between 0 and 10' });
      }
    }

    // For demo purposes, skip user existence check
    // const existingUser = await User.findOne({
    //   $or: [{ email }, { username }]
    // });

    // if (existingUser) {
    //   return res.status(400).json({ error: 'User already exists' });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // For demo purposes, skip saving to database
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   role: mappedRole,
    //   ...(mappedRole === 'Student' && {
    //     college,
    //     year,
    //     branch,
    //     cgpa: parseFloat(cgpa),
    //     skills: skills || '',
    //     phone: phone || '',
    //     linkedin: linkedin || '',
    //     github: github || ''
    //   })
    // });

    // await newUser.save();

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: mappedRole,
      resetToken: null,
      jobRole: null,
      ...(mappedRole === 'Student' && {
        college,
        year,
        branch,
        cgpa: parseFloat(cgpa),
        skills: skills || '',
        phone: phone || '',
        linkedin: linkedin || '',
        github: github || ''
      })
    };

    // Add new user to mock users array
    mockUsers.push(newUser);

    console.log(`User registered successfully: ${username} (${email}) - ${mappedRole}`);
    console.log(`Total users now: ${mockUsers.length}`);

    res.status(200).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username,
        email,
        role: mappedRole
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request received:', { email: req.body.email, role: req.body.role });
  try {
    const { email, password, role } = req.body;
    // const clientIP = getClientIP(req);
    // const userAgent = req.get('User-Agent') || 'unknown';

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const mappedRole = mapRole(role);
    if (!['Student', 'Placement Cell'].includes(mappedRole)) {
      return res.status(400).json({ error: 'Invalid role. Use "std" for Student or "placement cell" for Placement Cell' });
    }



    const user = mockUsers.find(u => u.email === email && u.role === mappedRole);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, skip account active check
    // if (!user.isActive) {
    //   return res.status(401).json({ error: 'Account is deactivated' });
    // }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, skip updating user
    // user.lastLogin = new Date();
    // user.loginCount += 1;
    // await user.save();

    // Log successful login (skip for mock users)
    console.log(`Login successful for ${user.email} (${mappedRole})`);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        jobRole: user.jobRole || null
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Update Job Role
router.put('/update-job-role/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { jobRole } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required' });
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'Student') {
      return res.status(400).json({ error: 'Only students can update job roles' });
    }

    user.jobRole = jobRole;

    res.status(200).json({
      message: 'Job role updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        jobRole: user.jobRole
      }
    });
  } catch (error) {
    console.error('Update job role error:', error);
    res.status(500).json({ error: 'Server error during job role update' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  console.log('Forgot password request received:', { email: req.body.email });
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }



    const user = mockUsers.find(u => u.email === email);
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      console.log(`Password reset link for ${email}: ${resetUrl}`);
    }

    res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetUrl: user ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${user.resetToken}` : null
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password reset request' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  console.log('Reset password request received');
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log(`Looking for token: ${token}`);
    console.log('Available tokens:', mockUsers.map(u => ({ email: u.email, resetToken: u.resetToken })));

    const user = mockUsers.find(u => u.resetToken === token);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = null; // Clear the token after use
      console.log(`Password reset successful for token: ${token}`);
      res.status(200).json({ message: 'Password reset successfully' });
    } else {
      console.log(`Token not found: ${token}`);
      console.log('Available tokens:', mockUsers.map(u => u.resetToken));
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// // Get Login Logs (for admin analytics)
// router.get('/login-logs', async (req, res) => {
//   try {
//     const { page = 1, limit = 50, email, role, success } = req.query;

//     const query = {};
//     if (email) query.email = new RegExp(email, 'i');
//     if (role) query.role = role;
//     if (success !== undefined) query.success = success === 'true';

//     const logs = await LoginLog.find(query)
//       .populate('userId', 'username email')
//       .sort({ timestamp: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await LoginLog.countDocuments(query);

//     res.status(200).json({
//       logs,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Get login logs error:', error);
//     res.status(500).json({ error: 'Server error retrieving login logs' });
//   }
// });

module.exports = router;
module.exports.mockUsers = mockUsers;
