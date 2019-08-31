const mongoose = require('mongoose');
const MatchModel = require('../models/match.model');
const FighterModel = require("../models/fighter.model");
const JudgeModel = require('../models/judge.model');
const CustomTools = require('./CustomTools');
const randomNumber = CustomTools.randomNumber;

let fighterObjects = [];
let matchObjects = [];
let matchesPerEvents;
let eventHelper = {
  ufcEvents: [],
  bellatorEvents: []
};

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

const isTitleFight = (matchOrder) => {
  if ((matchOrder == 0) && (randomNumber(0, 1) == 0)) {
    return true;
  } else {
    return false;
  }
};

const isFiveRounder = (matchOrder, isTitleFight) => {
  if (isTitleFight || matchOrder == 0){
    return true;
  } else {
    return false;
  }
};

const createMockData = async (numFighters, numMatches, numEvents, numJudges) => {

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

      //TODO: REMOVE THIS WHEN READY TO SAVE
      _id: i,
      isTestData: true
    };
    const fighter = new FighterModel(fighterObj);

    // Save fighter and keep it in memory
    // const savedFighter = await fighter.save();
    fighterObjects.push(savedFighter);
  };

  let eventIndex = 0;
  let matchTypeIndex = 0;
  const numMatchesPerEvents = numMatches / numEvents;
  const numMatchesPerMatchType = numMatchesPerEvents / 3;
  let currentEvent = [];

  for (let i = 0; i < numMatches; i++) {
    // Randomly weightClass and org
    const selectedWeightClass = weightClasses[randomNumber(0, weightClasses.length - 1)];
    const selectedOrg = orgs[randomNumber(0, orgs.length - 1)];
    const selectedFighters = getFighters();
    // Equally distribute matches between events
    const selectedMatchType = matchType[i / numMatchesPerMatchType];
    const eventNumber = i / numMatchesPerEvents;
    const matchOrder = i % numMatchesPerEvents;
    const titleFightFlag = isTitleFight(matchOrder);
    const fiveRounderFlag = isFiveRounder(matchOrder, isTitleFight);

    const matchObj = {
      eventName: selectedOrg + " " + eventNumber,
      organizaion: selectedOrg,
      weightClass: selectedWeightClass,
      matchType: selectedMatchType,
      matchOrder: matchOrder,
      isTitleFight: titleFightFlag,
      isFiveRounder: fiveRounderFlag,
      fighters: [selectedFighters.fighter1Id, selectedFighters.fighter2Id],
      isTestData: true
    };

    const match = new Match(matchObj);
  }

  console.log(fighterObjects);
};

createMockData(50, 90, 5, 10);
