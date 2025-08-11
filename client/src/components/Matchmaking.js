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
  RefreshCw,
  Crown,
  Medal,
  Edit,
  Save
} from 'lucide-react';
import axios from 'axios';

const Matchmaking = () => {
  const [boxers, setBoxers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [filters, setFilters] = useState({
    experienceLevel: '',
    weightClass: '',
    location: ''
  });
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [resultForm, setResultForm] = useState({
    winnerId: '',
    loserId: '',
    method: 'Decision',
    rounds: 3,
    notes: ''
  });
  const [savingResult, setSavingResult] = useState(false);

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
        setMatches(response.data.data.matches || []);
        setEventInfo({
          eventDate: response.data.data.eventDate,
          eventUrl: response.data.data.eventUrl,
          eventQRCodeUrl: response.data.data.eventQRCodeUrl,
          totalGenerated: response.data.data.totalGenerated
        });
        alert(`Generated ${response.data.data.totalGenerated} new matches for the event!`);
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

  const isWinner = (boxerId, result) => {
    return result && result.winner && result.winner._id === boxerId;
  };

  const isLoser = (boxerId, result) => {
    return result && result.loser && result.loser._id === boxerId;
  };

  const getWinnerDisplay = (match) => {
    if (!match.result) return null;
    
    if (match.result.winner && match.result.winner.name) {
      return {
        name: match.result.winner.name,
        method: match.result.method || 'Unknown',
        rounds: match.result.rounds || 0
      };
    }
    return null;
  };

  const openResultModal = (match) => {
    setSelectedMatch(match);
    setResultForm({
      winnerId: '',
      loserId: '',
      method: 'Decision',
      rounds: match.rounds,
      notes: ''
    });
    setShowResultModal(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setSelectedMatch(null);
    setResultForm({
      winnerId: '',
      loserId: '',
      method: 'Decision',
      rounds: 3,
      notes: ''
    });
  };

  const handleRecordResult = async (e) => {
    e.preventDefault();
    
    if (!resultForm.winnerId || !resultForm.loserId) {
      setError('Please select both winner and loser');
      return;
    }

    if (resultForm.winnerId === resultForm.loserId) {
      setError('Winner and loser cannot be the same boxer');
      return;
    }

    try {
      setSavingResult(true);
      setError(null);
      
      const response = await axios.post(`/api/matches/${selectedMatch._id}/result`, resultForm);
      
      if (response.data.success) {
        // Update the match in the local state
        const updatedMatches = matches.map(m => 
          m._id === selectedMatch._id ? response.data.data : m
        );
        setMatches(updatedMatches);
        
        alert('Match result recorded successfully!');
        closeResultModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record result');
    } finally {
      setSavingResult(false);
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
              <p className="text-xs text-gray-500">
                {matches.filter(m => m.status === 'Completed' && m.result).length} with results
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

      {/* Event QR Code */}
      {eventInfo && eventInfo.eventQRCodeUrl && (
        <div className="card mb-6 border-green-200 bg-green-50">
          <div className="text-center">
                          <h3 className="text-lg font-semibold text-green-800 mb-4">Public Fights QR Code Generated!</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <img 
                  src={eventInfo.eventQRCodeUrl} 
                  alt="Event QR Code" 
                  className="w-48 h-48 border-4 border-white shadow-lg rounded-lg"
                />
              </div>
              <div className="text-left">
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Event Details</h4>
                  <p className="text-sm text-green-700 mb-1">
                    <strong>Date:</strong> {eventInfo.eventDate}
                  </p>
                  <p className="text-sm text-green-700 mb-1">
                    <strong>Matches:</strong> {eventInfo.totalGenerated} generated
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Event URL:</strong> 
                    <a 
                      href={eventInfo.eventUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline ml-1"
                    >
                      View Event Page
                    </a>
                  </p>
                </div>
                <div className="text-xs text-green-600">
                  <p>📱 Scan this QR code to view upcoming and completed fights</p>
                  <p>🔗 Share this QR code for public access to fight information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {/* Red Corner */}
                  <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                    match.result ? 
                      (isWinner(match.boxer1._id, match.result) ? 'border-green-500 bg-green-50' : 
                       isLoser(match.boxer1._id, match.result) ? 'border-red-500 bg-red-50' : 
                       'border-red-300') : 
                      'border-red-300 hover:border-red-400'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center relative">
                      <User className="w-8 h-8 text-red-600" />
                      {match.result && isWinner(match.boxer1._id, match.result) && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                      RED CORNER
                    </div>
                    <h4 className={`font-medium ${
                      match.result ? 
                        (isWinner(match.boxer1._id, match.result) ? 'text-green-800 font-bold' : 
                         isLoser(match.boxer1._id, match.result) ? 'text-red-800' : 
                         'text-gray-900') : 
                        'text-gray-900'
                    }`}>
                      {match.boxer1.name}
                    </h4>
                    <p className="text-sm text-gray-600">{match.boxer1.experienceLevel}</p>
                    <div className="flex items-center justify-center mt-1">
                      <Scale className="w-3 h-3 mr-1" />
                      <span className="text-xs text-gray-600">{match.boxer1.weightKg} kg</span>
                    </div>
                    {match.result && isWinner(match.boxer1._id, match.result) && (
                      <div className="flex items-center justify-center mt-2 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">WINNER</span>
                      </div>
                    )}
                    {match.result && isLoser(match.boxer1._id, match.result) && (
                      <div className="flex items-center justify-center mt-2 text-red-700">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">LOSER</span>
                      </div>
                    )}
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
                      {/* Winner Information */}
                      {match.result && getWinnerDisplay(match) && (
                        <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-center mb-1">
                            <Crown className="w-4 h-4 text-yellow-600 mr-1" />
                            <span className="text-xs font-semibold text-yellow-800">WINNER</span>
                          </div>
                          <div className="text-xs text-yellow-700 font-medium">
                            {getWinnerDisplay(match).name}
                          </div>
                          <div className="text-xs text-yellow-600">
                            {getWinnerDisplay(match).method} - Round {getWinnerDisplay(match).rounds}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Blue Corner */}
                  <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                    match.result ? 
                      (isWinner(match.boxer2._id, match.result) ? 'border-green-500 bg-green-50' : 
                       isLoser(match.boxer2._id, match.result) ? 'border-red-500 bg-red-50' : 
                       'border-blue-300') : 
                      'border-blue-300 hover:border-blue-400'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center relative">
                      <User className="w-8 h-8 text-blue-600" />
                      {match.result && isWinner(match.boxer2._id, match.result) && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                      BLUE CORNER
                    </div>
                    <h4 className={`font-medium ${
                      match.result ? 
                        (isWinner(match.boxer2._id, match.result) ? 'text-green-800 font-bold' : 
                         isLoser(match.boxer2._id, match.result) ? 'text-red-800' : 
                         'text-gray-900') : 
                        'text-gray-900'
                    }`}>
                      {match.boxer2.name}
                    </h4>
                    <p className="text-sm text-gray-600">{match.boxer2.experienceLevel}</p>
                    <div className="flex items-center justify-center mt-1">
                      <Scale className="w-3 h-3 mr-1" />
                      <span className="text-xs text-gray-600">{match.boxer2.weightKg} kg</span>
                    </div>
                    {match.result && isWinner(match.boxer2._id, match.result) && (
                      <div className="flex items-center justify-center mt-2 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">WINNER</span>
                      </div>
                    )}
                    {match.result && isLoser(match.boxer2._id, match.result) && (
                      <div className="flex items-center justify-center mt-2 text-red-700">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">LOSER</span>
                      </div>
                    )}
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
                  
                                        {/* Result Details for Completed Matches */}
                      {match.result && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Medal className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="text-sm font-semibold text-blue-800">Fight Result</span>
                            </div>
                            <span className="text-xs text-blue-600">
                              {match.result.recordedAt ? new Date(match.result.recordedAt).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs">
                            <div>
                              <span className="font-medium text-blue-700">Method:</span>
                              <span className="ml-1 text-blue-800">{match.result.method || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">Rounds:</span>
                              <span className="ml-1 text-blue-800">{match.result.rounds || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">Winner:</span>
                              <span className="ml-1 text-blue-800 font-semibold">{match.result.winner?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          {match.result.notes && (
                            <div className="mt-2 text-xs">
                              <span className="font-medium text-blue-700">Notes:</span>
                              <span className="ml-1 text-blue-800">{match.result.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                  
                  {/* Record Result Button for Matches without Results */}
                  {!match.result && match.status === 'Scheduled' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">No result recorded yet</span>
                        </div>
                        <button
                          onClick={() => openResultModal(match)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Record Result
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Result Recording Modal */}
      {showResultModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Record Match Result</h2>
                  <p className="text-red-100">Match ID: {selectedMatch.matchId}</p>
                </div>
                <button
                  onClick={closeResultModal}
                  className="text-red-100 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Match Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                    Red Corner
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {selectedMatch.boxer1.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedMatch.boxer1.name}</h4>
                      <p className="text-sm text-gray-600">{selectedMatch.boxer1.experienceLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                    Blue Corner
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {selectedMatch.boxer2.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedMatch.boxer2.name}</h4>
                      <p className="text-sm text-gray-600">{selectedMatch.boxer2.experienceLevel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Form */}
              <form onSubmit={handleRecordResult} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Winner Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                      Winner
                    </label>
                    <select
                      value={resultForm.winnerId}
                      onChange={(e) => setResultForm({ ...resultForm, winnerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select winner...</option>
                      <option value={selectedMatch.boxer1._id}>{selectedMatch.boxer1.name}</option>
                      <option value={selectedMatch.boxer2._id}>{selectedMatch.boxer2.name}</option>
                    </select>
                  </div>

                  {/* Loser Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <XCircle className="w-4 h-4 inline mr-1 text-red-600" />
                      Loser
                    </label>
                    <select
                      value={resultForm.loserId}
                      onChange={(e) => setResultForm({ ...resultForm, loserId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select loser...</option>
                      <option value={selectedMatch.boxer1._id}>{selectedMatch.boxer1.name}</option>
                      <option value={selectedMatch.boxer2._id}>{selectedMatch.boxer2.name}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Result Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="w-4 h-4 inline mr-1" />
                      Result Method
                    </label>
                    <select
                      value={resultForm.method}
                      onChange={(e) => setResultForm({ ...resultForm, method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="Decision">Decision</option>
                      <option value="TKO">TKO</option>
                      <option value="KO">KO</option>
                      <option value="Retirement">Retirement</option>
                      <option value="Disqualification">Disqualification</option>
                      <option value="Walkover">Walkover</option>
                    </select>
                  </div>

                  {/* Rounds */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Rounds Completed
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedMatch.rounds}
                      value={resultForm.rounds}
                      onChange={(e) => setResultForm({ ...resultForm, rounds: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={resultForm.notes}
                      onChange={(e) => setResultForm({ ...resultForm, notes: e.target.value })}
                      placeholder="e.g., Close match, split decision"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center text-red-800">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeResultModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingResult}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {savingResult ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{savingResult ? 'Saving...' : 'Record Result'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matchmaking; 