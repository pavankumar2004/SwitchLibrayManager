const mongoose = require('mongoose');

const dlcSchema = new mongoose.Schema({
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

dlcSchema.pre('save', function(next) {
  // Ensure titleId ends with '001' or higher for DLC
  const titleIdSuffix = this.titleId.slice(-3);
  if (!/^\d{3}$/.test(titleIdSuffix) || parseInt(titleIdSuffix, 10) < 1) {
    const error = new Error('DLC titleId must end with a number 001 or higher.');
    console.error('Error saving DLC:', error.message);
    next(error);
  } else {
    console.log(`Saving DLC: ${this.name}`);
    next();
  }
});

const DLC = mongoose.model('DLC', dlcSchema);

module.exports = DLC;