const JudgeModel = require('../models/judge.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers the Judge
 * @param {*} req contains the email and password of the Judge
 * @param {*} res
 * @param {*} next
 */
const createJudge = (req, res, next) => {
  console.log(req.body);
  // TODO: Research second argument, I think it's how many layers of salt it goes through
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    let judgeObj = {
      email: req.body.email,
      password: hashedPassword,
      // TODO: remove this when we're done with everything
      isTestData: true,
      // Creating default preferences for judges
      preferences: {
        stats: [
          { name: 'Score', isShared: false, min: 0, max: 10 },
          { name: 'Takedowns', isShared: false, min: 0 },
          { name: 'Knockdowns', isShared: false, min: 0 },
          { name: 'Submission Attempts', isShared: false, min: 0, max: 10 },
          { name: 'Octagon Control', isShared: true, min: 0, max: 100 },
          { name: 'Damage Ratio', isShared: true, min: 0, max: 100 },
          { name: 'Significant Strikes', isShared: false, min: 0 }
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
  console.log(req.body);
  // TODO: Have better error handling
  try {
    const foundJudge = await JudgeModel.findOne({ email: req.body.email });
    console.log(foundJudge);
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
  JudgeModel.aggregate([
    { $match: { email: userData.email } },
    { $group: { stats: "$preferences.stats" } }
  ]).then(fetchedResult => {
    console.log(fetchedResult);
    res.status(200).json({
      messege: "Stats fetched sucessfully",
      stats:fetchedResult.stats
    });
  }).catch(err => {
    console.log(err);
    res.status(401).json({
      message: "Could not fetch Stats"
    });
  });
};

module.exports = {
  createJudge: createJudge,
  signinJudge: signinJudge,
  getStatInfo: getStatInfo
};
