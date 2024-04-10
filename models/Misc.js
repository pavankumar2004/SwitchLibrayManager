const mongoose = require('mongoose');

const miscSchema = new mongoose.Schema({
  titleId: { type: String, required: true, unique: true },
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
});

miscSchema.pre('save', function(next) {
  console.log(`Saving misc title: ${this.name}`);
  next();
});

miscSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('Error saving misc title due to duplicate titleId:', error.message);
    next(new Error('Duplicate titleId detected. Misc title could not be saved.'));
  } else if (error) {
    console.error('Error saving misc title:', error.message);
    next(error);
  } else {
    next();
  }
});

const Misc = mongoose.model('Misc', miscSchema);

module.exports = Misc;