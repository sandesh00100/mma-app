import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Match } from './match.model';
import { map } from 'rxjs/operators';

const httpURL = environment.apiUrl + 'matches/';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matches: Match[] = [];

  constructor(private http: HttpClient) { }

  getMatches(matchesPerPage: number, currentPage: number, org: string) {

    const queryParams = `?pageSize=${matchesPerPage}&page=${currentPage}&org=${org}`;
    this.http.get<{ message: string, matches: any, totalMatches: number }>(httpURL + queryParams)
      .pipe(
        map(matchData => {
          return {
            matches: matchData.matches.map(fetchedMatch => {
              return {
                eventName: fetchedMatch.eventName,
                organization: fetchedMatch.organization,
                weightClass: fetchedMatch.weightClass,
                matchType: fetchedMatch.matchType,
                matchOrder: fetchedMatch.matchOrder,
                isFiveRounds: fetchedMatch.isFiveRounds,
                isTitleFight: fetchedMatch.isTitleFight,
                date: fetchedMatch.date,
                fighters: fetchedMatch.fighters.map(fetchedFighter => {
                  return {
                    firstName: fetchedFighter.firstName,
                    lastName: fetchedFighter.lastName,
                    isActive: fetchedFighter.isActive,
                    imagePath: fetchedFighter.imagePath,
                    rank: fetchedFighter.rank,
                    record: {
                      wins: fetchedFighter.wins,
                      losses: fetchedFighter.losses,
                      disqualifications: fetchedFighter.disqualifications
                    }
                  }
                })
              }
            })
          }
        })
      ).subscribe(transformedMatches => {
         this.matches = transformedMatches.matches;
      });
  }

}
