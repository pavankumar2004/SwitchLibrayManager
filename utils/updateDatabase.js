// ./utils/updateDatabase.js
const axios = require('axios');
const GameTitle = require('../models/GameTitle');

async function updateDatabase() {
  let titlesCount = 0; // Initialize titlesCount to track the number of titles processed
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

    const bulkOps = titlesArray.map(title => {
      return {
        updateOne: {
          filter: { titleId: title.id },
          update: { $set: title },
          upsert: true
        }
      };
    });

    const result = await GameTitle.bulkWrite(bulkOps);
    console.log(`${result.nModified} titles were updated. Total upserted: ${result.nUpserted}.`);
  } catch (error) {
    console.error('Failed to update database with new titles:', error.message);
    console.error(error.stack);
  }
  return { titlesCount }; // Return titlesCount as part of an object at the end of the function
}

module.exports = updateDatabase;