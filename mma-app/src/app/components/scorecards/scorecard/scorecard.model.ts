import { Match } from "../../matchesExplorer/match.model";
import { Stat } from "../../matchesExplorer/stat.model";

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