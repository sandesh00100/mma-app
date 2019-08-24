const mongoose = require('mongoose');
const EventModel = require('../../models/event.model');
const FighterModel = require("../../models/fighter.model");

describe('Event database model', () => {
    let event = null;
    beforeAll((done) => {
        // secure password relative to app.js
        const mongoPassword = require('../../../../../pas');
        // 'node-angular' is the database it is storing the post in
        const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
       
        const match1 = {
            fighters:[{
            takeDownAttempts: 1,
            takeDownDefense: 1,
            significantStrikes: 1,
            octagonControl: 1,
            damageRatio: 1,
            submissionAttempts: 1
            }]
            
        };

        const match2 = {
            fighters:[{
            takeDownAttempts: 2,
            takeDownDefense: 2,
            significantStrikes: 2,
            octagonControl: 2,
            damageRatio: 2,
            submissionAttempts: 2
            }]
            
        };

        const match3 = {
            fighters:[{
            takeDownAttempts: 3,
            takeDownDefense: 3,
            significantStrikes: 3,
            octagonControl: 3,
            damageRatio: 3,
            submissionAttempts: 3
            }]
        };

        event = new EventModel({
           eventName: "UFC 225",
           organization: "UFC",
           fights: {
               main: [match1, match2],
               prelims: [match2],
               earlyPrelims: [match3]
           }
        });

        mongoose.connect(databaseURL, { useNewUrlParser: true })
            .then(() => {
                console.info('\nConnected to mongo database!\n');
                done();
            }).catch(() => {
                console.info('\nConnection failed\n');
                done();
            });
    });

    afterAll((done) => {
        EventModel.collection.drop().then((response) => {
            FighterModel.collection.drop().then((response) => {
                done();
            }).catch((err) => {
                done();
            });
        }).catch(err => {
            done();
        });
    });

    it('Creates an event', done => {
        event.save().then(savedEvent => {
            console.info(savedEvent);
            expect(savedEvent.fights.main[0].fighters[0].takeDownAttempts).toBe(1);
            done();
        });
    });

    it ('Creates a new fighter', (done) => {
        const fighter = new FighterModel({
            firstName: "Sandesh",
            lastName: "Shrestha",
            weightClass: 155
        });

        fighter.save().then((savedFighter) => {
            console.info(savedFighter);
            done();
        });
    })
});