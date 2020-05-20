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

const usersCollection = require('../db').db().collection('users');

const User = function (data) {
  this.data = data;
  this.errors = [];
  this.source = null;
};

User.prototype.cleanUp = function () {
  // get rid of any bogus properties
  this.source = {
    businessName: this.data.name.toLowerCase(),
    businessAddress: this.data.address.toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    phone: this.data.phone,
    bvn: this.data.bvn,
    password: this.data.password,
    state: this.data.state.trim().toLowerCase(),
    city: this.data.city.trim().toLowerCase()
  };
  if (this.data.company === 'true') {
    // company account registration
    this.data = this.source;
  }
  if (this.data.company === 'false') {
    // individual business account registration
    // get rid of any bogus properties
    this.target = {
      status: this.data.maritalStatus.trim().toLowerCase(),
      gender: this.data.gender.trim().toLowerCase(),
      birthDate: this.data.birthDate.toLowerCase()
    };
    this.data = { ...this.target, ...this.source };
  }
};

// registration validations
User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (validator.isEmpty(this.data.businessName)) {
      this.errors.push('You must provide a business name.');
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push('You must provide a valid email address.');
    }
    if (validator.isEmpty(this.data.password)) {
      this.errors.push('You must provide a password.');
    }
    if (this.data.password.length > 0 && this.data.password.length < 12) {
      this.errors.push('Password must be at least 12 characters.');
    }
    if (this.data.password.length > 100) {
      this.errors.push('Password cannot exceed 100 characters');
    }
    if (this.data.password.length > 30) {
      this.errors.push('Password cannot exceed 30 characters');
    }
    if (validator.isEmpty(this.data.businessAddress)) {
      this.errors.push('You must provide a business Address.');
    }
    if (validator.isEmpty(this.data.phone)) {
      this.errors.push('You must provide a phone.');
    }
    if (!validator.isEmpty(this.data.phone) && !validator.isInt(this.data.phone)) {
      this.errors.push('Phone can only contain numbers.');
    }
    if (validator.isEmpty(this.data.bvn)) {
      this.errors.push('You must provide a bvn.');
    }
    if (!validator.isEmpty(this.data.bvn) && !validator.isInt(this.data.bvn)) {
      this.errors.push('BVN  can only contain numbers.');
    }
    if (validator.isEmpty(this.data.state)) {
      this.errors.push('You must provide a state.');
    }
    if (!validator.isEmpty(this.data.state) && !validator.isAlpha(this.data.state)) {
      this.errors.push('State can only contain letters.');
    }
    if (validator.isEmpty(this.data.city)) {
      this.errors.push('You must provide a city.');
    }
    if (!validator.isEmpty(this.data.city) && !validator.isAlpha(this.data.city)) {
      this.errors.push('City can only contain letters.');
    }

    // Only if businessName is valid then check to see if it's already taken
    if (this.data.businessName.length > 2 && validator.isAlphanumeric(this.data.businessName)) {
      const businessNameExists = await usersCollection
        .findOne({ businessName: this.data.businessName });
      if (businessNameExists) { this.errors.push('This Business name already exist.'); }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      const emailExists = await usersCollection.findOne({ email: this.data.email });
      if (emailExists) { this.errors.push('This email is already being used.'); }
    }
    resolve();
  });
};
// genearate paytax Id
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
    this.cleanUp();
    await this.validate();
    this.data.taxPayerId = await User.makeId(10);
    if (!this.errors.length) {
      // hash user password
      const salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      // upload to users collection
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
