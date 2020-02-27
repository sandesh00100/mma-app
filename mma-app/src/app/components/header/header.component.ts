import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { PreferencesComponent } from '../judge/preferences/preferences.component';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { logout } from '../judge/judge.actions';
import { Judge } from '../judge/judge.model';
import { isAuth, selectJudge, isNotAuth } from '../judge/judge.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private judgeServiceListener: Subscription;
  filterOptions: string[] = ["Event", "Fighter"];
  isAuth$:Observable<boolean>;
  isNotAuth$:Observable<boolean>;

  judge$:Observable<Judge>;

  username: string;
  constructor(private judgeService: JudgeService, private dialogService: MatDialog, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.isAuth$ = this.store.pipe(
      select(isAuth),
      tap(auth => {
        console.log("here"),
        console.log(auth);
      }),
    );
    
    this.isNotAuth$ = this.store.pipe(
      select(isNotAuth)
    );
    
    this.judge$ = this.store.pipe(
      select(selectJudge)
    );
  }

  ngOnDestroy(): void {
    this.judgeServiceListener.unsubscribe();
  }

  signout() {
    this.store.dispatch(logout());
  }

  openHistory() {
    this.router.navigate(["/history"]);
  }
  openPreferenceDialog() {
    this.dialogService.open(PreferencesComponent);
  }

}
