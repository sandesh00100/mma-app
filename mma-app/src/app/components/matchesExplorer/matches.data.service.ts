import { Injectable } from "@angular/core";
import { Match } from "./match.model";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { map, tap, catchError } from "rxjs/operators";
import { AppState } from "src/app/reducers";
import { Store } from "@ngrx/store";
import { updateTotalMatches } from "./matchesExplorer.actions";

const httpURL = environment.apiUrl + '/matches';
@Injectable()
export class MatchesDataService extends DefaultDataService<Match>{
    private defaultQuery:string = "?pageSize=5&page=1&org=UFC";
    constructor(http:HttpClient, httpUrlGenerator:HttpUrlGenerator, private store:Store<AppState>){
        super("Match", http, httpUrlGenerator);
    }
    
    getAll(){
        return this.http.get<{ message: string, matches: any[], totalMatches: number }>(`${httpURL}/${this.defaultQuery}`).pipe(
            tap(response => {
                this.store.dispatch(updateTotalMatches({totalMatches:response.totalMatches}));
            }),
            map(
                response => response.matches.map(match => {
                    let modifiedMatch = {
                        ...match,
                        id:match._id
                    };
                    return modifiedMatch;
                })
            )
        );

    }

    getWithQuery(query:string): Observable<Match[]>{
        console.log("Calling get with query");
        console.log("Query " + query);
        return this.http.get<{ message: string, matches: any[], totalMatches: number }>(`${httpURL}/${query}`).pipe(
            tap(response => {
                console.log("GETTING WITH QUERY");
                console.log(response.matches);
                this.store.dispatch(updateTotalMatches({totalMatches:response.totalMatches}));
            }),
            map(
                response => response.matches.map(match => {
                    let modifiedMatch = {
                        ...match,
                        id:match._id
                    };
                    return modifiedMatch;
                })
            ),
            catchError(err => {
                console.log(err);
                return of(err);
            })
        );
    }
}