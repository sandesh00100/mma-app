import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { ScoreCardMaker } from './scorecard/scorecardmaker';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { ScoreCard } from './scorecard/scorecard.model';
import { map } from 'rxjs/operators';

const httpURL = environment.apiUrl + '/scorecards';

@Injectable({
  providedIn: 'root'
})

// TODO: Probably should change how we're loading the data, maybe create an object that encapsulates these score cards
export class ScoreCardService {
  private judgeHistoryUpdateListener = new Subject<{scoreCards: ScoreCard[], totalScoreCards: number}>();
  private judgeHistory: ScoreCard[];

  constructor(private http:HttpClient, private router:Router, private snackBar: MatSnackBar) {

  }

  // TODO: add error and retries for all htttp calls
  saveScoreCard(ScoreCardMaker: ScoreCardMaker): void {
    this.http.post<{message: string}>(`${httpURL}`,ScoreCardMaker.getJsonObject()).subscribe(response => {
      this.router.navigate(['/']);
      this.snackBar.open(response.message, 'Success', {
        duration: 3000
      })
    });
  }

  getJudgeHistoryUpdateListener(): Subject<{scoreCards: ScoreCard[], totalScoreCards: number}>{
    return this.judgeHistoryUpdateListener;
  }

  getJudgeHistory(scoreCardsPerPage:number, currentPage:number): void {
    const queryParams = `?pageSize=${scoreCardsPerPage}&page=${currentPage}`;
    this.http.get<{message:string, scoreCards:any[] ,totalScoreCards: number}>(`${httpURL}/history/${queryParams}`)
    .pipe(
      map(
        response => {
          console.log("Fetching ScoreCards");
          console.log(response);
          let modifiedScoreCards = response.scoreCards.map(scoreCard => {
            let modifiedMatch; 
            if (typeof scoreCard.match != "string"){
              modifiedMatch = {...scoreCard.match,id:scoreCard.match._id};
              delete modifiedMatch["_id"];
            }
            return {
              ...scoreCard,
              match:modifiedMatch
            };
          });
          return {
            ...response,
            scoreCards:modifiedScoreCards
          }
        }
      )
    )
    .subscribe(fetchedJudgeHistory => {
      this.judgeHistory = fetchedJudgeHistory.scoreCards;
      const fetchedJudgeHistoryData = {
        scoreCards: [...this.judgeHistory],
        totalScoreCards: fetchedJudgeHistory.totalScoreCards
      }
      this.judgeHistoryUpdateListener.next(fetchedJudgeHistoryData);
    });
  }
}
