import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { MatchService } from "./match.service";
import { updatePageOptions, addFilter, updateOrg, getMatchesSuccess, getMatchesFailure, getMatches, removeFilter } from "./matchesExplorer.actions";
import { AppState } from "src/app/reducers";
import { Store } from "@ngrx/store";
import { switchMap, map, mergeMap, catchError, tap, take } from "rxjs/operators";
import { selectFilterState } from "./matchesExplorer.selector";
import { FilterState } from "../matchfilter/reducers";
import { MatchesResponse } from "./match.model";
import { of } from "rxjs";

@Injectable()
export class MatcheExplorerEffects {
    getMatches$ = createEffect(
        () => this.actions$.pipe(
            ofType(updateOrg,updatePageOptions,addFilter,removeFilter,getMatches),
            tap(action => console.log("Get matches effect")),
            // have to relook at this it was doing an infinite loop on filter state before doing take(1)
            mergeMap(action => this.store.select(selectFilterState).pipe(take(1))),
            switchMap((filterState:FilterState) => this.matchService.getMatchesWithQuery(filterState)),
            map((response:MatchesResponse) => {
                console.log("MATCHES RESPONSE");
                console.log(response);
                return getMatchesSuccess(response);
            }),
            catchError(err => of(getMatchesFailure))
        )
    )
    constructor(private actions$: Actions, private matchService: MatchService, private store: Store<AppState>) {

    }
}