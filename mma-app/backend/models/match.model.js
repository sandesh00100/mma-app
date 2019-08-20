const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    // Will only have two fighters at anytime
    fighters:[{
        fighter: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Fighter",
            required: true
        },
        takeDownAttempts: Number,
        takeDownDefense: Number,
        significantStrikes: Number,
        octagonControl: Number,
        damageRatio: Number,
        submissionAttempts: Number
    }]
});

module.exports = mongoose.model('Match', matchSchema);