/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const usersCollection = require('../db').db().collection('users');

const paymentsCollection = require('../db').db().collection('payments');

const Payments = function (taxPayerID) {
  this.taxPayerID = taxPayerID;
  if (this.taxPayerID == null) {
    this.taxPayerID = false;
  }
};
Payments.addToHistory = function (refData, taxPayerId) {
  return new Promise((resolve, reject) => {
    const selectedData = {
      payment_reference: refData.data.reference,
      amount: (refData.data.amount / 100),
      payment_date: refData.data.paid_at,
      currency: refData.data.currency,
      taxpayer: refData.data.metadata.full_name,
      email: refData.data.customer.email,
      tax_type: refData.data.metadata.tax_type
    };
    usersCollection.findOne({ email: refData.data.customer.email }).then((user) => {
      selectedData.taxPayerId = user.taxPayerId;
      selectedData.state = user.state;
      paymentsCollection.insertOne(selectedData).then((success) => {
        resolve(success);
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {

    });
  });
};

// payment Get history method
Payments.prototype.getHistory = function () {
  return new Promise((resolve, reject) => {
    paymentsCollection.find(
      { taxPayerId: this.taxPayerID },
      { $sort: { payment_date: -1 } }
    ).toArray().then((responses) => {
      const responseHistory = responses.map((response) => response);
      resolve(responseHistory);
    }).catch((err) => {
      reject('err');
    });
  });
};

module.exports = Payments;
