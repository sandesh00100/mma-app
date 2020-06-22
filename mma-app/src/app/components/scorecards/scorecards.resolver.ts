import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { tap, finalize, first } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { Observable } from "rxjs";
import { areScorecardsLoaded } from "../scorecards/scorecards.selector";
import { getScoreCards } from "./scorecards.actions";

@Injectable()
// Need to review the logic of this resolver
export class ScorecardsResolver implements Resolve<Boolean>{
    loading = false;
    constructor(private store:Store<AppState>) {
    
    }

    resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.pipe(
            select(areScorecardsLoaded),
            tap(matchesLoaded => {
                if(!this.loading && !matchesLoaded){
                    this.loading = true;
                    this.store.dispatch(getScoreCards());
                }
            }),
            first(scoreCardsLoaded => scoreCardsLoaded),
            finalize(() => this.loading = false)
        );
    }
}