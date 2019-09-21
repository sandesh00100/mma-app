import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../match.model';
import { Observable } from 'rxjs';

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
          if (this.currentMatch.isFiveRounds){
            this.rounds = Array.from({length:5}, (v,i) => i+1);
          } else {
            this.rounds = Array.from({length:3}, (v,i) => i+1);
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
