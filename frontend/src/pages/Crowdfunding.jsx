import { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DonationForm from '../components/DonationForm';
import { XMarkIcon, PlusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Crowdfunding() {
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    endDate: ''
  });

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/crowdfunding', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/crowdfunding', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      setFormData({ title: '', description: '', targetAmount: '', endDate: '' });
      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crowdfunding Campaigns</h1>
            <p className="mt-2 text-gray-600">Support causes that matter to you</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? (
              <>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Campaign
              </>
            )}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter campaign title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter campaign description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (INR)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter target amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter end date"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Campaign
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                
                <div className="space-y-4">
                  <div>
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
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{campaign.currentAmount}</p>
                      <p className="text-sm text-gray-500">raised of ₹{campaign.targetAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{campaign.donors?.length || 0}</p>
                      <p className="text-sm text-gray-500">donors</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{campaign.organizer?.name}</span>
                  </div>
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <HeartIcon className="h-5 w-5 mr-2" />
                      Donate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
              <h2 className="text-2xl font-semibold mb-6">Support {selectedCampaign.title}</h2>
              <Elements stripe={stripePromise}>
                <DonationForm
                  campaignId={selectedCampaign._id}
                  onSuccess={() => {
                    setSelectedCampaign(null);
                    fetchCampaigns();
                  }}
                />
              </Elements>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Crowdfunding;
