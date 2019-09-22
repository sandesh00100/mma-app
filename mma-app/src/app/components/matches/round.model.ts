import { ValueValidator } from "../validators/value.validator";
import { Stat } from "../enums/stat.enum";
import { Validators } from "@angular/forms";

export class Round {
    public roundNumber: number;
    public takeDownAttempts: number;
    public significantStrikes: number;
    public octagonControl: number;
    public damageRatio: number;
    public submissionAttempts: number;
    public score: number;
    public statMap: Map<String,{value:string, statType:Stat}>;

    constructor(roundNumber: number, takeDownAttempts: number, significantStrikes: number, damageRatio: number, submissionAttempts: number, score: number) {
        this.roundNumber = roundNumber;
        this.takeDownAttempts = takeDownAttempts;
        this.significantStrikes = significantStrikes;
        this.damageRatio = damageRatio;
        this.submissionAttempts = submissionAttempts;
        this.score = score;
    }

    // public setTakeDownAttempts(takeDownAttempts: number) {
    //     ValueValidator.validatePositiveNumber(takeDownAttempts);
    //     this.takeDownAttempts = takeDownAttempts;
    // }

    // public setSignificantStrikes(significantStrikes: number) {
    //     ValueValidator.validatePositiveNumber(significantStrikes);
    //     this.significantStrikes = significantStrikes;
    // }

    // public setSubmissionAttempts(submissionAttempts: number) {
    //     ValueValidator.validatePositiveNumber(submissionAttempts);
    //     this.submissionAttempts = submissionAttempts;
    // }

    // public setScore(scoreNumber: number, min: number, max: number) {
    //     ValueValidator.validateRange(scoreNumber, min, max);
    //     this.score = this.score;
    // }

    // public setDamageRatio(damageRatio: number) {
    //     ValueValidator.validatePositiveNumber(this.takeDownAttempts);
    //     ValueValidator.validateFraction(this.damageRatio);
    //     this.damageRatio = damageRatio;
    // }

    public addNewStat(statName: string, statType: Stat, initialValue: any) {
        this.statMap.set(statName,{
            value: initialValue,
            statType: statType
        });
    }

    public addStatValue(statName: string, statType: Stat, value: any) {
       
    };

    private validateStatValue (statType: Stat, value: any){
        switch (statType) {
            case Stat.Positive:
                ValueValidator.validatePositiveNumber(value);
            case Stat.Fraction:
                ValueValidator.validateFraction(value);
            case Stat.Range:
        }
    }
}