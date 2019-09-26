import {FighterCard} from "./fighterCard.model";

export class ScoreCard {
    public matchId: string;
    public fighter1Card: FighterCard;
    public fighter2Card: FighterCard;
    public eventName: string;

    constructor(matchId:string, fighter1Card: FighterCard, fighter2card: FighterCard, eventName:string){
        this.matchId = matchId;
        this.eventName = eventName;
        this.fighter1Card = fighter1Card;
        this.fighter2Card = fighter2card;
    }

    public getFighter1LastName(){
        return this.fighter1Card.fighterInfo.lastName;
    }

    public getFighter2LastName(){
        return this.fighter1Card.fighterInfo.lastName;
    }

    public getFighter1Name(){
        return this.fighter1Card.fighterInfo.fighterName;
    }

    public getFighter2Name(){
        return this.fighter1Card.fighterInfo.fighterName;
    }

}