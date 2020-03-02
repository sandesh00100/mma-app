import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge.service';
import { Router } from '@angular/router';
import { Stat } from '../../matches/stat.model';
import { Subscription, Observable } from 'rxjs';
import { StatValidator } from '../../../utility/Stat.validator';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { selectPreferences } from '../judge.selector';
import { addStat, deleteStat } from '../judge.actions';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})

/**
 * FIXME: ADDING AND REMOVING PREFRENCES STILL BROKEN
 * TODO: Defaults button, make users have minimum of 1 stat
 */
export class PreferencesComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.preferenceStatsSub != null) {
      this.preferenceStatsSub.unsubscribe();
    }

  }
  preferences$: Observable<Stat[]>;
  preferenceStatsOld: Stat[];
  newStat: Stat;
  private preferenceStatsSub: Subscription;

  constructor(private judgeService: JudgeService, private router: Router, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PreferencesComponent>, private store:Store<AppState>) { }

  ngOnInit() {
    this.preferences$ = this.store.pipe(
      select(selectPreferences)
    );

    this.resetStat();
    if (this.router.url.includes("judge")) {
      this.preferenceStatsOld = this.judgeService.getStats();
    } else {
      this.preferenceStatsSub = this.judgeService.getPreferenceUpdateListener().subscribe(statsData => {
        this.preferenceStatsOld = statsData;
      });
      this.judgeService.getPreferences();
    }
  }

  removeStat(stat: Stat) {
    this.store.dispatch(deleteStat({statId:stat.id}));
  }

  addStat() {
    const isValid = StatValidator.isValidStat(this.newStat, this.preferenceStatsOld);
    if (isValid) {

      if (this.newStat.isShared) {
        this.resetSharedStat(this.newStat);
      }
      this.store.dispatch(addStat({stat:this.newStat}));

      this.preferenceStatsOld.push(this.newStat);
      this.resetStat();
    } else {
      this.snackBar.open('Please enter a valid name.', 'Error',
        {
          duration: 2000
        });
    }

  }

  updatePreferences() {
    this.judgeService.updatePreferences(this.preferenceStatsOld).subscribe(response => {
      this.judgeService.updatePreferenceListeners(this.preferenceStatsOld);
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

  updateStat(id: string, newValue:number, attribute:string){

  }

  correctStat(stat: Stat, newValue) {
    console.log(stat);
    console.log(newValue);
    StatValidator.correctValues(stat);
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
