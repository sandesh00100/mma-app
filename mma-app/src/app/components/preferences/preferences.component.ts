import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Stat } from '../matches/stat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.preferenceStatsSub != null){
      this.preferenceStatsSub.unsubscribe();
    }
    
  }

  preferenceStats: Stat[];
  private preferenceStatsSub: Subscription;

  constructor(private judgeService: JudgeService, private router: Router) { }

  ngOnInit() {
    if (this.router.url.includes("judge")){
      this.preferenceStats = this.judgeService.getStats();
    } else {
      this.preferenceStatsSub = this.judgeService.getPreferenceUpdateListener().subscribe(statsData => {
        this.preferenceStats = statsData;
      });
      this.judgeService.getPreferences();
    }
  }

}
