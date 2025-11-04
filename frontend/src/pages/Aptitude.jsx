import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Aptitude = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isTestActive, setIsTestActive] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (isTestActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleSubmitTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTestActive]);

  const fetchQuestions = async () => {
    try {
      // Mock questions for now
      const mockQuestions = [
        {
          id: 1,
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          type: 'Quantitative'
        },
        {
          id: 2,
          question: 'Which word is a synonym of "happy"?',
          options: ['Sad', 'Joyful', 'Angry', 'Tired'],
          correctAnswer: 'Joyful',
          type: 'English'
        },
        {
          id: 3,
          question: 'If all cats are mammals, and some mammals are pets, then:',
          options: ['All cats are pets', 'Some cats are pets', 'No cats are pets', 'Cannot be determined'],
          correctAnswer: 'Cannot be determined',
          type: 'Logical'
        }
      ];
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const startTest = () => {
    setIsTestActive(true);
    setTimeLeft(1800);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer('');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = async () => {
    setIsTestActive(false);
    const finalScore = Math.round((score / questions.length) * 100);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/submit/aptitude`, {
        userId: user.id,
        answers: [], // Mock answers
        timeTaken: 1800 - timeLeft
      });
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isTestActive) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Aptitude Test</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Aptitude Challenge</h2>
          <p className="text-gray-700 mb-6">
            Test your logical reasoning, quantitative skills, and English proficiency.
            You have 30 minutes to complete {questions.length} questions.
          </p>
          <button
            onClick={startTest}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aptitude Test</h1>
        <div className="text-xl font-semibold text-red-600">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {currentQuestion.type}
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                id={`option-${index}`}
                name="answer"
                type="radio"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor={`option-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next'}
        </button>
      </div>
      {score > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Current Score</h3>
          <p className="text-2xl font-bold text-green-600">{score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default Aptitude;
