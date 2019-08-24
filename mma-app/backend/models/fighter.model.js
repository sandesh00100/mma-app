const mongoose = require('mongoose');

const fighterSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive: { type: Boolean },
    imagePath: { type: String},
    record: {
        wins: Number,
        losses: Number,
        draws: Number,
        disqualifications: Number,
    },
    matches:[{type:mongoose.Schema.Types.ObjectId, ref: "Match"}]
});

module.exports = mongoose.model('Fighter', fighterSchema);