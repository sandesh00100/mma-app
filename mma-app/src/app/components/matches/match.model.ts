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
    event,
    fighter
}

export interface Filter {
    mode:MatchFilterMode,
    search:string
}