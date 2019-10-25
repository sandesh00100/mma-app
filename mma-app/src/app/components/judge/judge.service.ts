import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Stat } from '../matches/stat.model';
import { map } from 'rxjs/operators';
import { ScoreCard } from '../matches/scorecard.model';
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

  getPreferences() {
    this.http.get<{message:string, stats: Stat[]}>(`${httpURL}/preference/stats`).pipe(
      map(statData => {
        return {
          stats: statData.stats.map(stat => {
            return {
              name:stat.name,
              min:stat.min,
              max:stat.max,
              isShared:stat.isShared,
              value:stat.value
            }
          }),
        }
      })
    ).subscribe(transformedStatData => {
      this.preferenceStats = transformedStatData.stats;
      this.preferenceUpdateListener.next([...this.preferenceStats]);
    });
  }
  
  // TODO: add error and retries for all htttp calls
  saveScoreCard(scoreCard: ScoreCard) {
    this.http.post<{message: string}>(`${httpURL}/scorecard`,scoreCard.getJsonObject()).subscribe(response => {
      this.router.navigate(['/']);
      this.snackBar.open(response.message, 'Success', {
        duration: 3000
      })
    });
  }

  getPreferenceUpdateListener(){
    return this.preferenceUpdateListener;
  }

  updatePreferences(statList: Stat[]){
    return this.http.post<{message:string}>(`${httpURL}/preference/stats`,statList);
  }

  getStats(){
    return [...this.preferenceStats];
  }
}
