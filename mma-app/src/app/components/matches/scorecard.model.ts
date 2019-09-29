import {FighterCard} from "./fighterCard.model";

export class ScoreCard {
    public matchId: string;

    // TODO: maybe having this as an array would create less duplicate code
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

    public getFighter1RoundStats(round:number){
        return this.fighter1Card.rounds[round + 1].roundMap;
    }

    public getFighter2RoundStats(round:number){
        return this.fighter2Card.rounds[round + 1].roundMap;
    }
    
}