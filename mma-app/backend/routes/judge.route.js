const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');
const CheckAuthMiddleWare = require('../middleware/check.auth');

router.post('/register', JudgeController.createJudge);
router.post('/signin', JudgeController.signinJudge);
router.post('/scorecard', CheckAuthMiddleWare, JudgeController.saveScoreCard);
router.post('/preference/stats', CheckAuthMiddleWare, JudgeController.updateStatPreferences);
router.get('/preference/stats', CheckAuthMiddleWare, JudgeController.getStatInfo);
router.get('/history', CheckAuthMiddleWare, JudgeController.getJudgeHistory);
module.exports = router;
