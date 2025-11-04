import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import PlacementCellDashboard from './pages/PlacementCellDashboard';
import JobRoleSelection from './pages/JobRoleSelection';
import ProblemsList from './pages/ProblemsList';
import CodingPractice from './pages/CodingPractice';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleRoleSelected = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/select-role"
          element={
            user && user.role === 'Student' && !user.jobRole ? (
              <JobRoleSelection user={user} onRoleSelected={handleRoleSelected} />
            ) : (
              <Navigate to="/studentdashboard" />
            )
          }
        />
        <Route
          path="/studentdashboard/*"
          element={
            user && user.role === 'Student' ? (
              user.jobRole ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/select-role" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/placementdashboard/*"
          element={
            user && user.role === 'Placement Cell' ? (
              <PlacementCellDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/problems" element={<ProblemsList user={user} />} />
        <Route path="/coding-practice/:id" element={<CodingPractice user={user} />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/student" element={<Navigate to="/studentdashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
