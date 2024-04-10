const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  titleId: { type: String, required: true, unique: true },
  name: { type: String, required: false, unique: false },
  bannerUrl: { type: String, required: false, unique: false },
  iconUrl: { type: String, required: false, unique: false },
  key: { type: String, required: false, unique: false },
  region: { type: String, required: false, unique: false },
  intro: { type: String, required: false, unique: false },
  description: { type: String, required: false, unique: false },
  releaseDate: { type: String, required: false, unique: false },
  version: { type: Number, required: false },
  size: { type: BigInt, required: false },  
});

updateSchema.pre('save', async function(next) {
  // Ensure titleId ends with '800'
  if (!this.titleId.endsWith('800')) {
    const error = new Error('Update titleId must end with 800');
    console.error('Error saving update:', error.message);
    next(error);
  } else {
    console.log(`Saving update with titleId: ${this.titleId}`);
    next();
  }
});

const Update = mongoose.model('Update', updateSchema);

module.exports = Update;