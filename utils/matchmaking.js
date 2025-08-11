const Boxer = require('../models/Boxer');
const Match = require('../models/Match');
const QRCode = require('qrcode');

/**
 * IBA Amateur Boxing Matchmaking Rules
 */
const MATCHMAKING_RULES = {
  Novice: {
    maxWeightDiff: 2,
    maxAgeGap: 999, // No age limit for Novice
    maxBoutsDiff: 5
  },
  Schools: {
    maxWeightDiff: 2,
    maxAgeGap: 1
  },
  Junior: {
    maxWeightDiff: 3,
    maxAgeGap: 2
  },
  Youth: {
    maxWeightDiff: 4,
    maxAgeGap: 2
  },
  Elite: {
    maxWeightDiff: 5,
    maxAgeGap: 999 // No age limit for Elite
  },
  levelCompatibility: ['Novice', 'Schools', 'Junior', 'Youth', 'Elite']
};

/**
 * Weight class definitions based on IBA rules
 */
const WEIGHT_CLASSES = {
  'Light Flyweight': { min: 46, max: 48 },
  'Flyweight': { min: 48, max: 51 },
  'Bantamweight': { min: 51, max: 54 },
  'Featherweight': { min: 54, max: 57 },
  'Lightweight': { min: 57, max: 60 },
  'Light Welterweight': { min: 60, max: 63.5 },
  'Welterweight': { min: 63.5, max: 67 },
  'Light Middleweight': { min: 67, max: 71 },
  'Middleweight': { min: 71, max: 75 },
  'Light Heavyweight': { min: 75, max: 81 },
  'Heavyweight': { min: 81, max: 91 },
  'Super Heavyweight': { min: 91, max: 999 }
};

/**
 * Determine weight class based on weight
 */
function getWeightClass(weightKg) {
  for (const [className, range] of Object.entries(WEIGHT_CLASSES)) {
    if (weightKg >= range.min && weightKg < range.max) {
      return className;
    }
  }
  return 'Super Heavyweight';
}

/**
 * Check if two boxers can be matched according to IBA rules
 */
function canMatchBoxers(boxer1, boxer2) {
  // Basic checks
  if (!boxer1.isActive || !boxer2.isActive) return false;
  if (boxer1._id.equals(boxer2._id)) return false;

  // Get the more restrictive experience level rules
  const level1 = boxer1.experienceLevel;
  const level2 = boxer2.experienceLevel;
  const rules1 = MATCHMAKING_RULES[level1];
  const rules2 = MATCHMAKING_RULES[level2];

  // Check weight difference
  const weightDiff = Math.abs(boxer1.weightKg - boxer2.weightKg);
  const maxWeightDiff = Math.min(rules1.maxWeightDiff, rules2.maxWeightDiff);
  if (weightDiff > maxWeightDiff) return false;

  // Check age gap
  const ageDiff = Math.abs(boxer1.age - boxer2.age);
  const maxAgeGap = Math.min(rules1.maxAgeGap, rules2.maxAgeGap);
  if (ageDiff > maxAgeGap) return false;

  // Check experience level compatibility
  const levelCompatibility = MATCHMAKING_RULES.levelCompatibility;
  const level1Index = levelCompatibility.indexOf(level1);
  const level2Index = levelCompatibility.indexOf(level2);
  if (Math.abs(level1Index - level2Index) > 1) return false;

  // Special rule for Novice boxers
  if (level1 === 'Novice' || level2 === 'Novice') {
    const boutsDiff = Math.abs(boxer1.boutsCount - boxer2.boutsCount);
    if (boutsDiff > MATCHMAKING_RULES.Novice.maxBoutsDiff) return false;
  }

  return true;
}

/**
 * Generate match compatibility score (higher is better)
 */
function getMatchScore(boxer1, boxer2) {
  let score = 100;

  // Weight difference penalty
  const weightDiff = Math.abs(boxer1.weightKg - boxer2.weightKg);
  score -= weightDiff * 5;

  // Age difference penalty
  const ageDiff = Math.abs(boxer1.age - boxer2.age);
  score -= ageDiff * 3;

  // Experience level difference penalty
  const levelCompatibility = MATCHMAKING_RULES.levelCompatibility;
  const level1Index = levelCompatibility.indexOf(boxer1.experienceLevel);
  const level2Index = levelCompatibility.indexOf(boxer2.experienceLevel);
  const levelDiff = Math.abs(level1Index - level2Index);
  score -= levelDiff * 10;

  // Bouts count difference penalty for Novice
  if (boxer1.experienceLevel === 'Novice' || boxer2.experienceLevel === 'Novice') {
    const boutsDiff = Math.abs(boxer1.boutsCount - boxer2.boutsCount);
    score -= boutsDiff * 2;
  }

  return Math.max(0, score);
}

