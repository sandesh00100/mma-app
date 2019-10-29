import { Component, OnInit } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { ScoreCard } from '../matches/scorecard.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  judgeHistory: ScoreCard[];
  constructor(private judgeService:JudgeService) { }

  ngOnInit() {
    this.judgeService.getJudgeHistory(2,1).subscribe(fetchedHistory => {
      console.log(fetchedHistory);
    });
  }

}
