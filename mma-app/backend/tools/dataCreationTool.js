const mongoose = require('mongoose');
const MatchModel = require('../models/match.model');
const FighterModel = require("../models/fighter.model");
const JudgeModel = require('../models/judge.model');
const CustomTools = require('./CustomTools');
const randomNumber = CustomTools.randomNumber;

let fighterObjects = [];
let matchObjects = [];

const orgs = ['UFC', 'Bellator'];
const matchType = ['Main', 'Prelims', 'Early Prelims'];
const weightClasses = [125,135,145,155,170,185,205,265];

const getMatchOrder = () => {};
const getFighters = (fighters) => {};

const createMockData = async (numFighters, numMatches, numJudges) => {

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
            isTestData: true
        });

        // Save fighter and keep it in memory
        const savedFighter = await fighter.save();
        fighterObjects.push(savedFighter);
    };

    for (let i = 1; i <= numMatches; i++) {
        // Randomly select org and match type
        const selectedOrg = orgs[randomNumber(0, orgs.length - 1)];
        const selectedMatchType = matchType[randomNumber(0, matchType.length - 1)];
        const selectedWeightClass= weightClasses[randomNumber(0, weightClasses.length-1)];

        const match = new Match({
            // Event name based on the org, only 4 events per organization
            eventName: selectedOrg + " " + i % 4,
            organization: selectedOrg,
            weightClass: selectedWeightClass,
            matchType: selectedMatchType,
            matchOrder:getMatchOrder(),
            isFiveRounds: Boolean,
            isTitleFight:false,
            fighters:getFighters(),
            isTestData:true
        });
    }

    console.log(fighterObjects);
};

createMockData(50, 100, 10);
