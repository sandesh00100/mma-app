const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const matchRoutes = require('./routes/match.route');
const judgeRoutes = require('./routes/judge.route');
const scorecardRoutes = require('./routes/scorecard.route');

const mongoose = require('mongoose');
// secure password relative to app.js
const mongoPassword = require('../../../pas');
// 'node-angular' is the database it is storing the post in
const databaseURL = 'mongodb+srv://sandesh:' + mongoPassword.PASSWORD + '@mean-stack-optfw.mongodb.net/node-angular?retryWrites=true';

mongoose.connect(databaseURL, { useNewUrlParser: true })
  .then(() => {
    console.log('\nConnected to mongo database!\n');
  }).catch(() => {
    console.log('Connection failed and the password is' + mongoPassword.PASSWORD);
  });

app.use(bodyParser.json());

// Any requests targeting the images folder should be allowed (probably because it's relative to the server.js)
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    // no matter what the app domain is running on you are able to use this app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // what http requests can be sent
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
  });

app.use('/api/matches',matchRoutes);
app.use('/api/judge',judgeRoutes);
app.use('/api/scorecards', scorecardRoutes);

module.exports = app;
