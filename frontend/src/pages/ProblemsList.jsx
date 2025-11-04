import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProblemsList = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const navigate = useNavigate();

  // Function to map job role to API role
  const mapJobRoleToApiRole = (jobRole) => {
    const roleMapping = {
      'Software Engineer': 'developer',
      'Data Analyst': 'data-analyst',
      'AI Engineer': 'ai-engineer',
      'Full Stack Developer': 'developer',
      'Frontend Developer': 'developer',
      'Backend Developer': 'developer',
      'DevOps Engineer': 'developer',
      'Machine Learning Engineer': 'ai-engineer',
      'Data Scientist': 'data-analyst'
    };
    return roleMapping[jobRole] || 'developer'; // default to developer
  };

  useEffect(() => {
    fetchProblems();
  }, [user?.jobRole]);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, selectedDifficulty, selectedTopic]);

  const fetchProblems = async () => {
    try {
      // Get the API role based on user's job role
      const apiRole = mapJobRoleToApiRole(user?.jobRole);

      // Fetch problems from API based on user's role
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/questions/${apiRole}`);
      const roleBasedProblems = response.data;

      // Transform API data to match the expected format for the UI
      const transformedProblems = roleBasedProblems.map((problem, index) => ({
        id: problem.id || (index + 1),
        title: problem.title,
        difficulty: problem.difficulty,
        topic: problem.topic,
        acceptance: '50.0%', // Default acceptance rate
        solved: false,
        description: problem.description,
        examples: [], // Could be populated from testCases if needed
        constraints: [],
        testCases: problem.testCases || []
      }));

      setProblems(transformedProblems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching problems:', error);
      // Fallback to empty array if API fails
      setProblems([]);
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    // Filter by topic
    if (selectedTopic !== 'All') {
      filtered = filtered.filter(problem => problem.topic === selectedTopic);
    }

    setFilteredProblems(filtered);
  };

  // Initialize filteredProblems with all problems when component loads
  useEffect(() => {
    if (problems.length > 0 && filteredProblems.length === 0) {
      setFilteredProblems(problems);
    }
  }, [problems, filteredProblems.length]);

  const handleProblemClick = (problem) => {
    navigate(`/coding-practice/${problem.id}`, { state: { problem } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const topics = ['All', 'Array', 'String', 'Tree', 'Linked List', 'Dynamic Programming', 'Graph', 'Stack', 'Heap', 'Math', 'Design', 'Backtracking'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Problems</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-1">Acceptance</div>
            </div>
          </div>

          {/* Problems */}
          <div className="divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleProblemClick(problem)}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-sm font-medium text-gray-900">
                    {problem.id}
                  </div>
                  <div className="col-span-6">
                    <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {problem.title}
                    </h3>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {problem.topic}
                  </div>
                  <div className="col-span-1 text-sm text-gray-600">
                    {problem.acceptance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No problems found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsList;
