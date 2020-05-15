/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const User = require('../models/Users');


exports.home = (req, res) => {
// return payer Id by email
  res.json('testing api');
};

exports.registeration = (req, res) => {
  const user = new User(req.body);
  user.register().then((result) => {
    res.json({
      PaytaxId: result.taxPayerId
    });
  }).catch((err) => {
    res.json(err);
  });
};
exports.login = (req, res) => {
// return token
  res.json('login in progress');
};

exports.mustBeLoggedIn = (req, res, next) => {
  next();
};

exports.recovery = (req, res) => {
  res.json('recovery in progress');
};

exports.getUserData = (req, res) => {
  res.json(`user information ${req.params.taxID}`);
};
