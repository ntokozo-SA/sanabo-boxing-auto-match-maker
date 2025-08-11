const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Boxer = require('../models/Boxer');
const { demoDataAPI } = require('../utils/demoData');
const {
  findMatchesForBoxer,
  generateAllMatches,
  validateMatchResult,
  generateEventQRCode
} = require('../utils/matchmaking');

/**
 * @route   GET /api/matches
 * @desc    Get all matches with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      experienceLevel,
      weightClass,
      scheduledDate,
      search
    } = req.query;

    // Use demo data API instead of MongoDB
    const allMatches = demoDataAPI.getAllMatches();
    let filteredMatches = [...allMatches];
    
    // Apply filters
    if (status) {
      filteredMatches = filteredMatches.filter(match => match.status === status);
    }
    
    if (experienceLevel) {
      filteredMatches = filteredMatches.filter(match => match.experienceLevel === experienceLevel);
    }
    
    if (weightClass) {
      filteredMatches = filteredMatches.filter(match => match.weightClass === weightClass);
    }
    
    if (scheduledDate) {
      const date = new Date(scheduledDate);
      const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      filteredMatches = filteredMatches.filter(match => {
        const matchDate = new Date(match.scheduledDate);
        return matchDate >= date && matchDate < nextDay;
      });
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMatches = filteredMatches.filter(match => 
        match.matchId.toLowerCase().includes(searchLower) ||
        match.venue.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMatches = filteredMatches
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedMatches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredMatches.length,
        pages: Math.ceil(filteredMatches.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching matches',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/:id
 * @desc    Get single match by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const match = demoDataAPI.getMatchById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/match/:matchId
 * @desc    Get match by matchId (for QR code access)
 * @access  Public
 */
