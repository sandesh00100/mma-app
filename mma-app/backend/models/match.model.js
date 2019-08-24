const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    eventName: {
        type: String
    },
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
    fighters: [{
        fighter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fighter",
            required: true
        }
    }]
});

module.exports = mongoose.model('Match', matchSchema);