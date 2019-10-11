import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Stat } from './stat.model';
import { map } from 'rxjs/operators';

const httpURL = environment.apiUrl + 'judge/';

@Injectable({
  providedIn: 'root'
})

export class JudgeService {
  private preferenceUpdateListener = new Subject<Stat[]>();
  private preferenceStats: Stat[];

  constructor(private http:HttpClient) { 

  }

  getPreferences() {
    this.http.get<{message:string, stats: Stat[]}>(`${httpURL}preference/stats`).pipe(
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

  getPreferenceUpdateListener(){
    return this.preferenceUpdateListener;
  }
}
