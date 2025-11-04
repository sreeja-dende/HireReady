import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    college: '',
    year: '',
    branch: '',
    cgpa: '',
    skills: '',
    phone: '',
    linkedin: '',
    github: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.role.trim()) {
      setError('Role is required');
      return false;
    }
    const validRoles = ['std', 'placement cell'];
    if (!validRoles.includes(formData.role.toLowerCase())) {
      setError('Role must be "std" for Student or "placement cell" for Placement Cell');
      return false;
    }

    // Additional validation for students
    if (formData.role.toLowerCase() === 'std') {
      if (!formData.college.trim()) {
        setError('College name is required for students');
        return false;
      }
      if (!formData.year.trim()) {
        setError('Year of study is required');
        return false;
      }
      if (!formData.branch.trim()) {
        setError('Branch/Specialization is required');
        return false;
      }
      if (!formData.cgpa.trim()) {
        setError('CGPA is required');
        return false;
      }
      const cgpa = parseFloat(formData.cgpa);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        setError('Please enter a valid CGPA (0-10)');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      // Map frontend role to backend role
      const roleMapping = { 'std': 'Student', 'placement cell': 'Placement Cell' };
      const mappedFormData = { 
        ...formData, 
        role: roleMapping[formData.role.toLowerCase()] 
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, mappedFormData);
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join HireReady</h2>
          <p className="text-gray-600">Create your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role"
              name="role"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select your role</option>
              <option value="std">Student</option>
              <option value="placement cell">Placement Cell</option>
            </select>
          </div>

          {formData.role === 'std' && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
                    <input
                      id="college"
                      name="college"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your college name"
                      value={formData.college}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                      <select
                        id="year"
                        name="year"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.year}
                        onChange={handleChange}
                      >
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                      <input
                        id="cgpa"
                        name="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        required
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="8.5"
                        value={formData.cgpa}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">Branch/Specialization</label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Computer Science, Mechanical, etc."
                      value={formData.branch}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information (Optional)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                    <input
                      id="skills"
                      name="skills"
                      type="text"
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="JavaScript, Python, React, etc."
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                    <input
                      id="github"
                      name="github"
                      type="url"
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://github.com/yourusername"
                      value={formData.github}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Register
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

