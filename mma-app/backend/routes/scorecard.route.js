const express = require('express');
const router = express.Router();
const ScoreCardController = require('../controllers/scorecard.controller');
const CheckAuthMiddleWare = require('../middleware/check.auth');

router.post('', CheckAuthMiddleWare, ScoreCardController.saveScoreCard);
router.get('/history', CheckAuthMiddleWare, ScoreCardController.getJudgeHistory);

module.exports = router;