import { Injectable } from "@angular/core";
import { Match } from "./match.model";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

const httpURL = environment.apiUrl + '/matches';
@Injectable()
export class MatchesDataService extends DefaultDataService<Match>{
    constructor(http:HttpClient, httpUrlGenerator:HttpUrlGenerator){
        super("Match", http, httpUrlGenerator);
    }
    
    getWithQuery(query:string): Observable<Match[]>{
        return this.http.get<{ message: string, matches: any[], totalMatches: number }>(`${httpURL}/${query}`).pipe(
            map(
                response => response.matches
            )
        );
    }
}