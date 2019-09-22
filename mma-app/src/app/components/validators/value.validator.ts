export class ValueValidator {
    public static validateRange(value:number, min: number, max: number){
        if (value < min || value > max) {
            throw RangeError(`Please enter a value from ${min} to ${max}`);
        }
    }

    public static validatePositiveNumber(value:number){
        if (value < 0) {
            throw RangeError("Please enter a positive value");
        }
    }

    public static validateFraction(value:number){
        ValueValidator.validatePositiveNumber(value);
        if (value > 1) {
            throw RangeError("Please enter a fraction between 0 - 1");
        }
    }
}