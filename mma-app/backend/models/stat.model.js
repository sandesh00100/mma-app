const mongoose = require('mongoose');

const roundStatSchema = mongoose.Schema({
    name:{type:String, required:true},
    value: {type: Number, required: true},
    isShared:{type: Number, required: true},
    min:Number,
    max:Number
 });

 module.exports = roundStatSchema;