const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    eventName: { type:String, required: true},
    organization: { type:String, required: true},
    fights: {
        main:[Match],
        prelims: [Match],
        earlyPrelims: [Match]
    }
});

module.exports = mongoose.model('Event', eventSchema);