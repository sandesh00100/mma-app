import { Component, OnInit, OnDestroy } from '@angular/core';
import { JudgeService } from '../judge/judge.service';
import { ScoreCard } from '../matches/scorecard.model';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.judgeHistorySubs.unsubscribe();
  }
  currentPage: number = 1;
  pageLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1, 5, 10, 20];
  judgeHistory: ScoreCard[];
  private judgeHistorySubs: Subscription;

  constructor(private judgeService: JudgeService) { }

  ngOnInit() {
    this.judgeHistorySubs = this.judgeService.getJudgeHistoryUpdateListener().subscribe(judgeHistoryData => {
      this.judgeHistory = judgeHistoryData.scoreCards;
      this.pageLength = judgeHistoryData.totalScoreCards;
      console.log(judgeHistoryData);
    });
    this.judgeService.getJudgeHistory(this.pageSize, this.currentPage);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.judgeService.getJudgeHistory(this.pageSize, this.currentPage);
  }

  /**
   * Function takes in scorecard object and fighter and returns a datasource for the cdk table
   * @param scorecard 
   * @param fighter 
   */
  getTableDataSource(scorecard: ScoreCard, fighter: number): string[] {
    const rounds = scorecard.roundsScored[fighter - 1].rounds;
    let dataSource = [];

    let sharedStatNames = new Set();
    let summarizedDataObject = {
      Round: "*"
    };

    rounds.forEach(currentRound => {
      let dataSourceRow = {
        Round: currentRound.round
      };
      currentRound.stats.forEach(stat => {
        if (summarizedDataObject[stat.name] == undefined) {
          summarizedDataObject[stat.name] = stat.value;
        } else {
          summarizedDataObject[stat.name] += stat.value;
        }

        if (!stat.isShared) {
          dataSourceRow[stat.name] = stat.value;
        } else {
          sharedStatNames.add(stat.name);
          dataSourceRow[stat.name] = stat.value + "%";
        }
      });
      dataSource.push(dataSourceRow);
    });

    sharedStatNames.forEach((sharedStatName:string) => {
      summarizedDataObject[sharedStatName] /= rounds.length;
      summarizedDataObject[sharedStatName] = Math.round(summarizedDataObject[sharedStatName]) + "%";
    });


    dataSource.push(summarizedDataObject);
    return dataSource;
  }

  getTableColumnsToDisplay(scorecard: ScoreCard, fighter: number): string[] {
    let columnsToDisplay = ["Round"];
    let fighterStats = scorecard.roundsScored[fighter - 1].rounds[0].stats;

    fighterStats.forEach(stat => {
      columnsToDisplay.push(stat.name);
    });

    return columnsToDisplay;
  }
}
