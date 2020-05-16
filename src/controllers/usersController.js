/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');

exports.home = (req, res) => {
// return payer Id by email
  res.json('testing api');
};

exports.register = (req, res) => {
// return payer Id by email
  res.json('registraion in progress');
};

exports.login = [
  [
    // username must be an email
    check('email').isEmail().withMessage('Invalid email addres'),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    // check password
    const isUser = await bcrypt.compare(req.body.password, user.password);
    if (!isUser) {
      return res.status(400).json({
        status: false,
        data: 'Wrong email or password'
      });
    }
    return res.status(200).json({
      status: true,
      data: user
    });
    // return token
    // return res.json('login in progress');
  }
];

exports.mustBeLoggedIn = (req, res, next) => {
  next();
};

exports.recovery = (req, res) => {
  res.json('recovery in progress');
};

exports.getUserData = (req, res) => {
  res.json(`user information ${req.params.taxID}`);
};
