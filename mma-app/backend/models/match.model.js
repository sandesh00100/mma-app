const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    eventName: String,
    organization: {
        type: String,
        enum: ['UFC', 'Bellator'],
        default: 'UFC'
    },
    weightClass: {type:Number, required:true},
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
            required: () => {
                return fighters.length == 2;
            }
        }
    ],
    // TODO: Remove this if we use a test database for the tests
    isTestData: { type: Boolean, required: true }
});

module.exports = mongoose.model('Match', matchSchema);