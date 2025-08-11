import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Target,
  Trophy,
  Users,
  Eye,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    experienceLevel: ''
  });

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);

      const response = await axios.get(`/api/matches?${params}`);
      setMatches(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'status-scheduled';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-scheduled';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
            <p className="text-gray-600 mt-2">View and manage boxing matches</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/matches/matchmaking" className="btn-outline flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Matchmaking</span>
            </Link>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Match</span>
            </button>
          </div>
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
                placeholder="Search matches by ID or venue..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600">Try adjusting your filters or generate new matches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match._id} className="card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Match Status */}
                  <span className={`match-status ${getStatusColor(match.status)}`}>
                    {match.status}
                  </span>

                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900">{match.boxer1?.name}</h3>
                        <p className="text-sm text-gray-500">Boxer 1</p>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-400">VS</span>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900">{match.boxer2?.name}</h3>
                        <p className="text-sm text-gray-500">Boxer 2</p>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(match.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTime(match.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{match.venue || 'TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        <span>{match.weightClass}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>{match.rounds} rounds</span>
                      </div>
                      <span className={`experience-badge ${getExperienceLevelColor(match.experienceLevel)}`}>
                        {match.experienceLevel}
                      </span>
                    </div>

                    {/* Match Result (if completed) */}
                    {match.result && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <span className="text-sm font-medium text-green-600">Winner</span>
                              <p className="font-semibold">{match.result.winner?.name}</p>
                            </div>
                            <div className="text-center">
                              <span className="text-sm font-medium text-red-600">Loser</span>
                              <p className="font-semibold">{match.result.loser?.name}</p>
                            </div>
                            <div className="text-center">
                              <span className="text-sm font-medium text-gray-600">Method</span>
                              <p className="font-semibold">{match.result.method}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
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

export default Matches; 