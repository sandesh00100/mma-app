const MatchModel = require('../models/match.model');
const FighterModel = require('../models/fighter.model');
const CustomTools = require('../tools/CustomTools');
const ERROR_MESSAGE_OBJECT = {
    message: "Fetching matches failed"
};

/**
 * Async function that finds matches of the provided organization and sorts it by date
 * @param {*} pageSize size of the selected page
 * @param {*} currentPage index of the current page
 * @param {*} org organization name (UFC/Bellator for now)
 */
const fetchMatches = async (pageSize, currentPage, org) => {

    // Find matches by looking at the org name, getting the corrosponding page and populating the fighter ids
    // TODO: remove ignorable database data from fighters
    const fetchedMatches = await MatchModel.find({ organization: org }, CustomTools.ignoreObject)
        .sort({ date: -1 })
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .populate({ path: 'fighters' });

    const totalMatches = await MatchModel.countDocuments({ organization: org });

    return {
        message: "Matches fetched sucessfully",
        matches: fetchedMatches,
        totalMatches: totalMatches
    };
};

const getMatches = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const org = req.query.org;
    if (pageSize && currentPage && org) {
        fetchMatches(pageSize, currentPage, org).then(fetchedMatches => {
            console.log(fetchedMatches);
            res.status(200).json(fetchedMatches);
        }).catch(err => {
            console.log(err);
            res.status(500).json(ERROR_MESSAGE_OBJECT);
        });
    } else {
        res.status(500).json(ERROR_MESSAGE_OBJECT);
    }
};

/**
 * Might Need this later
 */
const getMatch =  (req, res, next) => {
    const matchId = req.params.id;
    if (matchId){
        MatchModel.findById({_id:matchId}).populate({path:'fighters'}).then(foundMatch =>{
            res.status(200).json({
                match: foundMatch,
                message: 'Match fetched sucessfully'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Match could not be found. Please provide a valid Id'
            });
        });
    } else {
        res.status(500).json({
            message: 'No id provided'
        });
    }
}

module.exports = {
    getMatches: getMatches,
    getMatch:getMatch,
    // exporting fetchMatches for unit testing
    fetchMatches: fetchMatches
};
