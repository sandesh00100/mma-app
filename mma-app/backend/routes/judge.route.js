const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');

router.post('/register', JudgeController.createJudge);
router.post('/signin', JudgeController.signinJudge);

// TODO: Use the token to make sure only the right judge can get the preferences
router.get('/preference/:judgeId', JudgeController.getStatInfo)
module.exports = router;