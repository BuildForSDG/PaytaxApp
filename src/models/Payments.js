/* eslint-disable linebreak-style */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const moment = require('moment');
const User = require('./Users');

const usersCollection = require('../db').db().collection('users');

const paymentsCollection = require('../db').db().collection('payments');

const taxTypesCollection = require('../db').db().collection('taxtypes');

const Payments = function (taxPayerID, paymentDate) {
  this.taxPayerID = taxPayerID;
  this.paymentDate = paymentDate;
  if (this.taxPayerID == null) {
    this.taxPayerID = false;
  }
  if (this.paymentDate == null) {
    this.paymentDate = false;
  }
  this.errors = [];
  this.taxType = null;
};

Payments.addToHistory = function (refData) {
  return new Promise((resolve, reject) => {
    const selectedData = {
      payment_reference: refData.data.reference,
      amount: (refData.data.amount / 100),
      payment_date: refData.data.paid_at.replace('.000Z', ' ').trim(),
      currency: refData.data.currency,
      taxpayer: refData.data.metadata.full_name,
      email: refData.data.customer.email,
      tax_type: refData.data.metadata.tax_type
    };
    usersCollection.findOne({ email: selectedData.email }).then((user) => {
      selectedData.taxPayerId = user.taxPayerId;
      selectedData.state = user.state;
      paymentsCollection.insertOne(selectedData).then((success) => {
        resolve(selectedData);
        Payments.sendReceipt(selectedData);
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

Payments.addToHistoryInline = function (refData) {
  return new Promise((resolve, reject) => {
    const selectedData = {
      payment_reference: refData.reference,
      amount: (refData.amount),
      payment_date: moment(new Date()).format('LLL'),
      currency: 'NGN',
      taxpayer: refData.fullname,
      email: refData.email,
      taxtype: refData.taxtype,
      reference: refData.reference
    };
    usersCollection.findOne({ email: selectedData.email }).then(async (user) => {
      if (!user) {
        reject('Organization not found!');
        return;
      }
      selectedData.taxPayerId = user.taxPayerId;
      selectedData.state = user.state;

      paymentsCollection.insertOne(selectedData).then((success) => {
        resolve(selectedData);
        Payments.sendReceipt(selectedData);
      }).catch((err) => {
        reject('Bad request');
      });
    });
  });
};

Payments.sendReceipt = async function (selectedData) {
  let msg = selectedData;
  msg = {
    to: `${selectedData.email}`,
    from: 'contact@app.paytax.com',
    subject: 'Payment Receipt',
    text: 'Transaction Successful!',
    html: `
    <div>PaymentReference: ${selectedData.payment_reference}</div>
    <div>Amount paid: ${selectedData.amount}</div>
    <div>Payment Date: ${selectedData.payment_date}</div>
    <div>Currency: ${selectedData.currency}</div>
    <div>Tax Payer: ${selectedData.taxpayer}</div>
    <div>Email: ${selectedData.email}</div>
    <div>Tax Payer ID: ${selectedData.taxPayerId}</div>
    <div>Tax Type: ${selectedData.tax_type}</div>
    `
  };
  await User.sendMail(msg);
};

// payment Get history method
Payments.prototype.getHistory = function () {
  return new Promise((resolve, reject) => {
    this.taxPayerID.trim();
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

// Get payment reciept
Payments.prototype.getReceipt = function () {
  return new Promise(async (resolve, reject) => {
    paymentsCollection.find(
      {
        taxPayerId: this.taxPayerID,
        payment_date: this.paymentDate
      }
    ).toArray().then((data) => {
      const receipts = data.map((receipt) => ({
        payment_reference: receipt.payment_reference,
        amount: receipt.amount,
        payment_date: receipt.payment_date,
        currency: receipt.currency,
        taxpayer: receipt.taxpayer,
        email: receipt.email,
        taxPayerId: receipt.taxPayerId
      }));
      resolve(receipts);
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = Payments;
