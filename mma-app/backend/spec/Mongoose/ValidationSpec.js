const mongoose = require('mongoose');
const FighterModel = require('../../models/fighter.model');
const MatchModel = require('../../models/match.model');

describe("Validation tests", () => {
    beforeAll((done) => {
        // TODO: Might need to add the block of code below, relying on the first spec connecting to mongoose 
        // // secure password relative to app.js
        // const mongoPassword = require('../../../../../pas');
        // // 'node-angular' is the database it is storing the post in
        // const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

        // mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true })
        //     .then(() => {
        //         console.info('\n*Connected to mongo\n');
        //         done();
        //     }).catch(() => {
        //         console.info('\n*Connection failed\n');
        //         done();
        //     });
        done();
    });

    it('validates a match', done => {

        const matchObject = {
            eventName: "UFC 242",
            organization: "UFC",
            weightClass: 170,
            matchType: 'Main',
            matchOrder: 1,
            isFiveRounds: true,
            // TODO: Remove this if we use a test database for the tests
            isTestData: true
        };

        let fighterObjs = [];
        let fighterIds = [];

        for (let i = 0; i < 2; i++) {
            fighterObjs.push({
                firstName: "FirstName" + i,
                lastName: "LastName" + i,
                isTestData: true
            });
        }

        const saveLoop = async () => {
            for (fighterObj of fighterObjs) {
                const fighter = new FighterModel(fighterObj);

                await fighter.save().then((savedFighter) => {
                    console.info(savedFighter._id);
                    fighterIds.push(savedFighter._id);
                });
            }
            matchObject.fighters = fighterIds;
            console.info(matchObject.fighters);
            const match = new MatchModel(matchObject);
            match.save().then(savedMatch => {
                done();
            }
            );

        };

        saveLoop();

    });
});