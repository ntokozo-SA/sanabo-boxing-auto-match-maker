import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Target, Award, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Sanabo Boxing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional amateur boxing matchmaking system following IBA rules. 
            Create fair, competitive matches for boxers of all experience levels.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/matches/matchmaking" 
            className="btn-primary text-lg px-8 py-3"
          >
            Generate Matches
          </Link>
          <Link 
            to="/boxers" 
            className="btn-outline text-lg px-8 py-3"
          >
            View Boxers
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matchmaking</h3>
          <p className="text-gray-600">
            Advanced algorithm ensures fair matches based on weight, age, experience level, and bout count.
          </p>
        </div>

        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">IBA Compliant</h3>
          <p className="text-gray-600">
            All matches follow International Boxing Association rules for safety and fairness.
          </p>
        </div>

        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience Levels</h3>
          <p className="text-gray-600">
            Support for Novice, Schools, Junior, Youth, and Elite categories with appropriate restrictions.
          </p>
        </div>

        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Match Management</h3>
          <p className="text-gray-600">
            Schedule matches, record results, and track boxer statistics with ease.
          </p>
        </div>

        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Boxer Profiles</h3>
          <p className="text-gray-600">
            Comprehensive boxer management with detailed profiles and match history.
          </p>
        </div>

        <div className="card-hover text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Access</h3>
          <p className="text-gray-600">
            Public match details accessible via QR codes for easy sharing and viewing.
          </p>
        </div>
      </div>

      {/* Matchmaking Rules */}
      <div className="card mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Matchmaking Rules</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Differences</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Novice:</span> Maximum 2kg difference</li>
              <li><span className="font-medium">Schools:</span> Maximum 2kg difference</li>
              <li><span className="font-medium">Junior:</span> Maximum 3kg difference</li>
              <li><span className="font-medium">Youth:</span> Maximum 4kg difference</li>
              <li><span className="font-medium">Elite:</span> Maximum 5kg difference</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Restrictions</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Schools:</span> Maximum 1 year difference</li>
              <li><span className="font-medium">Junior:</span> Maximum 2 years difference</li>
              <li><span className="font-medium">Youth:</span> Maximum 2 years difference</li>
              <li><span className="font-medium">Novice/Elite:</span> No age restrictions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Create your first match or add boxers to the system to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/boxers" 
            className="btn-primary text-lg px-8 py-3"
          >
            Add Boxers
          </Link>
          <Link 
            to="/matches/matchmaking" 
            className="btn-secondary text-lg px-8 py-3"
          >
            Generate Matches
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 