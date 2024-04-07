const express = require('express');
const GameTitle = require('../models/GameTitle');
const router = express.Router();

// Route to display game titles released in a specific year with pagination
router.get('/games/year/:year', async (req, res) => {
  try {
    const year = req.params.year;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Adjusted limit to 50 titles per page as per user feedback
    const skip = (page - 1) * limit;
    const totalTitles = await GameTitle.countDocuments({
      releaseDate: { $regex: new RegExp(year) }
    });
    const totalPages = Math.ceil(totalTitles / limit);
    const maxPages = 30;

    if (page > totalPages || page < 1) {
      return res.status(404).send('Page not found.');
    }

    const gameTitles = await GameTitle.find({
      releaseDate: { $regex: new RegExp(year) }
    })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit);

    if (gameTitles.length === 0) {
      console.log(`No game titles found for the year ${year}.`);
      return res.status(404).send(`No game titles found for the year ${year}. Please update the database with game titles or choose a different year.`);
    }

    const viewName = `games${year}`; // Dynamically select the view based on the year
    res.render(viewName, {
      year,
      gameTitles,
      currentPage: page,
      totalPages: totalPages > maxPages ? maxPages : totalPages,
      totalTitles
  });
  } catch (error) {
    console.error(`Failed to fetch game titles for the year ${req.params.year}:`, error.message);
    console.error(error.stack);
    res.status(500).send('Failed to load game titles. Please try again later.');
  }
});

// Routes to display game titles released in a specific year and region with pagination
const regions = ['US', 'GB', 'JP']; // Define the regions
regions.forEach(region => {
  router.get(`/games/year/2024/${region.toLowerCase()}`, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;
      const totalTitles = await GameTitle.countDocuments({
        releaseDate: { $regex: new RegExp('2024') },
        region: region
      });
      const totalPages = Math.ceil(totalTitles / limit);
      const maxPages = 30;

      if (page > totalPages || page < 1) {
        return res.status(404).send('Page not found.');
      }

      const gameTitles = await GameTitle.find({
        releaseDate: { $regex: new RegExp('2024') },
        region: region
      })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit);

      if (gameTitles.length === 0) {
        console.log(`No game titles found for the year 2024 in region ${region}.`);
        return res.status(404).send(`No game titles found for the year 2024 in region ${region}. Please update the database with game titles or choose a different region.`);
      }

      // Correcting the view rendering to match the case of the view files
      const viewName = `games2024${region.toUpperCase()}`; // Ensure the region is uppercase to match the view file naming convention
      res.render(viewName, {
        region,
        gameTitles,
        currentPage: page,
        totalPages: totalPages > maxPages ? maxPages : totalPages,
        totalTitles
      });
    } catch (error) {
      console.error(`Failed to fetch game titles for the year 2024 in region ${region}:`, error.message);
      console.error(error.stack);
      res.status(500).send('Failed to load game titles. Please try again later.');
    }
  });
});

module.exports = router;