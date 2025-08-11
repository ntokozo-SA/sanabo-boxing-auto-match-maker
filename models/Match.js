const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  boxer1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boxer',
    required: [true, 'Boxer 1 is required']
  },
  boxer2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boxer',
    required: [true, 'Boxer 2 is required']
  },
  matchDate: {
    type: Date,
    required: [true, 'Match date is required'],
    default: Date.now
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  venue: {
    type: String,
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  weightClass: {
    type: String,
    required: [true, 'Weight class is required'],
    enum: {
      values: ['Light Flyweight', 'Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Light Welterweight', 'Welterweight', 'Light Middleweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight', 'Super Heavyweight'],
      message: 'Invalid weight class'
    }
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['Novice', 'Schools', 'Junior', 'Youth', 'Elite'],
      message: 'Experience level must be one of: Novice, Schools, Junior, Youth, Elite'
    }
  },
  rounds: {
    type: Number,
    required: [true, 'Number of rounds is required'],
    min: [1, 'Minimum 1 round'],
    max: [4, 'Maximum 4 rounds'],
    default: 3
  },
  roundDuration: {
    type: Number,
    required: [true, 'Round duration is required'],
    min: [1, 'Minimum 1 minute'],
    max: [3, 'Maximum 3 minutes'],
    default: 2
  },
  qrCodeUrl: {
    type: String,
    required: [true, 'QR code URL is required']
  },
  matchId: {
    type: String,
    unique: true,
    required: [true, 'Match ID is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      message: 'Status must be one of: Scheduled, In Progress, Completed, Cancelled'
    },
    default: 'Scheduled'
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boxer'
    },
    loser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boxer'
    },
    method: {
      type: String,
      enum: {
        values: ['Decision', 'TKO', 'KO', 'Retirement', 'Disqualification', 'Walkover'],
        message: 'Invalid result method'
      }
    },
    rounds: {
      type: Number,
      min: [1, 'Minimum 1 round'],
      max: [4, 'Maximum 4 rounds']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  officials: {
    referee: {
      name: String,
      license: String
    },
    judges: [{
      name: String,
      license: String
    }],
    timekeeper: {
      name: String,
      license: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
matchSchema.index({ status: 1, scheduledDate: 1 });
matchSchema.index({ boxer1: 1, boxer2: 1 });
matchSchema.index({ matchId: 1 });
matchSchema.index({ 'result.winner': 1, 'result.loser': 1 });

// Virtual for determining if match has a result
matchSchema.virtual('hasResult').get(function() {
  return this.result && this.result.winner && this.result.loser;
});

// Virtual for match duration
matchSchema.virtual('duration').get(function() {
  if (this.result && this.result.rounds) {
    return `${this.result.rounds} rounds`;
  }
  return `${this.rounds} rounds scheduled`;
});

// Method to record match result
matchSchema.methods.recordResult = function(winnerId, loserId, method, rounds, notes) {
  this.result = {
    winner: winnerId,
    loser: loserId,
    method: method,
    rounds: rounds,
    notes: notes,
    recordedAt: new Date()
  };
  this.status = 'Completed';
  return this.save();
};

// Method to get match summary
matchSchema.methods.getSummary = function() {
  return {
    matchId: this.matchId,
    boxer1: this.boxer1,
    boxer2: this.boxer2,
    scheduledDate: this.scheduledDate,
    status: this.status,
    hasResult: this.hasResult,
    winner: this.result?.winner,
    loser: this.result?.loser,
    method: this.result?.method
  };
};

// Pre-save middleware to generate match ID if not provided
matchSchema.pre('save', function(next) {
  if (!this.matchId) {
    this.matchId = `MATCH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema); 