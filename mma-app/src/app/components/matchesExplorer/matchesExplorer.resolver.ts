import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { tap, take, catchError, filter, first } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { selectFilterState } from "./matchesExplorer.selector";
import { of, Observable } from "rxjs";
import { FilterState } from "./reducers/filter.reducer";

@Injectable()
export class MatchResolver implements Resolve<Boolean>{
    constructor(private store:Store<AppState>) {
    
    }

    resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // console.log("Trying to resolve...");
        // return this.matchService.loaded$.pipe(
        //     tap(loaded => {
        //         if (!loaded) {
        //             console.log("Calling match service");
        //             this.getFilterState(this.store).then(filterState => {
        //                 //Looks like we have to getAll() first so that we can make use of the loaded$ observable
        //                 this.matchService.getAll();
        //                 console.log("Finished calling match service")
        //             }).catch(err => {
        //                 of(false);
        //             })
        //         }
        //     }),
        //     filter(loaded => !!loaded),
        //     first()
        // )
        return of(true);
    }

    private getFilterState(store:Store<AppState>): Promise<FilterState>{
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