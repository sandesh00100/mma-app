const JudgeModel = require('../models/judge.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createJudge = (req, res, next) => {
    // TODO: Research second argument, I think it's how many layers of salt it goes through
    bcrypt.hash(req.body.password,10).then(hashedPassword => {
        const judge = new JudgeModel({
            email:req.body.email,
            password:hashedPassword
        });

        // TODO: Check what's in the result
        judge.save().then(result => {   
            res.json({
                message: "Judge registered sucessfully!",
                result:result
            });
        }).catch(err => {
            console.log(err);
            res.json({
                message: "Error user could not be registered"
            });
        });
    });
}

const signinJudge = (req, res, next) => {

}

module.exports = {
    createJudge:createJudge,
    signinJudge:signinJudge
};
