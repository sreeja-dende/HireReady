const express = require('express');
// const LoginLog = require('../models/LoginLog'); // Commented out for demo

const router = express.Router();

// Import mockUsers from auth.js for consistency
const { mockUsers } = require('./auth');

// Get student analytics
router.get('/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Mock analytics data - in production, this would come from actual progress tracking
    const analytics = {
      coding: Math.max(parseFloat(global.codingScores?.[userId] || '0'), Math.floor(Math.random() * 100)),
      aptitude: Math.floor(Math.random() * 100),
      softSkills: Math.floor(Math.random() * 100),
      mockInterview: Math.floor(Math.random() * 100),
      participation: Math.floor(Math.random() * 100)
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({ error: 'Server error retrieving student analytics' });
  }
});


// Update coding score
router.post('/update-coding-score', async (req, res) => {
  try {
    const { userId, increment } = req.body;

    if (!userId || increment === undefined) {
      return res.status(400).json({ error: 'userId and increment are required' });
    }

    // In production, this would update the database
    // For demo, we'll simulate with a simple in-memory store
    global.codingScores = global.codingScores || {};
    const currentScore = parseFloat(global.codingScores[userId] || '0');
    const newScore = Math.min(currentScore + increment, 100);
    global.codingScores[userId] = newScore.toString();

    res.status(200).json({ message: 'Coding score updated successfully', newScore });
  } catch (error) {
    console.error('Update coding score error:', error);
    res.status(500).json({ error: 'Server error updating coding score' });
  }
});

// Get placement cell analytics
router.get('/placement', async (req, res) => {
  try {
    // For demo purposes, skip database operations and use mock data
    let totalLogins = 5;
    let failedLogins = 1;
    let recentLogs = [];

    // For demo purposes, use mock admin activity logs
    let adminActivityLog = [
      {
        id: 1,
        adminName: 'placement1',
        activityType: 'login',
        details: 'Successful login to placement dashboard',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 2,
        adminName: 'placement1',
        activityType: 'resource_add',
        details: 'Added new coding resource: "Advanced Algorithms Guide"',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 3,
        adminName: 'placement1',
        activityType: 'resource_edit',
        details: 'Updated aptitude quiz questions',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 4,
        adminName: 'placement1',
        activityType: 'login',
        details: 'Successful login to placement dashboard',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 5,
        adminName: 'placement1',
        activityType: 'resource_delete',
        details: 'Removed outdated resource: "Old Interview Tips"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    console.log(`Returning ${adminActivityLog.length} admin activity logs`);

    // Mock additional analytics data for placement cell
    const analytics = {
      summary: {
        totalStudents: 25,
        averageOverall: 280,
        averageConsistency: 75,
        totalSubmissions: 150
      },
      performanceDistribution: {
        excellent: 8,
        good: 10,
        average: 5,
        needsImprovement: 2
      },
      moduleCompletionStats: {
        codingCompleted: 20,
        aptitudeCompleted: 18,
        softSkillsCompleted: 15,
        mockInterviewCompleted: 12,
        allModulesCompleted: 10
      },
      consistencyLevels: {
        high: 12,
        medium: 8,
        low: 5
      },
      weeklyProgress: [
        { week: 'Week 1', avgCoding: 45, avgAptitude: 50, participation: 60 },
        { week: 'Week 2', avgCoding: 55, avgAptitude: 60, participation: 70 },
        { week: 'Week 3', avgCoding: 65, avgAptitude: 70, participation: 80 },
        { week: 'Week 4', avgCoding: 75, avgAptitude: 80, participation: 85 }
      ],
      studentDetails: [
        { id: 1, username: 'student1', totalScore: 320, codingScore: 85, aptitudeScore: 90, softSkillsScore: 80, mockInterviewScore: 75, participationRate: 85 },
        { id: 2, username: 'student2', totalScore: 290, codingScore: 75, aptitudeScore: 85, softSkillsScore: 70, mockInterviewScore: 70, participationRate: 80 }
      ],
      jobRoleDistribution: [
        { name: 'Software Engineer', value: 12 },
        { name: 'Data Analyst', value: 8 },
        { name: 'Product Manager', value: 5 }
      ],
      topPerformersByRole: [
        { username: 'student1', jobRole: 'Software Engineer', score: 320 },
        { username: 'student2', jobRole: 'Data Analyst', score: 290 }
      ],
      totalUsers: mockUsers.length,
      totalLogins,
      failedLogins,
      recentLogs,
      adminActivityLog,
      loginStats: {
        successful: totalLogins,
        failed: failedLogins,
        total: totalLogins + failedLogins
      }
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Placement analytics error:', error);
    res.status(500).json({ error: 'Server error retrieving placement analytics' });
  }
});

// Export mockUsers for backward compatibility
module.exports = router;
module.exports.mockUsers = mockUsers;
