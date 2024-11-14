import { useState, useEffect } from 'react';
import axios from 'axios';

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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {userData && (
          <div>
            <p className="text-xl mb-2">{userData.name}</p>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enrolled Events</h2>
          {userEvents.enrolledEvents.map(event => (
            <div key={event._id} className="mb-4 border-b pb-2">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-600">
                Organized by: {event.organizer.name}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Organized Events</h2>
          {userEvents.organizedEvents.map(event => (
            <div key={event._id} className="mb-4 border-b pb-2">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-600">
                {event.participants.length} participants
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Crowdfunding Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Donations</h2>
          {userCampaigns.donations.map(donation => (
            <div key={donation._id} className="mb-4 border-b pb-2">
              <p className="font-semibold">{donation.campaign.title}</p>
              <p className="text-sm text-gray-600">
                Amount: ${donation.amount}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Campaigns</h2>
          {userCampaigns.campaigns.map(campaign => (
            <div key={campaign._id} className="mb-4 border-b pb-2">
              <p className="font-semibold">{campaign.title}</p>
              <p className="text-sm text-gray-600">
                Target: ${campaign.targetAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
