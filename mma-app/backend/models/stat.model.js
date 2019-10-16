const mongoose = require('mongoose');

const roundStatSchema = mongoose.Schema({
    name:String,
    value:Number,
    isShared:Boolean,
    min:Number,
    max:Number
 });

 module.exports = roundStatSchema;