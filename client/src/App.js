import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MatchDetails from './components/MatchDetails';
import Home from './components/Home';
import Boxers from './components/Boxers';
import Matches from './components/Matches';
import Matchmaking from './components/Matchmaking';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boxers" element={<Boxers />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/matchmaking" element={<Matchmaking />} />
            <Route path="/match/:matchId" element={<MatchDetails />} />
            <Route path="*" element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 