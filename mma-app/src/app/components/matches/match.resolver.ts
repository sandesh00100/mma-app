import { Injectable, OnDestroy } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { MatchEntityService } from "./match.entity.service";
import { tap, take, catchError, filter, first } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { selectFilterState } from "./match.selector";
import { FilterState, filterStateToQuery } from "./reducers";
import { of, Observable } from "rxjs";

@Injectable()
export class MatchResolver implements Resolve<Boolean>{
    constructor(private matchService: MatchEntityService, private store:Store<AppState>) {
    
    }

    resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log("Trying to resolve...");
        return this.matchService.loaded$.pipe(
            tap(loaded => {
                if (!loaded) {
                    console.log("Calling match service");
                    getFilterState(this.store).then(filterState => {
                        this.matchService.getWithQuery(filterStateToQuery(filterState));
                    }).catch(err => {
                        of(false);
                    })
                }
            }),
            filter(loaded => !!loaded),
            first()
        )
    }

}

const getFilterState = function getFilterState(store:Store<AppState>): Promise<FilterState>{
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
                    console.log("selecting " + filterState);
                    resolve(filterState);
                }
            )
        });

        return filterPromise;
}