import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from '../matches/match.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ScoreCardMaker } from '../matches/scorecardmaker';
import { Stat } from '../matches/stat.model';
import { FormGroup } from '@angular/forms';
import { JudgeService } from './judge.service';
import { Subscription} from 'rxjs';
import { StatValidator } from '../utility/Stat.validator';
import { Match } from '../matches/match.model';
import { FighterInfo, FighterCard } from '../matches/fighterCard';

@Component({
  selector: 'app-judge-screen',
  templateUrl: './judge-screen.component.html',
  styleUrls: ['./judge-screen.component.css']
})
export class JudgeScreenComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.preferenceStatsSubscription.unsubscribe();
  }
  private SECONDS_PER_ROUND: number = 300;
  private SECONDS_PER_BREAK: number = 60;
  private interval;
  private clockIsActive: boolean = false;
  private breakStarted: boolean = false;
  private currentTimeInSeconds: number;
  private preferenceStatsSubscription: Subscription;

  currentRedFighterInfo:FighterInfo;
  currentBlueFighterInfo:FighterInfo;

  currentRedFighterStats: Stat[];
  currentBlueFighterStats: Stat[];
  currentInputValue;
  form: FormGroup;
  initialPreferenceFetch: boolean = false;

  currentScoreCard: ScoreCardMaker;
  currentRound: number = 1;
  rounds: number[] = [];
  minutes: string = "5";
  seconds: string = "00";
  currentTimerColor: string;

  constructor(private matchService: MatchService, private route: ActivatedRoute, private judgeService: JudgeService) { }

  ngOnInit() {
    // Don't fetch if we already have a match from the match-list-screen
    // Since we have the auth guard it will get it from the already fetched matches for now
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const matchId = paramMap.get('matchId');

      this.matchService.getMatch(matchId).subscribe(matchData => {
        const fetchedMatch: Match = matchData.match;

        this.currentScoreCard = new ScoreCardMaker(fetchedMatch);
        this.currentRedFighterInfo = this.currentScoreCard.getRedFighterInfo();
        this.currentBlueFighterInfo = this.currentScoreCard.getBlueFighterInfo();

        this.rounds = this.currentScoreCard.getNumericalRoundArray();
        this.currentTimeInSeconds = this.SECONDS_PER_ROUND;

        this.preferenceStatsSubscription = this.judgeService.getPreferenceUpdateListener().subscribe(statsData => {

          if (!this.initialPreferenceFetch) {
            this.currentScoreCard.initializeStats(statsData);
            this.updateClock();
            this.updateCurrentStatLists();
            this.initialPreferenceFetch = true;
          } else {
            //TODO: update current score card according to the updated stats
            console.log("Getting info from preference subscription");
            this.currentScoreCard.updateStats(statsData);
          }

        });

        this.judgeService.getPreferences();
      });
    });
  }

  updateStat(stat) {
    if (stat.max == null || stat.value < stat.max) {
      stat.value += 1;
    }
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
          if (this.currentRound < this.rounds.length) {
            if (!this.breakStarted) {
              this.currentTimeInSeconds = this.SECONDS_PER_BREAK;
              this.breakStarted = true;
              this.updateClock();
            } else {
              this.nextRound(false);
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

  /**
   * Converts second's to whats going to be displayed on the clock
   */
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
   * Stops fight timer
   */
  stopTimer() {
    this.clockIsActive = false;
    clearInterval(this.interval);
  }

  /**
   * Changes the current round to next and updates the stats list
   * @param isUserInput true or false depending if this method is called from a click event
   */
  nextRound(isUserInput: boolean) {
    if (this.currentRound < this.rounds.length) {
      this.currentRound += 1;
      this.updateCurrentStatLists();
      if (isUserInput) {
        this.breakStarted = false;
      }
      this.resetTimer();
    }
  }

  /**
   * Changes the current round to previous and updates the stats list
   * @param isUserInput true or false depending if this method is called from a click event
   */
  previousRound(isUserInput: boolean) {
    if (this.currentRound > 1) {
      this.currentRound -= 1;
      this.updateCurrentStatLists();
      if (isUserInput) {
        this.breakStarted = false;
      }
      this.resetTimer();
    }
  }

  /**
   * Reset's the timer to seconds per round, stops the timer if break is not started
   */
  resetTimer() {
    this.currentTimeInSeconds = this.SECONDS_PER_ROUND;
    this.updateClock();
    if (!this.breakStarted) {
      this.stopTimer();
    }
  }

  /**
   * Change current stat list based on what the current round is
   */
  updateCurrentStatLists() {
    this.currentRedFighterStats = this.currentScoreCard.getRedFighterRoundStats(this.currentRound);
    this.currentBlueFighterStats = this.currentScoreCard.getBlueFighterRoundStats(this.currentRound);
  }

  /**
   * Since the shared stats sliders are based on fighter 1 stats.
   * This method allows us to update fighter 2 stats after a judge has changed the slider.
   * @param statName
   */
  updateBlueFighterStat(statName: string) {
    this.currentBlueFighterStats.find(stat => stat.name == statName).value = 100 - this.currentRedFighterStats.find(stat => stat.name == statName).value;
  }

  submitScoreCard() {
    this.judgeService.saveScoreCard(this.currentScoreCard);
  }

  /**
   * Validates and corrects user's inputs.
   * If input is larger than max it sets it as max.
   * If input is smaller than min it sets it as the min.
   * @param stat statObject it's displaying
   */
  correctStat(stat: Stat) {
   StatValidator.correctValues(stat);
  }
}
