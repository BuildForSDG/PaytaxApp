/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-useless-return */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const validator = require('validator');
const md5 = require('md5');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const usersCollection = require('../../db').db('paytax').collection('users');

const User = function (data) {
  this.data = data;
  this.errors = [];
  this.source = null;
};


User.makeId = function (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
// static sendMAIL method
User.sendMail = function (msg) {
  sgMail
    .send(msg)
    .then((data) => {
      console.log('Registered successfully!');
    }, (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // this.cleanUp();
    // await this.validate();
    this.data.taxPayerId = await User.makeId(10);
    if (!this.errors.length) {
      // hash user password
      const salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      // upload to users collection
      // check if user exist before
      const existingUser = await usersCollection.findOne({ email: this.data.email });

      if (existingUser) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('user with this email address exist');
      }
      await usersCollection.insertOne(this.data);

      // send the paytax Id as an email
      User.sendMail({
        to: `${this.data.email}`,
        from: 'contact@app.paytax.com',
        subject: 'PayTax APP registration',
        text: 'Pay your tax anywhere with app.paytax.com',
        html: `<strong> Hi 😀 ${this.data.businessName} we've received your registration; Here's your Tax payer ID: <h1> ${this.data.taxPayerId}</h1>  </strong>`
      });
      resolve(this.data);
    } else {
      reject(this.errors);
    }
  });
};


module.exports = User;
