import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon, MapPinIcon, UsersIcon, UserCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

function EventForum() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      setFormData({ title: '', description: '', date: '', location: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnroll = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${eventId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents(); // Refresh events list
    } catch (error) {
      console.error('Error enrolling in event:', error);
      alert('Error enrolling in event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Forum</h1>
            <p className="mt-2 text-gray-600">Join and organize community events</p>
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
                Create Event
              </>
            )}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Describe your event"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Event location"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Event
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{event.participants?.length || 0} participants</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{event.organizer.name}</span>
                  </div>
                  <button
                    onClick={() => handleEnroll(event._id)}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventForum;
