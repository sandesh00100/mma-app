import {Round} from './round.model';

export class FighterCard {
    public fighterId: string;
    public rounds: [
        Round
    ];
    constructor (fighterId:string) {
        this.fighterId = fighterId;
    }
}