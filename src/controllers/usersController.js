/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const User = require('../models/Users');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.home = (req, res) => {
// return payer Id by email
  res.json('testing api');
};

exports.registeration = (req, res) => {
  const user = new User(req.body);
  user.register().then((result) => {
    const msg = {
      to: `${result.email}`,
      from: 'contact@app.paytax.com',
      subject: 'PayTax APP registration',
      text: 'Pay your tax anywhere with app.paytax.com',
      html: `<strong> Hi 😀 ${result.businessName} we've received your registration; Here's your Tax payer ID: <h1> ${result.taxPayerId}</h1>  </strong>`
    };
    sgMail
      .send(msg)
      .then((data) => {
        console.log('Registered successfully!');
      }, (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      });
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
