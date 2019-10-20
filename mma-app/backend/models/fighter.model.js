const mongoose = require('mongoose');

const fighterSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive: { type: Boolean },
    imagePath: { type: String },
    rank:{type: Number},
    isChampion:{type: Boolean},
    record: {
        wins: Number,
        losses: Number,
        draws: Number,
        disqualifications: Number,
    },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    // TODO: Remove this if we use a test database for the tests
    isTestData: { type: Boolean, required: true},
    isMockData: { type: Boolean, required: true}
});

module.exports = mongoose.model('Fighter', fighterSchema);