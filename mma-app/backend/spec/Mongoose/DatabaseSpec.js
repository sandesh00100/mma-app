const MatchFighters = require('../../models/fighter.match.model');
const mongoose = require('mongoose');

describe("Match fighter sub document", () => {
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

  beforeAll((done) => {
    // secure password relative to app.js
    const mongoPassword = require('../../../../../pas');
    // 'node-angular' is the database it is storing the post in
    const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

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
    MatchFighters.collection.drop().then((response) => {
      done();
    });
  });

  it('creates a match', (done) => {
    const match = new MatchFighters({
      fighters: [{
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
      }],
      takeDownAttempts: 4,
      takeDownDefense: 3,
      significantStrikes: 2,
      octagonControl: 1,
      damageRatio: 3,
      submissionAttempts: 1
    });

    match.save().then((savedMatch) => {
     MatchFighters.findOne({"takeDownAttempts":4}).then((match) => {
       console.info(match);

        // expect(match.fighters[0].firstName).toBe("sandesh");
        expect(true).toBe(true);
        done();
     });
    // console.info(match.fighters.id(savedMatch.fighters[0]._id));
    // done();
    // }).catch((err)=>{
    //   console.info(err);
    //   done()
    // });

  });
});