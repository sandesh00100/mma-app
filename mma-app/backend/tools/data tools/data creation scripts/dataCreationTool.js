const mongoose = require('mongoose');
const MatchModel = require('../../../models/match.model');
const FighterModel = require("../../../models/fighter.model");
const mongoPassword = require('../../../../../../pas');
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

const eventObj = require('../../data tools/data/UFC/eventData.json')
// TODO: Add match type on the database (lower in priority)
// const matchType = ['Main', 'Prelims', 'Early Prelims'];
const weightClasses = [125, 135, 145, 155, 170, 185, 205, 265];

const createDatabase = async () => {
    console.log("connecting to mongodb...")
    await mongoose.connect(databaseURL, {useNewUrlParser:true, useCreateIndex:true});
    const events = eventObj.Events;
    for (let event of events){
        const eventMatches = event.Matches;
        let createdFighters = set();

        // TODO: Need to revisit this code after the image scraper
        for (let i = 0; i <eventMatches.length; i++){
            const match = event[i];
            const redFighterName = match.redFighter;
            const blueFighterName = match.blueFighter;
            
            if (createdFighters.has(redFighter)){
                const nameArray = redFighterName.split(' ');
                const firstName = nameArray[0];
                const lastName = nameArray[1];

                const foundFighter = await FighterModel.findOne({firstName:firstName,lastName:lastName});

                if (foundFighter == null) {
                } 

            } else {

            }

            if (createdFighters.has(blueFighter)){

            } else {

            }

        }
    }
};

createDatabase.then(() => {
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(-1);
});