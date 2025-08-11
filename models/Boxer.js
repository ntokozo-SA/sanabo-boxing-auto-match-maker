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