/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const User = require('../models/Users');
const Gateway = require('../models/Gateway');
const Payments = require('../models/Payments');

exports.paymentTypes = function (req, res) {
};

//  get payment history from taxPayerID
exports.paymentHistory = function (req, res) {
  const taxID = req.params.taxPayerID;
  const payments = new Payments(taxID);
  payments.getHistory().then((data) => {
    if (data === undefined || data.length === 0) {
      // array empty or does not exist
      res.status(500).json({
        status: false,
        data: ' Invalid Tax Payer ID'
      });
    } else {
      res.status(200).json({
        status: true,
        data
      });
    }
  }).catch((err) => {
    res.status(500).json({
      status: false,
      data: err
    });
  });
};

exports.paymentReceipt = function (req, res) {

};
