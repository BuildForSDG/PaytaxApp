/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const usersCollection = require('../db').db().collection('users');

const paymentsCollection = require('../db').db().collection('payments');

const Payments = function (data) {
  this.data = data;
  if (this.data == null) {
    this.data = false;
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
      paymentsCollection.insertOne(selectedData).then((success) => {
        resolve(success);
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {

    });
  });
};

module.exports = Payments;
