/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const { check, validationResult } = require('express-validator');
const Payments = require('../models/Payments');
const usersCollection = require('../db').db('paytax').collection('users');

//  calls the getTaxTypes methods
exports.getTaxTypes = function (req, res) {
  const payments = Payments.getOtherTaxTypes();
  payments.then((types) => {
    if (types === undefined || types.length === 0) {
      // array empty or does not exist
      res.status(400).json({
        status: true,
        data: ' No TaxType returned'
      });
    } else {
      res.status(200).json({
        status: true,
        data: types
      });
    }
  }).catch((err) => {
    res.status(400).json({
      status: false,
      data: err
    });
  });
};

// calls the addTaxTypes methods
exports.addTaxTypes = function (req, res) {
  const taxType = req.body;
  const payments = new Payments();
  payments.addOtherTaxTypes(taxType).then(() => {
    res.status(200).json({
      status: true,
      data: 'Successfully added!'
    });
  }).catch((err) => {
    res.status(400).json({
      status: false,
      data: 'Bad Request'
    });
  });
};

//  get payment history from taxPayerID
exports.paymentHistory = function (req, res) {
  const taxID = req.params.taxPayerID;
  const payments = new Payments(taxID);
  payments.getHistory().then((data) => {
    if (data === undefined || data.length === 0) {
      // array empty or does not exist
      res.status(404).json({
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
    // bad request
    res.status(400).json({
      status: false,
      data: 'Bad Request'
    });
  });
};

//  get  receipt from taxPayerID
exports.paymentReceipt = function (req, res) {
  const { taxPayerID, paymentDate } = req.query;

  const payments = new Payments(taxPayerID, paymentDate);
  payments.getReceipt().then((receipt) => {
    res.status(200).json({
      status: true,
      data: receipt
    });
  }).catch((err) => {
    res.status(400).json({
      status: false,
      data: 'Bad Request'
    });
  });
};

const calculatePIT = (income) => {
  const q = [300000, 300000, 500000, 500000, 1600000, 3200000];
  const rate = [0.07, 0.11, 0.15, 0.19, 0.21, 0.24];
  const taxPayable = [];
  let totalTaxPayable = 0;
  let incomeBalance = income - q[0];
  taxPayable.push(Math.trunc(q[0] * rate[0]));
  if (incomeBalance <= 0) {
    totalTaxPayable = income * rate[0];
    return totalTaxPayable;
  }
  for (let i = 1; i < q.length - 1; i++) {
    incomeBalance -= q[i];
    taxPayable.push(Math.trunc(q[i] * rate[i]));
    if (incomeBalance <= 0) {
      let incomeStat;
      for (let j = 0; j < i; j++) {
        incomeStat = income - q[j];
      }
      totalTaxPayable = (incomeStat) * rate[i];
      for (let k = 0; k < taxPayable.length - 1; k++) {
        totalTaxPayable += taxPayable[k];
      }
      return totalTaxPayable;
    }
  }
  incomeBalance = income - q[5];
  taxPayable.forEach((tpi) => {
    totalTaxPayable += tpi;
  });
  if (incomeBalance < 0) {
    return totalTaxPayable;
  }
  totalTaxPayable += Math.trunc(incomeBalance * rate[5]);
  return totalTaxPayable;
};

exports.paymentIncomeTax = [
  [
    // taxPayerId must be alphanumeric and at least 15 characters long
    check('taxPayerId').isAlphanumeric().withMessage('Payer ID must be alphanumeric')
      .isLength({ min: 10, max: 10 })
      .withMessage('Tax Payer ID must be 10 chars long'),
    // taxPayer income must be numeric and must not be empty
    check('income').isNumeric().withMessage('Payer income must be numeric')
      .isLength({ min: 1 })
      .withMessage('Tax Payer income must not be empty')
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: false, errors: errors.array() });
    }
    try {
      const { income } = req.body;
      const totalTaxPayable = calculatePIT(income);
      // update user payable income tax field
      const user = await usersCollection.findOneAndUpdate({ taxPayerId: req.body.taxPayerId },
        { $set: { paymentIncomeTax: totalTaxPayable } });
      if (!user) {
        return res.status(400).json({
          status: false,
          data: 'User not found'
        });
      }
      return res.json({
        status: true,
        data: totalTaxPayable,
        message: "User's payable income tax updated successfully"
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        data: `Bad Request - ${error}`
      });
    }
  }
];
