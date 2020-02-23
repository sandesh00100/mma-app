const ScoreCardModel = require('../models/scorecard.model');
const CustomTools = require('../tools/CustomTools');

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
  saveScoreCard: saveScoreCard,
  getJudgeHistory: getJudgeHistory
};
