import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MatchDetails from './components/MatchDetails';
import EventDetails from './components/EventDetails';
import RecordResult from './components/RecordResult';
import PublicFightsDisplay from './components/PublicFightsDisplay';
import BoxerRecord from './components/BoxerRecord';
import Admin from './components/Admin';
import Home from './components/Home';
import Boxers from './components/Boxers';
import Matches from './components/Matches';
import Matchmaking from './components/Matchmaking';
import Header from './components/Header';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes - accessible without login */}
            <Route path="/" element={<PublicFightsDisplay />} />
            <Route path="/fights" element={<PublicFightsDisplay />} />
            <Route path="/public-fights" element={<PublicFightsDisplay />} />
            <Route path="/event-today" element={<PublicFightsDisplay />} />
            
            {/* Admin routes - accessible without login */}
            <Route path="/boxers" element={<Boxers />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/matchmaking" element={<Matchmaking />} />
            <Route path="/match/:matchId" element={<MatchDetails />} />
            <Route path="/event/:eventDate" element={<EventDetails />} />
            <Route path="/record-result/:matchId" element={<RecordResult />} />
            <Route path="/boxer/:boxerId/record" element={<BoxerRecord />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/home" element={<Home />} />
            
            {/* Catch all other routes and redirect to public fights */}
            <Route path="*" element={<Navigate to="/fights" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 