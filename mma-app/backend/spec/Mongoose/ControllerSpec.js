const matchController = require('../../controllers/match.controller');
const mongoose = require('mongoose');

describe('Controller Tests', () => {

    beforeAll(done => {
        const mongoPassword = require('../../../../../pas');
        // 'node-angular' is the database it is storing the post in
        const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
        mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true })
            .then(() => {
                //console.info('\n*Connected to mongo\n');
                done();
            }).catch(() => {
                done();
                //console.info('\n*Connection failed\n');
            });
    });


    it('Finds the correct matches based on page info', (done) => {
        matchController.fetchMatches(4, 1, 'UFC').then(fetchedMatches => {
            expect(fetchedMatches.matches.length).toBe(4);
            expect(fetchedMatches.matches[0].fighters.length).toBe(2);
            done();
        });
    });
});