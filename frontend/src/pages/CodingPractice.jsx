import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from 'axios';

const CodingPractice = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [submissions, setSubmissions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcase');

  useEffect(() => {
    if (location.state?.problem) {
      setCurrentQuestion(location.state.problem);
    } else if (id) {
      fetchProblemById(id);
    } else {
      fetchDefaultProblem();
    }

    // Load saved data from localStorage
    loadSavedData();
  }, [id, location.state]);

  useEffect(() => {
    if (currentQuestion) {
      const starterCode = generateStarterCode(currentQuestion, selectedLanguage);
      setCode(starterCode);
      setOutput('');
      setTestResults([]);
      setConsoleOutput([]);
    }
  }, [currentQuestion, selectedLanguage]);

  const loadSavedData = () => {
    const savedSubmissions = localStorage.getItem(`submissions_${user.id}_${id || 'default'}`);
    const savedSolutions = localStorage.getItem(`solutions_${user.id}_${id || 'default'}`);
    const savedCount = localStorage.getItem(`submissionCount_${user.id}_${id || 'default'}`);

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
    if (savedSolutions) {
      setSolutions(JSON.parse(savedSolutions));
    }
    if (savedCount) {
      setSubmissionCount(parseInt(savedCount));
    }
  };

  const saveData = (newSubmissions, newSolutions, newCount) => {
    localStorage.setItem(`submissions_${user.id}_${id || 'default'}`, JSON.stringify(newSubmissions));
    localStorage.setItem(`solutions_${user.id}_${id || 'default'}`, JSON.stringify(newSolutions));
    localStorage.setItem(`submissionCount_${user.id}_${id || 'default'}`, newCount.toString());
  };

  const fetchDefaultProblem = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/questions/developer`);
      setCurrentQuestion(response.data[0]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setCurrentQuestion({
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: "Easy",
        topic: "Array",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]"
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]"
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ]
      });
    }
  };

  const fetchProblemById = async (problemId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/questions/${problemId}`);
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
      fetchDefaultProblem();
    }
  };

  const handleRun = async () => {
    if (!currentQuestion?.examples) return;

    setIsRunning(true);
    setOutput('Running tests...');
    setConsoleOutput([]);
    setTestResults([]);

    try {
      const results = [];
      const consoleLogs = [];
      let allPassed = true;
      let passedCount = 0;

      // Check if code is empty or just starter code
      const trimmedCode = code.trim();
      const isEmptyCode = !trimmedCode ||
        trimmedCode.includes('// Write your solution here') ||
        trimmedCode.includes('# Write your solution here') ||
        trimmedCode === `function ${currentQuestion.title.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}(nums, target) {\n    // Write your solution here\n    \n}`;

      if (isEmptyCode) {
        consoleLogs.push({
          type: 'error',
          message: 'Please write some code before running tests.',
          timestamp: new Date().toISOString()
        });
        setConsoleOutput(consoleLogs);
        setOutput('Please write some code before running tests.');
        setIsRunning(false);
        return;
      }

      for (let i = 0; i < currentQuestion.examples.length; i++) {
        const testCase = currentQuestion.examples[i];

        try {
          consoleLogs.push({
            type: 'info',
            message: `Running test case ${i + 1}...`,
            timestamp: new Date().toISOString()
          });

          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/execute`, {
            code: code,
            language: selectedLanguage,
            testCase: testCase
          });

          const result = response.data;

          let expectedOutput;
          if (testCase.output.startsWith('[') && testCase.output.endsWith(']')) {
            expectedOutput = JSON.parse(testCase.output);
          } else if (testCase.output === 'true' || testCase.output === 'false') {
            expectedOutput = testCase.output === 'true';
          } else if (!isNaN(testCase.output)) {
            expectedOutput = parseInt(testCase.output);
          } else {
            expectedOutput = testCase.output.replace(/"/g, '');
          }

          let passed = false;
          if (result.status === 'success') {
            passed = JSON.stringify(result.output) === JSON.stringify(expectedOutput);
            if (passed) passedCount++;
          }

          results.push({
            input: testCase.input,
            expected: testCase.output,
            actual: result.status === 'success' ? result.output : (result.error || 'Execution failed'),
            status: result.status === 'success' ? (passed ? 'pass' : 'fail') : 'error',
            error: result.error
          });

          consoleLogs.push({
            type: result.status === 'success' ? (passed ? 'success' : 'error') : 'error',
            message: `Test case ${i + 1}: ${result.status === 'success' ? (passed ? 'PASSED' : 'FAILED') : 'ERROR'}`,
            details: `Input: ${testCase.input} | Expected: ${testCase.output} | Got: ${result.status === 'success' ? result.output : (result.error || 'Execution failed')}`,
            timestamp: new Date().toISOString()
          });

          if (!passed) {
            allPassed = false;
          }

        } catch (executionError) {
          results.push({
            input: testCase.input,
            expected: testCase.output,
            actual: 'Execution Error',
            status: 'error',
            error: executionError.response?.data?.error || executionError.message
          });
          allPassed = false;

          consoleLogs.push({
            type: 'error',
            message: `Test case ${i + 1}: EXECUTION ERROR`,
            details: executionError.response?.data?.error || executionError.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      setTestResults(results);
      setConsoleOutput(consoleLogs);

      const summaryMessage = allPassed
        ? `All ${currentQuestion.examples.length} test cases passed! ✅`
        : `${passedCount}/${currentQuestion.examples.length} test cases passed. ${currentQuestion.examples.length - passedCount} failed. ❌`;

      setOutput(summaryMessage);

    } catch (error) {
      console.error('Error running tests:', error);
      const errorLogs = [{
        type: 'error',
        message: 'Failed to run tests',
        details: error.response?.data?.error || error.message,
        timestamp: new Date().toISOString()
      }];
      setConsoleOutput(errorLogs);
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('Submitting solution...');

    try {
      // First run the tests to validate the code
      const results = [];
      let allPassed = true;

      for (let i = 0; i < currentQuestion.examples.length; i++) {
        const testCase = currentQuestion.examples[i];

        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/execute`, {
            code: code,
            language: selectedLanguage,
            testCase: testCase
          });

          const result = response.data;

          let expectedOutput;
          if (testCase.output.startsWith('[') && testCase.output.endsWith(']')) {
            expectedOutput = JSON.parse(testCase.output);
          } else if (testCase.output === 'true' || testCase.output === 'false') {
            expectedOutput = testCase.output === 'true';
          } else if (!isNaN(testCase.output)) {
            expectedOutput = parseInt(testCase.output);
          } else {
            expectedOutput = testCase.output.replace(/"/g, '');
          }

          let passed = false;
          if (result.status === 'success') {
            passed = JSON.stringify(result.output) === JSON.stringify(expectedOutput);
          }

          results.push({
            input: testCase.input,
            expected: testCase.output,
            actual: result.status === 'success' ? result.output : (result.error || 'Execution failed'),
            status: result.status === 'success' ? (passed ? 'pass' : 'fail') : 'error',
            error: result.error
          });

          if (!passed) {
            allPassed = false;
          }

        } catch (executionError) {
          results.push({
            input: testCase.input,
            expected: testCase.output,
            actual: 'Execution Error',
            status: 'error',
            error: executionError.response?.data?.error || executionError.message
          });
          allPassed = false;
        }
      }

      setTestResults(results);

      if (!allPassed) {
        setOutput('Submission failed: Code does not pass all test cases. Please fix the errors and try again.');
        setIsSubmitting(false);
        return;
      }

      // If all tests pass, proceed with submission
      // Calculate AI-based score
      const codeScore = analyzeCodeQuality(code, selectedLanguage, results);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/submit/coding`, {
        userId: user.id,
        questionId: currentQuestion.id,
        code: code,
        language: selectedLanguage,
        score: codeScore
      });

      const score = response.data.score || codeScore;

      // Create submission record
      const newSubmission = {
        id: Date.now(),
        code: code,
        language: selectedLanguage,
        score: score,
        status: 'accepted',
        timestamp: new Date().toISOString(),
        testResults: results
      };

      const updatedSubmissions = [newSubmission, ...submissions];
      setSubmissions(updatedSubmissions);
      setSubmissionCount(submissionCount + 1);

      // Save to solutions since all tests passed
      const newSolution = {
        id: Date.now(),
        code: code,
        language: selectedLanguage,
        score: score,
        timestamp: new Date().toISOString(),
        problemTitle: currentQuestion.title
      };
      const updatedSolutions = [newSolution, ...solutions];
      setSolutions(updatedSolutions);
      saveData(updatedSubmissions, updatedSolutions, submissionCount + 1);

      // Update coding score in dashboard with AI-calculated score
      updateCodingScore(score, code, selectedLanguage, results);

      setOutput(`Accepted! Score: ${score}/100`);

    } catch (error) {
      console.error('Error submitting code:', error);
      // Mock submission for demo with AI scoring
      const mockTestResults = testResults.length > 0 ? testResults : results;
      const mockScore = analyzeCodeQuality(code, selectedLanguage, mockTestResults);
      const allPassed = mockTestResults.every(r => r.status === 'pass');

      const newSubmission = {
        id: Date.now(),
        code: code,
        language: selectedLanguage,
        score: mockScore,
        status: allPassed ? 'accepted' : 'failed',
        timestamp: new Date().toISOString(),
        testResults: mockTestResults
      };

      const updatedSubmissions = [newSubmission, ...submissions];
      setSubmissions(updatedSubmissions);
      setSubmissionCount(submissionCount + 1);

      if (allPassed) {
        const newSolution = {
          id: Date.now(),
          code: code,
          language: selectedLanguage,
          score: mockScore,
          timestamp: new Date().toISOString(),
          problemTitle: currentQuestion.title
        };
        const updatedSolutions = [newSolution, ...solutions];
        setSolutions(updatedSolutions);
        saveData(updatedSubmissions, updatedSolutions, submissionCount + 1);
      } else {
        saveData(updatedSubmissions, solutions, submissionCount + 1);
      }

      // Update coding score with AI-calculated score
      updateCodingScore(mockScore, code, selectedLanguage, mockTestResults);

      setOutput(allPassed ? `Accepted! Your ${selectedLanguage} solution has been submitted. Score: ${mockScore}/100` : `Failed! Your code did not pass all test cases. Score: ${mockScore}/100`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI-based code scoring algorithm
  const analyzeCodeQuality = (code, language, testResults) => {
    let score = 0;
    const allTestsPassed = testResults.every(result => result.status === 'pass');

    // Base score based on test results
    if (allTestsPassed) {
      score = 85; // Base for correct solutions
    } else {
      const passedCount = testResults.filter(r => r.status === 'pass').length;
      const passRate = passedCount / testResults.length;
      score = Math.floor(passRate * 60); // Max 60 for partial solutions
    }

    // Code quality analysis
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const codeLength = code.length;
    const hasComments = code.includes('//') || code.includes('#') || code.includes('/*');
    const hasProperStructure = language === 'javascript' ? code.includes('function') :
                              language === 'python' ? code.includes('def ') :
                              language === 'java' ? code.includes('public class') : false;

    // Efficiency bonus (shorter, cleaner code)
    if (codeLength < 200 && lines.length <= 10) {
      score += 10; // Efficient solution
    } else if (codeLength < 400 && lines.length <= 20) {
      score += 5; // Decent solution
    }

    // Structure bonus
    if (hasProperStructure) score += 5;

    // Readability bonus
    if (hasComments) score += 3;

    // Language-specific bonuses
    if (language === 'javascript' && code.includes('const') && code.includes('=>')) {
      score += 2; // Modern JS practices
    }
    if (language === 'python' && code.includes('def ') && !code.includes('print(')) {
      score += 2; // Clean Python code
    }

    // Penalty for very long code
    if (codeLength > 1000) score = Math.max(score - 10, 0);

    return Math.min(Math.max(score, 0), 100);
  };

  const updateCodingScore = async (codeScore, code, language, testResults) => {
    try {
      let increment = 0;

      if (codeScore >= 90) {
        // Excellent solution - 2-3% increment
        increment = Math.random() * 1 + 2; // 2-3%
      } else if (codeScore >= 70) {
        // Good solution - 1-2% increment
        increment = Math.random() * 1 + 1; // 1-2%
      } else if (codeScore >= 50) {
        // Acceptable solution - 0.5-1% increment
        increment = Math.random() * 0.5 + 0.5; // 0.5-1%
      } else {
        // Poor solution - no increment
        increment = 0;
      }

      if (increment > 0) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/analytics/update-coding-score`, {
          userId: user.id,
          increment: increment
        });
      }
    } catch (error) {
      console.error('Error updating coding score:', error);
      // For demo, update local storage with proper increments
      const currentScore = parseFloat(localStorage.getItem(`codingScore_${user.id}`) || '0');

      let increment = 0;
      if (codeScore >= 90) {
        increment = Math.random() * 1 + 2;
      } else if (codeScore >= 70) {
        increment = Math.random() * 1 + 1;
      } else if (codeScore >= 50) {
        increment = Math.random() * 0.5 + 0.5;
      }

      const newScore = Math.min(currentScore + increment, 100);
      localStorage.setItem(`codingScore_${user.id}`, newScore.toString());
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const generateStarterCode = (question, language) => {
    const functionName = question.title.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

    switch (language) {
      case 'javascript':
        return `function ${functionName}(nums, target) {\n    // Write your solution here\n    \n}`;
      case 'python':
        return `def ${functionName}(nums, target):\n    # Write your solution here\n    pass`;
      case 'java':
        return `public class Solution {\n    public int[] ${functionName}(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`;
      case 'cpp':
        return `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> ${functionName}(vector<int>& nums, int target) {\n        // Write your solution here\n        \n    }\n};`;
      default:
        return `function ${functionName}(nums, target) {\n    // Write your solution here\n    \n}`;
    }
  };

  const formatCode = (code, language) => {
    // Basic code formatting - add proper indentation
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentSize = 4;

    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing braces/brackets
      if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']') ||
          trimmed.startsWith('end') || trimmed.startsWith('else') || trimmed.startsWith('elif')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indented = ' '.repeat(indentLevel * indentSize) + trimmed;

      // Increase indent for opening braces/brackets
      if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[') ||
          trimmed.startsWith('if') || trimmed.startsWith('for') || trimmed.startsWith('while') ||
          trimmed.startsWith('def') || trimmed.startsWith('class')) {
        indentLevel++;
      }

      return indented;
    });

    return formattedLines.join('\n');
  };

  const tabs = [
    { id: 'problem', label: 'Problem', icon: '📝' },
    { id: 'solutions', label: 'Solutions', icon: '💡', count: solutions.length },
    { id: 'submissions', label: 'Submissions', icon: '📊', count: submissionCount }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/studentdashboard/coding"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              ← Back to Problems
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-900">{currentQuestion?.title}</h1>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              currentQuestion?.difficulty === 'Easy' ? 'bg-green-100 text-green-800 border border-green-200' :
              currentQuestion?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {currentQuestion?.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    tab.id === 'submissions' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex h-[calc(100vh-113px)]">
        {/* Left Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion?.title}</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {currentQuestion?.description}
                  </p>
                </div>

                {/* Examples */}
                {currentQuestion?.examples?.map((example, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Example {index + 1}:</h3>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg font-mono text-sm shadow-sm">
                      <div className="text-blue-700 mb-2">
                        <strong className="text-blue-600">Input:</strong> {example.input}
                      </div>
                      <div className="text-green-700 mb-2">
                        <strong className="text-green-600">Output:</strong> {example.output}
                      </div>
                      {example.explanation && (
                        <div className="text-gray-600">
                          <strong className="text-gray-500">Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {currentQuestion?.constraints?.map((constraint, index) => (
                      <li key={index} className="text-sm">{constraint}</li>
                    )) || [
                      "2 <= nums.length <= 10^4",
                      "-10^9 <= nums[i] <= 10^9",
                      "-10^9 <= target <= 10^9",
                      "Only one valid answer exists."
                    ].map((constraint, index) => (
                      <li key={index} className="text-sm">{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepted Solutions</h2>
                  {solutions.length === 0 ? (
                    <p className="text-gray-500">No accepted solutions yet. Submit a correct solution to see it here!</p>
                  ) : (
                    <div className="space-y-4">
                      {solutions.map((solution, index) => (
                        <div key={solution.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 font-medium">Accepted</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-600">{solution.language}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-600">Score: {solution.score}/100</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(solution.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="bg-white border border-gray-200 rounded p-3">
                            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                              {formatCode(solution.code, solution.language)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission History</h2>
                  {submissions.length === 0 ? (
                    <p className="text-gray-500">No submissions yet. Start coding and submit your solutions!</p>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission, index) => (
                        <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                submission.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {submission.status === 'accepted' ? '✓ Accepted' : '✗ Failed'}
                              </span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-600">{submission.language}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-600">Score: {submission.score}/100</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(submission.timestamp).toLocaleDateString()} {new Date(submission.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                              {formatCode(submission.code, submission.language)}
                            </pre>
                          </div>
                          {submission.testResults && submission.testResults.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <h4 className="text-sm font-medium text-gray-700">Test Results:</h4>
                              {submission.testResults.map((result, idx) => (
                                <div key={idx} className="text-xs bg-white p-2 rounded border">
                                  <div className="flex items-center space-x-2">
                                    <span className={`w-3 h-3 rounded-full ${
                                      result.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    <span className="font-mono">Input: {result.input}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className="font-mono">Expected: {result.expected}</span>
                                    <span className="text-gray-500">→</span>
                                    <span className="font-mono">Got: {result.actual}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 bg-white shadow-sm">
            <CodeMirror
              value={code}
              height="100%"
              extensions={
                selectedLanguage === 'javascript' ? [javascript()] :
                selectedLanguage === 'python' ? [python()] :
                selectedLanguage === 'java' ? [java()] :
                selectedLanguage === 'cpp' ? [cpp()] :
                [javascript()]
              }
              theme={oneDark}
              onChange={(value) => setCode(value)}
              className="h-full"
            />
          </div>

          {/* Console/Test Results */}
          <div className="h-64 bg-white border-t border-gray-200 shadow-sm">
            {/* Console Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveConsoleTab('testcase')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeConsoleTab === 'testcase'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Testcase ({testResults.length})
                </button>
                <button
                  onClick={() => setActiveConsoleTab('console')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeConsoleTab === 'console'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Console ({consoleOutput.length})
                </button>
              </nav>
            </div>

            <div className="p-4 h-full overflow-y-auto">
              {activeConsoleTab === 'testcase' ? (
                <div className="space-y-3">
                  {testResults.length > 0 ? (
                    testResults.map((result, index) => (
                      <div key={index} className={`text-sm p-4 border rounded-lg transition-all duration-200 ${
                        result.status === 'pass'
                          ? 'border-green-200 bg-green-50 shadow-sm'
                          : result.status === 'error'
                          ? 'border-red-200 bg-red-50 shadow-sm'
                          : 'border-red-200 bg-red-50 shadow-sm'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`w-4 h-4 rounded-full flex-shrink-0 ${
                            result.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                            result.status === 'pass'
                              ? 'text-green-700 bg-green-100'
                              : 'text-red-700 bg-red-100'
                          }`}>
                            {result.status === 'pass' ? '✓ Passed' : result.status === 'error' ? '⚠️ Error' : '✗ Failed'}
                          </span>
                          <span className="text-xs text-gray-500">Test Case {index + 1}</span>
                        </div>
                        <div className="font-mono text-xs space-y-1">
                          <div className="text-gray-600">Input: {result.input}</div>
                          <div className="text-gray-600">Expected: {result.expected}</div>
                          <div className="text-gray-600">Actual: {result.actual}</div>
                          {result.error && (
                            <div className="text-red-600 font-semibold mt-2">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm text-center py-8">
                      <div className="text-2xl mb-2">🧪</div>
                      {output || 'Click "Run" to test your code...'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {consoleOutput.length > 0 ? (
                    consoleOutput.map((log, index) => (
                      <div key={index} className={`p-2 rounded ${
                        log.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                        log.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                        log.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            log.type === 'error' ? 'bg-red-500' :
                            log.type === 'success' ? 'bg-green-500' :
                            log.type === 'info' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></span>
                          <span className="font-medium">{log.message}</span>
                        </div>
                        {log.details && (
                          <div className="mt-1 text-xs opacity-75 ml-4">
                            {log.details}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm text-center py-8">
                      <div className="text-2xl mb-2">📋</div>
                      Console output will appear here when you run tests...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
