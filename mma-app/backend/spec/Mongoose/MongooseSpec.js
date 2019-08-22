describe("Match fighter sub document", () => {
  const MatchFighters = require('../../models/fighter.match.model');
  const mongoose = require('mongoose');
  // const match = new Match({
  //   fighters:[{
  //     fighter: {
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: "Fighter",
  //         required: true
  //     },
  //     takeDownAttempts: Number,
  //     takeDownDefense: Number,
  //     significantStrikes: Number,
  //     octagonControl: Number,
  //     damageRatio: Number,
  //     submissionAttempts: Number
  // }]
  // });

  beforeAll(() => {
    // secure password relative to app.js
    const mongoPassword = require('../../../../../pas');
    // 'node-angular' is the database it is storing the post in
    const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

    mongoose.connect(databaseURL, { useNewUrlParser: true })
      .then(() => {
        console.info('\nConnected to mongo database!\n');
      }).catch(() => {
        console.info('\nConnection failed\n');
      });
  });

  it('creates a match', (done) => {
    const match = new MatchFighters({
      // fighters: [{
      //   firstName: "sandesh",
      //   lastName: "shrestha",
      //   weightClass: 155,
      //   organization: "ufc",
      //   isActive: true,
      //   record: {
      //     wins: 1,
      //     losses: 2,
      //     draws: 3,
      //     disqualifications: 4,
      //   }
      // }],
      takeDownAttempts: 4,
      takeDownDefense: 3,
      significantStrikes: 2,
      octagonControl: 1,
      damageRatio: 3,
      submissionAttempts: 1
    });

    match.save().then((savedMatch) => {
      console.info('Saved fighter id' + savedMatch.fighters[0]);
      expect(true).toBeTruthy();
      done();
    });

  });

  it("finds all matches", (done) => {
      MatchFighters.find()
      .then((foundMatchs) => {
        console.info(foundMatchs);
        done();
      });
  });
});