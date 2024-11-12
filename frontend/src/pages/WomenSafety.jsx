import React from 'react';

function WomenSafety() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Women's Safety</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Alert Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Emergency Alert</h2>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Send Emergency Alert
          </button>
        </div>

        {/* Location Sharing Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Location Sharing</h2>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Share Location
          </button>
        </div>

        {/* Safety Resources Section */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Safety Resources</h2>
          <ul className="space-y-3">
            <li>Emergency Contact Numbers</li>
            <li>Safety Tips</li>
            <li>Nearby Safe Zones</li>
            <li>Community Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WomenSafety;