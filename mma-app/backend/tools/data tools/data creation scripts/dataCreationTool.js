const mongoose = require('mongoose');
const MatchModel = require('../../../models/match.model');
const FighterModel = require("../../../models/fighter.model");
const mongoPassword = require('../../../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
const randomNumberGen = require("../../CustomTools").randomNumber;
 
const fs = require('fs').promises;

const eventObj = require('../../data tools/data/UFC/eventData.json');
// TODO: Add match type on the database (lower in priority)
// const matchType = ['Main', 'Prelims', 'Early Prelims'];

const createFighters = async () => {
  try {
    const data = await fs.readFile("../../data tools/data/UFC/fighterImage.csv", "utf-8");
    const splitData = data.split("\n");

    for (let i = 1; i < splitData.length; i++) {
      const currentLine = splitData[i].split(",");
      const imageLink = currentLine[1];
      const currentFighterName = currentLine[0].split(" ");
      const fighterObject = {
        firstName: currentFighterName[0],
        lastName: currentFighterName[currentFighterName.length - 1],
        imagePath: imageLink,
        isTestData: false,
        isMockData: false
      };

      const fighter = FighterModel(fighterObject);
      const savedFighter = await fighter.save();
      console.log(savedFighter.firstName + " has been saved");
    }

  } catch (err) {
    console.log(err);
  }
};

const getNameArray = name => {
  const tempNameArray = name.split(" ");
  return tempNameArray.filter(element => !element.includes("c)"));
};

const getWeightClass = (weightClassName) => {
  for (let weightClass of weightClassMap){
    if (weightClass in weightClassName) {
      return weightClassMap[weightClass];
    }
  }
};

let fighterRecordMap = {};

// TODO: Ignoring heavy weight at the moment but might want to revist that
const weightClassMap = {
  "Heavyweight":265,
  "Light Heavyweight": 205,
  "Middleweight":185,
  "Welterweight":175,
  "Lightweight":155,
  "Featherweight":145,
  "Bantamweight":135,
  "Flyweight":125
};

const createDatabase = async () => {
  console.log("connecting to mongodb...")
  try {
    // Remove comment
    // await mongoose.connect(databaseURL, {useNewUrlParser:true, useCreateIndex:true});
  } catch (err) {
    console.log(err);
  }

  const events = eventObj.events;
  const eventLen = events.length;
  console.log("Reading events...")

   // Starting from the oldest event to the newest
  for (let j = 0; j < eventLen; j++) {
    currentEvent = events[eventLen-j-1];
    const matches = currentEvent.matches;
    const matchesLen = matches.length;

    for (let i = 0; i < matchesLen; i++) {
      const currentMatch = matches[i];
      const winnerName = getNameArray(currentMatch.redFighter);
      const loserName = getNameArray(currentMatch.blueFighter);
      const weightClass = getWeightClass(currentMatch.weightClass);
      const winnerIndex = randomNumberGen(0,2);
      const loserIndex = Math.abs(winnerIndex - 1); 
      const fighterArray = [];

      const winner = await FighterModel.findOne({firstName: winnerName[0], lastName: winnerName[1]});
      const loser = await FighterModel.findOne({firstName: loserName[0], lastName: loserName[1]});
      fighterArray[winnerIndex] = winner._id;
      fighterArray[loserIndex] = loser._id;

      let isFiveRounder = false;
      let isTitleFight = false;
      console.log(currentMatch);

      if (i == isFiveRounder) {
        const redFighterIsChamp = currentMatch.redFighter.includes("c)");
        const blueFighterIsChamp = currentMatch.blueFighter.includes("c)");
        if (redFighterIsChamp || blueFighterIsChamp){
            if (redFighterIsChamp) {

            }
          isTitleFight = true;
        }

        isFiveRounder = true;
      } 

      const matchObject = {
        organization: "UFC",
        eventName: currentEvent.name,
        matchOrder: i,
        isFiveRounds: isFiveRounder,
        isTitleFight: isTitleFight,
        weightClass: weightClass,
        
      };
      break;
    }
    break;
  }
};

createDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(-1);
});
