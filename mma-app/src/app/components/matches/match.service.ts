import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Match } from './match.model';
import { Subject, Observable} from 'rxjs';

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
    this.http.get<{ message: string, matches: any, totalMatches: number }>(`${httpURL}/${queryParams}`).subscribe(fetchedMatches => {
         console.log(fetchedMatches);
         this.matches = fetchedMatches.matches;
         this.matchesUpdated.next({matches:[...this.matches], maxMatch: fetchedMatches.totalMatches});
      });
  }

  // Might want to go to fetch it from the server
  getLocalMatch(matchId: string): Match{
    return this.matches.find((match: Match) => {
      return match._id == matchId;
    });
  }

  getMatch(matchId: String): Observable<{message:string, match:any}>{
    return this.http.get<{message:string, match:any}>(`${httpURL}/${matchId}`);
  }

  getMatchUpdateListener(): Subject<{matches: Match[], maxMatch:number}>{
      return this.matchesUpdated;
  }

  searchFighters():Observable<{message:string, fighters:string[]}> {
    return this.http.get<{message:string, fighters:string[]}>(`${httpURL}/search/service`);
  }
}
