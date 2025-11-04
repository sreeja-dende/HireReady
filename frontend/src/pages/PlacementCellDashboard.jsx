import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Analytics from './Analytics';
import axios from 'axios';

const PlacementCellDashboard = ({ user, onLogout }) => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', type: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newResource.title);
      formData.append('description', newResource.description);
      formData.append('type', newResource.type);
      formData.append('uploadedBy', user.username);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewResource({ title: '', type: '', description: '' });
      setSelectedFile(null);
      fetchResources();
      alert('Resource added successfully!');
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource. Please try again.');
    }
  };

  const handleEditResource = async (resourceId, updatedResource) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedResource.title);
      formData.append('description', updatedResource.description);
      formData.append('type', updatedResource.type);
      if (updatedResource.file) {
        formData.append('file', updatedResource.file);
      }

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/resources/${resourceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchResources();
      alert('Resource updated successfully!');
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource. Please try again.');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/resources/${resourceId}`);
        fetchResources();
        alert('Resource deleted successfully!');
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource. Please try again.');
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/resources"
            element={
              <div className="px-4 py-6 sm:px-0">
                <h1 className="text-4xl font-bold text-white mb-8">Manage Resources</h1>
                <div className="card mb-8">
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Add New Resource</h3>
                    <form onSubmit={handleAddResource} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={newResource.title}
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                          <select
                            id="type"
                            name="type"
                            value={newResource.type}
                            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="" className="bg-gray-700">Select type</option>
                            <option value="Resume Sample" className="bg-gray-700">Resume Sample</option>
                            <option value="Company Info" className="bg-gray-700">Company Info</option>
                            <option value="Interview Tips" className="bg-gray-700">Interview Tips</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={newResource.description}
                          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">Upload File (Optional)</label>
                        <input
                          type="file"
                          id="file"
                          name="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                          className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        />
                        <p className="text-sm text-gray-400 mt-1">Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, GIF (Max 10MB)</p>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Add Resource
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Existing Resources</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                      <div key={resource.id} className="card hover:bg-gray-750 transition duration-200">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                          <p className="text-indigo-400 font-medium mb-3">{resource.type}</p>
                          <p className="text-gray-300 leading-relaxed mb-4">{resource.description}</p>
                          <div className="flex items-center justify-between mb-4">
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
                          <div className="text-xs text-gray-500 mb-4">
                            {resource.createdAt && new Date(resource.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const newTitle = prompt('Enter new title:', resource.title);
                                const newDescription = prompt('Enter new description:', resource.description);
                                const newType = prompt('Enter new type:', resource.type);
                                if (newTitle && newDescription && newType) {
                                  handleEditResource(resource.id, {
                                    title: newTitle,
                                    description: newDescription,
                                    type: newType
                                  });
                                }
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteResource(resource.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/analytics" element={<Analytics user={user} />} />
          <Route
            path="/"
            element={
              <div className="px-4 py-6 sm:px-0">
                <h1 className="text-4xl font-bold text-white mb-8">Placement Cell Dashboard</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                          </div>
                        </div>
                        <div className="ml-6 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Resources</dt>
                            <dd className="text-3xl font-bold text-indigo-400">{resources.length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/placementdashboard/analytics" className="card cursor-pointer hover:bg-gray-750 transition duration-200">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                          </div>
                        </div>
                        <div className="ml-6 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 uppercase tracking-wide">Admin Activity Log</dt>
                            <dd className="text-xl font-semibold text-green-400">View Details</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default PlacementCellDashboard;
