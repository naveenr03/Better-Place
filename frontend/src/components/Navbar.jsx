// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/check-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/register');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Better Place
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/events" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Events
                </Link>
                <Link to="/crowdfunding" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Crowdfunding
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Profile
                </Link>
                <Link to="/women-safety" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Women's Safety
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/events" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Events
                </Link>
                <Link to="/crowdfunding" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Crowdfunding
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Profile
                </Link>
                <Link to="/women-safety" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                  Women's Safety
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;