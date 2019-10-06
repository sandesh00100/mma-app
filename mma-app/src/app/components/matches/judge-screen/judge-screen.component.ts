import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ScoreCard } from '../scorecard.model';
import { Stat } from '../stat.model';

@Component({
  selector: 'app-judge-screen',
  templateUrl: './judge-screen.component.html',
  styleUrls: ['./judge-screen.component.css']
})
export class JudgeScreenComponent implements OnInit {
  private SECONDS_PER_ROUND: number = 300;
  private SECONDS_PER_BREAK: number = 60;
  private interval;
  private clockIsActive: boolean = false;
  private breakStarted: boolean = false;
  private currentTimeInSeconds: number;
  currentFighter1Stats: Stat[];
  currentFighter2Stats: Stat[];
  currentInputValue;

  currentScoreCard: ScoreCard;
  currentRound: number = 1;
  rounds: number[] = [];
  minutes: string = "5";
  seconds: string = "00";
  currentTimerColor: string;

  constructor(private matchService: MatchService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Don't fetch if we already have a match from the match-list-screen
    // Since we have the auth guard it will get it from the already fetched matches for now
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const matchId = paramMap.get('matchId');
      this.matchService.getMatch(matchId).subscribe(matchData => {
        const fetchedMatch = matchData.match;
        let matchLength;
        console.log(fetchedMatch);
        if (fetchedMatch.isFiveRounds) {
          matchLength = 5;
        } else {
          matchLength = 3;
        }

        for (let i = 0; i < matchLength; i++) {
          this.rounds.push(i + 1);
        }

        this.currentScoreCard = new ScoreCard(matchLength, fetchedMatch);

        this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
        this.updateClock();
        this.updateCurrentStatMaps();
        this.getStatArray();
      });
    });
  }

  startTimer() {

    // Making sure the interval doesn't start again when clock is active
    if (this.clockIsActive != true) {
      this.clockIsActive = true;
      this.interval = setInterval(() => {
        if (this.currentTimeInSeconds > 0) {
          this.currentTimeInSeconds--;
          this.updateClock();
          // Timer dynimically changes green value as time decreases
          this.clockIsActive = true;
        } else {
          if (this.currentRound < this.rounds.length){
            if (!this.breakStarted){
              this.currentTimeInSeconds = this.SECONDS_PER_BREAK;
              this.breakStarted = true;
              this.updateClock();
            } else {
              this.nextRound();
              this.breakStarted = false;
              this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
              this.updateClock();
            }
            
          } else {
            this.stopTimer();
          }
        }
      }, 1000);
    }
  }


  updateClock() {
    this.currentTimerColor = `rgb(255,${255 - (this.SECONDS_PER_ROUND - this.currentTimeInSeconds)},0)`;
    this.minutes = Math.floor(this.currentTimeInSeconds / 60).toString();
    const nonPadedSeconds: string = (this.currentTimeInSeconds % 60).toString();
    // Quick and dirty way of getting padding
    if (nonPadedSeconds.length < 2) {
      this.seconds = '0' + nonPadedSeconds;
    } else {
      this.seconds = nonPadedSeconds;
    }
    
  }

  /**
   * Stops fight clock
   */
  stopTimer() {
    this.clockIsActive = false;
    clearInterval(this.interval);
  }

  nextRound() {
    if (this.currentRound < this.rounds.length) {
      this.currentRound += 1;
      this.updateCurrentStatMaps();
      this.resetTimer();
    }
  }

  previousRound() {
    if (this.currentRound > 1) {
      this.currentRound -= 1;
      this.updateCurrentStatMaps();
      this.resetTimer();
    }
  }

  resetTimer() {
    this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
    this.updateClock();
    if (!this.breakStarted){
      this.stopTimer();
    }
  }

  updateStat(stat){
    
    if (stat.max == null || stat.value < stat.max){
      stat.value += 1;
    }
  }

  updateCurrentStatMaps(){
    this.currentFighter1Stats = this.currentScoreCard.getFighter1RoundStats(this.currentRound);
    this.currentFighter2Stats = this.currentScoreCard.getFighter2RoundStats(this.currentRound);
  }

  // Probably temporary code, might get this info depending on judge settings
  getStatArray(){
    // Doesn't matter which map we get keys from
    return this.currentFighter1Stats.filter((stat) => {
      return stat.isShared;
    }).map((stat) => {
      return stat.name;
    });
  }

  getStatValue(stats:Stat[], statName: string){
    return stats.find(stat => stat.name == statName);
  }

  updateFighter2Stat(statName:string, value:number){
    this.currentFighter2Stats.find(stat => stat.name == statName).value = 100 - this.currentFighter1Stats.find(stat => stat.name == statName).value;
  }

  submitScoreCard(){
    console.log("submitScoreCard() called!");
  }
}
