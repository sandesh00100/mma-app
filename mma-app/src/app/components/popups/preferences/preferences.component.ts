import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../../judge/judge.service';
import { Router } from '@angular/router';
import { Stat } from '../../matches/stat.model';
import { Subscription } from 'rxjs';
import { StatValidator } from '../../validators/Stat.validator';
import { MatSnackBar, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})

/**
 * TODO: Defaults button, make users have minimum of 1 stat
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

  constructor(private judgeService: JudgeService, private router: Router, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PreferencesComponent>) { }

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
    const isValid = StatValidator.isValidStat(this.newStat, this.preferenceStats);
    console.log(isValid);
    if (isValid) {
      this.preferenceStats.push(this.newStat);
      this.resetStat();
    } else {
      this.snackBar.open('Please enter a valid name.', 'Error',
      {
        duration: 2000
      });
    }
   
  }

  updatePreferences(){
    this.judgeService.updatePreferences(this.preferenceStats).subscribe(response => {
      console.log(response);
      this.dialogRef.close(response.message);
    });;
  }

  resetStat(){
    this.newStat = {
      name:undefined,
      min:undefined,
      max:undefined,
      isShared: false,
      value:0
    };
  }

  resetSharedStat(stat: Stat){
    stat.min = 0;
    stat.max = 100;
    stat.value = 50;
  }
  correctStat(stat: Stat) {
    StatValidator.correctValues(stat);
   }
}
