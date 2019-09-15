const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');

router.post('/register', JudgeController.createJudge);
router.post('/signin', JudgeController.signinJudge);

module.exports = router;