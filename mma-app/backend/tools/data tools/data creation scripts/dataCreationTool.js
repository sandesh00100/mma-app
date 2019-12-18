const mongoose = require('mongoose');
const MatchModel = require('../../../models/match.model');
const FighterModel = require("../../../models/fighter.model");
const mongoPassword = require('../../../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';
const fs = require('fs').promises;

const eventObj = require('../../data tools/data/UFC/eventData.json');
// TODO: Add match type on the database (lower in priority)
// const matchType = ['Main', 'Prelims', 'Early Prelims'];

const createDatabase = async () => {
    console.log("connecting to mongodb...")
    await mongoose.connect(databaseURL, {useNewUrlParser:true, useCreateIndex:true});
    const events = eventObj.Events;
    try {
        const data = await fs.readFile("../../data tools/data/UFC/fighterImage.csv","utf-8");
        const splitData = data.split("\n");
        
        for (let i = 1; i < splitData.length; i++){
            const currentLine = splitData[i].split(",");
            const imageLink = currentLine[1];
            const currentFighterName = currentLine[0].split(" ");
            const fighterObject = {
                firstName:currentFighterName[0],
                lastName:currentFighterName[currentFighterName.length-1],
                imagePath:imageLink,
                isTestData:false,
                isMockData:false
            };
            
            const fighter = FighterModel(fighterObject);
            const savedFighter = await fighter.save();
            console.log(savedFighter.firstName + " has been saved");
        }

    } catch (err){
        console.log(err);
    }
};

createDatabase().then(() => {
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(-1);
});