import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to={user.role === 'Student' ? '/studentdashboard/' : '/placementdashboard/'}
                className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-200 cursor-pointer"
              >
                HireReady
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user.role === 'Student' && (
                <>
                  <Link
                    to="/studentdashboard/coding"
                    className={`${
                      isActive('/studentdashboard/coding')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Coding Practice
                  </Link>
                  <Link
                    to="/studentdashboard/aptitude"
                    className={`${
                      isActive('/studentdashboard/aptitude')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Aptitude
                  </Link>
                  <Link
                    to="/studentdashboard/soft-skills"
                    className={`${
                      isActive('/studentdashboard/soft-skills')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Soft Skills
                  </Link>
                  <Link
                    to="/studentdashboard/mock-interview"
                    className={`${
                      isActive('/studentdashboard/mock-interview')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Mock Interview
                  </Link>
                  <Link
                    to="/studentdashboard/analytics"
                    className={`${
                      isActive('/studentdashboard/analytics')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Analytics
                  </Link>
                </>
              )}
              {user.role === 'Placement Cell' && (
                <>
                  <Link
                    to="/placementdashboard/resources"
                    className={`${
                      isActive('/placementdashboard/resources')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Manage Resources
                  </Link>
                  <Link
                    to="/placementdashboard/analytics"
                    className={`${
                      isActive('/placementdashboard/analytics')
                        ? 'border-indigo-400 text-indigo-400'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-200`}
                  >
                    Analytics
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="text-right mr-4">
              <div className="text-gray-300 text-sm">Welcome, {user.username}</div>
              {user.role === 'Student' && user.jobRole && (
                <div className="text-indigo-400 text-xs font-medium">{user.jobRole}</div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
