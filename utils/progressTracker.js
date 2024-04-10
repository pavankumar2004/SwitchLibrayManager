let progress = {
  games: 0,
};

const setProgress = (percentage, category) => {
    progress['games'] = Math.round(percentage);
    console.log(`Database update progress for ${category}: ${progress['games']}%`);
};

const getProgress = (category) => {
    return progress['games'];
};

const resetProgress = (category) => {
  if (progress.hasOwnProperty(category)) {
    progress[category] = 0;
    console.log(`Database update progress for ${category} reset to 0%`);
  } else {
    console.error(`Category ${category} does not exist in progress tracker.`);
  }
};

module.exports = {
  setProgress,
  getProgress,
  resetProgress,
};