const mongoose = require('mongoose');

const roundStatSchema = mongoose.Schema({
    name:{type:String, required:true},
    value: {type: Number, required: true},
    isShared:{type: Number, required: true},
    min:Number,
    max:Number
 });

 roundStatSchema.pre("validate", next => {
    if (this.value < this.max || this.value > this.max ){
        next(new Error("Value must be in range of min and max"));
    } else if (this.min != undefined && this.max != undefined && this.min > this.max){
        next(new Error("min can't be more than max"));
    } else {
        next();
    }
 });
 module.exports = roundStatSchema;