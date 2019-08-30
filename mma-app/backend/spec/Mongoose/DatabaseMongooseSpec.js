const mongoose = require('mongoose');
const MatchModel = require('../../models/match.model');
const FighterModel = require("../../models/fighter.model");
const JudgeModel = require('../../models/judge.model');

describe('Mongo Database Models', () => {
    let fighterObj;
    let fighter2Obj;
    let fighter1;
    let fighter2;
    let matchObj;

    beforeEach(() => {
        fighterObj = {
            firstName: "Sandesh",
            lastName: "Shrestha",
            isActive: true,
            imagePath: "/somepath.png",
            record: {
                wins: 1,
                losses: 1,
                draws: 1,
                disqualifications: 1,
            },
            isTestData: true
        };

        fighter2Obj = { ...fighterObj };
        fighter2Obj.firstName = "Steve";

        fighter1 = new FighterModel(fighterObj);
        fighter2 = new FighterModel(fighter2Obj);

        matchObj = {
            eventName: "UFC 242",
            organization: "UFC",
            weightClass: 155,
            matchType: "Main",
            matchOrder: 1,
            isFiveRounds: true,
            fighters: [],
            isTestData: true
        }
    });

    afterAll((done) => {
        console.info("\t* Deleting test data: ");

        // Maybe use return statemetns for these
        FighterModel.deleteMany({ isTestData: true }).then((deletedFightsResponse) => {
            console.info("\t\t* Num Fighters: " + deletedFightsResponse.n);
            MatchModel.deleteMany({ isTestData: true }).then((deletedMatchesResponse) => {
                console.info("\t\t* Num Matches: " + deletedMatchesResponse.n);
                JudgeModel.deleteMany({ isTestData: true }).then(deletedJudgeResponse => {
                    console.info("\t\t* Num Judges: " + deletedJudgeResponse.n);
                    done();
                });
            });
        });


    });

    it('Creates new fighters', (done) => {
        fighter1.save().then((savedFighter) => {
            expect(savedFighter.firstName).toBe("Sandesh");
            fighter2.save().then(savedFighter2 => {
                expect(savedFighter2.firstName).toBe("Steve");
                done();
            });
        });
    });

    it('Creates a match', done => {
        fighter1.save().then((savedFighter1) => {
            matchObj.fighters.push(savedFighter1._id);
            fighter2.save().then((savedFighter2) => {
                matchObj.fighters.push(savedFighter2._id);
                const match = new MatchModel(matchObj);
                match.save().then(savedMatch => {
                    expect(savedMatch.fighters.length).toBe(2);
                    expect(match.eventName).toBe("UFC 242");
                    MatchModel.findOne({ eventName: "UFC 242" }).populate('fighters').exec((err, foundMatch) => {
                        if (err) {
                            console.info(err);
                        } else {
                            expect(foundMatch.fighters[0].firstName).not.toBe(null);
                        }
                        done();
                    });
                }).catch(err => {
                    console.info(err);
                    done();
                });
            });
        });
    });

    it('Creates a Judge', done => {
        let judgeObj = {
            email: "sandesh@test.com",
            password: "testPassword",
            matches: [],
            isTestData: true
        };

        let roundsScoredObj1 = [];
        let roundsScoredObj2 = [];

        for (let i = 0; i < 5; i++) {
            roundsScoredObj1.push({
                takeDownAttempts: i,
                takeDownDefense: i,
                significantStrikes: i,
                octagonControl: i,
                damageRatio: i,
                submissionAttempts: i,
                // Random number between 7-10
                score: Math.floor(Math.random() * (10 - 7)) + 7,
                roundNumber: i + 1
            });
            roundsScoredObj2.push({
                takeDownAttempts: i,
                takeDownDefense: i,
                significantStrikes: i,
                octagonControl: i,
                damageRatio: i,
                submissionAttempts: i,
                score: Math.floor(Math.random() * (10 - 7)) + 7,
                roundNumber: i + 1
            });
        }

        fighter1.save().then(savedFighter1 => {
            matchObj.fighters.push(savedFighter1._id);
            fighter2.save().then(savedFighter2 => {
                matchObj.fighters.push(savedFighter2._id);
                const testMatch = new MatchModel(matchObj);
                testMatch.save().then(savedMatch => {
                    MatchModel.findById(savedMatch._id).populate('fighters').exec((err, popMatch) => {
                        const judgeMatchObj = {
                            match: popMatch._id,
                            roundsScored: [
                                {
                                    fighter: popMatch.fighters[0]._id,
                                    rounds: roundsScoredObj1
                                },
                                {
                                    fighter: popMatch.fighters[1]._id,
                                    rounds: roundsScoredObj2
                                }
                            ]
                        };

                        judgeObj.matches.push(judgeMatchObj);
                        const judge = new JudgeModel(judgeObj);
                        judge.save().then(savedJudge => {
                            JudgeModel.findById(savedJudge)
                                .populate('match')
                                .populate('fighter')
                                .exec((err, foundJudge) => {
                                    if (!err) {
                                        expect(foundJudge.email).toBe('sandesh@test.com');
                                        expect(foundJudge.matches.length).toEqual(1);
                                        done();
                                    }
                                });
                        });
                    });

                });
            });
        });
    });

});