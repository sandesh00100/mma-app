import {Round} from './round.model';

export class FighterCard {
    constructor (fighterId:string) {

    }
    public fighterId: string;
    public rounds: [
        Round
    ];
}