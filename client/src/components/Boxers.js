import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Target, 
  Trophy,
  Edit,
  Trash2,
  BarChart3,
  Crown
} from 'lucide-react';
import axios from 'axios';

const Boxers = () => {
  const [boxers, setBoxers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    experienceLevel: '',
    isActive: 'true'
  });

  useEffect(() => {
    fetchBoxers();
  }, [filters]);

  const fetchBoxers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.isActive) params.append('isActive', filters.isActive);

      const response = await axios.get(`/api/boxers?${params}`);
      setBoxers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load boxers');
      console.error('Error fetching boxers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExperienceLevelColor = (level) => {
    switch (level) {
      case 'Novice': return 'level-novice';
      case 'Schools': return 'level-schools';
      case 'Junior': return 'level-junior';
      case 'Youth': return 'level-youth';
      case 'Elite': return 'level-elite';
      default: return 'level-novice';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boxers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Boxers</h1>
            <p className="text-gray-600 mt-2">Manage boxer profiles and information</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Boxer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search boxers by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
            >
              <option value="">All Levels</option>
              <option value="Novice">Novice</option>
              <option value="Schools">Schools</option>
              <option value="Junior">Junior</option>
              <option value="Youth">Youth</option>
              <option value="Elite">Elite</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
              <option value="">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Boxers Grid */}
      {boxers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No boxers found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new boxer.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boxers.map((boxer) => (
            <div key={boxer._id} className="card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={boxer.photoUrl || 'https://via.placeholder.com/50/cccccc/666666?text=Boxer'}
                    alt={boxer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{boxer.name}</h3>
                    <span className={`experience-badge ${getExperienceLevelColor(boxer.experienceLevel)}`}>
                      {boxer.experienceLevel}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{boxer.age} years old</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  <span>{boxer.weightKg} kg</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>{boxer.boutsCount} bouts</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{boxer.location}</span>
                </div>
                
                {/* Record Display */}
                {boxer.record && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Record:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {boxer.record.wins || 0}-{boxer.record.losses || 0}-{boxer.record.draws || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Win Rate: {boxer.record.wins && boxer.record.losses ? 
                        Math.round(((boxer.record.wins || 0) / ((boxer.record.wins || 0) + (boxer.record.losses || 0))) * 100) : 0}%</span>
                      <span>Total: {(boxer.record.wins || 0) + (boxer.record.losses || 0) + (boxer.record.draws || 0)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    boxer.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {boxer.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <a
                      href={`/boxer/${boxer._id}/record`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Record
                    </a>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Boxers; 