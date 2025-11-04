import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobRoleSelection = ({ user, onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState(user.jobRole || '');
  const navigate = useNavigate();

  const jobRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile App Developer',
    'UI/UX Designer',
    'Product Manager',
    'System Administrator',
    'Database Administrator',
    'Machine Learning Engineer',
    'Cybersecurity Analyst',
    'Cloud Engineer',
    'QA Engineer',
    'Technical Support Engineer'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole) {
      try {
        // Update job role in backend
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/auth/update-job-role/${user.id}`, {
          jobRole: selectedRole
        });

        // Update user with selected job role
        const updatedUser = { ...user, jobRole: selectedRole };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onRoleSelected(updatedUser);
        navigate('/studentdashboard');
      } catch (error) {
        console.error('Error updating job role:', error);
        // Fallback to local storage update if backend fails
        const updatedUser = { ...user, jobRole: selectedRole };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onRoleSelected(updatedUser);
        navigate('/studentdashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m8 0V8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m8 0H8m0 0V4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Job Role</h2>
          <p className="text-gray-600">Choose the role you're preparing for</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
              Job Role
            </label>
            <input
              id="jobRole"
              name="jobRole"
              type="text"
              list="jobRoles"
              required
              className="block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Select or type a job role..."
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            <datalist id="jobRoles">
              {jobRoles.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </div>
          <div>
            <button
              type="submit"
              disabled={!selectedRole}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRoleSelection;