/**
 * Find all possible matches for a given boxer
 */
async function findMatchesForBoxer(boxerId, options = {}) {
  const {
    limit = 10,
    minScore = 50,
    excludeBoxerIds = [],
    experienceLevels = null,
    weightRange = null
  } = options;

  const boxer = await Boxer.findById(boxerId);
  if (!boxer || !boxer.isActive) {
    throw new Error('Boxer not found or inactive');
  }

  // Build query for potential opponents
  let query = {
    _id: { $ne: boxerId },
    isActive: true
  };

  if (excludeBoxerIds.length > 0) {
    query._id.$nin = excludeBoxerIds;
  }

  if (experienceLevels) {
    query.experienceLevel = { $in: experienceLevels };
  }

  if (weightRange) {
    query.weightKg = {
      $gte: boxer.weightKg - weightRange,
      $lte: boxer.weightKg + weightRange
    };
  }

  const potentialOpponents = await Boxer.find(query);
  const matches = [];

  for (const opponent of potentialOpponents) {
    if (canMatchBoxers(boxer, opponent)) {
      const score = getMatchScore(boxer, opponent);
      if (score >= minScore) {
        matches.push({
          boxer1: boxer,
          boxer2: opponent,
          score,
          weightClass: getWeightClass(Math.max(boxer.weightKg, opponent.weightKg)),
          experienceLevel: boxer.experienceLevel === opponent.experienceLevel 
            ? boxer.experienceLevel 
            : `${boxer.experienceLevel}/${opponent.experienceLevel}`
        });
      }
    }
  }

  // Sort by score (highest first) and limit results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Generate matches for all active boxers
 */
async function generateAllMatches(options = {}) {
  const {
    maxMatchesPerBoxer = 3,
    minScore = 60,
    scheduledDate = null,
    venue = null
  } = options;

  const activeBoxers = await Boxer.find({ isActive: true });
  const generatedMatches = [];
  const usedBoxers = new Set();

  for (const boxer of activeBoxers) {
    if (usedBoxers.has(boxer._id.toString())) continue;

    const matches = await findMatchesForBoxer(boxer._id, {
      limit: maxMatchesPerBoxer,
      minScore,
      excludeBoxerIds: Array.from(usedBoxers)
    });

    for (const match of matches) {
      if (!usedBoxers.has(match.boxer2._id.toString())) {
        // Generate QR code URL
        const matchId = `MATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const qrCodeUrl = await generateQRCode(matchId);

        // Create match record
        const matchRecord = new Match({
          boxer1: match.boxer1._id,
          boxer2: match.boxer2._id,
          scheduledDate: scheduledDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
          venue: venue || 'TBD',
          weightClass: match.weightClass,
          experienceLevel: match.experienceLevel,
          rounds: getRoundsForLevel(match.experienceLevel),
          roundDuration: getRoundDurationForLevel(match.experienceLevel),
          qrCodeUrl,
          matchId
        });

        generatedMatches.push(matchRecord);
        usedBoxers.add(match.boxer1._id.toString());
        usedBoxers.add(match.boxer2._id.toString());
      }
    }
  }

  return generatedMatches;
}

/**
 * Get number of rounds based on experience level
 */
function getRoundsForLevel(experienceLevel) {
  const roundConfig = {
    Novice: 2,
    Schools: 2,
    Junior: 3,
    Youth: 3,
    Elite: 4
  };
  return roundConfig[experienceLevel] || 3;
}

/**
 * Get round duration based on experience level
 */
function getRoundDurationForLevel(experienceLevel) {
  const durationConfig = {
    Novice: 1,
    Schools: 1,
    Junior: 2,
    Youth: 2,
    Elite: 3
  };
  return durationConfig[experienceLevel] || 2;
}

/**
 * Generate QR code for match
 */
async function generateQRCode(matchId) {
  try {
    const matchUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/match/${matchId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(matchUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Validate match result
 */
function validateMatchResult(match, winnerId, loserId) {
  if (!match.boxer1.equals(winnerId) && !match.boxer2.equals(winnerId)) {
    throw new Error('Winner must be one of the match participants');
  }
  if (!match.boxer1.equals(loserId) && !match.boxer2.equals(loserId)) {
    throw new Error('Loser must be one of the match participants');
  }
  if (winnerId.equals(loserId)) {
    throw new Error('Winner and loser cannot be the same boxer');
  }
  return true;
}

module.exports = {
  MATCHMAKING_RULES,
  WEIGHT_CLASSES,
  canMatchBoxers,
  getMatchScore,
  findMatchesForBoxer,
  generateAllMatches,
  getWeightClass,
  getRoundsForLevel,
  getRoundDurationForLevel,
  generateQRCode,
  validateMatchResult
}; 