const mongoose = require('mongoose');
const MatchModel = require('../../models/match.model');
const FighterModel = require("../../models/fighter.model");
const JudgeModel = require('../../models/judge.model');

let fighterObjects = [];

let createFighters = async (numFighters) => {
    let fighterIds = [];
    for (let i = 0; i < numFighters; i++){
        const fighter = new FighterModel({
            
        });
    }
    return fighterObjects;
};