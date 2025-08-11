import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  CheckCircle, 
  XCircle, 
  Save,
  AlertCircle,
  Users
} from 'lucide-react';
import axios from 'axios';

const RecordResult = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({
    winnerId: '',
    loserId: '',
    method: 'Decision',
    rounds: 3,
    notes: ''
  });

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/matches/${matchId}`);
      setMatch(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!result.winnerId || !result.loserId) {
      setError('Please select both winner and loser');
      return;
    }

    if (result.winnerId === result.loserId) {
      setError('Winner and loser cannot be the same boxer');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await axios.post(`/api/matches/${matchId}/result`, result);
      
      if (response.data.success) {
        setMatch(response.data.data);
        alert('Match result recorded successfully!');
        // Redirect to event page
        const eventDate = new Date(match.scheduledDate).toISOString().split('T')[0];
        window.location.href = `/event/${eventDate}`;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record result');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match details...</p>
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

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Not Found</h2>
          <p className="text-gray-600">The match you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (match.status === 'Completed') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Already Completed</h2>
          <p className="text-gray-600 mb-4">This match result has already been recorded.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-green-800">Winner:</span>
              <span className="text-green-700">{match.result.winner.name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-red-800">Loser:</span>
              <span className="text-red-700">{match.result.loser.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Method:</span>
              <span className="text-gray-700">{match.result.method}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Record Match Result</h1>
          <p className="text-red-100">Match ID: {match.matchId}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span>{match.experienceLevel}</span>
            <span>•</span>
            <span>{match.weightClass}</span>
            <span>•</span>
            <span>{match.rounds} rounds × {match.roundDuration}min</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Boxer 1 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Boxer 1</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                  {match.boxer1.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{match.boxer1.name}</h4>
                  <p className="text-sm text-gray-600">{match.boxer1.experienceLevel} • {match.boxer1.weightKg}kg</p>
                </div>
              </div>
            </div>

            {/* Boxer 2 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Boxer 2</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                  {match.boxer2.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{match.boxer2.name}</h4>
                  <p className="text-sm text-gray-600">{match.boxer2.experienceLevel} • {match.boxer2.weightKg}kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Winner Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  Winner
                </label>
                <select
                  value={result.winnerId}
                  onChange={(e) => setResult({ ...result, winnerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select winner...</option>
                  <option value={match.boxer1._id}>{match.boxer1.name}</option>
                  <option value={match.boxer2._id}>{match.boxer2.name}</option>
                </select>
              </div>

              {/* Loser Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <XCircle className="w-4 h-4 inline mr-1 text-red-600" />
                  Loser
                </label>
                <select
                  value={result.loserId}
                  onChange={(e) => setResult({ ...result, loserId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select loser...</option>
                  <option value={match.boxer1._id}>{match.boxer1.name}</option>
                  <option value={match.boxer2._id}>{match.boxer2.name}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Result Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Result Method
                </label>
                <select
                  value={result.method}
                  onChange={(e) => setResult({ ...result, method: e.target.value })}
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
                  max={match.rounds}
                  value={result.rounds}
                  onChange={(e) => setResult({ ...result, rounds: parseInt(e.target.value) })}
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
                  value={result.notes}
                  onChange={(e) => setResult({ ...result, notes: e.target.value })}
                  placeholder="e.g., Close match, split decision"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Record Result'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordResult; 