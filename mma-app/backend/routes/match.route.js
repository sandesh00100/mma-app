const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/match.controller');

router.get('', MatchController.getMatches);
router.get('/:id', MatchController.getMatch);
module.exports = router;