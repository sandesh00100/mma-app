const mongoose = require('mongoose');
const MatchFightersModel = require('../../models/fighter.match.model');
const matchModel = MatchFightersModel.Match;
const fighterModel = MatchFightersModel.Fighter;


describe("Match fighter sub document", () => {
  let match = null;
  beforeAll((done) => {
    // secure password relative to app.js
    const mongoPassword = require('../../../../../pas');
    // 'node-angular' is the database it is storing the post in
    const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
    match = new matchModel({
      fighters:[
        {
          firstName: "sandesh",
          lastName: "shrestha",
          weightClass: 155,
          organization: "ufc",
          isActive: true,
          record: {
            wins: 1,
            losses: 2,
            draws: 3,
            disqualifications: 4,
          }
        }
      ],
      takeDownAttempts: 4,
      takeDownDefense: 3,
      significantStrikes: 2,
      octagonControl: 1,
      damageRatio: 3,
      submissionAttempts: 1
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
    matchModel.collection.drop().then((response) => {
      done();
    });
    done();
  });

  it('creates a match', (done) => {
    match.save().then((savedMatch) => {
      matchModel.findOne({ "takeDownAttempts": 4 }).then((foundMatch) => {
        expect(foundMatch.takeDownAttempts).toBe(4);
        done();
      });
     
    });

  });

});