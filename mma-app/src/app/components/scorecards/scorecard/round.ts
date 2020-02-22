import { Stat } from "../../matches/stat.model";

export class Round {
    public roundNumber: number;
    public stats: Stat[] = [];

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
    }

    // TODO: Create an interface for round
    public getRoundInfo(): {round:number,stats:Stat[]}{
        return {
            round: this.roundNumber,
            stats: this.stats
        }
    }
}