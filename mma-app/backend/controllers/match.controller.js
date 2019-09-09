const MatchModel = require('../models/match.model');
const FighterModel = require('../models/fighter.model');
const ERROR_MESSAGE_OBJECT = {
    message: "Fetching matches failed"
};

const fetchMatches = async (pageSize, currentPage, org) => {

    // Find matches by looking at the org name, getting the corrosponding page and populating the fighter ids
    const fetchedMatches = await MatchModel.find({ organization: org })
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
            res.status(200).json(fetchedMatches);
        }).catch(err => {
            console.log(err);
            res.status(500).json(ERROR_MESSAGE_OBJECT);
        });
    } else {
        res.status(500).json(ERROR_MESSAGE_OBJECT);
    }
};

module.exports = {
    getMatches: getMatches,
    // exporting fetchMatches for unit testing
    fetchMatches: fetchMatches
};
