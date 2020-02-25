import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge.service';
import { Router } from '@angular/router';
import { Stat } from '../../matches/stat.model';
import { Subscription } from 'rxjs';
import { StatValidator } from '../../../utility/Stat.validator';
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
    if (this.preferenceStatsSub != null) {
      this.preferenceStatsSub.unsubscribe();
    }

  }

  preferenceStats: Stat[];
  newStat: Stat;
  private preferenceStatsSub: Subscription;

  constructor(private judgeService: JudgeService, private router: Router, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PreferencesComponent>) { }

  ngOnInit() {
    this.resetStat();
    if (this.router.url.includes("judge")) {
      this.preferenceStats = this.judgeService.getStats();
    } else {
      this.preferenceStatsSub = this.judgeService.getPreferenceUpdateListener().subscribe(statsData => {
        this.preferenceStats = statsData;
      });
      this.judgeService.getPreferences();
    }
  }

  removeStat(stat: Stat) {
    this.preferenceStats = this.preferenceStats.filter(currentStat => {
      return currentStat != stat;
    });
  }

  addStat() {
    const isValid = StatValidator.isValidStat(this.newStat, this.preferenceStats);
    if (isValid) {

      if (this.newStat.isShared) {
        this.resetSharedStat(this.newStat);
      }
      
      this.preferenceStats.push(this.newStat);
      this.resetStat();
    } else {
      this.snackBar.open('Please enter a valid name.', 'Error',
        {
          duration: 2000
        });
    }

  }

  updatePreferences() {
    this.judgeService.updatePreferences(this.preferenceStats).subscribe(response => {
      this.judgeService.updatePreferenceListeners(this.preferenceStats);
      this.snackBar.open(response.message, 'Saved',
        {
          duration: 2000
        });
      this.dialogRef.close();
    });;
  }

  resetStat() {
    this.newStat = {
      id:undefined,
      name: undefined,
      min: undefined,
      max: undefined,
      isShared: false,
      value: 0,
      isGreater: false
    };
  }

  resetSharedStat(stat: Stat) {
    stat.min = 0;
    stat.max = 100;
    stat.value = 50;
  }

  correctStat(stat: Stat) {
    StatValidator.correctValues(stat);
  }
}
