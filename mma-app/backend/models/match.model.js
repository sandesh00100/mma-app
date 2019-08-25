const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    eventName: String,
    organization: {
        type: String,
        enum: ['UFC', 'Bellator'],
        default: 'UFC'
    },
    weightClass: Number,
    matchType: {
        type: String,
        enum: ['Main', 'Prelims', 'Early Prelims']
    },
    matchOrder: Number,
    isFiveRounds: Boolean,
    fighters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fighter",
            required: true
        }
    ],
    // TODO: Remove this if we use a test database for the tests
    isTestData: {type:Boolean, required: true}
});

module.exports = mongoose.model('Match', matchSchema);