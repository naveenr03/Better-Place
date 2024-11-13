import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

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
      } else {
        const response = await axios.get('http://localhost:5000/api/admin/campaigns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(response.data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Crowdfunding Campaigns
        </button>
      </div>

      {activeTab === 'events' ? (
        <div className="grid gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  Participants: {event.participants?.length || 0}
                </p>
              </div>
              <button
                onClick={() => handleDelete(event._id, 'events')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                <p className="text-gray-600">{campaign.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(campaign.currentAmount / campaign.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${campaign.currentAmount} raised</span>
                    <span>${campaign.targetAmount} goal</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Status: {campaign.status}
                </p>
                <p className="text-sm text-gray-500">
                  Donors: {campaign.donors?.length || 0}
                </p>
              </div>
              <button
                onClick={() => handleDelete(campaign._id, 'campaigns')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 