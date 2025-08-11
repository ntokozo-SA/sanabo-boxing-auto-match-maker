const mongoose = require('mongoose');

const boxerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Boxer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  weightKg: {
    type: Number,
    required: [true, 'Weight in kg is required'],
    min: [30, 'Weight must be at least 30kg'],
    max: [150, 'Weight cannot exceed 150kg']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['Novice', 'Schools', 'Junior', 'Youth', 'Elite'],
      message: 'Experience level must be one of: Novice, Schools, Junior, Youth, Elite'
    }
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [8, 'Age must be at least 8 years'],
    max: [40, 'Age cannot exceed 40 years']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  photoUrl: {
    type: String,
    default: null
  },
  boutsCount: {
    type: Number,
    required: [true, 'Number of bouts is required'],
    min: [0, 'Bouts count cannot be negative'],
    default: 0
  },
  // Fight Record
  record: {
    wins: {
      type: Number,
      default: 0,
      min: [0, 'Wins cannot be negative']
    },
    losses: {
      type: Number,
      default: 0,
      min: [0, 'Losses cannot be negative']
    },
    draws: {
      type: Number,
      default: 0,
      min: [0, 'Draws cannot be negative']
    },
    noContests: {
      type: Number,
      default: 0,
      min: [0, 'No contests cannot be negative']
    }
  },
  // Win Methods
  winMethods: {
    decisions: {
      type: Number,
      default: 0
    },
    tko: {
      type: Number,
      default: 0
    },
    ko: {
      type: Number,
      default: 0
    },
    retirement: {
      type: Number,
      default: 0
    },
    disqualification: {
      type: Number,
      default: 0
    },
    walkover: {
      type: Number,
      default: 0
    }
  },
  // Loss Methods
  lossMethods: {
    decisions: {
      type: Number,
      default: 0
    },
    tko: {
      type: Number,
      default: 0
    },
    ko: {
      type: Number,
      default: 0
    },
    retirement: {
      type: Number,
      default: 0
    },
    disqualification: {
      type: Number,
      default: 0
    },
    walkover: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
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

// Index for efficient matchmaking queries
boxerSchema.index({ experienceLevel: 1, weightKg: 1, age: 1, isActive: 1 });
boxerSchema.index({ location: 1 });

// Virtual for age category based on age
boxerSchema.virtual('ageCategory').get(function() {
  if (this.age < 12) return 'Schools';
  if (this.age < 15) return 'Junior';
  if (this.age < 18) return 'Youth';
  return 'Elite';
});

// Virtual for total fights
boxerSchema.virtual('totalFights').get(function() {
  return this.record.wins + this.record.losses + this.record.draws + this.record.noContests;
});

// Virtual for win percentage
boxerSchema.virtual('winPercentage').get(function() {
  const total = this.totalFights;
  if (total === 0) return 0;
  return Math.round((this.record.wins / total) * 100);
});

// Virtual for record string (e.g., "5-2-1")
boxerSchema.virtual('recordString').get(function() {
  return `${this.record.wins}-${this.record.losses}-${this.record.draws}`;
});

// Virtual for total wins by method
boxerSchema.virtual('totalWinsByMethod').get(function() {
  return Object.values(this.winMethods).reduce((sum, count) => sum + count, 0);
});

// Virtual for total losses by method
boxerSchema.virtual('totalLossesByMethod').get(function() {
  return Object.values(this.lossMethods).reduce((sum, count) => sum + count, 0);
});

// Method to check if boxer can be matched with another boxer
boxerSchema.methods.canMatchWith = function(otherBoxer) {
  // Check if both boxers are active
  if (!this.isActive || !otherBoxer.isActive) return false;
  
  // Check if it's the same boxer
  if (this._id.equals(otherBoxer._id)) return false;
  
  // Get matchmaking rules
  const rules = getMatchmakingRules();
  const levelRules = rules[this.experienceLevel];
  
  if (!levelRules) return false;
  
  // Check weight difference
  const weightDiff = Math.abs(this.weightKg - otherBoxer.weightKg);
  if (weightDiff > levelRules.maxWeightDiff) return false;
  
  // Check age gap
  const ageDiff = Math.abs(this.age - otherBoxer.age);
  if (ageDiff > levelRules.maxAgeGap) return false;
  
  // Check experience level compatibility
  const levelCompatibility = rules.levelCompatibility;
  const thisLevelIndex = levelCompatibility.indexOf(this.experienceLevel);
  const otherLevelIndex = levelCompatibility.indexOf(otherBoxer.experienceLevel);
  
  if (Math.abs(thisLevelIndex - otherLevelIndex) > 1) return false;
  
  // Special rule for Novice boxers
  if (this.experienceLevel === 'Novice' || otherBoxer.experienceLevel === 'Novice') {
    const boutsDiff = Math.abs(this.boutsCount - otherBoxer.boutsCount);
    if (boutsDiff > 5) return false;
  }
  
  return true;
};

// Method to update boxer record after a match
boxerSchema.methods.updateRecord = function(matchResult, isWinner) {
  if (isWinner) {
    this.record.wins++;
    // Update win method
    const method = matchResult.method.toLowerCase();
    if (this.winMethods.hasOwnProperty(method)) {
      this.winMethods[method]++;
    }
  } else {
    this.record.losses++;
    // Update loss method
    const method = matchResult.method.toLowerCase();
    if (this.lossMethods.hasOwnProperty(method)) {
      this.lossMethods[method]++;
    }
  }
  
  this.boutsCount++;
  return this.save();
};

// Method to get detailed record statistics
boxerSchema.methods.getRecordStats = function() {
  return {
    record: this.recordString,
    totalFights: this.totalFights,
    winPercentage: this.winPercentage,
    wins: this.record.wins,
    losses: this.record.losses,
    draws: this.record.draws,
    noContests: this.record.noContests,
    winMethods: this.winMethods,
    lossMethods: this.lossMethods
  };
};

// Helper function to get matchmaking rules
function getMatchmakingRules() {
  return {
    Novice: {
      maxWeightDiff: 2,
      maxAgeGap: 999 // No age limit for Novice
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
}

module.exports = mongoose.model('Boxer', boxerSchema); 