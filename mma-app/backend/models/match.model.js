const mongoose = require('mongoose');

const requiredLength = (fighters) => {
    return fighters.length == 2;
};

const matchSchema = mongoose.Schema({
    eventName: String,
    organization: {
        type: String,
        enum: ['UFC', 'Bellator'],
        default: 'UFC'
    },
    weightClass: { type: Number, required: true },
    matchType: {
        type: String,
        enum: ['Main', 'Prelims', 'Early Prelims']
    },
    matchOrder: Number,
    isFiveRounds: Boolean,
    fighters: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Fighter",
            }
        ],
        validate: [requiredLength, 'Match needs to have 2 fighters']
    },
    // TODO: Remove this if we use a test database for the tests
    isTestData: { type: Boolean, required: true }
});

module.exports = mongoose.model('Match', matchSchema);