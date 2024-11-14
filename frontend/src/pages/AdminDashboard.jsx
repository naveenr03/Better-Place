import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon } from '@heroicons/react/24/outline';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (activeTab === 'events') {
        const response = await axios.get('http://localhost:5000/api/admin/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      } else if (activeTab === 'campaigns') {
        const response = await axios.get('http://localhost:5000/api/admin/campaigns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleRoleUpdate = async (userId, isAdmin) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { isAdmin },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your platform's content and users</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex space-x-4">
            {['events', 'campaigns', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'events' && (
          <div className="grid gap-6">
            {events.map(event => (
              <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                        <span>Location: {event.location}</span>
                        <span>Participants: {event.participants?.length || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(event._id, 'events')}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid gap-6">
            {campaigns.map(campaign => (
              <div key={campaign._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
                      <p className="text-gray-600 mb-4">{campaign.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(campaign.currentAmount / campaign.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>Target: ₹{campaign.targetAmount}</span>
                        <span>Raised: ₹{campaign.currentAmount}</span>
                        <span>Donors: {campaign.donors?.length || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(campaign._id, 'campaigns')}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid gap-6">
            {users.map(user => (
              <div key={user._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                      <p className="text-gray-600 mb-4">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Role: {user.isAdmin ? 'Admin' : 'User'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRoleUpdate(user._id, !user.isAdmin)}
                      className={`px-4 py-2 rounded-lg ${
                        user.isAdmin ? 'bg-red-600' : 'bg-green-600'
                      } text-white`}
                    >
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 