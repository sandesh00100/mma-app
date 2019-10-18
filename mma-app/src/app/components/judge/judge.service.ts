import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Stat } from '../matches/stat.model';
import { map } from 'rxjs/operators';
import { ScoreCard } from '../matches/scorecard.model';
import { Router } from '@angular/router';

const httpURL = environment.apiUrl + '/judge';

@Injectable({
  providedIn: 'root'
})

export class JudgeService {
  private preferenceUpdateListener = new Subject<Stat[]>();
  private preferenceStats: Stat[];

  constructor(private http:HttpClient, private router:Router) { 

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
    this.http.post(`${httpURL}/scorecard`,scoreCard.getJsonObject()).subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  getPreferenceUpdateListener(){
    return this.preferenceUpdateListener;
  }

  getStats(){
    return [...this.preferenceStats];
  }
}
