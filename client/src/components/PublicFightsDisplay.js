import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Award, 
  Users, 
  Scale, 
  User, 
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  TrendingUp,
  CheckSquare,
  QrCode,
  Smartphone
} from 'lucide-react';
import axios from 'axios';

const PublicFightsDisplay = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'

  useEffect(() => {
    fetchAllMatches();
  }, []);

  const fetchAllMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/matches?limit=100');
      setMatches(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load fights');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const upcomingMatches = matches.filter(match => match.status === 'Scheduled');
  const completedMatches = matches.filter(match => match.status === 'Completed');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExperienceLevelColor = (level) => {
    switch (level) {
      case 'Novice': return 'bg-blue-100 text-blue-800';
      case 'Schools': return 'bg-green-100 text-green-800';
      case 'Junior': return 'bg-yellow-100 text-yellow-800';
      case 'Youth': return 'bg-purple-100 text-purple-800';
      case 'Elite': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isWinner = (boxerId, result) => {
    return result && result.winner && result.winner._id === boxerId;
  };

  const isLoser = (boxerId, result) => {
    return result && result.loser && result.loser._id === boxerId;
  };

  const FightCard = ({ match, index }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
                #{index + 1}
              </div>
              <div>
                <h3 className="font-bold text-lg">Fight #{index + 1}</h3>
                <p className="text-red-100 text-sm">{match.experienceLevel} • {match.weightClass}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-red-100 font-medium">{formatDate(match.scheduledDate)}</div>
              <div className="text-xs text-red-200">{formatTime(match.scheduledDate)}</div>
            </div>
          </div>
        </div>

        {/* Fighters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fighter 1 */}
            <div className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${
              match.result ? 
                (isWinner(match.boxer1._id, match.result) ? 'border-green-500 bg-green-50 shadow-lg' : 
                 isLoser(match.boxer1._id, match.result) ? 'border-red-500 bg-red-50 shadow-lg' : 
                 'border-gray-200') : 
                'border-gray-200 hover:border-red-300 hover:shadow-md'
            }`}>
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {match.boxer1.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h4 className={`font-bold text-lg ${
                match.result ? 
                  (isWinner(match.boxer1._id, match.result) ? 'text-green-800' : 
                   isLoser(match.boxer1._id, match.result) ? 'text-red-800' : 
                   'text-gray-900') : 
                  'text-gray-900'
              }`}>
                {match.boxer1.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{match.boxer1.experienceLevel}</p>
              <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
                <Scale className="w-3 h-3 mr-1" />
                {match.boxer1.weightKg}kg
              </div>
              {match.result && isWinner(match.boxer1._id, match.result) && (
                <div className="flex items-center justify-center mt-2 text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">WINNER</span>
                </div>
              )}
              {match.result && isLoser(match.boxer1._id, match.result) && (
                <div className="flex items-center justify-center mt-2 text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">LOSER</span>
                </div>
              )}
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-3">VS</div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {match.rounds} rounds
                  </div>
                  <div className="flex items-center justify-center">
                    <Target className="w-4 h-4 mr-2" />
                    {match.venue}
                  </div>
                </div>
              </div>
            </div>

            {/* Fighter 2 */}
            <div className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${
              match.result ? 
                (isWinner(match.boxer2._id, match.result) ? 'border-green-500 bg-green-50 shadow-lg' : 
                 isLoser(match.boxer2._id, match.result) ? 'border-red-500 bg-red-50 shadow-lg' : 
                 'border-gray-200') : 
                'border-gray-200 hover:border-red-300 hover:shadow-md'
            }`}>
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {match.boxer2.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h4 className={`font-bold text-lg ${
                match.result ? 
                  (isWinner(match.boxer2._id, match.result) ? 'text-green-800' : 
                   isLoser(match.boxer2._id, match.result) ? 'text-red-800' : 
                   'text-gray-900') : 
                  'text-gray-900'
              }`}>
                {match.boxer2.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{match.boxer2.experienceLevel}</p>
              <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
                <Scale className="w-3 h-3 mr-1" />
                {match.boxer2.weightKg}kg
              </div>
              {match.result && isWinner(match.boxer2._id, match.result) && (
                <div className="flex items-center justify-center mt-2 text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">WINNER</span>
                </div>
              )}
              {match.result && isLoser(match.boxer2._id, match.result) && (
                <div className="flex items-center justify-center mt-2 text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">LOSER</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Details (for completed fights) */}
          {match.result && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Fight Result
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <span className="font-semibold text-gray-700">Method:</span>
                  <span className="ml-2 text-gray-900">{match.result.method}</span>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <span className="font-semibold text-gray-700">Rounds:</span>
                  <span className="ml-2 text-gray-900">{match.result.rounds}</span>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(match.result.recordedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {match.result.notes && (
                <div className="mt-4 bg-white p-3 rounded-lg text-sm">
                  <span className="font-semibold text-gray-700">Notes:</span>
                  <span className="ml-2 text-gray-900">{match.result.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <QrCode className="w-12 h-12 mr-3" />
              <Smartphone className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-bold mb-3">Sanabo Boxing</h1>
            <p className="text-2xl text-red-100 mb-2">Event Fights Display</p>
            <p className="text-lg text-red-200">Scan QR code to view live fight information</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <TrendingUp className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{upcomingMatches.length}</h3>
            <p className="text-gray-600 font-medium">Upcoming Fights</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <CheckSquare className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{completedMatches.length}</h3>
            <p className="text-gray-600 font-medium">Completed Fights</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">{matches.length}</h3>
            <p className="text-gray-600 font-medium">Total Fights</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <Target className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900">
              {new Set(matches.map(m => m.experienceLevel)).size}
            </h3>
            <p className="text-gray-600 font-medium">Categories</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-lg mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <TrendingUp className="w-5 h-5" />
              <span>Upcoming ({upcomingMatches.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <CheckSquare className="w-5 h-5" />
              <span>Completed ({completedMatches.length})</span>
            </div>
          </button>
        </div>

        {/* Fights List */}
        <div className="space-y-8">
          {activeTab === 'upcoming' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
                Upcoming Fights
              </h2>
              {upcomingMatches.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                  <CalendarDays className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Upcoming Fights</h3>
                  <p className="text-gray-600 text-lg">No fights are currently scheduled.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingMatches.map((match, index) => (
                    <FightCard key={match._id} match={match} index={index} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <CheckSquare className="w-8 h-8 mr-3 text-green-600" />
                Completed Fights
              </h2>
              {completedMatches.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                  <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Completed Fights</h3>
                  <p className="text-gray-600 text-lg">No fights have been completed yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {completedMatches.map((match, index) => (
                    <FightCard key={match._id} match={match} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 bg-white rounded-xl shadow-lg p-6">
          <p className="text-lg font-medium">Sanabo Boxing Matchmaking System</p>
          <p className="text-sm mt-2">Public Event Display - Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicFightsDisplay; 