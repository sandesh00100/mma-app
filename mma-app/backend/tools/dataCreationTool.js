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
    ufcEvents:[],
    bellatorEvents:[]
};

const orgs = ['UFC', 'Bellator'];
const matchType = ['Main', 'Prelims', 'Early Prelims'];
const weightClasses = [125, 135, 145, 155, 170, 185, 205, 265];

const getFighters = () => {

}
const createMockData = async (numFighters, numMatches, numEvents, numJudges) => {

    // Create fighters with empty records
    for (let i = 0; i < numFighters; i++) {
        const fighter = new FighterModel({
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
        });

        // Save fighter and keep it in memory
        // const savedFighter = await fighter.save();
        fighterObjects.push(savedFighter);
    };

    let eventIndex = 0;
    let matchTypeIndex = 0;
    const numMatchesPerEvents = numMatches/numEvents;
    const numMatchesPerMatchType = numMatchesPerEvents/3;
    let currentEvent = [];

    for (let i = 0; i < numMatches; i++) {
        // Randomly weightClass and org
        const selectedWeightClass = weightClasses[randomNumber(0, weightClasses.length - 1)];
        const selectedOrg = orgs[randomNumber(0, orgs.length - 1)];

        // Equally distribute matches between events
        const selectedMatchType = matchType[i/numMatchesPerMatchType];
        const eventNumber = i/numMatchesPerEvents;
        const matchOrder = i%numMatchesPerEvents;

        const match = new Match();
    }

    console.log(fighterObjects);
};

createMockData(50, 90, 5, 10);
