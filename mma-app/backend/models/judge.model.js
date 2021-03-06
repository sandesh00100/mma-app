const mongoose = require('mongoose');

// Extra hook that checks the data before saving it
// It's a plugin
// unique is not a validator but allows mongoose to optimize database
const uniqueValidator = require('mongoose-unique-validator');
const roundStatSchema = require('./stat.model');

const judgeSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    stats: [roundStatSchema]
  },
  isMockData: { type: Boolean, required: true},
  isTestData: { type: Boolean, required: true}
});

judgeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Judge', judgeSchema);
