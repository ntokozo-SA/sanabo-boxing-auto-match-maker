import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Award,
  Scale,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const Matchmaking = () => {
  const [boxers, setBoxers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    experienceLevel: '',
    weightClass: '',
    location: ''
  });

  useEffect(() => {
    fetchBoxers();
    fetchMatches();
  }, []);

  const fetchBoxers = async () => {
    try {
      const response = await axios.get('/api/boxers?limit=100');
      setBoxers(response.data.data);
    } catch (err) {
      setError('Failed to load boxers');
      console.error('Error fetching boxers:', err);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/api/matches?limit=50');
      setMatches(response.data.data);
    } catch (err) {
      setError('Failed to load matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMatches = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await axios.post('/api/matches/matchmaking', {
        filters: filters
      });
      
      if (response.data.success) {
        setMatches(response.data.data);
        alert(`Generated ${response.data.data.length} new matches!`);
      }
    } catch (err) {
      setError('Failed to generate matches');
      console.error('Error generating matches:', err);
    } finally {
      setGenerating(false);
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

  const getWeightClass = (weightKg) => {
    if (weightKg < 48) return 'Light Flyweight';
    if (weightKg < 51) return 'Flyweight';
    if (weightKg < 54) return 'Bantamweight';
    if (weightKg < 57) return 'Featherweight';
    if (weightKg < 60) return 'Lightweight';
    if (weightKg < 63.5) return 'Light Welterweight';
    if (weightKg < 67) return 'Welterweight';
    if (weightKg < 71) return 'Light Middleweight';
    if (weightKg < 75) return 'Middleweight';
    if (weightKg < 81) return 'Light Heavyweight';
    if (weightKg < 91) return 'Heavyweight';
    return 'Super Heavyweight';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'status-scheduled';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-scheduled';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matchmaking data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Matchmaking</h1>
            <p className="text-gray-600 mt-2">Generate optimal matches between boxers using IBA rules</p>
          </div>
          <button 
            onClick={generateMatches}
            disabled={generating}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{generating ? 'Generating...' : 'Generate Matches'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Matchmaking Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight Class
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.weightClass}
              onChange={(e) => setFilters({ ...filters, weightClass: e.target.value })}
            >
              <option value="">All Weight Classes</option>
              <option value="Light Flyweight">Light Flyweight</option>
              <option value="Flyweight">Flyweight</option>
              <option value="Bantamweight">Bantamweight</option>
              <option value="Featherweight">Featherweight</option>
              <option value="Lightweight">Lightweight</option>
              <option value="Light Welterweight">Light Welterweight</option>
              <option value="Welterweight">Welterweight</option>
              <option value="Light Middleweight">Light Middleweight</option>
              <option value="Middleweight">Middleweight</option>
              <option value="Light Heavyweight">Light Heavyweight</option>
              <option value="Heavyweight">Heavyweight</option>
              <option value="Super Heavyweight">Super Heavyweight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Filter by location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Boxers</p>
              <p className="text-2xl font-bold text-gray-900">{boxers.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Matchable Pairs</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(boxers.length * (boxers.length - 1) / 2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card mb-6 border-red-200 bg-red-50">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Generated Matches ({matches.length})
        </h3>
        
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches generated yet</h3>
            <p className="text-gray-600 mb-4">Click "Generate Matches" to create optimal matchups between boxers.</p>
            <button 
              onClick={generateMatches}
              disabled={generating}
              className="btn-primary flex items-center space-x-2 mx-auto disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{generating ? 'Generating...' : 'Generate Matches'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                    <span className="text-sm text-gray-600">{match.matchId}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(match.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Boxer 1 */}
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">{match.boxer1.name}</h4>
                    <p className="text-sm text-gray-600">{match.boxer1.experienceLevel}</p>
                    <div className="flex items-center justify-center mt-1">
                      <Scale className="w-3 h-3 mr-1" />
                      <span className="text-xs text-gray-600">{match.boxer1.weightKg} kg</span>
                    </div>
                  </div>
                  
                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">VS</div>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center justify-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {match.venue}
                        </div>
                        <div className="flex items-center justify-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {match.rounds} rounds
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Boxer 2 */}
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">{match.boxer2.name}</h4>
                    <p className="text-sm text-gray-600">{match.boxer2.experienceLevel}</p>
                    <div className="flex items-center justify-center mt-1">
                      <Scale className="w-3 h-3 mr-1" />
                      <span className="text-xs text-gray-600">{match.boxer2.weightKg} kg</span>
                    </div>
                  </div>
                </div>
                
                {/* Match Details */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(match.experienceLevel)}`}>
                      {match.experienceLevel}
                    </span>
                    <span className="text-gray-600">{match.weightClass}</span>
                    <span className="text-gray-600">{match.roundDuration} min rounds</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchmaking; 