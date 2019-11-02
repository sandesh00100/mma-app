import { Stat } from "../matches/stat.model";

export class StatValidator {

    public static correctValues(preferenceStat: Stat) {
        if (preferenceStat.max != undefined && preferenceStat.max < preferenceStat.min) {
            preferenceStat.max = preferenceStat.min;
        };

        if (preferenceStat.value != null) {
            const keyPressedValue = preferenceStat.value;
            if (preferenceStat.min != undefined && keyPressedValue < preferenceStat.min) {
                preferenceStat.value = preferenceStat.min;
            }else if (preferenceStat.max != undefined && keyPressedValue > preferenceStat.max) {
                preferenceStat.value = preferenceStat.max;
            } 
        } else {
            if (preferenceStat.min != undefined) {
                preferenceStat.value = preferenceStat.min;
            } else {
                preferenceStat.value = 0;
            }
        }

    }

    public static isValidStat(preferenceStat: Stat, currentStats: Stat[]): boolean{
        if (preferenceStat.name == undefined || preferenceStat.name.length < 1){
            return false;
        }
        for (let stat of currentStats){
            if (stat.name == preferenceStat.name.trim()){
                return false;
            }
        }
        return true;
    }
}