import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  MapPin,
  Scale,
  Crown,
  Medal,
  Star
} from 'lucide-react';
import axios from 'axios';

const BoxerRecord = () => {
  const { boxerId } = useParams();
  const [boxer, setBoxer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBoxerData();
  }, [boxerId]);

  const fetchBoxerData = async () => {
    try {
      setLoading(true);
      const [boxerResponse, matchesResponse] = await Promise.all([
        axios.get(`/api/boxers/${boxerId}`),
        axios.get(`/api/matches/boxer/${boxerId}?limit=50`)
      ]);
      
      setBoxer(boxerResponse.data.data);
      setMatches(matchesResponse.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load boxer data');
      console.error('Error fetching boxer data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boxer record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!boxer) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Boxer Not Found</h2>
          <p className="text-gray-600">The boxer you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalFights = (boxer.record?.wins || 0) + (boxer.record?.losses || 0) + (boxer.record?.draws || 0);
  const winPercentage = totalFights > 0 ? Math.round(((boxer.record?.wins || 0) / totalFights) * 100) : 0;
  const recordString = `${boxer.record?.wins || 0}-${boxer.record?.losses || 0}-${boxer.record?.draws || 0}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'ko': return 'bg-red-100 text-red-800';
      case 'tko': return 'bg-orange-100 text-orange-800';
      case 'decision': return 'bg-blue-100 text-blue-800';
      case 'retirement': return 'bg-purple-100 text-purple-800';
      case 'disqualification': return 'bg-gray-100 text-gray-800';
      case 'walkover': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isWinner = (match) => {
    return match.result && match.result.winner && match.result.winner._id === boxerId;
  };

  const isLoser = (match) => {
    return match.result && match.result.loser && match.result.loser._id === boxerId;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {boxer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{boxer.name}</h1>
            <div className="flex items-center space-x-4 text-red-100">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {boxer.experienceLevel}
              </span>
              <span className="flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                {boxer.weightKg}kg
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {boxer.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{recordString}</div>
            <div className="text-red-100">Record</div>
            <div className="text-2xl font-bold mt-2">{winPercentage}%</div>
            <div className="text-red-100">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{boxer.record?.wins || 0}</h3>
          <p className="text-gray-600">Wins</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{boxer.record?.losses || 0}</h3>
          <p className="text-gray-600">Losses</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{totalFights}</h3>
          <p className="text-gray-600">Total Fights</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{boxer.boutsCount || 0}</h3>
          <p className="text-gray-600">Bouts</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('fights')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'fights'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Fight History ({matches.length})</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Win Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Win Methods
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {boxer.winMethods && Object.entries(boxer.winMethods).map(([method, count]) => (
                <div key={method} className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{count}</div>
                  <div className="text-sm text-green-800 capitalize">{method}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Loss Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <XCircle className="w-5 h-5 mr-2 text-red-600" />
              Loss Methods
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {boxer.lossMethods && Object.entries(boxer.lossMethods).map(([method, count]) => (
                <div key={method} className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{count}</div>
                  <div className="text-sm text-red-800 capitalize">{method}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fights' && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fights Yet</h3>
              <p className="text-gray-600">This boxer hasn't had any fights recorded yet.</p>
            </div>
          ) : (
            matches.map((match) => (
              <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {match.status}
                    </span>
                    <span className="text-sm text-gray-600">{match.matchId}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(match.scheduledDate)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Opponent 1 */}
                  <div className={`text-center p-4 rounded-lg border-2 ${
                    match.result ? 
                      (isWinner(match) ? 'border-green-500 bg-green-50' : 
                       isLoser(match) ? 'border-red-500 bg-red-50' : 
                       'border-gray-200') : 
                      'border-gray-200'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                      {match.boxer1.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <h4 className="font-medium text-gray-900">{match.boxer1.name}</h4>
                    <p className="text-sm text-gray-600">{match.boxer1.experienceLevel}</p>
                    {match.result && isWinner(match) && (
                      <div className="flex items-center justify-center mt-2 text-green-700">
                        <Crown className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">WIN</span>
                      </div>
                    )}
                    {match.result && isLoser(match) && (
                      <div className="flex items-center justify-center mt-2 text-red-700">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">LOSS</span>
                      </div>
                    )}
                  </div>

                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 mb-2">VS</div>
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center justify-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {match.venue}
                        </div>
                        <div className="flex items-center justify-center mt-1">
                          <Target className="w-3 h-3 mr-1" />
                          {match.rounds} rounds
                        </div>
                      </div>
                      {match.result && (
                        <div className="mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(match.result.method)}`}>
                            {match.result.method}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opponent 2 */}
                  <div className={`text-center p-4 rounded-lg border-2 ${
                    match.result ? 
                      (isWinner(match) ? 'border-green-500 bg-green-50' : 
                       isLoser(match) ? 'border-red-500 bg-red-50' : 
                       'border-gray-200') : 
                      'border-gray-200'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                      {match.boxer2.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <h4 className="font-medium text-gray-900">{match.boxer2.name}</h4>
                    <p className="text-sm text-gray-600">{match.boxer2.experienceLevel}</p>
                    {match.result && isWinner(match) && (
                      <div className="flex items-center justify-center mt-2 text-green-700">
                        <Crown className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">WIN</span>
                      </div>
                    )}
                    {match.result && isLoser(match) && (
                      <div className="flex items-center justify-center mt-2 text-red-700">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-semibold">LOSS</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BoxerRecord; 