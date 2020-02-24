import { Stat } from "../../matches/stat.model";

export class Round {
    public roundNumber: number;
    public stats: Stat[] = [];
    public hslValues: string[] = [];

    constructor(roundNumber:number) {
        this.roundNumber = roundNumber;
    }
    
    public addNewStat(statName: string, isShared:boolean, initialValue: any, min: number, max?:number){
        this.stats.push({
            name:statName,
            value: initialValue,
            isShared: isShared,
            min:min,
            max:max,
            isGreater:false
        });
        let defaultHslValue = null;
        if (isShared) {
            defaultHslValue = "hsl(0, 0%, 100%)";
        }
        this.hslValues.push(defaultHslValue);
    }

    // TODO: Create an interface for round
    public getRoundInfo(): {round:number,stats:Stat[]}{
        return {
            round: this.roundNumber,
            stats: this.stats
        }
    }

    public getHslValues(): string[] {
        return this.hslValues;
    }
}