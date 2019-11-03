import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { Stat } from '../matches/stat.model';
import { ScoreCardMaker } from '../matches/scorecardmaker';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';

const httpURL = environment.apiUrl + '/judge';

@Injectable({
  providedIn: 'root'
})

export class JudgeService {
  private preferenceUpdateListener = new Subject<Stat[]>();
  private preferenceStats: Stat[];

  constructor(private http:HttpClient, private router:Router, private snackBar: MatSnackBar) {

  }

  getPreferences(): void{
    this.http.get<{message:string, stats: Stat[]}>(`${httpURL}/preference/stats`).subscribe(transformedStatData => {
      this.preferenceStats = transformedStatData.stats;
      this.preferenceUpdateListener.next([...this.preferenceStats]);
    });
  }

  // TODO: add error and retries for all htttp calls
  saveScoreCard(ScoreCardMaker: ScoreCardMaker): void {
    this.http.post<{message: string}>(`${httpURL}/scorecard`,ScoreCardMaker.getJsonObject()).subscribe(response => {
      this.router.navigate(['/']);
      this.snackBar.open(response.message, 'Success', {
        duration: 3000
      })
    });
  }

  getPreferenceUpdateListener(): Subject<Stat[]>{
    return this.preferenceUpdateListener;
  }

  updatePreferences(statList: Stat[]): Observable<{message: string}>{
    return this.http.post<{message:string}>(`${httpURL}/preference/stats`,statList);
  }

  updatePreferenceListeners(statList: Stat[]): void{
    this.preferenceStats = statList;
    this.preferenceUpdateListener.next([...this.preferenceStats]);
  };

  getStats(): Stat[]{
    return [...this.preferenceStats];
  }

  getJudgeHistory(scoreCardsPerPage:number, currentPage:number): Observable<{message:string, judgeHistory: any[]}>{
    const queryParams = `?pageSize=${scoreCardsPerPage}&page=${currentPage}`;
    return this.http.get<{message:string, judgeHistory: any[]}>(`${httpURL}/history/${queryParams}`);
  }
}
