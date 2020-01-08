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
    method: String,
    time: String,
    methodInfo: String,
    decisionInfo: String,
    round: String,
    matchOrder: Number,
    isFiveRounds: Boolean,
    isTitleFight: Boolean,
    date: Date,
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
    winnerIndex: Number,
    championIndex: Number,
    isTestData: { type: Boolean, required: true },
    isMockData: { type: Boolean, required: true}
});

module.exports = mongoose.model('Match', matchSchema);
