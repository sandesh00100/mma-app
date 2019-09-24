import {Round} from './round.model';

export class FighterCard {
    public fighterId: string;
    public rounds: Round[];
    // Maybe give a better type
    public figherInfo: any;
    constructor (fighterId:string, rounds:Round[], fighterInfo:any) {
        this.rounds = rounds;
        this.fighterId = fighterId;
        this.figherInfo = fighterInfo;
    }
}