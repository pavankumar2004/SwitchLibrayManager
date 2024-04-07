const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
  titleId: { type: String, required: true, unique: true },
  name: { type: String, required: false, unique: false },
  bannerUrl: { type: String, required: false, unique: false },
  iconUrl: { type: String, required: false, unique: false },
  key: { type: String, required: false, unique: false },
  region: { type: String, required: false, unique: false },
  intro: { type: String, required: false, unique: false },
  description: { type: String, required: false, unique: false },
  releaseDate: { type: String, required: false, unique: false },
});

const GameTitle = mongoose.model('GameTitle', titleSchema);

module.exports = GameTitle;