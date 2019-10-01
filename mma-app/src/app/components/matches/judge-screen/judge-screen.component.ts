import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ScoreCard } from '../scorecard.model';
import { Round } from '../round.model';
import { FighterCard } from '../fighterCard.model';

@Component({
  selector: 'app-judge-screen',
  templateUrl: './judge-screen.component.html',
  styleUrls: ['./judge-screen.component.css']
})
export class JudgeScreenComponent implements OnInit {
  private SECONDS_PER_ROUND: number = 300;
  private interval;
  private clockIsActive: boolean = false;
  private currentTimeInSeconds: number;
  fighter1StatMap;
  fighter2StatMap;
  
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

        let fighter1Rounds: Round[] = [];
        let fighter2Rounds: Round[] = [];

        let matchLength;

        if (fetchedMatch.isFiveRounds) {
          matchLength = 5;
        } else {
          matchLength = 3;
        }

        for (let i = 0; i < matchLength; i++) {
          fighter1Rounds.push(new Round(i + 1));
          fighter2Rounds.push(new Round(i + 1));
          this.rounds.push(i + 1);
        }

        const fighters = fetchedMatch.fighters;
        let fighter1Card = new FighterCard(fighters[0].id, fighter1Rounds, { fighterName: fighters[0].firstName + " " + fighters[0].lastName, lastName: fighters[0].lastName });
        let fighter2Card = new FighterCard(fighters[1].id, fighter1Rounds, { fighterName: fighters[1].firstName + " " + fighters[1].lastName, lastName: fighters[1].lastName });

        this.currentScoreCard = new ScoreCard(fetchedMatch.matchId, fighter1Card, fighter2Card, fetchedMatch.eventName);

        this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
        this.updateClock();
        this.fighter1StatMap = this.currentScoreCard.getFighter1RoundStats(this.currentRound);
        this.fighter2StatMap = this.currentScoreCard.getFighter2RoundStats(this.currentRound);

        console.log(this.fighter1StatMap);
        console.log(this.fighter2StatMap);
        console.log(this.currentScoreCard);
      });
    });
  }

  startTimer() {

    // Making sure the interval doesn't start again when clock is active
    if (this.clockIsActive != true) {
      this.clockIsActive = true;
      this.interval = setInterval(() => {
        if (this.currentTimeInSeconds >= 0) {
          this.currentTimeInSeconds--;
          this.updateClock();
          // Timer dynimically changes green value as time decreases
          this.clockIsActive = true;
        } else {
          this.stopTimer();
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
      this.resetTimer();
    }
  }

  previousRound() {
    if (this.currentRound > 1) {
      this.currentRound -= 1;
      this.resetTimer();
    }
  }

  resetTimer() {
    this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
    this.updateClock();
    this.stopTimer();
  }

  updateStat(stat){
    console.log(stat);
  }
}
