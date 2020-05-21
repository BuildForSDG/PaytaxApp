/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const axios = require('axios');
const gatewayController = require('../controllers/gatewayController');

const Paystack = function (data) {
  this.data = data;
  if (this.data == null) {
    this.data = false;
  }
  this.key = 'sk_test_50c95c6d4ebb739f1e96963f0816b7a0eb0b5ca2';
  this.MySecretKey = `Bearer ${this.key}`;
  this.data = {
    amount: this.data.amount *= 100,
    email: this.data.email,
    metadata: {
      name: this.data.full_name
    }
  };
};
Paystack.prototype.initializePayment = function () {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: 'post',
      url: 'https://api.paystack.co/transaction/initialize',
      headers: {
        authorization: this.MySecretKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      data: this.data
    };
    await axios(options).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
};

Paystack.prototype.verifyPayment = function (ref) {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: 'get',
      url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
      headers: {
        authorization: this.MySecretKey,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    };
    await axios(options).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = Paystack;
