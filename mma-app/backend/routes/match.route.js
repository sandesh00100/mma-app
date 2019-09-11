const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/match.controller');
const JudgeController = require('../controllers/judge.controller');

router.get('', MatchController.getMatches);
router.post('/signup', JudgeController.createJudge);
router.post('/login', JudgeController.loginJudge);

module.exports = router;