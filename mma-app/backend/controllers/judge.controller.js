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
  // TODO: Research second argument, I think it's how many layers of salt it goes through
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    const judge = new JudgeModel({
      email: req.body.email,
      password: hashedPassword
    });

    // TODO: Check what's in the result
    judge.save().then(result => {
      res.json({
        message: "Judge registered sucessfully!",
        result: result
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
    const foundJudge = await JudgeModel.findOne({ email: req.email, password: req.password });
    if (!foundJudge) {
      return res.json({
        message: "User could not be found"
      });
    } else {
      const isSamePassword = await bcrypt.compare(req.password, foundJudge.password);
      if (!isSamePassword) {
        res.json({
          message: "Passwords do not match"
        });
      } else {

        // TODO: Look into more different ways of hashing JWT
          const token = jwt.sign({
            email: foundJudge.email,
            userId: foundJudge._id
          },
          'CHANGE_SERCRET_SIGNING_KEY'
          ,
          {expiresIn: "1h"}
          );

          res.json({

          });

      }
    }


  } catch (err) {

  }
}

module.exports = {
  createJudge: createJudge,
  signinJudge: signinJudge
};
