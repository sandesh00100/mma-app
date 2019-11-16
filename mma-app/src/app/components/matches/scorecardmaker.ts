import { FighterCard } from "./fighterCard.model";
import { Round } from "./round.model";
import { Stat } from "./stat.model";
import { Match } from "./match.model";
import { ScoreCard } from "./scorecard.model";

/**
 * Class Used to set up a scorecard before you submit it.
 */
export class ScoreCardMaker {
  public matchId: string;

  // TODO: maybe having this as an array would create less duplicate code
  public fighter1Card: FighterCard;
  public fighter2Card: FighterCard;
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

      let fighter1Rounds: Round[] = [];
      let fighter2Rounds: Round[] = [];

      for (let i = 0; i < this.numRounds; i++) {
        fighter1Rounds.push(new Round(i + 1));
        fighter2Rounds.push(new Round(i + 1));
      }

      const fighters = fetchedMatch.fighters;
      let fighter1Card = new FighterCard(fighters[0]._id, fighter1Rounds, { fighterName: fighters[0].firstName + " " + fighters[0].lastName, lastName: fighters[0].lastName });
      let fighter2Card = new FighterCard(fighters[1]._id, fighter2Rounds, { fighterName: fighters[1].firstName + " " + fighters[1].lastName, lastName: fighters[1].lastName });

      this.fighter1Card = fighter1Card;
      this.fighter2Card = fighter2Card;

  }

  public initializeStats(stats: Stat[]) {
    this.fighter1Card.rounds.forEach(round => {
      stats.forEach(stat => {
        round.addNewStat(stat.name, stat.isShared, stat.value, stat.min, stat.max);
      });
    });

    this.fighter2Card.rounds.forEach(round => {
      stats.forEach(stat => {
        round.addNewStat(stat.name, stat.isShared, stat.value, stat.min, stat.max);
      });
    });
  }

  public updateStats(stats: Stat[]) {
    this.fighter1Card.rounds.forEach(round => {
      this.applyNewStats(stats, round);
    });
    this.fighter2Card.rounds.forEach(round => {
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
          fighter: this.fighter1Card.fighterId,
          rounds: this.fighter1Card.getRoundInfoList()
        },
        {
          fighter: this.fighter2Card.fighterId,
          rounds: this.fighter2Card.getRoundInfoList()
        }
      ];
    
    const roundLength = roundsScored[0].rounds.length;
    for (let i = 0; i < roundLength; i++) {
      const fighter1CurrentStats = roundsScored[0].rounds[i].stats;
      const fighter2CurrentStats = roundsScored[1].rounds[i].stats;
      const statLength = roundsScored[0].rounds[i].stats.length;

      for (let j = 0; j < statLength; j++){
        let fighter1Stat = fighter1CurrentStats[j];
        let fighter2Stat = fighter2CurrentStats[j];

        if (fighter1Stat.value > fighter2Stat.value){
          console.log("fighter1 stat " + fighter1Stat.name + " is greater "+fighter1Stat.value + "-" + fighter2Stat.value);
          fighter1Stat.isGreater = true;
        } else if (fighter1Stat.value < fighter2Stat.value){
          console.log("fighter2 stat " + fighter2Stat.name + " is greater "+fighter2Stat.value + "-" + fighter1Stat.value);
          fighter2Stat.isGreater = true;
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

  public getFighter1LastName() {
    return this.fighter1Card.fighterInfo.lastName;
  }

  public getFighter2LastName() {
    return this.fighter2Card.fighterInfo.lastName;
  }

  public getFighter1Name() {
    return this.fighter1Card.fighterInfo.fighterName;
  }

  public getFighter2Name() {
    return this.fighter2Card.fighterInfo.fighterName;
  }

  public getFighter1RoundStats(round: number) {
    return this.fighter1Card.rounds[round - 1].stats;
  }

  public getFighter2RoundStats(round: number) {
    return this.fighter2Card.rounds[round - 1].stats;
  }

}
