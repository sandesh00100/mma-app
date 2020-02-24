import { FighterCard, FighterInfo } from "./fighterCard";
import { Round } from "./round";
import { Stat } from "../../matches/stat.model";
import { Match } from "../../matches/match.model";
import { ScoreCard } from "./scorecard.model";

/**
 * Class Used to set up a scorecard before you submit it.
 */
export class ScoreCardMaker {
  public matchId: string;

  // TODO: maybe having this as an array would create less duplicate code
  public redFighterCard: FighterCard;
  public blueFighterCard: FighterCard;
  public eventName: string;
  public numRounds: number;

  
  constructor(fetchedMatch: Match) {

      this.matchId = fetchedMatch._id;
      this.eventName = fetchedMatch.eventName;

      if (fetchedMatch.isFiveRounds){
        this.numRounds = 5;
      }  else {
        this.numRounds = 3;
      }

      let redFighterRounds: Round[] = [];
      let blueFighterRounds: Round[] = [];

      for (let i = 0; i < this.numRounds; i++) {
        redFighterRounds.push(new Round(i + 1));
        blueFighterRounds.push(new Round(i + 1));
      }

      const fighters = fetchedMatch.fighters;
      const redFighterInfo = {
        fighterName: fighters[0].firstName + " " + fighters[0].lastName,
        lastName: fighters[0].lastName,
        imagePath: fighters[0].imagePath
      };
      const blueFighterInfo = {
        fighterName: fighters[1].firstName + " " + fighters[1].lastName,
        lastName: fighters[1].lastName,
        imagePath: fighters[1].imagePath
      };
      let redFighterCard = new FighterCard(fighters[0]._id, redFighterRounds, redFighterInfo);
      let blueFighterCard = new FighterCard(fighters[1]._id, blueFighterRounds, blueFighterInfo);

      this.redFighterCard = redFighterCard;
      this.blueFighterCard = blueFighterCard;

  }

  public initializeStats(stats: Stat[]) {
    this.redFighterCard.rounds.forEach(round => {
      stats.forEach(stat => {
        round.addNewStat(stat.name, stat.isShared, stat.value, stat.min, stat.max);
      });
    });

    this.blueFighterCard.rounds.forEach(round => {
      stats.forEach(stat => {
        round.addNewStat(stat.name, stat.isShared, stat.value, stat.min, stat.max);
      });
    });
  }

  public updateStats(stats: Stat[]) {
    this.redFighterCard.rounds.forEach(round => {
      this.applyNewStats(stats, round);
    });
    this.blueFighterCard.rounds.forEach(round => {
      this.applyNewStats(stats, round);
    });
  }

  private applyNewStats(stats: Stat[], round: any) {
    // Remove deleted stats
    let roundStats = round.stats;
    let removedStatIndicies = [];

    for (let i = 0; i < roundStats.length; i++) {
      const currentRoundStat = roundStats[i];
      const foundStat = stats.find(stat => {
        return currentRoundStat.name === stat.name;
      });
      if (foundStat == null) {
        removedStatIndicies.push(i);
      }
    }

    removedStatIndicies.forEach(index => {
      roundStats.splice(index, 1);
    });

    // Updating/Adding stat information
    stats.forEach(stat => {
      let foundRoundStat = roundStats.find(roundStat => {
        return roundStat.name === stat.name;
      });

      if (foundRoundStat == null) {
        roundStats.push({ ...stat });
      } else {
        if (foundRoundStat.value < stat.min) {
          foundRoundStat.value = stat.min;
        } else if (foundRoundStat.value > stat.max) {
          foundRoundStat.value = stat.max;
        }
        foundRoundStat.min = stat.min;
        foundRoundStat.max = stat.max;
        foundRoundStat.isShared = stat.isShared;
      }
    });
  }

  public getJsonObject(): ScoreCard {
    // Backend will get judgeid from token
    let roundsScored = [
        {
          fighter: this.redFighterCard.fighterId,
          rounds: this.redFighterCard.getRoundInfoList()
        },
        {
          fighter: this.blueFighterCard.fighterId,
          rounds: this.blueFighterCard.getRoundInfoList()
        }
      ];
    
    const roundLength = roundsScored[0].rounds.length;
    for (let i = 0; i < roundLength; i++) {
      const redFighterCurrentStats = roundsScored[0].rounds[i].stats;
      const blueFighterCurrentStats = roundsScored[1].rounds[i].stats;
      const statLength = roundsScored[0].rounds[i].stats.length;

      for (let j = 0; j < statLength; j++){
        let redFighterStat = redFighterCurrentStats[j];
        let blueFighterStat = blueFighterCurrentStats[j];

        if (redFighterStat.value > blueFighterStat.value){
          console.log("redFighter stat " + redFighterStat.name + " is greater "+redFighterStat.value + "-" + blueFighterStat.value);
          redFighterStat.isGreater = true;
        } else if (redFighterStat.value < blueFighterStat.value){
          console.log("blueFighter stat " + blueFighterStat.name + " is greater "+blueFighterStat.value + "-" + redFighterStat.value);
          blueFighterStat.isGreater = true;
        }
      }
    }

    const scorecard: ScoreCard = {
      match: this.matchId,
      judge:"",
      roundsScored: roundsScored
    };
    console.log("Json Score Card:");
    console.log(scorecard);
    return scorecard;
  }

  public getNumericalRoundArray(){
    let roundArray = [];

    for (let i = 0; i < this.numRounds; i++){
      roundArray.push(i+1);
    }

    return roundArray;
  }

  public getStatHslValues(roundNumber:number): string[]{
    return this.redFighterCard.rounds[roundNumber-1].hslValues;
  }
  
  public getRedFighterInfo(): FighterInfo{
    return this.redFighterCard.fighterInfo;
  }

  public getBlueFighterInfo(): FighterInfo{
    return this.blueFighterCard.fighterInfo;
  }

  public getRedFighterRoundStats(round: number) {
    return this.redFighterCard.rounds[round - 1].stats;
  }

  public getBlueFighterRoundStats(round: number) {
    return this.blueFighterCard.rounds[round - 1].stats;
  }
}
