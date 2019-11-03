import { Stat } from "./stat.model";

export interface ScoreCard {
    judge: string,
    match: string,
    roundsScored: {
        fighter: string,
        rounds:{
            round:number,
            stats:Stat[]
        }[]
    }[]
}