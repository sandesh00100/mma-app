const mongoose = require('mongoose');

let roundStatSchema = mongoose.Schema({
    name:{type:String, required:true},
    value: {type: Number, required: true},
    isShared:{type: Number, required: true},
    min:Number,
    max:Number
 });

 roundStatSchema.pre("save", next => {
     console.log(this.max);
     return new Error();
     next();
    if (this.value < this.max || this.value > this.max ){
        return new Error("Value must be in range of min and max");
    } else if (this.min != undefined && this.max != undefined && this.min > this.max){
        return new Error("min can't be more than max");
    } else {
        next();
    }
 });
 module.exports = roundStatSchema;