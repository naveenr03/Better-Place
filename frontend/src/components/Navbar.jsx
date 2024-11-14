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
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold"> Better Place</Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/events" className="hover:underline">Events</Link>
              <Link to="/crowdfunding" className="hover:underline">Crowdfunding</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <Link to="/women-safety" className="hover:underline">Women's Safety</Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-gray-300"
                >
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;