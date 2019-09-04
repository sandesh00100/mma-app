const Match = require('../models/match.model');
const Fighter = require('../models/fighter.model');

// TODO: put current orgs in a global shared place
const CurrentOrgs = ['UFC', 'Bellator'];

const getMatches = (req,res,next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    
    if (pageSize && currentPage) {
        
    }
};

module.exports = {
    getMatches: getMatches
};
