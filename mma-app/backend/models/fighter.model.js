const mongoose = require('mongoose');

const fighterSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    weightClass: { type: Number, required: true },
    organization: { type: String, required: true },
    isActive: { type: String },
    imagePath: { type: String},
    record: {
        wins: Number,
        losses: Number,
        draws: Number,
        disqualifications: Number,
    },
    matches:[Match]
});

module.exports = mongoose.model('Fighter', fighterSchema);