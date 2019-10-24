const mongoose = require('mongoose');

let roundStatSchema = mongoose.Schema({
    name:{type:String, required:true},
    value: {type: Number, required: true},
    isShared:{type: Number, required: true},
    min:Number,
    max:Number
 });

 // Arrow function uses lexical this
 // TODO: Read https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 roundStatSchema.pre("save", function (next) {
    if (this.value < this.min || this.value > this.max ){
        next(new Error("Value must be in range of min and max"));
    } else if (this.min != undefined && this.max != undefined && this.min > this.max){
        next(new Error("min can't be more than max")) ;
    } else {
        next();
    }
 });
 module.exports = roundStatSchema;