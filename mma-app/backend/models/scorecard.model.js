const mongoose = require('mongoose');
const roundStatSchema = require('./stat.model');

const scoreCardSchema = mongoose.Schema({
    judge:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Judge",
      required: true
    },
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
    }],
    date: Date
  });

  module.exports = mongoose.model('ScoreCard', scoreCardSchema);