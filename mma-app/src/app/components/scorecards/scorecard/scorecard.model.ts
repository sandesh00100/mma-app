import { Stat } from "../../matches/stat.model";
import { Match } from "../../matches/match.model";

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

// //TODO
// export interface SummarizedScoreCard {
//     _id:string,
//     roundsScored: SummarizedStat[][]
// }