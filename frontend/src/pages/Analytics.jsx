import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Analytics = ({ user }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
    // Set default tab to admin-activity for placement cell users
    if (user.role === 'Placement Cell') {
      setActiveTab('admin-activity');
    }
  }, []);

  const fetchAnalytics = async () => {
    try {
      let endpoint;
      if (user.role === 'Student') {
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/analytics/student/${user.id}`;
      } else {
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/analytics/placement`;
      }
      const response = await axios.get(endpoint);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalyticsData({
        coding: 75,
        aptitude: 80,
        participation: 60,
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
    }
  };

  if (!analyticsData) {
    return <div className="flex justify-center items-center h-64 text-white">Loading analytics...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // For placement cell, show detailed analytics with student data
  if (user.role === 'Placement Cell') {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Placement Cell Analytics</h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {['overview', 'performance', 'consistency', 'job-roles', 'admin-activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'performance' ? 'Performance Analysis' : tab === 'consistency' ? 'Consistency & Progress' : tab === 'job-roles' ? 'Job Roles & Top Performers' : 'Admin Activity'}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-indigo-400">{analyticsData.summary?.totalStudents || 0}</p>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Average Overall Score</h3>
                <p className="text-3xl font-bold text-green-400">{analyticsData.summary?.averageOverall || 0}/400</p>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Consistency Rate</h3>
                <p className="text-3xl font-bold text-yellow-400">{analyticsData.summary?.averageConsistency || 0}%</p>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Total Submissions</h3>
                <p className="text-3xl font-bold text-purple-400">{analyticsData.summary?.totalSubmissions || 0}</p>
              </div>
            </div>

            {/* Module-wise Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Average Performance by Module</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { module: 'Coding (35%)', score: analyticsData.summary?.averageCoding || 0, weight: 35 },
                      { module: 'Aptitude (25%)', score: analyticsData.summary?.averageAptitude || 0, weight: 25 },
                      { module: 'Soft Skills (20%)', score: analyticsData.summary?.averageSoftSkills || 0, weight: 20 },
                      { module: 'Mock Interview (20%)', score: analyticsData.summary?.averageMockInterview || 0, weight: 20 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="module" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Overall Performance Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Excellent (320+)', value: analyticsData.performanceDistribution?.excellent || 0 },
                        { name: 'Good (240-319)', value: analyticsData.performanceDistribution?.good || 0 },
                        { name: 'Average (160-239)', value: analyticsData.performanceDistribution?.average || 0 },
                        { name: `Needs Improvement (${"<"}160)`, value: analyticsData.performanceDistribution?.needsImprovement || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name.split(' ')[0]}: ${value}` : ''}
                    >
                      {['#00C49F', '#FFBB28', '#0088FE', '#FF8042'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Module Completion Statistics */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Module Completion Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{analyticsData.moduleCompletionStats?.codingCompleted || 0}</div>
                  <div className="text-sm text-gray-300">Coding Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{analyticsData.moduleCompletionStats?.aptitudeCompleted || 0}</div>
                  <div className="text-sm text-gray-300">Aptitude Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{analyticsData.moduleCompletionStats?.softSkillsCompleted || 0}</div>
                  <div className="text-sm text-gray-300">Soft Skills Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{analyticsData.moduleCompletionStats?.mockInterviewCompleted || 0}</div>
                  <div className="text-sm text-gray-300">Mock Interview Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">{analyticsData.moduleCompletionStats?.allModulesCompleted || 0}</div>
                  <div className="text-sm text-gray-300">All Modules Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Analysis Header */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance Analysis</h2>
              <p className="text-gray-300">Detailed breakdown of student performance across all modules</p>
            </div>

            {/* Performance Analysis Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {analyticsData.studentDetails?.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2">#{index + 1}</span>
                        <span className="text-white">{student.username}</span>
                      </div>
                      <span className="text-green-400 font-semibold">{student.totalScore || 0}</span>
                    </div>
                  )) || []}
                </div>
              </div>

              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Levels</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-green-400">Excellent (320+)</span>
                    <span className="text-white">{analyticsData.performanceDistribution?.excellent || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Good (240-319)</span>
                    <span className="text-white">{analyticsData.performanceDistribution?.good || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Average (160-239)</span>
                    <span className="text-white">{analyticsData.performanceDistribution?.average || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400">Needs Improvement ({"<"}160)</span>
                    <span className="text-white">{analyticsData.performanceDistribution?.needsImprovement || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="space-y-8">
            {/* Consistency Analysis Header */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Consistency & Progress Analysis</h2>
              <p className="text-gray-300">Track student consistency and progress patterns across modules</p>
            </div>

            {/* Consistency Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{analyticsData.consistencyLevels?.high || 0}</div>
                <div className="text-sm text-gray-300">High Consistency</div>
                <div className="text-xs text-gray-400">80-100% completion</div>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{analyticsData.consistencyLevels?.medium || 0}</div>
                <div className="text-sm text-gray-300">Medium Consistency</div>
                <div className="text-xs text-gray-400">50-79% completion</div>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{analyticsData.consistencyLevels?.low || 0}</div>
                <div className="text-sm text-gray-300">Low Consistency</div>
                <div className="text-xs text-gray-400">{"<"}50% completion</div>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Weekly Progress Trends</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analyticsData.weeklyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                  <Legend />
                  <Line type="monotone" dataKey="avgCoding" stroke="#8884d8" strokeWidth={3} name="Avg Coding Score" />
                  <Line type="monotone" dataKey="avgAptitude" stroke="#82ca9d" strokeWidth={3} name="Avg Aptitude Score" />
                  <Line type="monotone" dataKey="participation" stroke="#ffc658" strokeWidth={3} name="Participation Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Distribution Bar Chart */}
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Score Distribution by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { category: 'Coding Scores', excellent: analyticsData.studentDetails?.filter(s => s.codingScore >= 80).length || 0, good: analyticsData.studentDetails?.filter(s => s.codingScore >= 60 && s.codingScore < 80).length || 0, average: analyticsData.studentDetails?.filter(s => s.codingScore >= 40 && s.codingScore < 60).length || 0, poor: analyticsData.studentDetails?.filter(s => s.codingScore < 40).length || 0 },
                      { category: 'Aptitude Scores', excellent: analyticsData.studentDetails?.filter(s => s.aptitudeScore >= 80).length || 0, good: analyticsData.studentDetails?.filter(s => s.aptitudeScore >= 60 && s.aptitudeScore < 80).length || 0, average: analyticsData.studentDetails?.filter(s => s.aptitudeScore >= 40 && s.aptitudeScore < 60).length || 0, poor: analyticsData.studentDetails?.filter(s => s.aptitudeScore < 40).length || 0 },
                      { category: 'Soft Skills', excellent: analyticsData.studentDetails?.filter(s => s.softSkillsScore >= 80).length || 0, good: analyticsData.studentDetails?.filter(s => s.softSkillsScore >= 60 && s.softSkillsScore < 80).length || 0, average: analyticsData.studentDetails?.filter(s => s.softSkillsScore >= 40 && s.softSkillsScore < 60).length || 0, poor: analyticsData.studentDetails?.filter(s => s.softSkillsScore < 40).length || 0 },
                      { category: 'Mock Interview', excellent: analyticsData.studentDetails?.filter(s => s.mockInterviewScore >= 80).length || 0, good: analyticsData.studentDetails?.filter(s => s.mockInterviewScore >= 60 && s.mockInterviewScore < 80).length || 0, average: analyticsData.studentDetails?.filter(s => s.mockInterviewScore >= 40 && s.mockInterviewScore < 60).length || 0, poor: analyticsData.studentDetails?.filter(s => s.mockInterviewScore < 40).length || 0 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                    <Legend />
                    <Bar dataKey="excellent" stackId="a" fill="#00C49F" name="Excellent (80+)" />
                    <Bar dataKey="good" stackId="a" fill="#FFBB28" name="Good (60-79)" />
                    <Bar dataKey="average" stackId="a" fill="#0088FE" name="Average (40-59)" />
                    <Bar dataKey="poor" stackId="a" fill="#FF8042" name={`Needs Work (${"<"}40)`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Participation vs Performance Scatter */}
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Participation vs Total Score</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={analyticsData.studentDetails?.map(student => ({
                      name: student.username.substring(0, 8) + '..',
                      participation: student.participationRate,
                      totalScore: student.totalScore
                    })) || []}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="participation" fill="#8884d8" name="Participation %" />
                    <Bar yAxisId="right" dataKey="totalScore" fill="#82ca9d" name="Total Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'job-roles' && (
          <div className="space-y-8">
            {/* Job Roles Analysis Header */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Job Roles & Top Performers</h2>
              <p className="text-gray-300">Analysis of student performance by selected job roles</p>
            </div>

            {/* Job Role Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Job Role Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.jobRoleDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performers by Job Role</h3>
                <div className="space-y-3">
                  {analyticsData.topPerformersByRole?.slice(0, 5).map((performer, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                      <div>
                        <div className="text-white font-medium">{performer.username}</div>
                        <div className="text-gray-400 text-sm">{performer.jobRole}</div>
                      </div>
                      <span className="text-green-400 font-semibold">{performer.score}</span>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin-activity' && (
          <div className="space-y-8">
            {/* Admin Activity Log Header */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Admin Activity Log</h2>
              <p className="text-gray-300">Complete log of placement cell admin activities, changes made, and timestamps</p>
            </div>

            {/* Activity Log Table */}
            <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Recent Admin Activities</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {analyticsData.adminActivityLog?.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {activity.adminName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.activityType === 'login' ? 'bg-green-100 text-green-800' :
                            activity.activityType === 'resource_add' ? 'bg-blue-100 text-blue-800' :
                            activity.activityType === 'resource_edit' ? 'bg-yellow-100 text-yellow-800' :
                            activity.activityType === 'resource_delete' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.activityType.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {activity.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(activity.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {activity.ipAddress}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                          No admin activities recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {analyticsData.adminActivityLog?.filter(a => a.activityType === 'login').length || 0}
                </div>
                <div className="text-sm text-gray-300">Total Logins</div>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {analyticsData.adminActivityLog?.filter(a => a.activityType === 'resource_add').length || 0}
                </div>
                <div className="text-sm text-gray-300">Resources Added</div>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {analyticsData.adminActivityLog?.filter(a => a.activityType === 'resource_edit').length || 0}
                </div>
                <div className="text-sm text-gray-300">Resources Edited</div>
              </div>
              <div className="bg-gray-800 shadow rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  {analyticsData.adminActivityLog?.filter(a => a.activityType === 'resource_delete').length || 0}
                </div>
                <div className="text-sm text-gray-300">Resources Deleted</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student analytics (existing code)
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">Personal Analytics</h1>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl font-bold text-white mb-2">{analyticsData.overall || 0}%</div>
          <div className="text-blue-200 text-sm uppercase tracking-wide">Overall Score</div>
          <div className="mt-2 text-xs text-blue-300">{analyticsData.performanceLevel}</div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 shadow-xl rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl font-bold text-white mb-2">{analyticsData.coding}%</div>
          <div className="text-green-200 text-sm uppercase tracking-wide">Coding</div>
          <div className="mt-2 text-xs text-green-300">35% Weight</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 shadow-xl rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl font-bold text-white mb-2">{analyticsData.aptitude}%</div>
          <div className="text-purple-200 text-sm uppercase tracking-wide">Aptitude</div>
          <div className="mt-2 text-xs text-purple-300">25% Weight</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 shadow-xl rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl font-bold text-white mb-2">{analyticsData.participation}%</div>
          <div className="text-yellow-200 text-sm uppercase tracking-wide">Participation</div>
          <div className="mt-2 text-xs text-yellow-300">5% Weight</div>
        </div>
      </div>

      {/* Strengths & Achievements Section */}
      {analyticsData.achievements && analyticsData.achievements.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🏆</span> Achievements Unlocked
          </h2>
          <div className="flex flex-wrap gap-3">
            {analyticsData.achievements.map((achievement, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium">
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {analyticsData.strengths && analyticsData.strengths.length > 0 && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">💪</span> Your Strengths
            </h2>
            <ul className="space-y-2">
              {analyticsData.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-white">
                  <span className="text-green-300 mr-2">✓</span> {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analyticsData.weaknesses && analyticsData.weaknesses.length > 0 && (
          <div className="bg-gradient-to-br from-red-500 to-pink-600 shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🎯</span> Areas for Improvement
            </h2>
            <ul className="space-y-2">
              {analyticsData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-center text-white">
                  <span className="text-red-300 mr-2">→</span> {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {analyticsData.recommendations && analyticsData.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💡</span> Personalized Recommendations
          </h2>
          <ul className="space-y-3">
            {analyticsData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-white">
                <span className="text-blue-300 mr-3 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Milestones */}
      {analyticsData.nextMilestones && analyticsData.nextMilestones.length > 0 && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 shadow-xl rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🚀</span> Next Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.nextMilestones.map((milestone, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-orange-300 mr-2">🎯</span>
                  {milestone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
              <Legend />
              <Line type="monotone" dataKey="coding" stroke="#3B82F6" strokeWidth={3} name="Coding" />
              <Line type="monotone" dataKey="aptitude" stroke="#10B981" strokeWidth={3} name="Aptitude" />
              <Line type="monotone" dataKey="softSkills" stroke="#F59E0B" strokeWidth={3} name="Soft Skills" />
              <Line type="monotone" dataKey="mockInterview" stroke="#EF4444" strokeWidth={3} name="Mock Interview" />
              <Line type="monotone" dataKey="participation" stroke="#8B5CF6" strokeWidth={3} name="Participation" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Module Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Coding', value: analyticsData.coding, color: '#3B82F6' },
              { name: 'Aptitude', value: analyticsData.aptitude, color: '#10B981' },
              { name: 'Soft Skills', value: analyticsData.softSkills, color: '#F59E0B' },
              { name: 'Mock Interview', value: analyticsData.mockInterview, color: '#EF4444' },
              { name: 'Participation', value: analyticsData.participation, color: '#8B5CF6' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
              <Bar dataKey="value" fill="#8884d8">
                {[
                  { name: 'Coding', value: analyticsData.coding, color: '#3B82F6' },
                  { name: 'Aptitude', value: analyticsData.aptitude, color: '#10B981' },
                  { name: 'Soft Skills', value: analyticsData.softSkills, color: '#F59E0B' },
                  { name: 'Mock Interview', value: analyticsData.mockInterview, color: '#EF4444' },
                  { name: 'Participation', value: analyticsData.participation, color: '#8B5CF6' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic-wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {analyticsData.codingTopics && (
          <div className="bg-gray-800 shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Coding Topics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.codingTopics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {analyticsData.aptitudeTopics && (
          <div className="bg-gray-800 shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Aptitude Topics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.aptitudeTopics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                <Bar dataKey="score" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insights Section */}
      {analyticsData.insights && (
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span> Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {analyticsData.insights.bestPerformingModule?.module || 'N/A'}
              </div>
              <div className="text-sm text-gray-300">Best Module</div>
              <div className="text-xs text-gray-400">{analyticsData.insights.bestPerformingModule?.score || 0}%</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {analyticsData.insights.improvementNeeded?.module || 'N/A'}
              </div>
              <div className="text-sm text-gray-300">Needs Focus</div>
              <div className="text-xs text-gray-400">{analyticsData.insights.improvementNeeded?.score || 0}%</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {analyticsData.insights.consistencyScore}%
              </div>
              <div className="text-sm text-gray-300">Consistency</div>
              <div className="text-xs text-gray-400">Across modules</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {analyticsData.insights.participationRate}%
              </div>
              <div className="text-sm text-gray-300">Participation</div>
              <div className="text-xs text-gray-400">Activity rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
