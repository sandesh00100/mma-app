const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');
const CheckAuthMiddleWare = require('../middleware/check.auth');

router.post('/register', JudgeController.createJudge);
router.post('/signin', JudgeController.signinJudge);
router.post('/preference/stats', CheckAuthMiddleWare, JudgeController.addStat);
router.delete('/preference/stats/:statId',CheckAuthMiddleWare,JudgeController.deleteStat);
router.get('/preference/stats', CheckAuthMiddleWare, JudgeController.getStatInfo);
module.exports = router;
