const mongoose = require('mongoose');
const MatchModel = require('../../models/match.model');
const FighterModel = require("../../models/fighter.model");
const JudgeModel = require('../../models/judge.model');
const ScoreCardModel = require("../../models/scorecard.model");
const bcrypt = require('bcrypt');
// TODO: Add async functions to make code more readable
describe('Mongo Database Models', () => {
  let fighterObj;
  let fighter2Obj;
  let fighter1;
  let fighter2;
  let matchObj;


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
      isTestData: true,
      isMockData: false
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
      isTestData: true,
      isMockData: false
    }
  });

  afterAll(async done => {
    console.info("\t* Cleaning up test data: ");

    // Maybe use return statemetns for these
    try {
      const deletedFightsResponse = await FighterModel.deleteMany({ isTestData: true });
      console.info("\t\t* Num Fighters: " + deletedFightsResponse.n);
      const deletedMatchesResponse = await MatchModel.deleteMany({ isTestData: true });
      console.info("\t\t* Num Matches: " + deletedMatchesResponse.n);
      const deletedJudgeResponse = await JudgeModel.deleteMany({ isTestData: true });
      console.info("\t\t* Num Judges: " + deletedJudgeResponse.n);
      const deletedScoreCardResponse = await ScoreCardModel.deleteMany({ isTestData: true });
      console.info("\t\t* Num Score Cards: " + deletedScoreCardResponse.n);
      done();
    } catch (err) {
      console.log(err);
      fail();
    }

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

  it('Creates a Scorecard for a judge', async done => {

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


    try {
      const savedFighter1 = await fighter1.save();
      const savedFighter2 = await fighter2.save();
      matchObj.fighters.push(savedFighter1._id);
      matchObj.fighters.push(savedFighter2._id);

      const testMatch = new MatchModel(matchObj);
      const savedMatch = await testMatch.save();

      const hashedPassword = await bcrypt.hash("unitTestPassword%$%$2", 10);

      const testJudge = new JudgeModel({
        email: "sandesh@test.com",
        password: hashedPassword,
        isTestData: true,
        isMockData: false
      });

      const savedJudge = await testJudge.save();

      const scoreCard = new ScoreCardModel({
        judge: savedJudge._id,
        match: savedMatch._id,
        roundsScored: [
          {
            fighter: savedFighter1._id,
            rounds: roundsScoredObj1
          },
          {
            fighter: savedFighter2._id,
            rounds: roundsScoredObj2
          }
        ],
        isTestData: true,
        isMockData: false
      });

      scoreCard.save()
        .then(savedScoreCard => {
          expect(savedScoreCard.judge).toBe(savedJudge._id);
          expect(savedScoreCard.match).toBe(savedMatch._id);
          expect(savedScoreCard.roundsScored.length).toBe(2);
          done();
        }).catch(err => {
          console.info(err);
          fail();
        });

    } catch (err) {
      console.info(err);
      fail(err);
    }

  });

});
