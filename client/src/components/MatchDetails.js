import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Award, 
  Users, 
  Scale, 
  User, 
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const MatchDetails = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/matches/match/${matchId}`);
        setMatch(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check the QR code or match ID and try again.</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'status-scheduled';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-scheduled';
    }
  };

  const getExperienceLevelColor = (level) => {
    switch (level) {
      case 'Novice':
        return 'level-novice';
      case 'Schools':
        return 'level-schools';
      case 'Junior':
        return 'level-junior';
      case 'Youth':
        return 'level-youth';
      case 'Elite':
        return 'level-elite';
      default:
        return 'level-novice';
    }
  };

  const isWinner = (boxerId) => {
    return match.result?.winner?._id === boxerId;
  };

  const isLoser = (boxerId) => {
    return match.result?.loser?._id === boxerId;
  };

  const BoxerCard = ({ boxer, position }) => {
    const winner = isWinner(boxer._id);
    const loser = isLoser(boxer._id);
    
    return (
      <div className={`card ${winner ? 'winner-card' : loser ? 'loser-card' : ''}`}>
        <div className="text-center">
          {/* Boxer Avatar */}
          <div className="mb-4">
            <img
              src={boxer.photoUrl || 'https://via.placeholder.com/150/cccccc/666666?text=Boxer'}
              alt={boxer.name}
              className={`boxer-avatar ${winner ? 'boxer-avatar-winner' : loser ? 'boxer-avatar-loser' : ''}`}
            />
          </div>

          {/* Boxer Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{boxer.name}</h3>

          {/* Result Badge */}
          {match.result && (
            <div className="mb-3">
              {winner && (
                <span className="result-badge result-winner">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Winner
                </span>
              )}
              {loser && (
                <span className="result-badge result-loser">
                  <XCircle className="w-4 h-4 mr-1" />
                  Loser
                </span>
              )}
            </div>
          )}

          {/* Boxer Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <User className="w-4 h-4 mr-2" />
              <span>{boxer.age} years old</span>
            </div>
            <div className="flex items-center justify-center">
              <Scale className="w-4 h-4 mr-2" />
              <span>{boxer.weightKg} kg</span>
            </div>
            <div className="flex items-center justify-center">
              <Target className="w-4 h-4 mr-2" />
              <span className={`experience-badge ${getExperienceLevelColor(boxer.experienceLevel)}`}>
                {boxer.experienceLevel}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <Trophy className="w-4 h-4 mr-2" />
              <span>{boxer.boutsCount} bouts</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{boxer.location}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Match Header */}
      <div className="card mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Boxing Match</h1>
          <p className="text-gray-600">Match ID: {match.matchId}</p>
        </div>

        {/* Match Status */}
        <div className="flex justify-center mb-6">
          <span className={`match-status ${getStatusColor(match.status)}`}>
            {match.status}
          </span>
        </div>

        {/* Match Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center justify-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{formatDate(match.scheduledDate)}</p>
              <p className="text-sm text-gray-500">{formatTime(match.scheduledDate)}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-semibold">{match.venue || 'TBD'}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{match.rounds} rounds × {match.roundDuration} min</p>
            </div>
          </div>
        </div>

        {/* Weight Class and Experience Level */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Weight Class</p>
            <p className="font-semibold text-lg">{match.weightClass}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Experience Level</p>
            <span className={`experience-badge ${getExperienceLevelColor(match.experienceLevel)}`}>
              {match.experienceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Boxers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Boxers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <BoxerCard boxer={match.boxer1} position="left" />
          <BoxerCard boxer={match.boxer2} position="right" />
        </div>
      </div>

      {/* Match Result */}
      {match.result && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Match Result</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Winner</h3>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <span className="font-semibold text-lg">{match.result.winner.name}</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Loser</h3>
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-6 h-6 text-red-600 mr-2" />
                <span className="font-semibold text-lg">{match.result.loser.name}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Method</p>
                <p className="font-semibold">{match.result.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rounds</p>
                <p className="font-semibold">{match.result.rounds}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Recorded</p>
                <p className="font-semibold">{formatDate(match.result.recordedAt)}</p>
              </div>
            </div>
            
            {match.result.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{match.result.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Officials */}
      {match.officials && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Officials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {match.officials.referee && (
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Referee</h3>
                <p className="text-gray-600">{match.officials.referee.name}</p>
                {match.officials.referee.license && (
                  <p className="text-sm text-gray-500">License: {match.officials.referee.license}</p>
                )}
              </div>
            )}
            
            {match.officials.timekeeper && (
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Timekeeper</h3>
                <p className="text-gray-600">{match.officials.timekeeper.name}</p>
                {match.officials.timekeeper.license && (
                  <p className="text-sm text-gray-500">License: {match.officials.timekeeper.license}</p>
                )}
              </div>
            )}
            
            {match.officials.judges && match.officials.judges.length > 0 && (
              <>
                {match.officials.judges.map((judge, index) => (
                  <div key={index} className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">Judge {index + 1}</h3>
                    <p className="text-gray-600">{judge.name}</p>
                    {judge.license && (
                      <p className="text-sm text-gray-500">License: {judge.license}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* QR Code Info */}
      <div className="text-center text-sm text-gray-500">
        <p>This page is accessible via QR code for public viewing</p>
        <p>Match ID: {match.matchId}</p>
      </div>
    </div>
  );
};

export default MatchDetails; 