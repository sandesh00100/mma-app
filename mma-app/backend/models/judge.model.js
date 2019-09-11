const mongoose = require('mongoose');

// Extra hook that checks the data before saving it
// It's a plugin
const uniqueValidator = require('mongoose-unique-validator');

// unique is not a validator but allows mongoose to optimize database
const roundStatSchema = mongoose.Schema({
  takeDownAttempts: Number,
  takeDownDefense: Number,
  significantStrikes: Number,
  octagonControl: Number,
  damageRatio: Number,
  submissionAttempts: Number,
  score: {
    type: Number,
    min: 1,
    max: 10
  },
  roundNumber: {
    type: Number,
    min:1,
    max:5
  }
});

const judgeSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isTestData: { type: Boolean, required: true },
  matches: [
    {
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
        rounds: [roundStatSchema]
      }]
    }
  ]
});

judgeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', judgeSchema);
