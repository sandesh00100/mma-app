import {Round} from './round.model';

export class FighterCard {
    public fighterId: string;
    public rounds: Round[];
    // Maybe give a better type
    public fighterInfo: any;

    constructor (fighterId:string, rounds:Round[], fighterInfo:any) {
        this.rounds = rounds;
        this.fighterId = fighterId;
        this.fighterInfo = fighterInfo;
    }

    public getRoundInfoList() {
        let roundInfoList = [];
        this.rounds.forEach(round => {
            roundInfoList.push(
                round.getRoundInfo()
            );
        });
        return roundInfoList;
    }
}