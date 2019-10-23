const mongoose = require('mongoose');
const FighterModel = require('../../models/fighter.model');
const MatchModel = require('../../models/match.model');
const ScoreCardModel = require("../../models/scorecard.model");
const JudgeModel = require('../../models/judge.model');
const bcrypt = require('bcrypt');
const CustomTools = require('../../tools/CustomTools');
// TODO: Need more validation tests
describe("Validation tests", () => {
  let matchObject;
  let fighterObjs
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

  beforeEach(done => {
    matchObject = {
      eventName: "UFC 242",
      organization: "UFC",
      weightClass: 170,
      matchType: 'Main',
      matchOrder: 1,
      isFiveRounds: true,
      isTestData: true,
      isMockData: false
    };

    fighterObjs = [
      {
        firstName: "FirstName1",
        lastName: "LastName1",
        isTestData: true,
        isMockData: false
      },
      {
        firstName: "FirstName2",
        lastName: "LastName2",
        isTestData: true,
        isMockData: false
      }
    ];
    done();
  });

  it('validates a match', async done => {

    let fighterIds = [];
    for (let i = 0; i < 2; i++) {
      fighterObjs.push();
    }
    for (fighterObj of fighterObjs) {
      const fighter = new FighterModel(fighterObj);
      const savedFighter = await fighter.save();
      fighterIds.push(savedFighter._id);
    }
    matchObject.fighters = fighterIds;
    // console.info(matchObject.fighters);
    const match = new MatchModel(matchObject);
    match.save().then(savedMatch => {
      done();
    }
    ).catch((err) => {
      fail('should always save');
    });

    matchObject.fighters.push({
      firstName: 'ErrorFirstName',
      lastName: "errorLastName",
      isTestData: true,
      isMockData: false
    });

    const errorMatch = new MatchModel(matchObject);
    errorMatch.save().then(() => {
      fail('should always throw an error')
    }
    ).catch((err) => {
      expect(err.ValidationError).not.toBe(null);
      done();
    });
  });

  it('validates a score card', async done => {

    try {
      const fighter1 = new FighterModel(fighterObjs[0]);
      const savedFighter1 = await fighter1.save();
      const fighter2 = new FighterModel(fighterObjs[1]);
      const savedFighter2 = await fighter2.save();
      matchObject.fighters = [savedFighter1._id, savedFighter2._id];
      const match = new MatchModel(matchObject);
      const savedMatch = await match.save();
      const hashedPassword = await bcrypt.hash("unitTestPassword%$%$2", 10);

      const testJudge = new JudgeModel({
        email: "sandesh@test" + CustomTools.randomNumber(0, 1000) + ".com",
        password: hashedPassword,
        isTestData: true,
        isMockData: false
      });

      const savedJudge = await testJudge.save();
      console.info("5");
      let rounds = [];
      for (let i = 0; i < 3; i++) {
        rounds.push({
          round: i + 1,
          stats: [
            {
              name: "some stat",
              value: 2,
              min: 1,
              max: 3,
              isShared: false
            }
          ]
        });
      }

      let scoreCardObj = {
        match: savedMatch._id,
        judge: savedJudge._id,
        roundsScored: [
          {
            fighter: savedFighter1._id,
            rounds: [...rounds]
          },
          {
            fighter: savedFighter2._id,
            rounds: [...rounds]
          }
        ],
        isMockData: false,
        isTestData: true
      };

      const scoreCard = new ScoreCardModel(scoreCardObj);
      const savedScoreCard = await scoreCard.save();

      try {
        scoreCardObj.roundsScored[0].rounds[0].stats[0] = {
          name: "some stat",
          value: 0,
          min: 3,
          max: 2,
          isShared: false
        };

        const errorScoreCard = new ScoreCardModel(scoreCardObj);
        const savedErrorScoreCard = await errorScoreCard.save();
        console.info(savedErrorScoreCard.roundsScored[0].rounds[0].stats[0]);
        fail("Error should have been caught");
      } catch (expectedError) {
        console.info(expectedError);
        done();
      }
      console.info("rounds scored:" + savedScoreCard.roundsScored.length);
      done();
    } catch (err) {
      console.log(err);
      fail();
    }



  });
});
