import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Match } from './match.model';
import { map } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';

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
    this.http.get<{ message: string, matches: any, totalMatches: number }>(`${httpURL}/${queryParams}`)
      .pipe(
        map(matchData => {
          return {
            matches: matchData.matches.map(match => {
              let fetchedMatch = {
                ...match,
                id:match._id,
                fighters: match.fighters.map(fetchedFighter => {
                  return {
                    ...fetchedFighter,
                    record: {
                      ...fetchedFighter.record
                    }
                  }
                })
              };
              return fetchedMatch;
            }),
            maxMatches: matchData.totalMatches
          }
        })
      ).subscribe(transformedMatches => {
         console.log(transformedMatches);
         this.matches = transformedMatches.matches;
         this.matchesUpdated.next({matches:[...this.matches], maxMatch: transformedMatches.maxMatches});
      });
  }

  // Might want to go to fetch it from the server
  getLocalMatch(matchId: string): Match{
    return this.matches.find((match: Match) => {
      return match.id == matchId;
    });
  }

  getMatch(matchId: String) {
    return this.http.get<{message:string, match:any}>(`${httpURL}/${matchId}`);
  }
  
  getMatchUpdateListener(): Subject<{matches: Match[], maxMatch:number}>{
      return this.matchesUpdated;
  }
}
