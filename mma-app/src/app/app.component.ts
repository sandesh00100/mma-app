import { Component } from '@angular/core';
import { JudgeService } from './components/judge/judge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private judgeService: JudgeService){
    
  }
  ngOnInit(): void {
    this.judgeService.autoAuthUser();
  }
  title = 'app';
}
