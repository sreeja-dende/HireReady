import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage('If an account with that email exists, a password reset link has been sent. Check the browser console for the demo link.');
      // Log the reset URL to browser console for demo purposes
      if (response.data.resetUrl) {
        console.log('Password Reset Link:', response.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Your Password?</h2>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{message}</p>
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
