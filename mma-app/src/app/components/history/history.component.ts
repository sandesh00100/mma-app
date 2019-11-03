import { Component, OnInit } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { ScoreCard } from '../matches/scorecard.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  currentPage: number = 1;
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1,5,10,20];
  judgeHistory: ScoreCard[];
  constructor(private judgeService:JudgeService) { }

  ngOnInit() {
    this.judgeService.getJudgeHistory(2,1).subscribe(fetchedHistory => {
      console.log(fetchedHistory);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    
  }
}
