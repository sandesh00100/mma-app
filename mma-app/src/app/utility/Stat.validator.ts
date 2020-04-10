import { Stat } from "../components/matchesExplorer/stat.model";

export class StatValidator {

    public static correctValues(preferenceStat: Stat) {
        if (preferenceStat.value == undefined) {
            if (preferenceStat.min != undefined){
                preferenceStat.value = preferenceStat.min;
            } else if (preferenceStat.max != undefined){
                preferenceStat.value = preferenceStat.max;
            } else {
                preferenceStat.value = 0
            }
        }
        if (preferenceStat.value > preferenceStat.max){
            preferenceStat.max = preferenceStat.value;
        }

        if (preferenceStat.value < preferenceStat.min) {
            preferenceStat.min = preferenceStat.value;
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