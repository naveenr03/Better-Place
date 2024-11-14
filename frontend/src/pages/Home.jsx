import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, HeartIcon, ShieldCheckIcon, ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Better Place</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join our community and make a positive impact on society through events, crowdfunding, and safety initiatives.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Join Our Community
          </Link>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CalendarIcon className="h-8 w-8 text-blue-600" />}
              title="Event Forum"
              description="Join and organize community events to make a positive impact."
              linkTo="/events"
              className="bg-gradient-to-br from-blue-50 to-blue-100"
            />
            <FeatureCard
              icon={<HeartIcon className="h-8 w-8 text-purple-600" />}
              title="Crowdfunding"
              description="Support and create fundraising campaigns for important causes."
              linkTo="/crowdfunding"
              className="bg-gradient-to-br from-purple-50 to-purple-100"
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="h-8 w-8 text-green-600" />}
              title="Women's Safety"
              description="Access safety resources and emergency features for women."
              linkTo="/women-safety"
              className="bg-gradient-to-br from-green-50 to-green-100"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to make a difference?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our community and start creating positive change today!
              </p>
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, linkTo, className }) {
  return (
    <Link
      to={linkTo}
      className={`block p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export default Home;