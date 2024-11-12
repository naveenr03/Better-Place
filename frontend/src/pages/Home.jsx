import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Better Place! </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard
          title="Event Forum"
          description="Join and organize community events to make a positive impact."
          linkTo="/events"
        />
        <FeatureCard
          title="Crowdfunding"
          description="Support and create fundraising campaigns for important causes."
          linkTo="/crowdfunding"
        />
        <FeatureCard
          title="Women's Safety"
          description="Access safety resources and emergency features for women."
          linkTo="/women-safety"
        />
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to make a difference?</h2>
        <p className="text-lg mb-6">Join our community and start creating positive change today!</p>
        <Link
          to="/events"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, linkTo }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="mb-4">{description}</p>
      <Link
        to={linkTo}
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        Learn more →
      </Link>
    </div>
  );
}

export default Home;