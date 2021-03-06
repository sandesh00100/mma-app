import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { StatValidator } from '../../../utility/Stat.validator';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { selectPreferences } from '../judge.selector';
import { addStat, deleteStat, updateStat } from '../judge.actions';
import { Update } from '@ngrx/entity';
import { Stat } from '../../matchesExplorer/stat.model';

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

  constructor(private judgeService: JudgeService, private router: Router, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PreferencesComponent>, private store: Store<AppState>) { }

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
    this.store.dispatch(deleteStat({ statId: stat.id }));
  }

  addStat() {
    const isValid = StatValidator.isValidStat(this.newStat, this.preferenceStatsOld);
    if (isValid) {

      if (this.newStat.isShared) {
        this.newStat.min = 0;
        this.newStat.max = 100;
        this.newStat.value = 50;
      }
      this.store.dispatch(addStat({ stat: this.newStat }));

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
      id: undefined,
      name: undefined,
      min: undefined,
      max: undefined,
      isShared: false,
      value: 0,
      isGreater: false
    };
  }

  resetSharedStat(stat: Stat) {
    let statUpdate:Update<Stat> = {
      id:stat.id,
      changes:{
        min:0,
        max:100,
        value:50,
        isShared:!stat.isShared
      }
    }

    this.store.dispatch(updateStat({update:statUpdate}));
  }

  updateStat(inputHtmlElement, attribute: string, currentStatState: Stat) {
    const inputValue = +inputHtmlElement.value; 
    console.log(inputValue);
    // Make sure user has entered a value
    let changedStatState:Stat = {
      ...currentStatState,
    }
    if (inputHtmlElement.value.trim() != "") {
      switch (attribute) {
        case "value":
          if (inputValue> currentStatState.max){
            inputHtmlElement.value = currentStatState.max;
          } else if(inputValue < currentStatState.min) {
            inputHtmlElement.value = currentStatState.min;
          }
          break;
        case "min":
          if (inputValue > currentStatState.value) {
            inputHtmlElement.value = currentStatState.value;
          }
          break;
        case "max":
          if (inputValue < currentStatState.value) {
            inputHtmlElement.value = currentStatState.value;
          }
          break;
        default:
          break;
      }
      changedStatState[attribute] = +inputHtmlElement.value;
    } else if(attribute == "value"){
      if (currentStatState.min != undefined) {
        changedStatState[attribute] = currentStatState.min;
      } else if (currentStatState.max != undefined) {
        changedStatState[attribute] = currentStatState.max;
      } else {
        changedStatState[attribute] = 0;
      }
    } else {
      changedStatState[attribute] = undefined;
    }
    
    let statUpdate:Update<Stat> = {
      id:currentStatState.id,
      changes:changedStatState
    }

    this.store.dispatch(updateStat({update:statUpdate}));
  }

  correctStat(stat: Stat) {
    StatValidator.correctValues(stat);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
