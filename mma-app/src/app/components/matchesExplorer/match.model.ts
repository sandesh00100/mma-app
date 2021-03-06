// Maybe create a seperate match model later on
export interface Match {
    id:string,
    eventName: string,
    organization: string,
    weightClass: number,
    matchType: string,
    matchOrder: number,
    isFiveRounds: number,
    isTitleFight: boolean,
    date: Date,
    fighters:{
        id:string,
        firstName:string,
        lastName:string,
        isActive:boolean,
        imagePath:string,
        rank:number,
        record:{
            wins:number,
            losses:number,
            disqualifications:number
        }
    }[]
}

export enum MatchFilterMode {
    event = "Event",
    fighter = "Fighter"
}

export enum Organization {
    ufc="UFC",
    bellator="Bellator",
    oneFc="One FC"
}
export interface Filter {
    mode:MatchFilterMode,
    searchResult:SearchResult
}

export interface SearchResponse extends Response {
    searchResults:SearchResult[]
}

export interface MatchesResponse extends Response {
    matches: Match[],
    totalMatches: number,
    message: string
}
export interface SearchResult {
    searchItem:string,
    searchId:string
}