/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const _ = require('lodash');

const Payments = function (data) {
  this.data = data;
  if (this.data == null) {
    this.data = false;
  }
};
Payments.addToHistory = function (refData) {
  return new Promise((resolve, reject) => {
  // const selectedData = _.at(refData, ['reference', 'amount', 'customer.email', 'metadata.full_name']);
    const {
      reference, amount, customer, metadata
    } = refData;
    const selectedData = {
      reference: refData.data.reference,
      amount: (refData.data.amount / 100),
      taxpayer: customer,
      fullname: metadata
    };
    resolve(refData);
  });
};

module.exports = Payments;
