const mongoose = require('mongoose');
const roundStatSchema = require('./stat.model');

const scoreCardSchema = mongoose.Schema({
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true
    },
    roundsScored: [{
      fighter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fighter"
      },
      rounds: [{
        round:Number,
        stats:[roundStatSchema]
      }]
    }]
  });

  module.exports = mongoose.model('ScoreCard', scoreCardSchema);