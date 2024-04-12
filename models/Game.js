const mongoose = require('mongoose');


const gameSchema = new mongoose.Schema({
  titleId: { type: String, required: true},
  name: { type: String, required: true },
  bannerUrl: { type: String, required: false },
  iconUrl: { type: String, required: false },
  key: { type: String, required: false },
  region: { type: String, required: false },
  intro: { type: String, required: false },
  description: { type: String, required: false },
  releaseDate: { type: String, required: false },
  version: { type: Number, required: false },
  size: { type: BigInt, required: false },
  screenshots: { type: [String], required: false },
});

gameSchema.pre('save', function(next) {
  // Ensure titleId ends with '000' for Games
  if (!this.titleId.endsWith('000')) {
    const error = new Error('Game titleId must end with \'000\'.');
    console.error('Error saving Game:', error.message);
    next(error);
  } else {
    console.log(`Saving game: ${this.name}`); 
    next();
  }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;