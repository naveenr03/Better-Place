import { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Women&apos;s Safety</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Add Emergency Contact
          </button>
          {showAddForm && (
            <form onSubmit={handleAddContact} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required
                  placeholder="+1234567890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relationship</label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  required
                  placeholder="Family/Friend/Other"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Contact
              </button>
            </form>
          )}
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact._id} className="border-b pb-2">
                <p className="font-semibold">{contact.name}</p>
                <p className="text-gray-600">{contact.phoneNumber}</p>
                <p className="text-sm text-gray-500">{contact.relationship}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Emergency Alert</h2>
          <button
            onClick={handleEmergencyAlert}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Send Emergency Alert
          </button>
        </div>
      </div>
    </div>
  );
}

export default WomenSafety;