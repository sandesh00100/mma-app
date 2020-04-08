import { Injectable } from "@angular/core";
import { MatchEntityService } from "./match.entity.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getMatches } from "./match.actions";
import { map, switchMap } from "rxjs/operators";
import { MatchesDataService } from "./matches.data.service";
import { filterStateToQuery } from "./reducers";

@Injectable()
export class MatchEffects {
    constructor(private actions$: Actions, private matchService:MatchesDataService) {
        
    }
}