/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const validator = require('validator');

const usersCollection = require('../db').db().collection('users');

const paymentsCollection = require('../db').db().collection('payments');

const taxTypesCollection = require('../db').db().collection('taxtypes');

const Payments = function (taxPayerID) {
  this.taxPayerID = taxPayerID;
  if (this.taxPayerID == null) {
    this.taxPayerID = false;
  }
  this.errors = [];
  this.taxType = null;
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


// get all other tax types asides the PIT tax
Payments.getOtherTaxTypes = function () {
  return new Promise((resolve, reject) => {
    taxTypesCollection.find({}).toArray().then((docs) => {
      const taxTypes = docs.map((doc) => doc);
      resolve(taxTypes);
    }).catch((err) => {
      reject(err);
    });
  });
};

Payments.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    this.taxType = {
      name: this.taxType.name.trim().toLowerCase(),
      type: this.taxType.type.trim().toUpperCase()
    };
    const taxNameExists = await taxTypesCollection
      .findOne({ name: this.taxType.name });
    if (taxNameExists) {
      this.errors.push('This Tax name already exit.');
    }
    resolve();
  });
};
// Add other tax types asides the PIT tax
Payments.prototype.addOtherTaxTypes = async function (type) {
  this.taxType = type;
  await this.validate();

  return new Promise(async (resolve, reject) => {
    // if no errors
    if (!this.errors.length) {
      // upload to taxtypes colletion
      await taxTypesCollection.insertOne(this.taxType);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

module.exports = Payments;
