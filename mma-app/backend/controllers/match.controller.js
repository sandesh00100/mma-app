const MatchModel = require('../models/match.model');
const FighterModel = require('../models/fighter.model');
const CustomTools = require('../tools/CustomTools');
const ObjectId = require("mongoose").Types.ObjectId;

const ERROR_MESSAGE_OBJECT = {
    message: "Fetching matches failed"
};

/**
 * Async function that finds matches of the provided organization and sorts it by date
 * @param {*} pageSize size of the selected page
 * @param {*} currentPage index of the current page
 * @param {*} org organization name (UFC/Bellator for now)
 */
const fetchMatchesDeprecated = async (pageSize, currentPage, org) => {

    // Find matches by looking at the org name, getting the corrosponding page and populating the fighter ids
    // TODO: Need to figure out a way to have a seconday sort on matchOrder
    const fetchedMatches = await MatchModel.find({ organization: org }, CustomTools.ignoreUtility.ignoreObject)
        .sort({ date: -1, matchOrder: -1 })
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .populate({ path: 'fighters', select: CustomTools.ignoreUtility.ignoreString });

    const totalMatches = await MatchModel.countDocuments({ organization: org });


    return {
        message: "Matches fetched sucessfully",
        matches: fetchedMatches,
        totalMatches: totalMatches
    };
};

/**
 * Async function that finds matches of the provided organization and sorts it by date
 * @param {*} pageSize size of the selected page
 * @param {*} currentPage index of the current page
 * @param {*} org organization name (UFC/Bellator for now)
 */
const fetchMatches = async (query) => {

    // Find matches by looking at the org name, getting the corrosponding page and populating the fighter ids
    // TODO
    const pageSize = +query.pageSize;
    const org = query.org;
    const eventFilters = query.event != null ? query.event : [];
    const fighterFilters = query.fighter != null ? query.fighter : [];
    
    let fighterIds = []; 
    if (fighterFilters instanceof Array){
        fighterIds = fighterFilters.map(fighterFilter => ObjectId(fighterFilter));
    } else {
        fighterIds.push(ObjectId(fighterFilters));
    }

    let mongoQueryObj = {organization: org};

    if (fighterIds.length > 0) {
        mongoQueryObj.fighters = {$in:fighterIds};
    }

    if (eventFilters.length > 0){
        mongoQueryObj.eventName = {$in:eventFilters};
    }
    
    const fetchedMatches = await MatchModel.find(mongoQueryObj, CustomTools.ignoreUtility.ignoreObject)
        .sort({ date: -1, matchOrder: -1 })
        .skip(pageSize * (+query.page - 1))
        .limit(pageSize)
        .populate({ path: 'fighters', select: CustomTools.ignoreUtility.ignoreString });

    const totalMatches = await MatchModel.countDocuments({ organization: org });


    return {
        message: "Matches fetched sucessfully",
        matches: fetchedMatches,
        totalMatches: totalMatches
    };
};

const getMatchesDeprecated = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const org = req.query.org;
    if (pageSize && currentPage && org) {
        fetchMatchesDeprecated(pageSize, currentPage, org).then(fetchedMatches => {
            res.status(200).json(fetchedMatches);
        }).catch(err => {
            console.log(err);
            res.status(500).json(ERROR_MESSAGE_OBJECT);
        });
    } else {
        res.status(500).json(ERROR_MESSAGE_OBJECT);
    }
};

const getMatches = (req, res, next) => {
    console.log("gettingMatches");
    console.log(req.query);
    if (req.query) {
        fetchMatches(req.query).then(fetchedMatches => {
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
const getMatch = (req, res, next) => {
    const matchId = req.params.id;
    if (matchId) {
        MatchModel.findById({ _id: matchId }).populate({ path: 'fighters', select: CustomTools.ignoreUtility.ignoreString }).then(foundMatch => {
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

const search = (req, res, next) => {
    const search = req.params.search;
    const mode = req.params.mode;
    if (mode == "fighter") {
        const multipleWordsArr = search.split(" ");

        let firstNameSearch;
        let lastNameSearch;
        let searchFirstAndLast = false;

        if (multipleWordsArr.length > 1) {
            firstNameSearch = multipleWordsArr[0];
            lastNameSearch = multipleWordsArr[multipleWordsArr.length - 1];
            searchFirstAndLast = true;
        } else {
            firstNameSearch = search;
            lastNameSearch = search;
        }
        
        let searchQueryArray = [
            { firstName: { $regex: `.*${firstNameSearch}.*`, $options: 'i' } },
            { lastName: { $regex: `.*${lastNameSearch}.*`, $options: 'i' } }
        ];

        let queryAttribute = searchFirstAndLast ? "$and" : "$or";
        let searchQueryObj = {};
        
        searchQueryObj[queryAttribute] = searchQueryArray;

        console.log(searchQueryObj);
        FighterModel.find(searchQueryObj)
            .limit(5)
            .then(foundFighters => {
                let searchResults = foundFighters.map(fighter => {
                    return {
                        searchItem:fighter.firstName + " " + fighter.lastName,
                        searchId:fighter._id
                    };
                });

                res.status(200).json({
                    message: "Search Completed",
                    searchResults: searchResults
                });
            });
    } else if (mode == "event") {
        // TODO: might want to think of something more efficient maybe create a seperate collection for events
        MatchModel.distinct("eventName", { eventName: { $regex: `.*${search}.*`, $options: 'i' } })
            .then(foundEvents => {

                let searchResults = foundEvents.slice(0, 5).map(foundEvent => {
                    return {
                        searchItem:foundEvent,
                        searchId:null
                    };
                });
                res.status(200).json({
                    message: "Search Completed",
                    searchResults: searchResults
                });
            });
    } else {
        res.status(400).json({
            message: "Options does not contain " + mode,
        });
    }

};

module.exports = {
    getMatchesDeprecated: getMatchesDeprecated,
    getMatches: getMatches,
    getMatch: getMatch,
    // exporting fetchMatches for unit testing
    fetchMatches: fetchMatches,
    search: search
};
