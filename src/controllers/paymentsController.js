/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const Payments = require('../models/Payments');

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