router.get('/match/:matchId', async (req, res) => {
  try {
    const match = demoDataAPI.getMatchByMatchId(req.params.matchId);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error fetching match by matchId:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/event/:eventDate
 * @desc    Get all matches for a specific event date
 * @access  Public
 */
router.get('/event/:eventDate', async (req, res) => {
  try {
    const eventDate = req.params.eventDate;
    
    // Parse the event date (format: YYYY-MM-DD)
    const date = new Date(eventDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event date format. Use YYYY-MM-DD'
      });
    }

    // Get all matches and filter by date
    const allMatches = demoDataAPI.getAllMatches();
    const eventMatches = allMatches.filter(match => {
      const matchDate = new Date(match.scheduledDate);
      const eventDateObj = new Date(eventDate);
      
      // Compare dates (ignore time)
      return matchDate.toDateString() === eventDateObj.toDateString();
    });

    // Get event info from the first match (venue, etc.)
    const eventInfo = eventMatches.length > 0 ? {
      venue: eventMatches[0].venue,
      totalMatches: eventMatches.length,
      date: eventDate
    } : null;

    res.json({
      success: true,
      data: eventMatches,
      eventInfo: eventInfo
    });
  } catch (error) {
    console.error('Error fetching event matches:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event matches',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/matches/matchmaking
 * @desc    Run matchmaking algorithm and generate matches
 * @access  Public
 */
router.post('/matchmaking', async (req, res) => {
  try {
    const {
      maxMatchesPerBoxer = 3,
      minScore = 60,
      scheduledDate,
      venue = 'TBD',
      filters = {}
    } = req.body;

    // Validate scheduled date
    let matchDate = scheduledDate;
    if (scheduledDate) {
      matchDate = new Date(scheduledDate);
      if (isNaN(matchDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid scheduled date format'
        });
      }
    }

    // Get all boxers from demo data
    const allBoxers = demoDataAPI.getAllBoxers(filters);
    
    // Simple matchmaking algorithm using demo data
    const generatedMatches = [];
    const usedBoxers = new Set();
    
    // Sort boxers by experience level for better matching
    const sortedBoxers = allBoxers.sort((a, b) => {
      const levels = ['Novice', 'Schools', 'Junior', 'Youth', 'Elite'];
      return levels.indexOf(a.experienceLevel) - levels.indexOf(b.experienceLevel);
    });

    for (let i = 0; i < sortedBoxers.length && generatedMatches.length < maxMatchesPerBoxer * 10; i++) {
      const boxer1 = sortedBoxers[i];
      
      if (usedBoxers.has(boxer1._id)) continue;
      
      // Find compatible opponent
      for (let j = i + 1; j < sortedBoxers.length; j++) {
        const boxer2 = sortedBoxers[j];
        
        if (usedBoxers.has(boxer2._id)) continue;
        
        // Check if they can match (simple compatibility check)
        const weightDiff = Math.abs(boxer1.weightKg - boxer2.weightKg);
        const ageDiff = Math.abs(boxer1.age - boxer2.age);
        const sameLevel = boxer1.experienceLevel === boxer2.experienceLevel;
        
        // Basic IBA rules
        let canMatch = false;
        
        if (boxer1.experienceLevel === 'Schools' || boxer1.experienceLevel === 'Junior') {
          canMatch = weightDiff <= 2 && ageDiff <= 2 && sameLevel;
        } else if (boxer1.experienceLevel === 'Youth') {
          canMatch = weightDiff <= 3 && ageDiff <= 2 && sameLevel;
        } else if (boxer1.experienceLevel === 'Elite') {
          canMatch = weightDiff <= 4 && sameLevel;
        } else if (boxer1.experienceLevel === 'Novice') {
          canMatch = weightDiff <= 2 && Math.abs(boxer1.boutsCount - boxer2.boutsCount) <= 5;
        }
        
        if (canMatch) {
          // Create match
          const matchId = `MATCH-${Date.now()}-${generatedMatches.length + 1}`;
          const match = {
            _id: (generatedMatches.length + 1).toString(),
            boxer1: boxer1,
            boxer2: boxer2,
            scheduledDate: matchDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            venue: venue,
            weightClass: getWeightClass(Math.max(boxer1.weightKg, boxer2.weightKg)),
            experienceLevel: boxer1.experienceLevel,
            rounds: getRoundsForLevel(boxer1.experienceLevel),
            roundDuration: getRoundDurationForLevel(boxer1.experienceLevel),
            qrCodeUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
            matchId: matchId,
            status: 'Scheduled',
            result: null,
            officials: {
              referee: { name: 'TBD', license: 'TBD' },
              judges: [
                { name: 'TBD', license: 'TBD' },
                { name: 'TBD', license: 'TBD' },
                { name: 'TBD', license: 'TBD' }
              ],
              timekeeper: { name: 'TBD', license: 'TBD' }
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          generatedMatches.push(match);
          usedBoxers.add(boxer1._id);
          usedBoxers.add(boxer2._id);
          break;
        }
      }
    }

    // Generate event QR code for the event date
    let eventQRCodeUrl = '';
    let eventUrl = '';
    
    if (generatedMatches.length > 0) {
      const eventDate = generatedMatches[0].scheduledDate;
      const dateString = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      eventUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/public-fights`;
      
      try {
        eventQRCodeUrl = await generateEventQRCode(dateString);
      } catch (error) {
        console.error('Error generating event QR code:', error);
        eventQRCodeUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
      }
    }

    // Add generated matches to demo data
    generatedMatches.forEach(match => {
      demoDataAPI.createMatch(match);
    });

    res.status(201).json({
      success: true,
      message: `Generated ${generatedMatches.length} matches for event`,
      data: {
        totalGenerated: generatedMatches.length,
        totalSaved: generatedMatches.length,
        eventDate: generatedMatches.length > 0 ? generatedMatches[0].scheduledDate.toISOString().split('T')[0] : null,
        eventUrl: eventUrl,
        eventQRCodeUrl: eventQRCodeUrl,
        matches: generatedMatches.map(match => ({
          matchId: match.matchId,
          boxer1: match.boxer1,
          boxer2: match.boxer2,
          scheduledDate: match.scheduledDate,
          venue: match.venue,
          weightClass: match.weightClass,
          experienceLevel: match.experienceLevel
        }))
      }
    });
  } catch (error) {
    console.error('Error in matchmaking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during matchmaking',
      error: error.message
    });
  }
});

// Helper functions for matchmaking
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

const getRoundsForLevel = (level) => {
  switch (level) {
    case 'Schools': return 2;
    case 'Junior': return 3;
    case 'Youth': return 3;
    case 'Elite': return 4;
    case 'Novice': return 3;
    default: return 3;
  }
};

const getRoundDurationForLevel = (level) => {
  switch (level) {
    case 'Schools': return 2;
    case 'Junior': return 2;
    case 'Youth': return 3;
    case 'Elite': return 3;
    case 'Novice': return 3;
    default: return 3;
  }
};

/**
 * @route   POST /api/matches/:id/result
 * @desc    Record match result
 * @access  Public
 */
router.post('/:id/result', async (req, res) => {
  try {
    const {
      winnerId,
      loserId,
      method,
      rounds,
      notes
    } = req.body;

    // Validate required fields
    if (!winnerId || !loserId || !method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: winnerId, loserId, method'
      });
    }

    // Validate result method
    const validMethods = ['Decision', 'TKO', 'KO', 'Retirement', 'Disqualification', 'Walkover'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid result method. Must be one of: Decision, TKO, KO, Retirement, Disqualification, Walkover'
      });
    }

    // Find match using demo data
    const match = demoDataAPI.getMatchById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Validate match status
    if (match.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Match result has already been recorded'
      });
    }

    // Find winner and loser boxers
    const winner = demoDataAPI.getBoxerById(winnerId);
    const loser = demoDataAPI.getBoxerById(loserId);
    
    if (!winner || !loser) {
      return res.status(400).json({
        success: false,
        message: 'Winner or loser not found'
      });
    }

    // Record result (simplified for demo)
    match.result = {
      winner: winner,
      loser: loser,
      method: method,
      rounds: rounds || 3,
      notes: notes || '',
      recordedAt: new Date()
    };
    match.status = 'Completed';
    match.updatedAt = new Date();

    // Update boxer records
    try {
      // Update winner's record
      winner.record.wins++;
      winner.boutsCount++;
      const winMethod = method.toLowerCase();
      if (winner.winMethods && winner.winMethods[winMethod] !== undefined) {
        winner.winMethods[winMethod]++;
      }

      // Update loser's record
      loser.record.losses++;
      loser.boutsCount++;
      const lossMethod = method.toLowerCase();
      if (loser.lossMethods && loser.lossMethods[lossMethod] !== undefined) {
        loser.lossMethods[lossMethod]++;
      }

      // Save updated boxers
      demoDataAPI.updateBoxer(winner);
      demoDataAPI.updateBoxer(loser);
    } catch (error) {
      console.error('Error updating boxer records:', error);
      // Continue with match result even if boxer update fails
    }

    res.json({
      success: true,
      message: 'Match result recorded successfully',
      data: match
    });
  } catch (error) {
    console.error('Error recording match result:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while recording match result',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/boxer/:boxerId
 * @desc    Get all matches for a specific boxer
 * @access  Public
 */
router.get('/boxer/:boxerId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matches = await Match.find({
      $or: [
        { boxer1: req.params.boxerId },
        { boxer2: req.params.boxerId }
      ]
    })
      .populate('boxer1', 'name weightKg experienceLevel age location photoUrl')
      .populate('boxer2', 'name weightKg experienceLevel age location photoUrl')
      .populate('result.winner', 'name')
      .populate('result.loser', 'name')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Match.countDocuments({
      $or: [
        { boxer1: req.params.boxerId },
        { boxer2: req.params.boxerId }
      ]
    });

    res.json({
      success: true,
      data: matches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching boxer matches:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid boxer ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boxer matches',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/suggestions/:boxerId
 * @desc    Get match suggestions for a specific boxer
 * @access  Public
 */
router.get('/suggestions/:boxerId', async (req, res) => {
  try {
    const {
      limit = 10,
      minScore = 50,
      experienceLevels,
      weightRange
    } = req.query;

    const options = {
      limit: parseInt(limit),
      minScore: parseInt(minScore)
    };

    if (experienceLevels) {
      options.experienceLevels = experienceLevels.split(',');
    }

    if (weightRange) {
      options.weightRange = parseFloat(weightRange);
    }

    const suggestions = await findMatchesForBoxer(req.params.boxerId, options);

    res.json({
      success: true,
      data: suggestions.map(suggestion => ({
        boxer: suggestion.boxer2,
        score: suggestion.score,
        weightClass: suggestion.weightClass,
        experienceLevel: suggestion.experienceLevel,
        weightDiff: Math.abs(suggestion.boxer1.weightKg - suggestion.boxer2.weightKg),
        ageDiff: Math.abs(suggestion.boxer1.age - suggestion.boxer2.age)
      }))
    });
  } catch (error) {
    console.error('Error fetching match suggestions:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid boxer ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match suggestions',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/matches/:id
 * @desc    Update match details
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const {
      scheduledDate,
      venue,
      status,
      officials
    } = req.body;

    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Update fields
    const updateFields = {};
    if (scheduledDate !== undefined) updateFields.scheduledDate = new Date(scheduledDate);
    if (venue !== undefined) updateFields.venue = venue;
    if (status !== undefined) updateFields.status = status;
    if (officials !== undefined) updateFields.officials = officials;

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('boxer1', 'name weightKg experienceLevel age location photoUrl')
      .populate('boxer2', 'name weightKg experienceLevel age location photoUrl')
      .populate('result.winner', 'name')
      .populate('result.loser', 'name')
      .select('-__v');

    res.json({
      success: true,
      message: 'Match updated successfully',
      data: updatedMatch
    });
  } catch (error) {
    console.error('Error updating match:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid match ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating match',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/matches/stats/overview
 * @desc    Get match statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Match.aggregate([
      {
        $group: {
          _id: null,
          totalMatches: { $sum: 1 },
          completedMatches: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          scheduledMatches: { $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] } },
          inProgressMatches: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } }
        }
      }
    ]);

    const resultMethods = await Match.aggregate([
      { $match: { 'result.method': { $exists: true } } },
      {
        $group: {
          _id: '$result.method',
          count: { $sum: 1 }
        }
      }
    ]);

    const experienceLevelStats = await Match.aggregate([
      {
        $group: {
          _id: '$experienceLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        resultMethods,
        experienceLevels: experienceLevelStats
      }
    });
  } catch (error) {
    console.error('Error fetching match stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match statistics',
      error: error.message
    });
  }
});

module.exports = router; 