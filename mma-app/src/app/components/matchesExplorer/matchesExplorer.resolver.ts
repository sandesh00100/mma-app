import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { tap, take, catchError, filter, first, finalize } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { selectFilterState, areMatchesLoaded } from "./matchesExplorer.selector";
import { of, Observable } from "rxjs";
import { FilterState } from "./reducers/filter.reducer";
import { getMatches } from "./matchesExplorer.actions";

@Injectable()
// Need to review the logic of this resolver
export class MatchResolver implements Resolve<Boolean>{
    loading = false;
    constructor(private store:Store<AppState>) {
    
    }

    resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store.pipe(
            select(areMatchesLoaded),
            tap(matchesLoaded => {
                if(!this.loading && !matchesLoaded){
                    this.loading = true;
                    this.store.dispatch(getMatches());
                }
            }),
            first(matchesLoaded => matchesLoaded),
            first(),
            finalize(() => this.loading = false)
        );
    }
}