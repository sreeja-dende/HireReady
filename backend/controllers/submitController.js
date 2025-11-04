// In-memory storage for scores (since MongoDB is not available)
let userScores = {};

// Submit coding solution
const submitCoding = async (req, res) => {
  console.log('Coding submission received:', { userId: req.body.userId, questionId: req.body.questionId, codeLength: req.body.code?.length, language: req.body.language });
  try {
    const { userId, questionId, code, language } = req.body;

    // Initialize user scores if not exists
    if (!userScores[userId]) {
      userScores[userId] = { coding: 0, aptitude: 0, dailyCoding: {}, dailyAptitude: {} };
    }

    // Enhanced coding scoring algorithm with language consideration
    let score = 0;
    const codeLength = code ? code.length : 0;
    const hasLoops = /for|while|do/.test(code);
    const hasConditions = /if|else|switch/.test(code);
    const hasFunctions = /function|def|public|class/.test(code);
    const complexity = (hasLoops ? 20 : 0) + (hasConditions ? 15 : 0) + (hasFunctions ? 25 : 0);

    // Base score for submission
    score = 40;

    // Add points for code quality
    if (codeLength > 50) score += 20;
    if (codeLength > 100) score += 15;
    if (complexity > 0) score += complexity;

    // Language-specific adjustments
    if (language === 'javascript') {
      // JavaScript gets full score potential
      score = Math.min(score, 100);
    } else if (language === 'python') {
      // Python gets slight bonus for readability
      score = Math.min(score + 5, 100);
    } else if (language === 'java') {
      // Java gets bonus for OOP structure
      score = Math.min(score + 3, 100);
    } else if (language === 'cpp') {
      // C++ gets bonus for performance-oriented code
      score = Math.min(score + 2, 100);
    } else {
      // Default cap
      score = Math.min(score, 100);
    }

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    if (!userScores[userId].dailyCoding[today]) {
      userScores[userId].dailyCoding[today] = [];
    }
    userScores[userId].dailyCoding[today].push(score);

    // Calculate average daily score
    const dailyScores = userScores[userId].dailyCoding[today];
    const dailyAverage = dailyScores.reduce((sum, s) => sum + s, 0) / dailyScores.length;

    // Update overall coding score with weighted average
    const allCodingScores = Object.values(userScores[userId].dailyCoding).flat();
    userScores[userId].coding = Math.round(allCodingScores.reduce((sum, s) => sum + s, 0) / allCodingScores.length);

    res.json({ message: 'Submission successful', score: userScores[userId].coding, language: language });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit aptitude test
const submitAptitude = async (req, res) => {
  try {
    const { userId, answers, timeTaken } = req.body;

    // Initialize user scores if not exists
    if (!userScores[userId]) {
      userScores[userId] = { coding: 0, aptitude: 0, dailyCoding: {}, dailyAptitude: {} };
    }

    // Accurate aptitude scoring algorithm
    let score = 0;
    const totalQuestions = answers ? answers.length : 10; // Assume 10 questions if not provided
    const correctAnswers = answers ? answers.filter(a => a.correct).length : Math.floor(Math.random() * 8) + 2; // Mock correct answers

    // Base scoring
    const accuracy = correctAnswers / totalQuestions;
    score = Math.round(accuracy * 100);

    // Time bonus (faster completion = higher score)
    const averageTimePerQuestion = timeTaken / totalQuestions;
    let timeBonus = 0;
    if (averageTimePerQuestion < 30) timeBonus = 10; // Fast completion
    else if (averageTimePerQuestion < 60) timeBonus = 5; // Moderate speed

    score = Math.min(score + timeBonus, 100);

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    if (!userScores[userId].dailyAptitude[today]) {
      userScores[userId].dailyAptitude[today] = [];
    }
    userScores[userId].dailyAptitude[today].push(score);

    // Calculate overall aptitude score
    const allAptitudeScores = Object.values(userScores[userId].dailyAptitude).flat();
    userScores[userId].aptitude = Math.round(allAptitudeScores.reduce((sum, s) => sum + s, 0) / allAptitudeScores.length);

    res.json({ message: 'Test submitted successfully', score: userScores[userId].aptitude });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit soft skills assessment
const submitSoftSkills = async (req, res) => {
  try {
    const { userId, answers, timeTaken } = req.body;

    // Initialize user scores if not exists
    if (!userScores[userId]) {
      userScores[userId] = { coding: 0, aptitude: 0, softSkills: 0, mockInterview: 0, dailyCoding: {}, dailyAptitude: {}, dailySoftSkills: {}, dailyMockInterview: {} };
    }

    // Soft skills scoring algorithm (communication, leadership, teamwork, etc.)
    let score = 0;
    const totalQuestions = answers ? answers.length : 10;
    const correctAnswers = answers ? answers.filter(a => a.correct).length : Math.floor(Math.random() * 8) + 2;

    // Base scoring
    const accuracy = correctAnswers / totalQuestions;
    score = Math.round(accuracy * 100);

    // Time bonus for quick responses (indicates confidence)
    const averageTimePerQuestion = timeTaken / totalQuestions;
    let timeBonus = 0;
    if (averageTimePerQuestion < 45) timeBonus = 5; // Quick responses
    else if (averageTimePerQuestion < 90) timeBonus = 2;

    score = Math.min(score + timeBonus, 100);

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    if (!userScores[userId].dailySoftSkills[today]) {
      userScores[userId].dailySoftSkills[today] = [];
    }
    userScores[userId].dailySoftSkills[today].push(score);

    // Calculate overall soft skills score
    const allSoftSkillsScores = Object.values(userScores[userId].dailySoftSkills).flat();
    userScores[userId].softSkills = Math.round(allSoftSkillsScores.reduce((sum, s) => sum + s, 0) / allSoftSkillsScores.length);

    res.json({ message: 'Soft skills assessment submitted successfully', score: userScores[userId].softSkills });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit mock interview
const submitMockInterview = async (req, res) => {
  try {
    const { userId, answers, technicalScore, communicationScore, confidenceScore } = req.body;

    // Initialize user scores if not exists
    if (!userScores[userId]) {
      userScores[userId] = { coding: 0, aptitude: 0, softSkills: 0, mockInterview: 0, dailyCoding: {}, dailyAptitude: {}, dailySoftSkills: {}, dailyMockInterview: {} };
    }

    // Mock interview scoring algorithm
    let score = 0;

    // Technical knowledge (40% weight)
    const techScore = technicalScore || Math.floor(Math.random() * 40) + 60;
    score += techScore * 0.4;

    // Communication skills (30% weight)
    const commScore = communicationScore || Math.floor(Math.random() * 30) + 70;
    score += commScore * 0.3;

    // Confidence and presentation (30% weight)
    const confScore = confidenceScore || Math.floor(Math.random() * 30) + 70;
    score += confScore * 0.3;

    score = Math.round(score);

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    if (!userScores[userId].dailyMockInterview[today]) {
      userScores[userId].dailyMockInterview[today] = [];
    }
    userScores[userId].dailyMockInterview[today].push(score);

    // Calculate overall mock interview score
    const allMockInterviewScores = Object.values(userScores[userId].dailyMockInterview).flat();
    userScores[userId].mockInterview = Math.round(allMockInterviewScores.reduce((sum, s) => sum + s, 0) / allMockInterviewScores.length);

    res.json({ message: 'Mock interview submitted successfully', score: userScores[userId].mockInterview });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Record participation
const recordParticipation = async (req, res) => {
  try {
    const { userId, activity } = req.body;

    res.json({ message: 'Participation recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Execute code for different languages
const executeCode = async (req, res) => {
  try {
    const { code, language, testCase } = req.body;

    console.log('Code execution request:', { language, codeLength: code?.length, testCase });

    let result = {
      output: '',
      error: null,
      status: 'success'
    };

    if (language === 'javascript') {
      // Execute JavaScript in a safe context
      try {
        // Parse test case input - handle multiple variables
        // First, split by comma but be careful with arrays
        const inputStr = testCase.input;
        const variables = {};

        // Handle the specific format: "nums = [2,7,11,15], target = 9"
        const parts = inputStr.split(', ');
        for (const part of parts) {
          const [varName, varValueStr] = part.split(' = ');
          if (varName && varValueStr) {
            if (varValueStr.startsWith('[') && varValueStr.endsWith(']')) {
              // Array - parse JSON
              variables[varName] = JSON.parse(varValueStr);
            } else if (varValueStr.startsWith('"') && varValueStr.endsWith('"')) {
              // String
              variables[varName] = varValueStr.slice(1, -1);
            } else if (!isNaN(varValueStr)) {
              // Number
              variables[varName] = parseInt(varValueStr);
            } else {
              // Try to parse as number anyway (for cases like '9')
              const numVal = parseInt(varValueStr);
              variables[varName] = isNaN(numVal) ? varValueStr : numVal;
            }
          }
        }

        // Extract function name from code
        const functionNameMatch = code.match(/function\s+(\w+)/);
        const functionName = functionNameMatch ? functionNameMatch[1] : 'twosum';

        // Create function call with all variables
        const varNames = Object.keys(variables);
        const varValues = Object.values(variables);

        const userFunction = new Function(...varNames, `
          ${code}
          return ${functionName}(${varNames.join(', ')});
        `);

        const executionResult = userFunction(...varValues);
        result.output = JSON.stringify(executionResult);

      } catch (execError) {
        result.error = execError.message;
        result.status = 'error';
      }

    } else if (language === 'python') {
      // Mock Python execution - in real app, this would use a Python runtime
      try {
        // Simple mock execution for demo
        if (code.includes('def') && code.includes('return')) {
          // Simulate successful execution with mock output
          result.output = testCase.output; // Mock correct output
        } else {
          throw new Error('Syntax error: Invalid Python function definition');
        }
      } catch (execError) {
        result.error = execError.message;
        result.status = 'error';
      }

    } else if (language === 'java') {
      // Mock Java execution - in real app, this would compile and run Java code
      try {
        if (code.includes('public class') && code.includes('public static void main')) {
          // Simulate successful execution
          result.output = testCase.output; // Mock correct output
        } else {
          throw new Error('Compilation error: Missing main method or class definition');
        }
      } catch (execError) {
        result.error = execError.message;
        result.status = 'error';
      }

    } else if (language === 'cpp') {
      // Mock C++ execution - in real app, this would compile and run C++ code
      try {
        if (code.includes('#include') && code.includes('int main')) {
          // Simulate successful execution
          result.output = testCase.output; // Mock correct output
        } else {
          throw new Error('Compilation error: Missing main function or includes');
        }
      } catch (execError) {
        result.error = execError.message;
        result.status = 'error';
      }

    } else {
      result.error = `Language '${language}' is not supported`;
      result.status = 'error';
    }

    res.json(result);

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      error: 'Server error during code execution',
      status: 'error'
    });
  }
};

module.exports = {
  submitCoding,
  submitAptitude,
  submitSoftSkills,
  submitMockInterview,
  recordParticipation,
  executeCode,
  userScores // Export for analytics access
};
