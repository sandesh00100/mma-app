const mongoose = require('mongoose');

const fighterSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    weightClass: { type: Number, required: true },
    organization: { enum: ['UFC','Bellator']},
    isActive: { type: Boolean },
    imagePath: { type: String},
    record: {
        wins: Number,
        losses: Number,
        draws: Number,
        disqualifications: Number,
    }
});

const matchSchema = mongoose.Schema({
    // Will only have two fighters at anytime
    fighters:[{
        // fighter: fighterSchema,
        takeDownAttempts: Number,
        takeDownDefense: Number,
        significantStrikes: Number,
        octagonControl: Number,
        damageRatio: Number,
        submissionAttempts: Number
    }]
});

module.exports = mongoose.model('Match', matchSchema);