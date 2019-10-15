const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');
const CheckAuthMiddleWare = require('../middleware/check.auth');

router.post('/register', JudgeController.createJudge);
router.post('/signin', JudgeController.signinJudge);
router.post('/scorecard', CheckAuthMiddleWare, JudgeController.saveScoreCard);

// TODO: Use the token to make sure only the right judge can get the preferences
router.get('/preference/stats', CheckAuthMiddleWare, JudgeController.getStatInfo);
module.exports = router;
