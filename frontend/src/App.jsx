// frontend/src/App.js

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventForum from './pages/EventForum';
import Crowdfunding from './pages/Crowdfunding';
import Profile from './pages/Profile';
import WomenSafety from './pages/WomenSafety';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/register" />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/events" element={isAuthenticated ? <EventForum /> : <Navigate to="/register" />} />
            <Route path="/crowdfunding" element={isAuthenticated ? <Crowdfunding /> : <Navigate to="/register" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/register" />} />
            <Route path="/women-safety" element={isAuthenticated ? <WomenSafety /> : <Navigate to="/register" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;