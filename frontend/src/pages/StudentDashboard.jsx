import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodingPractice from './CodingPractice';
import ProblemsList from './ProblemsList';
import AptitudeQuiz from './AptitudeQuiz';
import ScoreRing from '../components/ScoreRing';
import SoftSkills from './SoftSkills';
import MockInterview from './MockInterview';
import Analytics from './Analytics';
import axios from 'axios';

const StudentDashboard = ({ user, onLogout }) => {
  const [progress, setProgress] = useState({ coding: 0, aptitude: 0, softSkills: 0, mockInterview: 0, participation: 0 });
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchProgress();
    fetchResources();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/analytics/student/${user.id}`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const totalProgress = Math.round((progress.coding * 0.4) + (progress.aptitude * 0.25) + (progress.softSkills * 0.15) + (progress.mockInterview * 0.15) + (progress.participation * 0.05));

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <div className="px-4 py-6 sm:px-0">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.username}!</h1>
                  <p className="text-xl text-indigo-400 mb-6">🚀 Preparing for your dream role as a <span className="font-semibold text-indigo-300">{user.jobRole}</span></p>
                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                          </div>
                        </div>
                        <div className="ml-6 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 uppercase tracking-wide">Overall Progress</dt>
                            <dd className="text-3xl font-bold text-indigo-400">{totalProgress}%</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
                  <div className="card">
                    <div className="p-6 flex flex-col items-center">
                      <ScoreRing score={progress.coding} label="Coding" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="p-6 flex flex-col items-center">
                      <ScoreRing score={progress.aptitude} label="Aptitude" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="p-6 flex flex-col items-center">
                      <ScoreRing score={progress.softSkills} label="Soft Skills" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="p-6 flex flex-col items-center">
                      <ScoreRing score={progress.mockInterview} label="Mock Interview" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                          </div>
                        </div>
                        <div className="ml-6 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 uppercase tracking-wide">Participation</dt>
                            <dd className="text-2xl font-bold text-yellow-400">{progress.participation}%</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Resources from Placement Cell</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                      <div key={resource.id} className="card hover:bg-gray-750 transition duration-200">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                          <p className="text-indigo-400 font-medium mb-3">{resource.type}</p>
                          <p className="text-gray-300 leading-relaxed mb-4">{resource.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                              By {resource.uploadedBy.username}
                            </span>
                            {resource.fileUrl && (
                              <a
                                href={`${import.meta.env.VITE_API_BASE_URL}${resource.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                              >
                                Download File
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {resource.createdAt && new Date(resource.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/coding" element={<ProblemsList user={user} />} />
          <Route path="/coding-practice/:id" element={<CodingPractice user={user} />} />
          <Route path="/aptitude" element={<AptitudeQuiz />} />
          <Route path="/soft-skills" element={<SoftSkills />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/analytics" element={<Analytics user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
