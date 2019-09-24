import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../match.model';
import { Observable } from 'rxjs';
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
  private currentTimeInSeconds: number = this.SECONDS_PER_ROUND;
  currentScoreCard: ScoreCard;

  rounds:number[];
  minutes:string = "5";
  seconds:string = "00";
  currentTimerColor: string;
  
  constructor(private matchService: MatchService, private route: ActivatedRoute) { }
  currentMatch: Match;

  ngOnInit() {
    // Don't fetch if we already have a match from the match-list-screen
    // Since we have the auth guard it will get it from the already fetched matches for now
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const matchId = paramMap.get('matchId');
      if (this.currentMatch == null){
        this.matchService.getMatch(matchId).subscribe(matchData => {
          const fetchedMatch = matchData.match;
          // Copy everything form fetched match but change the id
          this.currentMatch = {
            ...fetchedMatch,
            id:fetchedMatch._id
          };
          
          let fighter1Rounds:Round[] = [];
          let fighter2Rounds:Round[] = [];

          let matchLength;

          if (this.currentMatch.isFiveRounds){
            matchLength = 5;
          } else {
            matchLength = 3;
          }

          for (let i =0; i < matchLength; i++){
            fighter1Rounds.push(new Round());
            fighter2Rounds.push(new Round());
          }
          
          const fighters = this.currentMatch.fighters;
          if (fighters.length > 0){
            let fighter1Card = new FighterCard(fighters[0].id,fighter1Rounds,{fighterName:""});
            let fighter2Card = new FighterCard(fighters[1].id,fighter1Rounds,{fighterName:""});
          }
          

        });
      }
    });
  }

  startTimer(){

    // Making sure the interval doesn't start again when clock is active
    if (this.clockIsActive != true) {
      this.clockIsActive = true;
      this.interval = setInterval( ()=>{
        if (this.currentTimeInSeconds >= 0) {

          // Timer dynimically changes green value as time decreases
          this.currentTimerColor = `rgb(255,${255 - (this.SECONDS_PER_ROUND - this.currentTimeInSeconds)},0)`;
          this.clockIsActive = true;
          this.minutes = Math.floor(this.currentTimeInSeconds/60).toString();
          const nonPadedSeconds:string = (this.currentTimeInSeconds % 60).toString();
          
          // Quick and dirty way of getting padding
          if (nonPadedSeconds.length < 2){
            this.seconds = '0'+nonPadedSeconds;
          } else {
            this.seconds = nonPadedSeconds;
          }
          this.currentTimeInSeconds--;
        } else {
          this.stopTimer();
        }
      },1000);
    }
  }

  /**
   * Stops fight clock
   */
  stopTimer(){
    this.clockIsActive = false;
    clearInterval(this.interval);
  }
}
