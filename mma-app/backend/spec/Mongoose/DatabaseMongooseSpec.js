const mongoose = require('mongoose');
const MatchModel = require('../../models/match.model');
const FighterModel = require("../../models/fighter.model");

describe('Mongo Database Models', () => {
    let fighterJson;
    let fighter2Json;
    let fighter1;
    let fighter2;

    beforeAll((done) => {
        // secure password relative to app.js
        const mongoPassword = require('../../../../../pas');
        // 'node-angular' is the database it is storing the post in
        const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

        mongoose.connect(databaseURL, { useNewUrlParser: true })
            .then(() => {
                console.info('\n*Connected to mongo\n');
                done();
            }).catch(() => {
                console.info('\n*Connection failed\n');
                done();
            });
    });

    beforeEach(() => {
        fighterJson = {
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
        fighter2Json = { ...fighterJson };
        fighter2Json.firstName = "Steve";

        fighter1 = new FighterModel(fighterJson);
        fighter2 = new FighterModel(fighter2Json);
    });

    afterAll((done) => {
        console.info("\t* Deleting test data: ");
        // FighterModel.find().then(foundFighters => {
        //     console.info("\t\t* Num Fighters: " + foundFighters.length);
        //     FighterModel.collection.drop().then(() => {
        //         MatchModel.find().then(foundMatches => {
        //             MatchModel.collection.drop().then(() => {
        //                 console.info("\t\t* Num Matches: " + foundMatches.length);
        //                 done();
        //             });
        //         });

        //     }).catch((err) => {
        //         console.info(err);
        //         done();
        //     });
        // });
        FighterModel.deleteMany({ isTestData: true }).then((deletedFightsResponse) => {
            console.info("\t\t* Num Fighters: " + deletedFightsResponse.n);
            MatchModel.deleteMany({ isTestData: true }).then((deletedMatchesResponse) => {
                console.info("\t\t* Num Matches: " + deletedMatchesResponse.n);
                done();
            });
        });


    });

    it('Creates new fighters', (done) => {

        fighter1.save().then((savedFighter) => {
            expect(savedFighter.firstName).toBe("Sandesh");
            fighter2.save().then(savedFighter => {
                expect(savedFighter.firstName).toBe("Steve");
                done();
            });
        });
    });

    it('Creates a match', done => {
        let matchObj = {
            eventName: "UFC 242",
            organization: "UFC",
            weightClass: 155,
            matchType: "Main",
            matchOrder: 1,
            isFiveRounds: true,
            fighters: [],
            isTestData: true
        };

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

    it('Creates a User', done => {
        done();
    });

});