
const mongoose = require('mongoose');
const MatchModel = require('../../../models/match.model');
const FighterModel = require("../../../models/fighter.model");
const mongoPassword = require('../../../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
const randomNumberGen = require("../../CustomTools").randomNumber;
const fs = require('fs');
const fsPromises = fs.promises;
const util = require('util');

const eventObj = require('../../data tools/data/UFC/eventData.json');
// TODO: Add match type on the database (lower in priority)
// const matchType = ['Main', 'Prelims', 'Early Prelims'];

const createFighter = async (firstName, lastName, imageLink) => {
  console.log("Trying to save fighter " + firstName + " " + lastName + " with image " + imageLink);
  const fighterObject = {
    firstName: firstName,
    lastName: lastName,
    imagePath: imageLink,
    isTestData: false,
    isMockData: false
  };
  try {
    await FighterModel(fighterObject).save();
  } catch (err) {
    console.log("Failed to save fighter " + firstName + " " + lastName);
    console.log(err);
  }
};

const createFighters = async () => {
  try {
    const data = await fsPromises.readFile("../../data tools/data/UFC/fighterImage.csv", "utf-8");
    const splitData = data.split("\n");

    for (let i = 1; i < splitData.length; i++) {
      const currentLine = splitData[i].split(",");
      const imageLink = currentLine[1];
      const currentFighterName = currentLine[0].split(" ");

      createFighter(currentFighterName[0], lastName[currentFighterName.length - 1], imageLink);
      const fighter = FighterModel(fighterObject);
      const savedFighter = await fighter.save();
      console.log(savedFighter.firstName + " has been saved");
    }

  } catch (err) {
    console.log(err);
  }
};

const timeStamp = () => {
  const now = new Date();
  return `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

const getNameArray = name => {
  const tempNameArray = name.split(" ");
  return tempNameArray.filter(element => !element.includes("(") && !element.includes(")"));
};

const getWeightClass = (weightClassName) => {
  if (weightClassName.includes("Catchweight")) {
    return weightClassName.match(/\d+.\d+/)[0];
  }
  for (let weightClass in weightClassMap) {
    if (weightClassName.includes(weightClass)) {
      return weightClassMap[weightClass];
    }
  }
  return 0;
};

const logObject = obj => {
  let objString = "";
  for (let attr in obj) {
    objString += `\n${attr}:${obj[attr]} `
  }
  console.log(objString)
};
const createDatabase = async () => {
  let fighterRecordMap = {};

  console.log("Trying to connect to mongodb...");
  try {
    await mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true });
  } catch (err) {
    console.log("Could not connect to mongodb");
    console.log(err);
  }

  const events = eventObj.events;
  const eventLen = events.length;
  console.log("Reading events...")

  // Starting from the oldest event to the newest
  // TODO: change index
  for (let j = 0; j < eventLen; j++) {
    const currentEvent = events[eventLen - j - 1];
    const matches = currentEvent.matches;
    const matchesLen = matches.length;

    console.log("Reading " + currentEvent.name);
    for (let i = 0; i < matchesLen; i++) {
      const currentMatch = matches[i];
      const fighterArray = [];
      const weightClass = getWeightClass(currentMatch.weightClass);

      const winnerName = getNameArray(currentMatch.redFighter);
      const loserName = getNameArray(currentMatch.blueFighter);

      let winnerIndex = randomNumberGen(0, 2);
      const loserIndex = Math.abs(winnerIndex - 1);

      console.log("Finding fighters " + winnerName[0] + " " + winnerName[winnerName.length - 1] + " and " + loserName[0] + " " + loserName[loserName.length - 1])
      // TODO: need to create the fighter if it's their first match
      let winner = await FighterModel.findOne({ firstName: winnerName[0], lastName: winnerName[winnerName.length - 1] });
      let loser = await FighterModel.findOne({ firstName: loserName[0], lastName: loserName[loserName.length - 1] });

      // TODO: might want to call the ufc website to find image link
      if (winner == null) {
        console.log("Could not find winner");
        winner = createFighter(winnerName[0], winnerName[winnerName.length - 1], "NONE");
      }

      if (loser == null) {
        console.log("Could not find loser");
        loser = createFighter(loserName[0], loserName[loserName.length - 1], "NONE");
      }

      fighterArray[winnerIndex] = winner._id;
      fighterArray[loserIndex] = loser._id;
      let previousChampIndex = null;

      let isFiveRounder = false;
      let isTitleFight = false;

      if (i == 0) {
        isFiveRounder = true;
      }

      const redFighterIsChamp = currentMatch.redFighter.includes("c)");
      const blueFighterIsChamp = currentMatch.blueFighter.includes("c)");
      if (redFighterIsChamp || blueFighterIsChamp) {
        console.log("Match is championship fight")
        if (redFighterIsChamp) {
          previousChampIndex = winnerIndex;
        } else {
          previousChampIndex = loserIndex;
        }
        isTitleFight = true;
      }


      const matchIsNoContest = currentMatch.method == "No Contest";
      const matchIsDraw = currentMatch.method.includes("Draw");
      const matchIsDq = currentMatch.method == "Disqualification";

      if (matchIsDraw || matchIsNoContest) {
        winnerIndex = -1;
      }

      const matchObject = {
        organization: "UFC",
        eventName: currentEvent.name,
        matchOrder: i,
        isFiveRounds: isFiveRounder,
        isTitleFight: isTitleFight,
        weightClass: weightClass,
        fighters: fighterArray,
        winnerIndex: winnerIndex,
        championIndex: previousChampIndex,
        method: currentMatch.method,
        time: currentMatch.time,
        methodInfo: currentMatch.methodInfo,
        decisionInfo: currentMatch.decisionInfo,
        round: currentMatch.round,
        isTestData: false,
        isMockData: false
      };

      const match = new MatchModel(matchObject);
      const savedMatch = await match.save();
      console.log("Saving match");

      let winnerObject = fighterRecordMap[winner.id];
      let loserObject = fighterRecordMap[loser.id];

      if (winnerObject == null) {
        winnerObject = { ...newFighterObject, record: { ...newFighterObject.record } };
        fighterRecordMap[winner.id] = winnerObject;
      }

      if (loserObject == null) {
        loserObject = { ...newFighterObject, record: { ...newFighterObject.record } };
        fighterRecordMap[loser.id] = loserObject;
      }

      if (matchIsDraw) {
        winnerObject.record.draws += 1;
        loserObject.record.draws += 1;
      } else if (matchIsNoContest) {
        winnerObject.record.noContest += 1;
        loserObject.record.noContest += 1;
      } else {

        if (isTitleFight) {
          winnerObject.isChampion = true;
          loserObject.isChampion = false;
        }

        winnerObject.record.wins += 1;

        if (matchIsDq) {
          loserObject.record.disqualifications += 1;
        } else {
          loserObject.record.losses += 1;
        }
      }

      winnerObject.matches.push(savedMatch._id);
      loserObject.matches.push(savedMatch._id);
    }
  }
  //TODO: Need to test
  console.log("Updating fighter records")
  for (let fighterId in fighterRecordMap) {
    console.log("Updating fighter " + fighterId);
    const fighterObj = fighterRecordMap[fighterId];
    await FighterModel.updateOne({ _id: fighterId }, { $set: { record: fighterObj.record, isChampion: fighterObj.isChampion, matches: fighterObj.matches } });
  }
  console.log("Finished updating fighter records");
};

// TODO: Ignoring heavy weight at the moment but might want to revist that
const weightClassMap = {
  "Heavyweight": 265,
  "Light Heavyweight": 205,
  "Middleweight": 185,
  "Welterweight": 175,
  "Lightweight": 155,
  "Featherweight": 145,
  "Bantamweight": 135,
  "Flyweight": 125
};

const newFighterObject = {
  isChampion: false,
  record: {
    wins: 0,
    losses: 0,
    draws: 0,
    disqualifications: 0
  },
  matches: []
}

const now = new Date();
const logFile = fs.createWriteStream('dataCreation.access.log' + now.getTime(), { flags: 'a' });

console.log = log => {
  logFile.write(timeStamp() + " " + util.format(log) + '\n');
  process.stdout.write(util.format(log) + '\n');
};

createDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(-1);
});
