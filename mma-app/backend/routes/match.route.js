const express = require('express');
const router = express.router();
const MatchController = require('../controllers/match.controller');

router.get('', MatchController.getMatches);

module.exports = router;