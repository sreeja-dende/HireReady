const express = require('express');
// const LoginLog = require('../models/LoginLog'); // Commented out for demo

const router = express.Router();

// Import mockUsers from auth.js for consistency
const { mockUsers } = require('./auth');

// Get student analytics
router.get('/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get actual stored scores instead of random
    const codingScore = parseFloat(global.codingScores?.[userId] || '0');
    const aptitudeScore = parseFloat(global.aptitudeScores?.[userId] || '0');
    const softSkillsScore = parseFloat(global.softSkillsScores?.[userId] || '0');
    const mockInterviewScore = parseFloat(global.mockInterviewScores?.[userId] || '0');
    const participationScore = parseFloat(global.participationScores?.[userId] || '0');

    // Calculate weighted overall score (out of 100)
    const overallScore = Math.round(
      (codingScore * 0.4) +
      (aptitudeScore * 0.25) +
      (softSkillsScore * 0.15) +
      (mockInterviewScore * 0.15) +
      (participationScore * 0.05)
    );

    // Generate comprehensive analytics data
    const analytics = {
      // Core scores from dashboard rings
      coding: codingScore,
      aptitude: aptitudeScore,
      softSkills: softSkillsScore,
      mockInterview: mockInterviewScore,
      participation: participationScore,
      overall: overallScore,

      // Performance level
      performanceLevel: overallScore >= 90 ? 'Excellent' :
                       overallScore >= 75 ? 'Good' :
                       overallScore >= 60 ? 'Average' :
                       overallScore >= 40 ? 'Needs Improvement' : 'Beginner',

      // Weekly progress (mock data based on current scores)
      weeklyProgress: [
        { week: 'Week 1', coding: Math.max(0, codingScore - 20), aptitude: Math.max(0, aptitudeScore - 15), softSkills: Math.max(0, softSkillsScore - 10), mockInterview: Math.max(0, mockInterviewScore - 10), participation: Math.max(0, participationScore - 5) },
        { week: 'Week 2', coding: Math.max(0, codingScore - 10), aptitude: Math.max(0, aptitudeScore - 8), softSkills: Math.max(0, softSkillsScore - 5), mockInterview: Math.max(0, mockInterviewScore - 5), participation: Math.max(0, participationScore - 1) },
        { week: 'Week 3', coding: Math.max(0, codingScore - 5), aptitude: Math.max(0, aptitudeScore - 3), softSkills: Math.max(0, softSkillsScore - 2), mockInterview: Math.max(0, mockInterviewScore - 2), participation: Math.max(0, participationScore - 1) },
        { week: 'Week 4', coding: codingScore, aptitude: aptitudeScore, softSkills: softSkillsScore, mockInterview: mockInterviewScore, participation: participationScore }
      ],

      // Module strengths and weaknesses
      strengths: [],
      weaknesses: [],
      recommendations: [],

      // Topic-wise performance (coding topics)
      codingTopics: [
        { name: 'Arrays & Strings', score: Math.min(100, codingScore + Math.floor(Math.random() * 20) - 10) },
        { name: 'Algorithms', score: Math.min(100, codingScore + Math.floor(Math.random() * 20) - 10) },
        { name: 'Data Structures', score: Math.min(100, codingScore + Math.floor(Math.random() * 20) - 10) },
        { name: 'Problem Solving', score: Math.min(100, codingScore + Math.floor(Math.random() * 20) - 10) }
      ],

      // Aptitude topics
      aptitudeTopics: [
        { name: 'Quantitative', score: Math.min(100, aptitudeScore + Math.floor(Math.random() * 20) - 10) },
        { name: 'Logical Reasoning', score: Math.min(100, aptitudeScore + Math.floor(Math.random() * 20) - 10) },
        { name: 'Verbal Ability', score: Math.min(100, aptitudeScore + Math.floor(Math.random() * 20) - 10) }
      ],

      // Progress insights
      insights: {
        bestPerformingModule: [
          { module: 'Coding', score: codingScore },
          { module: 'Aptitude', score: aptitudeScore },
          { module: 'Soft Skills', score: softSkillsScore },
          { module: 'Mock Interview', score: mockInterviewScore }
        ].sort((a, b) => b.score - a.score)[0],

        improvementNeeded: [
          { module: 'Coding', score: codingScore },
          { module: 'Aptitude', score: aptitudeScore },
          { module: 'Soft Skills', score: softSkillsScore },
          { module: 'Mock Interview', score: mockInterviewScore }
        ].filter(m => m.score < 60).sort((a, b) => a.score - b.score)[0],

        consistencyScore: Math.round((codingScore + aptitudeScore + softSkillsScore + mockInterviewScore) / 4),
        participationRate: participationScore
      },

      // Achievement badges
      achievements: [],
      nextMilestones: []
    };

    // Generate strengths and weaknesses
    if (codingScore >= 70) analytics.strengths.push('Strong coding fundamentals');
    if (aptitudeScore >= 70) analytics.strengths.push('Excellent problem-solving skills');
    if (softSkillsScore >= 70) analytics.strengths.push('Good communication skills');
    if (mockInterviewScore >= 70) analytics.strengths.push('Confident in interviews');

    if (codingScore < 60) analytics.weaknesses.push('Coding skills need improvement');
    if (aptitudeScore < 60) analytics.weaknesses.push('Aptitude preparation required');
    if (softSkillsScore < 60) analytics.weaknesses.push('Soft skills development needed');
    if (mockInterviewScore < 60) analytics.weaknesses.push('Interview practice required');

    // Generate recommendations
    if (analytics.weaknesses.length > 0) {
      analytics.recommendations.push('Focus on improving weak areas identified above');
    }
    if (overallScore < 70) {
      analytics.recommendations.push('Complete more practice sessions to improve scores');
    }
    if (participationScore < 50) {
      analytics.recommendations.push('Increase participation in all modules');
    }

    // Generate achievements
    if (overallScore >= 90) analytics.achievements.push('🏆 Excellence Achiever');
    if (codingScore >= 80) analytics.achievements.push('💻 Coding Champion');
    if (aptitudeScore >= 80) analytics.achievements.push('🧠 Aptitude Expert');
    if (softSkillsScore >= 80) analytics.achievements.push('🎭 Communication Star');
    if (mockInterviewScore >= 80) analytics.achievements.push('🎯 Interview Ready');

    // Generate next milestones
    if (overallScore < 100) analytics.nextMilestones.push(`Reach ${Math.min(100, overallScore + 10)}% overall score`);
    if (codingScore < 100) analytics.nextMilestones.push(`Improve coding score to ${Math.min(100, codingScore + 10)}%`);
    if (aptitudeScore < 100) analytics.nextMilestones.push(`Boost aptitude score to ${Math.min(100, aptitudeScore + 10)}%`);

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
