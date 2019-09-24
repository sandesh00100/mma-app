import { ValueValidator } from "../validators/value.validator";
import { Stat } from "../enums/stat.enum";

export class Round {
    public roundMap: Map<String,{
        value:string, 
        statType:Stat, 
        min:number|undefined,
        max:number|undefined
    }>;

    constructor() {
        this.addNewStat('Round Number', Stat.Range, 1, 1, 5);
        this.addNewStat('Takedown Attempts', Stat.Positive, 0);
        this.addNewStat('Submission Attempts', Stat.Positive, 0);
        this.addNewStat('Octagon Control', Stat.Fraction, .5);
        this.addNewStat('Damage Ratio', Stat.Fraction, .5);
        this.addNewStat('Significant Strikes', Stat.Positive, 0);
    }
    
    public addNewStat(statName: string, statType: Stat, initialValue: any, min?: number, max?:number){
        this.validateStatValue(statType, initialValue, min, max);
        this.roundMap.set(statName,{
            value: initialValue,
            statType: statType,
            min:min,
            max:max
        });
    }
    
    public updateValue(statName: string, value: any, min?: number, max?:number) {
       const statObj = this.roundMap.get(statName);
        if (statObj != null){
            const statType:Stat = statObj.statType;
            this.validateStatValue(statType, value, min, max);
            this.roundMap.set(statName, value);
       } else {
           throw new ReferenceError("Stat doesn't exist.");
       }
       
    }
    
    private validateStatValue (statType: Stat, value: any, min?:number, max?:number){
        switch (statType) {
            case Stat.Positive:
                ValueValidator.validatePositiveNumber(value);
            case Stat.Fraction:
                ValueValidator.validateFraction(value);
            case Stat.Range:
                ValueValidator.validateRange(value, min, max);
            default:
                ValueValidator.validatePositiveNumber(value)
        }
    }
}