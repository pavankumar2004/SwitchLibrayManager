const axios = require('axios');
const mongoose = require('mongoose');
const Game = require('../models/Game');
const Update = require('../models/Update');
const DLC = require('../models/DLC');
const Misc = require('../models/Misc'); // Added for handling titles with invalid IDs
const progressTracker = require('./progressTracker'); // Import progressTracker module

async function updateDatabase() {
  let titlesCount = 0; // Initialize titlesCount to track the number of titles processed
  let updateCount = 0;
  try {
    const response = await axios.get('https://tinfoil.media/repo/db/titles.json');
    const titles = response.data;

    if (!titles || Object.keys(titles).length === 0) {
      console.log('No titles found in the fetched data.');
      return { titlesCount }; // Return titlesCount as part of an object
    }

    const titlesArray = Array.isArray(titles) ? titles : Object.values(titles);
    titlesCount = titlesArray.length; // Update titlesCount with the actual number of titles
    console.log('JSON Records : ' + titlesCount);

    // Reset progress for each category
    progressTracker.setProgress( 0, 'games' );
    const gameOps = [];
    const updateOps = [];
    const dlcOps = [];
    const miscOps = []; // Added for handling titles with invalid IDs


    titlesArray.forEach((title, index) => {
      if (title.id && title.id.endsWith('000')) {
        gameOps.push({
          updateOne: {
            filter: { titleId: title.id },
            update: { $set: title },
            upsert: true
          }
        });
      } else if (title.id && title.id.endsWith('800')) {
        updateOps.push({
          updateOne: {
            filter: { titleId: title.id },
            update: { $set: title },
            upsert: true
          }
        });
      } else if (title.id && parseInt(title.id.slice(-3)) >= 1 && !title.id.endsWith('000') && !title.id.endsWith('800')) {
        dlcOps.push({
          updateOne: {
            filter: { titleId: title.id },
            update: { $set: title },
            upsert: true
          }
        });
      } else {
        // Handling titles with invalid IDs by adding them to the Misc collection
        miscOps.push({
          updateOne: {
            filter: { titleId: title.id },
            update: { $set: title },
            upsert: true
          }
        });
      }
;
    });

    // Execute bulk operations and update progress for each category
    if (gameOps.length > 0) {
      await Game.bulkWrite(gameOps);
    }
    updateCount = updateCount + gameOps.length;
    progressTracker.setProgress( (updateCount / titlesCount) * 100, 'games' );
    if (updateOps.length > 0) {
      await Update.bulkWrite(updateOps);
    }
    updateCount = updateCount + updateOps.length;
    progressTracker.setProgress( (updateCount/ titlesCount) * 100, 'updates' );
    if (dlcOps.length > 0) {
      await DLC.bulkWrite(dlcOps);
    }
    updateCount = updateCount + dlcOps.length;
    progressTracker.setProgress( (updateCount / titlesCount) * 100, 'dlc' );
    if (miscOps.length > 0) {
      await Misc.bulkWrite(miscOps);
    }
    updateCount = updateCount + miscOps.length;
    progressTracker.setProgress( (updateCount / titlesCount) * 100, 'misc' );

    console.log(`Games updated/inserted: ${gameOps.length}`);
    console.log(`Updates updated/inserted: ${updateOps.length}`);
    console.log(`DLCs updated/inserted: ${dlcOps.length}`);
    console.log(`Misc titles updated/inserted: ${miscOps.length}`); // Logging the number of Misc titles processed
  } catch (error) {
    console.error('Failed to update database with new titles:', error.message);
    console.error(error.stack);
  }
  return { titlesCount }; // Return titlesCount as part of an object at the end of the function
}

module.exports = updateDatabase;