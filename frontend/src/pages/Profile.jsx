import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/24/solid';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userEvents, setUserEvents] = useState({ enrolledEvents: [], organizedEvents: [] });
  const [userCampaigns, setUserCampaigns] = useState({ donations: [], campaigns: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserEvents();
    fetchUserCampaigns();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserEvents(response.data);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const fetchUserCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/campaigns', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching user campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 rounded-full p-3">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">My Activities</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">Enrolled Events</h3>
                {userEvents.enrolledEvents.map(event => (
                  <div key={event._id} className="mb-4 p-4 border border-gray-100 rounded-lg hover:border-blue-500 transition-colors">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      Organized by: {event.organizer.name}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">Organized Events</h3>
                {userEvents.organizedEvents.map(event => (
                  <div key={event._id} className="mb-4 p-4 border border-gray-100 rounded-lg hover:border-blue-500 transition-colors">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {event.participants.length} participants
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">My Contributions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">My Donations</h3>
                {userCampaigns.donations.map(donation => (
                  <div key={donation._id} className="mb-4 p-4 border border-gray-100 rounded-lg hover:border-blue-500 transition-colors">
                    <p className="font-semibold">{donation.campaign.title}</p>
                    <p className="text-sm text-gray-600">
                      Amount: ₹{donation.amount}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">My Campaigns</h3>
                {userCampaigns.campaigns.map(campaign => (
                  <div key={campaign._id} className="mb-4 p-4 border border-gray-100 rounded-lg hover:border-blue-500 transition-colors">
                    <p className="font-semibold">{campaign.title}</p>
                    <p className="text-sm text-gray-600">
                      Target: ₹{campaign.targetAmount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
