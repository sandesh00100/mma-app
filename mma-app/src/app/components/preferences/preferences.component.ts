import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { Router } from '@angular/router';
import { Stat } from '../matches/stat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})

/**
 * TODO: Validation on preference
 * Require name and initial value for adding stats
 */
export class PreferencesComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.preferenceStatsSub != null){
      this.preferenceStatsSub.unsubscribe();
    }
    
  }

  preferenceStats: Stat[];
  newStat: Stat;
  private preferenceStatsSub: Subscription;

  constructor(private judgeService: JudgeService, private router: Router) { }

  ngOnInit() {
    this.resetStat();
    if (this.router.url.includes("judge")){
      this.preferenceStats = this.judgeService.getStats();
    } else {
      this.preferenceStatsSub = this.judgeService.getPreferenceUpdateListener().subscribe(statsData => {
        this.preferenceStats = statsData;
      });
      this.judgeService.getPreferences();
    }
    console.log(this.preferenceStats);
  }

  removeStat(stat: Stat){
    this.preferenceStats = this.preferenceStats.filter(currentStat => {
      return currentStat != stat;
    });
  }

  addStat(){
    console.log("adding stat");
    console.log(this.newStat);
    this.preferenceStats.push(this.newStat);
    this.resetStat();
  }

  resetStat(){
    this.newStat = {
      name:undefined,
      min:undefined,
      max:undefined,
      isShared: false,
      value:undefined
    };
  }

}
