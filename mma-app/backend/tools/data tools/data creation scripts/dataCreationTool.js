const mongoose = require('mongoose');
const MatchModel = require('../../../models/match.model');
const FighterModel = require("../../../models/fighter.model");
const mongoPassword = require('../../../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
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
  for (let j = 0; j < eventsLen; j++) {
    currentEvent = events[eventsLen-j-1];
    const matches = event.matches;
    const matchesLen = matches.length;
    console.log(event);

    for (let i = 0; i < matchesLen; i++) {
      const currentMatch = matches[i];
      let isFiveRounder = false;

      if (i == isFiveRounder || currentMatch.redFighter.includes("c)") || currentMatch.blueFighter.includes("c)")) {
        isFiveRounder = true;
      }

      const matchObject = {
        organization: "UFC",
        eventName: currentEvent.name,
        
      };
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
