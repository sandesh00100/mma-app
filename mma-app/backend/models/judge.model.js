const mongoose = require('mongoose');

// Extra hook that checks the data before saving it
// It's a plugin
// unique is not a validator but allows mongoose to optimize database
const uniqueValidator = require('mongoose-unique-validator');

const roundStatSchema = mongoose.Schema({
   name:String,
   value:Number,
   isShared:Boolean,
   min:Number,
   max:Number
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
        rounds: [{
          round:Number,
          stats:[roundStatSchema]
        }]
      }]
    }
  ],
  preferences:{
    stats:[roundStatSchema]
  }
});

judgeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Judge', judgeSchema);
