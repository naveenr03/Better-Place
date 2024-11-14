import { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function WomenSafety() {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    relationship: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/emergency/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert('Please enter a valid phone number in international format (e.g., +1234567890)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/emergency/contacts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setFormData({ name: '', phoneNumber: '', relationship: '' });
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding emergency contact');
    }
  };

  const handleEmergencyAlert = async () => {
    try {
      const token = localStorage.getItem('token');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const locationStr = `${position.coords.latitude},${position.coords.longitude}`;
          await axios.post('http://localhost:5000/api/emergency/alert', 
            { location: locationStr },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          alert('Emergency alerts sent successfully');
        });
      } else {
        await axios.post('http://localhost:5000/api/emergency/alert', 
          { location: 'Location unavailable' },
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Error sending emergency alerts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Women's Safety</h1>
          <p className="mt-2 text-gray-600">Manage your emergency contacts and access safety features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Emergency Contacts</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {showAddForm ? (
                    <>
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Contact
                    </>
                  )}
                </button>
              </div>

              {showAddForm && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <form onSubmit={handleAddContact} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                        placeholder="+1234567890"
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                        required
                        placeholder="Family/Friend/Other"
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Add Contact
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {contacts.map(contact => (
                  <div key={contact._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-500 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-gray-600">{contact.phoneNumber}</p>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Emergency Alert</h2>
              <div className="text-gray-600 mb-6">
                <p>In case of emergency, click the button below to:</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Send your current location</li>
                  <li>Alert your emergency contacts</li>
                  <li>Contact local authorities</li>
                </ul>
              </div>
              <button
                onClick={handleEmergencyAlert}
                className="w-full flex items-center justify-center px-6 py-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                Send Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WomenSafety;