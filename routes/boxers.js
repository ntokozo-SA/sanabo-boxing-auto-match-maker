const express = require('express');
const router = express.Router();
const Boxer = require('../models/Boxer');
const { demoDataAPI } = require('../utils/demoData');

/**
 * @route   GET /api/boxers
 * @desc    Get all boxers with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      experienceLevel,
      minAge,
      maxAge,
      minWeight,
      maxWeight,
      location,
      isActive,
      search
    } = req.query;

    // Use demo data API instead of MongoDB
    const filters = { 
      experienceLevel, 
      isActive, 
      search,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      minWeight: minWeight ? parseFloat(minWeight) : undefined,
      maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
      location
    };
    
    const allBoxers = demoDataAPI.getAllBoxers(filters);
    
    // Apply additional filters that demoDataAPI doesn't handle
    let filteredBoxers = allBoxers;
    
    if (minAge || maxAge) {
      filteredBoxers = filteredBoxers.filter(boxer => {
        if (minAge && boxer.age < minAge) return false;
        if (maxAge && boxer.age > maxAge) return false;
        return true;
      });
    }
    
    if (minWeight || maxWeight) {
      filteredBoxers = filteredBoxers.filter(boxer => {
        if (minWeight && boxer.weightKg < minWeight) return false;
        if (maxWeight && boxer.weightKg > maxWeight) return false;
        return true;
      });
    }
    
    if (location) {
      filteredBoxers = filteredBoxers.filter(boxer => 
        boxer.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedBoxers = filteredBoxers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedBoxers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredBoxers.length,
        pages: Math.ceil(filteredBoxers.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching boxers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boxers',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/boxers/:id
 * @desc    Get single boxer by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const boxer = demoDataAPI.getBoxerById(req.params.id);
    
    if (!boxer) {
      return res.status(404).json({
        success: false,
        message: 'Boxer not found'
      });
    }

    res.json({
      success: true,
      data: boxer
    });
  } catch (error) {
    console.error('Error fetching boxer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boxer',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/boxers
 * @desc    Create new boxer
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      weightKg,
      experienceLevel,
      age,
      location,
      contactInfo,
      photoUrl,
      boutsCount = 0
    } = req.body;

    // Validate required fields
    if (!name || !weightKg || !experienceLevel || !age || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, weightKg, experienceLevel, age, location'
      });
    }

    // Validate experience level
    const validLevels = ['Novice', 'Schools', 'Junior', 'Youth', 'Elite'];
    if (!validLevels.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid experience level. Must be one of: Novice, Schools, Junior, Youth, Elite'
      });
    }

    // Validate weight range
    if (weightKg < 30 || weightKg > 150) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be between 30kg and 150kg'
      });
    }

    // Validate age range
    if (age < 8 || age > 40) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 8 and 40 years'
      });
    }

    // Validate bouts count
    if (boutsCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Bouts count cannot be negative'
      });
    }

    // Check if boxer with same name already exists
    const existingBoxer = await Boxer.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingBoxer) {
      return res.status(400).json({
        success: false,
        message: 'A boxer with this name already exists'
      });
    }

    const boxer = new Boxer({
      name,
      weightKg: parseFloat(weightKg),
      experienceLevel,
      age: parseInt(age),
      location,
      contactInfo,
      photoUrl,
      boutsCount: parseInt(boutsCount)
    });

    await boxer.save();

    res.status(201).json({
      success: true,
      message: 'Boxer created successfully',
      data: boxer
    });
  } catch (error) {
    console.error('Error creating boxer:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating boxer',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/boxers/:id
 * @desc    Update boxer
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      weightKg,
      experienceLevel,
      age,
      location,
      contactInfo,
      photoUrl,
      boutsCount,
      isActive
    } = req.body;

    const boxer = await Boxer.findById(req.params.id);
    
    if (!boxer) {
      return res.status(404).json({
        success: false,
        message: 'Boxer not found'
      });
    }

    // Validate experience level if provided
    if (experienceLevel) {
      const validLevels = ['Novice', 'Schools', 'Junior', 'Youth', 'Elite'];
      if (!validLevels.includes(experienceLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid experience level. Must be one of: Novice, Schools, Junior, Youth, Elite'
        });
      }
    }

    // Validate weight range if provided
    if (weightKg !== undefined && (weightKg < 30 || weightKg > 150)) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be between 30kg and 150kg'
      });
    }

    // Validate age range if provided
    if (age !== undefined && (age < 8 || age > 40)) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 8 and 40 years'
      });
    }

    // Check for name conflict if name is being changed
    if (name && name !== boxer.name) {
      const existingBoxer = await Boxer.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingBoxer) {
        return res.status(400).json({
          success: false,
          message: 'A boxer with this name already exists'
        });
      }
    }

    // Update fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (weightKg !== undefined) updateFields.weightKg = parseFloat(weightKg);
    if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;
    if (age !== undefined) updateFields.age = parseInt(age);
    if (location !== undefined) updateFields.location = location;
    if (contactInfo !== undefined) updateFields.contactInfo = contactInfo;
    if (photoUrl !== undefined) updateFields.photoUrl = photoUrl;
    if (boutsCount !== undefined) updateFields.boutsCount = parseInt(boutsCount);
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updatedBoxer = await Boxer.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({
      success: true,
      message: 'Boxer updated successfully',
      data: updatedBoxer
    });
  } catch (error) {
    console.error('Error updating boxer:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid boxer ID format'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating boxer',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/boxers/:id
 * @desc    Delete boxer (soft delete by setting isActive to false)
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const boxer = await Boxer.findById(req.params.id);
    
    if (!boxer) {
      return res.status(404).json({
        success: false,
        message: 'Boxer not found'
      });
    }

    // Soft delete by setting isActive to false
    boxer.isActive = false;
    await boxer.save();

    res.json({
      success: true,
      message: 'Boxer deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating boxer:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid boxer ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating boxer',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/boxers/stats/overview
 * @desc    Get boxer statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Boxer.aggregate([
      {
        $group: {
          _id: null,
          totalBoxers: { $sum: 1 },
          activeBoxers: { $sum: { $cond: ['$isActive', 1, 0] } },
          avgAge: { $avg: '$age' },
          avgWeight: { $avg: '$weightKg' },
          avgBouts: { $avg: '$boutsCount' }
        }
      }
    ]);

    const experienceLevelStats = await Boxer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$experienceLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    const weightClassStats = await Boxer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$weightKg', 48] }, then: 'Light Flyweight' },
                { case: { $lt: ['$weightKg', 51] }, then: 'Flyweight' },
                { case: { $lt: ['$weightKg', 54] }, then: 'Bantamweight' },
                { case: { $lt: ['$weightKg', 57] }, then: 'Featherweight' },
                { case: { $lt: ['$weightKg', 60] }, then: 'Lightweight' },
                { case: { $lt: ['$weightKg', 63.5] }, then: 'Light Welterweight' },
                { case: { $lt: ['$weightKg', 67] }, then: 'Welterweight' },
                { case: { $lt: ['$weightKg', 71] }, then: 'Light Middleweight' },
                { case: { $lt: ['$weightKg', 75] }, then: 'Middleweight' },
                { case: { $lt: ['$weightKg', 81] }, then: 'Light Heavyweight' },
                { case: { $lt: ['$weightKg', 91] }, then: 'Heavyweight' }
              ],
              default: 'Super Heavyweight'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        experienceLevels: experienceLevelStats,
        weightClasses: weightClassStats
      }
    });
  } catch (error) {
    console.error('Error fetching boxer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boxer statistics',
      error: error.message
    });
  }
});

module.exports = router; 