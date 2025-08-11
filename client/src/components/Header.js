import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Swords, QrCode, Home, Users, Calendar, Target, Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || 
                      location.pathname === '/fights' || 
                      location.pathname === '/public-fights' || 
                      location.pathname === '/event-today';

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
              <img 
                src="/images.jpg" 
                alt="Sanabo Boxing Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sanabo Boxing</h1>
              <p className="text-xs text-gray-600">Matchmaking System</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isPublicPage ? (
              <>
                <Link 
                  to="/fights" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Swords className="w-4 h-4" />
                  <span>Today's Fights</span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-500">
                  <QrCode className="w-4 h-4" />
                  <span className="text-sm">Public View</span>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/boxers" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Users className="w-4 h-4" />
                  <span>Boxers</span>
                </Link>
                <Link 
                  to="/matches" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Matches</span>
                </Link>
                <Link
                  to="/matches/matchmaking"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Target className="w-4 h-4" />
                  <span>Matchmaking</span>
                </Link>
                <Link
                  to="/fights"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Swords className="w-4 h-4" />
                  <span>Fights</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-green-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 