import { Component } from '@angular/core';
import { JudgeService } from './components/judge/judge.service';
import { AppState } from './reducers';
import { Store } from '@ngrx/store';
import { autoAuth } from './components/judge/judge.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private judgeService: JudgeService, private store: Store<AppState>){
    
  }
  ngOnInit(): void {
    this.store.dispatch(autoAuth);
    this.judgeService.autoAuthUser();
  }
  title = 'app';
}
