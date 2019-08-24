const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    fighters: [
        {
            fighter: { type: mongoose.Schema.Types.ObjectId, ref: "Fighter" },
            takeDownAttempts: Number,
            takeDownDefense: Number,
            significantStrikes: Number,
            octagonControl: Number,
            damageRatio: Number,
            submissionAttempts: Number
        }
    ],

});

const eventSchema = mongoose.Schema({
    eventName: { type: String, required: true },
    organization: { type: String, required: true },
    fights: {
        main: [matchSchema],
        prelims: [matchSchema],
        earlyPrelims: [matchSchema]
    }
});


module.exports = mongoose.model('Event', eventSchema);