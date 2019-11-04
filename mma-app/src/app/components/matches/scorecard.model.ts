import { Stat } from "./stat.model";
import { Match } from "./match.model";

export interface ScoreCard {
    judge: string,
    // Can have actual match or match id
    match: string | Match,
    roundsScored: {
        fighter: string,
        rounds:{
            round:number,
            stats:Stat[]
        }[]
    }[]
}