import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Trophy, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Target,
  Crown,
  Medal,
  RefreshCw,
  Trash2
} from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [editingMatch, setEditingMatch] = useState(null);
  const [editForm, setEditForm] = useState({
    winnerId: '',
    loserId: '',
    method: 'Decision',
    rounds: 3,
    notes: '',
    isDraw: false
  });
  const [saving, setSaving] = useState(false);
  const [clearConfirmation, setClearConfirmation] = useState(0); // 0 = no confirmation, 1-3 = confirmation steps
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/matches?limit=100');
      setMatches(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFights = () => {
    if (clearConfirmation === 0) {
      setClearConfirmation(1);
    } else if (clearConfirmation === 1) {
      setClearConfirmation(2);
    } else if (clearConfirmation === 2) {
      setClearConfirmation(3);
    } else {
      // Final confirmation - clear all scheduled fights
      clearAllScheduledFights();
    }
  };

  const clearAllScheduledFights = async () => {
    try {
      setClearing(true);
      setError(null);
      
      // Get all scheduled matches
      const scheduledMatches = matches.filter(match => match.status === 'Scheduled');
      
      if (scheduledMatches.length === 0) {
        setError('No scheduled fights to clear');
        setClearConfirmation(0);
        setClearing(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Delete each scheduled match
      for (const match of scheduledMatches) {
        try {
          await axios.delete(`/api/matches/${match._id}`);
          successCount++;
        } catch (err) {
          errorCount++;
          errors.push(`Failed to delete match ${match.matchId}: ${err.response?.data?.message || err.message}`);
          console.error(`Error deleting match ${match._id}:`, err);
        }
      }

      // Refresh the matches list
      await fetchMatches();
      
      // Show results
      if (errorCount > 0) {
        setError(`Cleared ${successCount} matches, but failed to clear ${errorCount} matches. Check console for details.`);
      } else {
        alert(`Successfully cleared all ${successCount} scheduled matches!`);
      }
      
      setClearConfirmation(0);
      setClearing(false);
    } catch (err) {
      setError('Failed to clear scheduled fights');
      console.error('Error clearing fights:', err);
      setClearConfirmation(0);
      setClearing(false);
    }
  };

  const cancelClearFights = () => {
    setClearConfirmation(0);
    setClearing(false);
  };

  const getClearButtonText = () => {
    if (clearing) return 'Clearing...';
    if (clearConfirmation === 0) return 'Clear All Scheduled Fights';
    if (clearConfirmation === 1) return 'Are you sure? Click again to confirm';
    if (clearConfirmation === 2) return 'Really sure? Click again to confirm';
    if (clearConfirmation === 3) return 'Final warning! Click to clear all fights';
    return 'Clear All Scheduled Fights';
  };

  const getClearButtonColor = () => {
    if (clearing) return 'bg-gray-500';
    if (clearConfirmation === 0) return 'bg-red-600 hover:bg-red-700';
    if (clearConfirmation === 1) return 'bg-orange-600 hover:bg-orange-700';
    if (clearConfirmation === 2) return 'bg-yellow-600 hover:bg-yellow-700';
    if (clearConfirmation === 3) return 'bg-red-800 hover:bg-red-900';
    return 'bg-red-600 hover:bg-red-700';
  };

  const filteredMatches = matches.filter(match => {
    if (filters.status && match.status !== filters.status) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        match.matchId?.toLowerCase().includes(searchTerm) ||
        match.boxer1?.name?.toLowerCase().includes(searchTerm) ||
        match.boxer2?.name?.toLowerCase().includes(searchTerm) ||
        match.venue?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const startEditing = (match) => {
    setEditingMatch(match);
    setEditForm({
      winnerId: match.result?.winner?._id || '',
      loserId: match.result?.loser?._id || '',
      method: match.result?.method || 'Decision',
      rounds: match.result?.rounds || match.rounds,
      notes: match.result?.notes || '',
      isDraw: match.result?.isDraw || false
    });
  };

  const cancelEditing = () => {
    setEditingMatch(null);
    setEditForm({
      winnerId: '',
      loserId: '',
      method: 'Decision',
      rounds: 3,
      notes: '',
      isDraw: false
    });
  };

  const handleSaveResult = async () => {
    if (editForm.isDraw) {
      // For draws, we don't need winner/loser validation
      if (editForm.method !== 'Draw') {
        setError('Please select "Draw" as the method for draw results');
        return;
      }
    } else {
      // For non-draws, validate winner and loser
      if (!editForm.winnerId || !editForm.loserId) {
        setError('Please select both winner and loser');
        return;
      }

      if (editForm.winnerId === editForm.loserId) {
        setError('Winner and loser cannot be the same boxer');
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await axios.post(`/api/matches/${editingMatch._id}/result`, editForm);
      
      if (response.data.success) {
        // Update the match in the local state
        const updatedMatches = matches.map(m => 
          m._id === editingMatch._id ? response.data.data : m
        );
        setMatches(updatedMatches);
        
        alert('Match result updated successfully!');
        cancelEditing();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update result');
    } finally {
      setSaving(false);
    }
  };

  const deleteResult = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match result? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      // You would need to implement a delete result endpoint
      // For now, we'll just show a message
      alert('Delete functionality would be implemented here');
      setSaving(false);
    } catch (err) {
      setError('Failed to delete result');
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isWinner = (boxerId, result) => {
    return result && result.winner && result.winner._id === boxerId;
  };

  const isLoser = (boxerId, result) => {
    return result && result.loser && result.loser._id === boxerId;
  };

  const isDraw = (boxerId, result, match) => {
    return result && result.isDraw && match && match.boxer1 && match.boxer2 && 
           (match.boxer1._id === boxerId || match.boxer2._id === boxerId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              Admin Panel
            </h1>
            <p className="text-xl text-red-100">Manage match results and boxer records</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchMatches}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button 
              onClick={handleClearFights}
              disabled={clearing}
              className={`${getClearButtonColor()} px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white font-medium disabled:opacity-50`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{getClearButtonText()}</span>
            </button>
            {clearConfirmation > 0 && (
              <button 
                onClick={cancelClearFights}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white font-medium"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{matches.length}</h3>
          <p className="text-gray-600">Total Matches</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {matches.filter(m => m.status === 'Completed').length}
          </h3>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {matches.filter(m => m.status === 'Scheduled').length}
          </h3>
          <p className="text-gray-600">Scheduled</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {matches.filter(m => m.result).length}
          </h3>
          <p className="text-gray-600">With Results</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search matches..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '' })}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Match Management ({filteredMatches.length})</h3>
        </div>
        
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMatches.map((match) => (
              <div key={match._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                    <span className="text-sm text-gray-600">{match.matchId}</span>
                    <span className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(match.scheduledDate)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {editingMatch?._id === match._id ? (
                      <>
                        <button
                          onClick={handleSaveResult}
                          disabled={saving}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(match)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Result
                      </button>
                    )}
                  </div>
                </div>

                {editingMatch?._id === match._id ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {/* Draw Checkbox */}
                    <div className="mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editForm.isDraw}
                          onChange={(e) => {
                            setEditForm({ 
                              ...editForm, 
                              isDraw: e.target.checked,
                              winnerId: e.target.checked ? '' : editForm.winnerId,
                              loserId: e.target.checked ? '' : editForm.loserId
                            });
                          }}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">This is a Draw</span>
                      </label>
                    </div>

                    {!editForm.isDraw ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                          Winner
                        </label>
                        <select
                          value={editForm.winnerId}
                          onChange={(e) => setEditForm({ ...editForm, winnerId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select winner...</option>
                          <option value={match.boxer1._id}>{match.boxer1.name}</option>
                          <option value={match.boxer2._id}>{match.boxer2.name}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <XCircle className="w-4 h-4 inline mr-1 text-red-600" />
                          Loser
                        </label>
                        <select
                          value={editForm.loserId}
                          onChange={(e) => setEditForm({ ...editForm, loserId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select loser...</option>
                          <option value={match.boxer1._id}>{match.boxer1.name}</option>
                          <option value={match.boxer2._id}>{match.boxer2.name}</option>
                        </select>
                      </div>
                    </div>
                    ) : (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-blue-800">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Draw Result - Both boxers will be marked as having a draw</span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
                        <select
                          value={editForm.method}
                          onChange={(e) => setEditForm({ ...editForm, method: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Decision">Decision</option>
                          <option value="TKO">TKO</option>
                          <option value="KO">KO</option>
                          <option value="Retirement">Retirement</option>
                          <option value="Disqualification">Disqualification</option>
                          <option value="Walkover">Walkover</option>
                          <option value="Draw">Draw</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rounds</label>
                        <input
                          type="number"
                          min="1"
                          max={match.rounds}
                          value={editForm.rounds}
                          onChange={(e) => setEditForm({ ...editForm, rounds: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <input
                          type="text"
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          placeholder="Optional notes..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Red Corner */}
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      match.result ? 
                        (isWinner(match.boxer1._id, match.result) ? 'border-green-500 bg-green-50' : 
                         isLoser(match.boxer1._id, match.result) ? 'border-red-500 bg-red-50' : 
                         isDraw(match.boxer1._id, match.result, match) ? 'border-blue-500 bg-blue-50' :
                         'border-red-300') : 
                        'border-red-300'
                    }`}>
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                        {match.boxer1.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        RED CORNER
                      </div>
                      <h4 className="font-medium text-gray-900">{match.boxer1.name}</h4>
                      <p className="text-sm text-gray-600">{match.boxer1.experienceLevel}</p>
                      {match.result && isWinner(match.boxer1._id, match.result) && (
                        <div className="flex items-center justify-center mt-2 text-green-700">
                          <Crown className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">WINNER</span>
                        </div>
                      )}
                      {match.result && isLoser(match.boxer1._id, match.result) && (
                        <div className="flex items-center justify-center mt-2 text-red-700">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">LOSER</span>
                        </div>
                      )}
                      {match.result && isDraw(match.boxer1._id, match.result, match) && (
                        <div className="flex items-center justify-center mt-2 text-blue-700">
                          <Medal className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">DRAW</span>
                        </div>
                      )}
                    </div>

                    {/* VS */}
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">VS</div>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center justify-center">
                            <Target className="w-3 h-3 mr-1" />
                            {match.venue}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {match.rounds} rounds
                          </div>
                        </div>
                        {match.result && (
                          <div className="mt-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {match.result.method}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Blue Corner */}
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      match.result ? 
                        (isWinner(match.boxer2._id, match.result) ? 'border-green-500 bg-green-50' : 
                         isLoser(match.boxer2._id, match.result) ? 'border-red-500 bg-red-50' : 
                         isDraw(match.boxer2._id, match.result, match) ? 'border-blue-500 bg-blue-50' :
                         'border-blue-300') : 
                        'border-blue-300'
                    }`}>
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                        {match.boxer2.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        BLUE CORNER
                      </div>
                      <h4 className="font-medium text-gray-900">{match.boxer2.name}</h4>
                      <p className="text-sm text-gray-600">{match.boxer2.experienceLevel}</p>
                      {match.result && isWinner(match.boxer2._id, match.result) && (
                        <div className="flex items-center justify-center mt-2 text-green-700">
                          <Crown className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">WINNER</span>
                        </div>
                      )}
                      {match.result && isLoser(match.boxer2._id, match.result) && (
                        <div className="flex items-center justify-center mt-2 text-red-700">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">LOSER</span>
                        </div>
                      )}
                      {match.result && isDraw(match.boxer2._id, match.result, match) && (
                        <div className="flex items-center justify-center mt-2 text-blue-700">
                          <Medal className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">DRAW</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Result Details */}
                {match.result && editingMatch?._id !== match._id && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Medal className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-blue-800">Result Details</span>
                      </div>
                      <span className="text-xs text-blue-600">
                        {match.result.recordedAt ? formatDate(match.result.recordedAt) : 'Unknown'}
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
                        <span className="font-medium text-blue-700">
                          {match.result.isDraw ? 'Result:' : 'Winner:'}
                        </span>
                        <span className="ml-1 text-blue-800 font-semibold">
                          {match.result.isDraw ? 'Draw' : (match.result.winner?.name || 'Unknown')}
                        </span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 