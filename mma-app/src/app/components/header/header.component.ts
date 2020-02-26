import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { PreferencesComponent } from '../judge/preferences/preferences.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { logout } from '../judge/judge.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private judgeServiceListener: Subscription;
  filterOptions: string[] = ["Event", "Fighter"];
  isAuth: boolean = false;
  username: string;
  constructor(private judgeService: JudgeService, private dialogService: MatDialog, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.isAuth = this.judgeService.userIsAuth();
    this.username = this.judgeService.getEmail();

    this.judgeServiceListener = this.judgeService.getAuthStatusListener().subscribe(auth => {
      this.isAuth = auth;
      this.username = this.judgeService.getEmail();
    });
  }

  ngOnDestroy(): void {
    this.judgeServiceListener.unsubscribe();
  }

  signout() {
    this.store.dispatch(logout());
    this.judgeService.signout();
  }

  openHistory() {
    this.router.navigate(["/history"]);
  }
  openPreferenceDialog() {
    this.dialogService.open(PreferencesComponent);
  }

}
