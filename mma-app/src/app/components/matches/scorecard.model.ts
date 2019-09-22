import {FighterCard} from "./fighterCard.model";

export class ScoreCard {
    
    constructor(matchId:string, fighter1Card: FighterCard, fighter2card: FighterCard){
        this.matchId = matchId;
        this.fighter1Card = fighter1Card;
        this.fighter2Card = fighter2card;
    }

    public matchId: string;
    public fighter1Card: FighterCard;
    public fighter2Card: FighterCard;
}