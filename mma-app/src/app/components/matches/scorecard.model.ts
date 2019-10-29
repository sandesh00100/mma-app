import { FighterCard } from "./fighterCard.model";
import { Round } from "./round.model";
import { Stat } from "./stat.model";

export class ScoreCard {
  public matchId: string;

  // TODO: maybe having this as an array would create less duplicate code
  public fighter1Card: FighterCard;
  public fighter2Card: FighterCard;
  public eventName: string;
  public isHistoryElement: boolean;
  
  constructor(matchLength: number, fetchedMatch: any) {
    this.matchId = fetchedMatch._id;
    this.eventName = fetchedMatch.eventName;

    let fighter1Rounds: Round[] = [];
    let fighter2Rounds: Round[] = [];

    for (let i = 0; i < matchLength; i++) {
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
  public getJsonObject() {
    return {
      match: this.matchId,
      roundsScored: [
        {
          fighter: this.fighter1Card.fighterId,
          rounds: this.fighter1Card.getRoundInfoList()
        },
        {
          fighter: this.fighter2Card.fighterId,
          rounds: this.fighter2Card.getRoundInfoList()
        }
      ]
    };
  }

  public getFighter1LastName() {
    return this.fighter1Card.fighterInfo.lastName;
  }

  public getFighter2LastName() {
    return this.fighter1Card.fighterInfo.lastName;
  }

  public getFighter1Name() {
    return this.fighter1Card.fighterInfo.fighterName;
  }

  public getFighter2Name() {
    return this.fighter1Card.fighterInfo.fighterName;
  }

  public getFighter1RoundStats(round: number) {
    return this.fighter1Card.rounds[round - 1].stats;
  }

  public getFighter2RoundStats(round: number) {
    return this.fighter2Card.rounds[round - 1].stats;
  }

}
