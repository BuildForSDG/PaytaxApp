/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Gateway = require('../models/Gateway');
const Payments = require('../models/Payments');


exports.pay = (req, res) => {
  // console.log(req.body);
  const paystack = new Gateway(req.body);
  paystack.initializePayment().then((response) => {
    res.redirect(response.data.data.authorization_url);
    console.log(response.data.data.authorization_url);
  }).catch((err) => {
    res.status(500).json({
      status: false,
      data: err
    });
  });
};

exports.verify = (req, res) => {
  const ref = req.query.reference;
  const paystack = new Gateway();
  paystack.verifyPayment(ref).then((response) => {
    const { data } = response;
    Payments.addToHistory(data).then((status) => {
      console.log(status);
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      status: false,
      data: 'something is wrong,try again later'
    });
  });
};

exports.paymentHistory = (req, res) => {
  // return payer Id by email
  res.json(req.params.id);
};
