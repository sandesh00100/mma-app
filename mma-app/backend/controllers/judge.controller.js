const JudgeModel = require('../models/judge.model');
const ScoreCardModel = require('../models/scorecard.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers the Judge
 * @param {*} req contains the email and password of the Judge
 * @param {*} res
 * @param {*} next
 */
const createJudge = (req, res, next) => {
  // TODO: Research second argument, I think it's how many layers of salt it goes through
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    const INITIAL_VALUE = 0;
    const SHARED_INITIAL_VALUE = 50;
    let judgeObj = {
      email: req.body.email,
      password: hashedPassword,
      // TODO: remove this when we're done with everything
      isTestData: true,
      // Creating default preferences for judges
      preferences: {
        stats: [
          { name: 'Score', isShared: false, min: 0, max: 10, value: 7 },
          { name: 'Takedowns', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Knockdowns', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Submission Attempts', isShared: false, min: 0, max: 10, value: INITIAL_VALUE },
          { name: 'Octagon Control', isShared: true, min: 0, max: 100, value: SHARED_INITIAL_VALUE },
          { name: 'Damage Ratio', isShared: true, min: 0, max: 100, value: SHARED_INITIAL_VALUE },
          { name: 'Significant Strikes', isShared: false, min: 0, value: INITIAL_VALUE }
        ]
      }
    };

    const judge = new JudgeModel(judgeObj);

    // TODO: Check what's in the result
    judge.save().then(result => {
      res.json({
        message: "Judge registered sucessfully!"
      });
    }).catch(err => {
      console.log(err);
      res.json({
        message: "Error user could not be registered"
      });
    });
  });
}

/**
 * Async function that finds that looks up the email and password of judge and sends back a jwt
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const signinJudge = async (req, res, next) => {
  // TODO: Have better error handling
  try {
    const foundJudge = await JudgeModel.findOne({ email: req.body.email });
    if (!foundJudge) {
      res.status(500).json({
        message: "User could not be found"
      });
    } else {
      const isSamePassword = await bcrypt.compare(req.body.password, foundJudge.password);
      if (!isSamePassword) {
        res.status(500).json({
          message: "Passwords do not match"
        });
      } else {

        // TODO: Look into more different ways of hashing JWT and change secret key
        const token = jwt.sign({
          email: foundJudge.email,
          userId: foundJudge._id
        },
          'CHANGE_SERCRET_SIGNING_KEY'
          ,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token: token,
          expiresIn: 3600,
          judgeId: foundJudge._id,
          email: foundJudge.email
        });

      }
    }


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal error"
    });
  }
}

const getStatInfo = (req, res, next) => {
  const userData = req.userData;
  JudgeModel.findOne({ email: userData.email }, { preferences: 1, _id: 0 }).then(fetchedJudge => {
    res.status(200).json({
      message: "Stats fetched successfully",
      stats: fetchedJudge.preferences.stats
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "internal error"
    });
  })
};

/**
 * Update existing scorecard, create a new score cared if it doesn't exist
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const saveScoreCard = (req, res, next) => {
  const judgeId = req.userData.userId;
  let scoreCardObj = {...req.body};

  ScoreCardModel.updateOne(
    {
      match: scoreCardObj.match,
      judge: judgeId
    },
    {
      judge: judgeId,
      match: scoreCardObj.match,
      roundsScored: scoreCardObj.roundsScored,
      date: new Date()
    },
    {
      upsert: true
    }).then( updatedScoreCard => {
      console.log(updatedScoreCard);
      res.status(200).json({
        message: "Sucessfully saved score card."
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed to save your score card. Please try again."
      })
    });
};

module.exports = {
  createJudge: createJudge,
  signinJudge: signinJudge,
  getStatInfo: getStatInfo,
  saveScoreCard: saveScoreCard
};
