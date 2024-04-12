const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionsSchema = new Schema({
    key: String,
    dates: {
        type: Map,
        of: String
    }
});

const Versions = mongoose.model('Versions', VersionsSchema);

module.exports = Versions;