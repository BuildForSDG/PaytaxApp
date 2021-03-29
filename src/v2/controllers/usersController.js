/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const User = require('../models/Users');
const usersCollection = require('../../db').db('paytax').collection('users');

exports.home = (req, res) => {
  // return payer Id by email
  res.json('PAYTAX APP Application server');
};

exports.registeration = [
  [
    check('firstname').isAlpha().withMessage('firstname must be entered'),
    check('lastname').isAlpha().withMessage('last name must be entered'),
    check('email').isEmail().withMessage('email must be entered correctly'),
    check('phone').isAlphanumeric().withMessage('phone number must be entered correctly'),
    check('phone').isEmpty().withMessage('phone number must be entered'),
    check('pasword number must be entereds').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    console.log(req.boady);
    const user = new User(req.body);

    user.register().then((result) => res.status(200).json({
      status: true,
      PaytaxId: result.taxPayerId
    })).catch((err) => {
      res.json(err);
    });
  }
];

exports.login = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxPayerId').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long'),
    // password must be at least 8 chars long
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await usersCollection.findOne({
      taxPayerId: req.body.taxPayerId
    }, { password: 0, _id: 0 });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    // check if password is valid
    const isPasswordValid = await bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        token: null,
        data: 'Invalid password'
      });
    }
    // create access token
    const token = jwt.sign({ id: user.id }, process.env.JWTSECRET, {
      expiresIn: 86400 // 24 hours
    });
    return res.status(200).json({
      status: true,
      token,
      data: user
    });
  }
];

exports.mustBeLoggedIn = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization || req.body.token;
  // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  try {
    req.apiUser = jwt.verify(token, process.env.JWTSECRET);
    next();
  } catch (error) {
    res.status(403).json({
      status: false,
      data: 'Sorry, you must provide a valid token.'
    });
  }
};

exports.recovery = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxPayerId').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long')
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await usersCollection.findOne({
      taxPayerId: req.body.taxPayerId
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    // create recovery token
    const token = jwt.sign({ id: user.taxPayerId }, process.env.JWTSECRET, {
      expiresIn: 7200 // 2 hours
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${user.email}`,
      from: 'contact@app.paytax.com',
      subject: 'PayTax APP Account Recovery',
      text: 'Pay your tax anywhere with app.paytax.com',
      html: `
        <pre><h1> PayTax account recovery request </h1>
        Hello ${user.businessName},
        
        We received a request to use PayTax APP Account Recovery to regain access to your account. To continue, click this link:
        
        <a href="${process.env.RECOVERY}${token}"> Start LastPass Account Recovery </a>
        
        The link expires in 2 hours.
        
        If the link doesn't work, visit this site by copying this address to your browser:
        
        ${process.env.RECOVERY}${token} </pre>
      `
    };
    sgMail.send(msg);
    return res.status(200).json({
      status: true,
      data: 'Message sent'
    });
  }
];

exports.recoverPassword = [
  [
    // password must be at least 8 chars long
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long'),
    check('confirmPassword').isLength({ min: 8 }).withMessage('Password confirmation must be at least 8 chars long')
  ], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }

    try {
      const { password } = req.body;
      const { confirmPassword } = req.body;
      if (password !== confirmPassword) return res.status(422).json({ status: false, data: 'Passwords do not match' });
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      // get access token
      const { token } = req.query;
      if (!token) {
        return res.status(403).json({
          status: false,
          data: 'Sorry, you must provide a valid token.'
        });
      }
      req.apiUser = jwt.verify(token, process.env.JWTSECRET);
      const user = await usersCollection.findOneAndUpdate({ taxPayerId: req.apiUser.id },
        { $set: { password: passwordHash } });
      if (!user) {
        return res.status(400).json({
          status: false,
          data: 'User not found'
        });
      }
      // send success mail
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: `${user.value.email}`,
        from: 'contact@app.paytax.com',
        subject: 'PayTax APP Password Reset',
        text: 'Pay your tax anywhere with app.paytax.com',
        html: `
        <h1> PayTax account recovery request </h1>
        Hello ${user.value.businessName}, <br/>
        
        <p> Your password has been reset successfully! </p>
      `
      };
      sgMail.send(msg);

      return res.status(200).json({
        status: true,
        data: 'Password reset was successful'
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        data: `Sorry, an error occured - ${error}`
      });
    }
  }
];

exports.getUserData = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxID').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long')
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    const user = await usersCollection.findOne({
      taxPayerId: req.params.taxID
    }, { password: 0, _id: 0 });
    if (!user) {
      return res.status(400).json({
        status: false,
        data: 'User not found'
      });
    }
    return res.status(200).json({
      status: true,
      data: user
    });
  }
];
