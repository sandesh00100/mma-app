const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    weightClass: { type: Number, required: true },
    organization: { enum: ['UFC', 'Bellator'] },
    isActive: { type: Boolean },
    imagePath: { type: String },
    record: {
        wins: Number,
        losses: Number,
        draws: Number,
        disqualifications: Number,
    }
});

const matchSchema = new mongoose.Schema({
    // Will only have two fighters at anytime
    fighters: [fighterSchema],
    takeDownAttempts: Number,
    takeDownDefense: Number,
    significantStrikes: Number,
    octagonControl: Number,
    damageRatio: Number,
    submissionAttempts: Number
});

const Match = mongoose.model('Match', matchSchema);
const Fighter = mongoose.model('Fighter', fighterSchema);

module.exports = {
    Match: Match,
    Fighter: Fighter
};
