const JudgeModel = require('../models/judge.model');
const ScoreCardModel = require('../models/scorecard.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomTools = require('../tools/CustomTools');
const mongoose = require('mongoose');
/**
 * Registers the Judge
 * @param {*} req contains the email and password of the Judge
 * @param {*} res
 * @param {*} next
 */
const createJudge = (req, res, next) => {
  // TODO: Research second argument, I think it's how many layers of salt it goes through
  // TODO: Research and add correct response messages
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    const INITIAL_VALUE = 0;
    const SHARED_INITIAL_VALUE = 50;
    let judgeObj = {
      email: req.body.email,
      password: hashedPassword,
      // TODO: remove this when we're done with everything
      isTestData: false,
      isMockData: true,
      // Creating default preferences for judges
      preferences: {
        stats: [
          { name: 'Score', isShared: false, min: 0, max: 10, value: 7 },
          { name: 'Takedowns', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Knockdowns', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Significant Strikes', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Submission Attempts', isShared: false, min: 0, value: INITIAL_VALUE },
          { name: 'Octagon Control', isShared: true, min: 0, max: 100, value: SHARED_INITIAL_VALUE },
          { name: 'Damage Ratio', isShared: true, min: 0, max: 100, value: SHARED_INITIAL_VALUE },
        ]
      }
    };

    const judge = new JudgeModel(judgeObj);

    // TODO: Check what's in the result
    judge.save().then(result => {
      res.status(200).json({
        message: "Judge registered sucessfully!"
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error registering Judge."
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
          message: "Sucessfully signed in!",
          token: token,
          expiresIn: 3600,
          id: foundJudge._id,
          email: foundJudge.email,
          preferences: foundJudge.preferences
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
  let scoreCardObj = { ...req.body };

  ScoreCardModel.updateOne(
    {
      match: scoreCardObj.match,
      judge: judgeId
    },
    {
      judge: judgeId,
      match: scoreCardObj.match,
      roundsScored: scoreCardObj.roundsScored,
      date: new Date(),
      isMockData: true,
      isTestData: false
    },
    {
      upsert: true
    }).then(updatedScoreCard => {
      res.status(200).json({
        message: "Sucessfully submitted score card."
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed to process your score card. Please try again."
      })
    });
};

// TODO: Check all return codes
const updateStatPreferences = (req, res, next) => {
  const judgeId = req.userData.userId;
  // NOT UPDATING CORRECTLY
  JudgeModel.updateOne({ _id: judgeId }, { "preferences.stats": req.body })
    .then(savedJudgePreferences => {
      res.status(200).json({
        message: "Preferences updated sucessfully"
      });
    }).catch(err => {
      res.status(500).json({
        message: "An error occurred when updating preferences"
      });
      console.log(err);
    });
};

const addStat = (req, res, next) => {
  const judgeId = req.userData.userId;
  const statId = mongoose.Types.ObjectId();

  const newStat = {
    ...req.body,
    _id:statId
  };
  console.log(req.body);
  console.log(newStat);
  JudgeModel.updateOne({ _id: judgeId},{
    $push:{
      "preferences.stats":newStat
    }
  }).then(
    savedStat => {
      res.status(200).json({
        message:"Sucessfully saved stat",
        savedStat:newStat
      })
    }
  ).catch( err => {
    res.status(500).json({
      message:"Could not save stat"
    });
  });
}

const deleteStat = (req, res, next) => {
  const judgeId = req.userData.userId;
  console.log(req.params);
  
  JudgeModel.updateOne({_id:judgeId},{
    $pull:{
      "preferences.stats":{
        _id:req.params.statId
      }
    }
  }).then(
    deletedResponse => {
      res.status(200).json({
        message:"Sucessfully deleted stat"
      });
    }
  ).catch(
    err => {
      res.status(500).json({
        message:"Failed to delete stat"
      });
    }
  );

  
};

const getJudgeHistory = (req, res, next) => {
  const userId = req.userData.userId;
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  fetchJudgedScoreCards(pageSize, currentPage, userId).then(fetchedScoreCards => {
    res.status(200).json(fetchedScoreCards);
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Could not fetch scoring history"
    });
  });
};

const fetchJudgedScoreCards = async (pageSize, currentPage, judgeId) => {

  // Find matches by looking at the org name, getting the corrosponding page and populating the fighter ids
  const fetchedScoreCards = await ScoreCardModel.find({ judge: judgeId }, CustomTools.ignoreUtility.ignoreObject)
    .sort({ date: -1 })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .populate(
      {
        path: 'match',
        populate:
        {
          path: 'fighters',
          model: 'Fighter',
          select: CustomTools.ignoreUtility.ignoreString + " -_id"
        },
        select: CustomTools.ignoreUtility.ignoreString
      }
    );
    
  const totalScoreCards = await ScoreCardModel.countDocuments({ judge: judgeId });

  return {
    message: "Score cards fetched sucessfully",
    scoreCards: fetchedScoreCards,
    totalScoreCards: totalScoreCards
  };
};

module.exports = {
  createJudge: createJudge,
  signinJudge: signinJudge,
  getStatInfo: getStatInfo,
  saveScoreCard: saveScoreCard,
  addStat: addStat,
  deleteStat: deleteStat,
  getJudgeHistory: getJudgeHistory
};
