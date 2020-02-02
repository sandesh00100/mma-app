import {Round} from './round';
import { Stat } from './stat.model';

export class FighterCard {
    public fighterId: string;
    public rounds: Round[];
    // Maybe give a better type
    public fighterInfo: FighterInfo;

    constructor (fighterId:string, rounds:Round[], fighterInfo:FighterInfo) {
        this.rounds = rounds;
        this.fighterId = fighterId;
        this.fighterInfo = fighterInfo;
    }

    public getRoundInfoList(): {round:number,stats:Stat[]}[]{
        let roundInfoList = [];
        this.rounds.forEach(round => {
            roundInfoList.push(
                round.getRoundInfo()
            );
        });
        return roundInfoList;
    }
}

export interface FighterInfo {
    fighterName: string,
    lastName: string,
    imagePath: string
}