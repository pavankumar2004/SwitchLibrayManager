const express = require('express');
const Game = require('../models/Game');
const Update = require('../models/Update');
const DLC = require('../models/DLC');
const Misc = require('../models/Misc');
const updateDatabase = require('../utils/updateDatabase'); // Import the updateDatabase function
const progressTracker = require('../utils/progressTracker'); // Import the progressTracker module
const router = express.Router();

// Route to display game titles with pagination
router.get('/games', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const games = await Game.find({}).skip(skip).limit(limit);
    const totalGames = await Game.countDocuments();
    const totalPages = Math.ceil(totalGames / limit);
    res.render('games', { games, totalPages, currentPage: page });
  } catch (error) {
    console.error(`Failed to fetch games: ${error.message}`, error.stack);
    res.status(500).send('Failed to load games. Please try again later.');
  }
});

// Route to display updates with pagination
router.get('/updates', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const updates = await Update.find({}).skip(skip).limit(limit);
    const totalUpdates = await Update.countDocuments();
    const totalPages = Math.ceil(totalUpdates / limit);
    res.render('updates', { updates, totalPages, currentPage: page });
  } catch (error) {
    console.error(`Failed to fetch updates: ${error.message}`, error.stack);
    res.status(500).send('Failed to load updates. Please try again later.');
  }
});

// Route to display DLCs with pagination
router.get('/dlc', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const dlcs = await DLC.find({}).skip(skip).limit(limit);
    const totalDLCs = await DLC.countDocuments();
    const totalPages = Math.ceil(totalDLCs / limit);
    res.render('dlc', { dlcs, totalPages, currentPage: page });
  } catch (error) {
    console.error(`Failed to fetch DLCs: ${error.message}`, error.stack);
    res.status(500).send('Failed to load DLCs. Please try again later.');
  }
});

// Route to display Miscs with pagination
router.get('/misc', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  try {
    const miscs = await Misc.find({}).skip(skip).limit(limit);
    const totalMiscs = await Misc.countDocuments();
    const totalPages = Math.ceil(totalMiscs / limit);
    res.render('misc', { miscs, totalPages, currentPage: page });
  } catch (error) {
    console.error(`Failed to fetch Miscs: ${error.message}`, error.stack);
    res.status(500).send('Failed to load Miscs. Please try again later.');
  }
});

// Route to manually trigger the database update process
router.post('/update-titles', async (req, res) => {
  try {
    // Drop existing collections before updating
    await Game.deleteMany({});
    await Update.deleteMany({});
    await DLC.deleteMany({});
    await Misc.deleteMany({});
    console.log("Existing collections dropped successfully.");

    // Reset progress before starting the update
    progressTracker.resetProgress('games');

    // Trigger database update
    await updateDatabase();
    console.log("Database update process triggered successfully.");
    res.json({ message: 'Database update triggered successfully' });
  } catch (error) {
    console.error('Failed to update database:', error);
    console.error(error.stack);
    res.status(500).send('Failed to update database');
  }
});

// Route to get the current progress of the database update
router.get('/update-progress', (req, res) => {
  try {
    const progress = {
      games: progressTracker.getProgress('games'),
    };
    res.json(progress);
  } catch (error) {
    console.error('Failed to get update progress:', error.message, error.stack);
    res.status(500).send('Failed to get update progress');
  }
});

// New route to display related game, updates, DLC, and misc items
router.get('/related/:titleId', async (req, res) => {
  const titleIdPrefix = req.params.titleId;
  const regex = new RegExp(`^${titleIdPrefix}`);
  try {
    const game = await Game.findOne({ titleId: regex });
    const updates = await Update.find({ titleId: regex });
    const dlcs = await DLC.find({ titleId: regex });
    const miscs = await Misc.find({ titleId: regex });
    res.render('related', { game, updates, dlcs, miscs });
  } catch (error) {
    console.error('Failed to fetch related items:', error.message, error.stack);
    res.status(500).send('Failed to load related items. Please try again later.');
  }
});

module.exports = router;