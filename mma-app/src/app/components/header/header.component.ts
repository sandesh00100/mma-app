import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../judge/judge.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { PreferencesComponent } from '../scorecards/preferences/preferences.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authServiceListener: Subscription;
  filterOptions: string[] = ["Event", "Fighter"];
  isAuth: boolean = false;
  username: string;
  constructor(private authService: AuthService, private dialogService: MatDialog, private router: Router) { }

  ngOnInit() {
    this.isAuth = this.authService.userIsAuth();
    this.username = this.authService.getEmail();

    this.authServiceListener = this.authService.getAuthStatusListener().subscribe(auth => {
      this.isAuth = auth;
      this.username = this.authService.getEmail();
    });
  }

  ngOnDestroy(): void {
    this.authServiceListener.unsubscribe();
  }

  signout() {
    this.authService.signout();
  }

  openHistory() {
    this.router.navigate(["/history"]);
  }
  openPreferenceDialog() {
    this.dialogService.open(PreferencesComponent);
  }

}
