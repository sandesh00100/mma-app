import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Match, SearchResponse } from './match.model';
import { Subject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

const httpURL = environment.apiUrl + '/matches';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matches: Match[] = [];
  private matchesUpdated = new Subject<{matches:Match[], maxMatch:number}>();
  constructor(private http: HttpClient) { }

  getMatches(matchesPerPage: number, currentPage: number, org: string) {

    const queryParams = `?pageSize=${matchesPerPage}&page=${currentPage}&org=${org}`;
    this.http.get<{ message: string, matches: any[], totalMatches: number }>(`${httpURL}/deprecated/${queryParams}`)
    .pipe(
      map(response => {
        const modifiedMatches = response.matches.map(match => {
          let modifiedMatch = {...match,id:match._id};
          delete modifiedMatch["_id"];
          return modifiedMatch;
        });
        return {
          ...response,
          matches:modifiedMatches
        };
      })
    )
    .subscribe(fetchedMatches => {
         console.log(fetchedMatches);
         this.matches = fetchedMatches.matches;
         this.matchesUpdated.next({matches:[...this.matches], maxMatch: fetchedMatches.totalMatches});
      });
  }

  // Might want to go to fetch it from the server
  getLocalMatch(matchId: string): Match{
    return this.matches.find((match: Match) => {
      return match.id == matchId;
    });
  }

  getMatch(matchId: String): Observable<{message:string, match:any}>{
    return this.http.get<{message:string, match:any}>(`${httpURL}/${matchId}`);
  }

  getMatchUpdateListener(): Subject<{matches: Match[], maxMatch:number}>{
      return this.matchesUpdated;
  }

  search(search: string, mode: string):Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${httpURL}/search/${mode}/${search}`);
  }
}
