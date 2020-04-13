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
                    this.getFilterState().then(
                        (filterState:FilterState) => {
                            this.store.dispatch(getMatches({filterState}));
                        }
                    )
                }
            }),
            first(matchesLoaded => matchesLoaded),
            first(),
            finalize(() => this.loading = false)
        );
    }

    private getFilterState(): Promise<FilterState>{
        const filterPromise:Promise<FilterState> = new Promise((resolve,reject)=>{
            this.store.select(selectFilterState)
            .pipe(
                take(1),
                catchError(
                    err => {
                        reject(err);
                        return of(err);
                    }
                )
            ).subscribe(
                (filterState:FilterState) => {
                    console.log("selecting ");
                    console.log(filterState);
                    resolve(filterState);
                }
            )
        });

        return filterPromise;
}

}