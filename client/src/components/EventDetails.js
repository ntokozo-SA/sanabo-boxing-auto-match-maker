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
  AlertCircle,
  CalendarDays,
  Edit
} from 'lucide-react';
import axios from 'axios';

const EventDetails = () => {
  const { eventDate } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    const fetchEventMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/matches/event/${eventDate}`);
        setMatches(response.data.data);
        setEventInfo(response.data.eventInfo);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventMatches();
  }, [eventDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check the event date and try again.</p>
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h2>
          <p className="text-gray-600">No matches are scheduled for this event date.</p>
        </div>
      </div>
    );
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

  const isWinner = (boxerId, result) => {
    return result && result.winner && result.winner._id === boxerId;
  };

  const isLoser = (boxerId, result) => {
    return result && result.loser && result.loser._id === boxerId;
  };

  const BoxerCard = ({ boxer, position, result }) => {
    const winner = isWinner(boxer._id, result);
    const loser = isLoser(boxer._id, result);
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 ${
        winner ? 'border-green-500 bg-green-50' : 
        loser ? 'border-red-500 bg-red-50' : 
        'border-gray-200 hover:border-red-300'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {boxer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold truncate ${
              winner ? 'text-green-800' : 
              loser ? 'text-red-800' : 
              'text-gray-900'
            }`}>
              {boxer.name}
            </h3>
            <p className="text-sm text-gray-600">{position}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                <span>{boxer.weightKg}kg</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{boxer.age} years</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                <span>{boxer.experienceLevel}</span>
              </div>
            </div>
            {winner && (
              <div className="flex items-center mt-2 text-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="font-semibold">Winner</span>
              </div>
            )}
            {loser && (
              <div className="flex items-center mt-2 text-red-700">
                <XCircle className="w-4 h-4 mr-1" />
                <span className="font-semibold">Loser</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MatchCard = ({ match, index }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Match #{index + 1}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
                {match.status}
              </span>
              {match.status === 'Scheduled' && (
                <a
                  href={`/record-result/${match._id}`}
                  className="px-3 py-1 bg-white text-red-600 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Record Result</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              <span>{match.experienceLevel}</span>
            </div>
            <div className="flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              <span>{match.weightClass}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{match.rounds} rounds × {match.roundDuration}min</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BoxerCard 
              boxer={match.boxer1} 
              position="Boxer 1" 
              result={match.result}
            />
            <BoxerCard 
              boxer={match.boxer2} 
              position="Boxer 2" 
              result={match.result}
            />
          </div>
          
          {match.result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Match Result</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Method:</span>
                  <span className="ml-2 text-gray-900">{match.result.method}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Rounds:</span>
                  <span className="ml-2 text-gray-900">{match.result.rounds}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recorded:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(match.result.recordedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {match.result.notes && (
                <div className="mt-2">
                  <span className="font-medium text-gray-700">Notes:</span>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Sanabo Boxing Event</h1>
          <p className="text-xl mb-4">{formatDate(eventDate)}</p>
          {eventInfo && eventInfo.venue && (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{eventInfo.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{matches.length}</h3>
          <p className="text-gray-600">Total Matches</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {matches.filter(m => m.status === 'Completed').length}
          </h3>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {matches.filter(m => m.status === 'Scheduled').length}
          </h3>
          <p className="text-gray-600">Scheduled</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {new Set(matches.map(m => m.experienceLevel)).size}
          </h3>
          <p className="text-gray-600">Categories</p>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Matches</h2>
        {matches.map((match, index) => (
          <MatchCard key={match._id} match={match} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500">
        <p>This is a read-only view of the Sanabo Boxing Event.</p>
        <p className="text-sm mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default EventDetails; 