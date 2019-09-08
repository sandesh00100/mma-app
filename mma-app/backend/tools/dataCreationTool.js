const mongoose = require('mongoose');
const MatchModel = require('../models/match.model');
const FighterModel = require("../models/fighter.model");
const CustomTools = require('./CustomTools');
const mongoPassword = require('../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
const randomNumber = CustomTools.randomNumber;

let fighterObjects = [];
let matchObjects = [];

const orgs = ['UFC', 'Bellator'];
const matchType = ['Main', 'Prelims', 'Early Prelims'];
const weightClasses = [125, 135, 145, 155, 170, 185, 205, 265];

// Return an object with 2 unique fighter IDs
const getFighters = () => {
  const randomFighterIndex = randomNumber(0, fighterObjects.length - 1);
  let randomFighterIndex2 = randomNumber(0, fighterObjects.length - 1);
  if (randomFighterIndex == randomFighterIndex2) {
    randomFighterIndex2 = (randomFighterIndex2 + 1) % fighterObjects.length;
  }
  const fighter1Id = fighterObjects[randomFighterIndex]._id;
  const fighter2Id = fighterObjects[randomFighterIndex2]._id;

  return {
    fighter1Id: fighter1Id,
    fighter2Id: fighter2Id
  };
};

// Checks if it's a title fight
const isTitleFight = (matchOrder) => {
  if ((matchOrder == 0) && (randomNumber(0, 2) == 0)) {
    return true;
  } else {
    return false;
  }
};

// Checks if it's a five rounder
const isFiveRounder = (matchOrder, isTitleFight) => {
  if (isTitleFight || matchOrder == 0){
    return true;
  } else {
    return false;
  }
};

const createMockData = async (numFighters, numMatches, numEvents) => {
  await mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true });

  // Create fighters with empty records
  for (let i = 0; i < numFighters; i++) {
    const fighterObj = {
      firstName: "firstName" + i,
      lastName: "lastName" + i,
      isActive: true,
      imagePath: "imagePath" + i,
      record: {
        wins: 0,
        losses: 0,
        draws: 0,
        disqualifications: 0
      },
      isTestData: true
    };

    // Undo the fllowing comments
   const fighter = new FighterModel(fighterObj);

    // Save fighter and keep it in memory
    const savedFighter = await fighter.save();

    fighterObjects.push(savedFighter);
  };

  const numMatchesPerEvents = numMatches / numEvents;
  const numMatchesPerMatchType = numMatchesPerEvents / 3;
  let selectedOrg = "";

  let currentDate = new Date("2018-01-01");
  for (let i = 0; i < numMatches; i++) {
    // Randomly weightClass and org
    const selectedWeightClass = weightClasses[randomNumber(0, weightClasses.length)];
    if (i%numMatchesPerEvents == 0){
      selectedOrg = orgs[randomNumber(0, orgs.length)];
    }

    const selectedFighters = getFighters();
    // Equally distribute matches between events
    const matchTypeIndex = Math.floor(i / numMatchesPerMatchType) % 3;
    const selectedMatchType = matchType[matchTypeIndex];
    const eventNumber = Math.floor(i / numMatchesPerEvents);
    const matchOrder = i % numMatchesPerEvents;
    const titleFightFlag = isTitleFight(matchOrder);
    const fiveRounderFlag = isFiveRounder(matchOrder, titleFightFlag);

    const matchObj = {
      eventName: selectedOrg + " " + eventNumber,
      organization: selectedOrg,
      weightClass: selectedWeightClass,
      matchType: selectedMatchType,
      matchOrder: matchOrder,
      isTitleFight: titleFightFlag,
      isFiveRounds: fiveRounderFlag,
      date: currentDate,
      fighters: [selectedFighters.fighter1Id, selectedFighters.fighter2Id],
      isTestData: true
    };
    matchObjects.push(matchObj);

    const match = new MatchModel(matchObj);
    const savedMatch = await match.save();

    const fighter1Won = Math.random() > .5;

    // Increment fighter records and push the match to the fighter's object
    let fighter1Update = {
      $inc: {
        "record.wins":0,
        "record.losses":0
      },
      $push: {
        matches:savedMatch._id
      }
    };

    fighter1Update.$inc["record.wins"] = fighter1Won ? 1:0;
    fighter1Update.$inc["record.losses"] = fighter1Won ? 0:1;

    let fighter2Update = {
      $inc: {
        "record.wins":0,
        "record.losses":0
      },
      $push: {
        matches:savedMatch._id
      }
    };

    fighter2Update.$inc["record.wins"] = fighter1Won ? 0:1;
    fighter2Update.$inc["record.losses"] = fighter1Won ? 1:0;

    await FighterModel.updateOne({_id:selectedFighters.fighter1Id},fighter1Update);
    await FighterModel.updateOne({_id:selectedFighters.fighter2Id},fighter2Update);

    // everytime we switch to a new event we increment the date
    if ((i+1) % numMatchesPerEvents == 0){
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
  }

  console.log("Num Matches: " + matchObjects.length)
  console.log("Num Fighters: " + fighterObjects.length);
};

createMockData(50, 90, 6).then(() => {
  // Everything executed properly
  process.exit(0);
}).catch((err) => {
  // Something went wrong
  console.log(err);
  process.exit(-1);
});
