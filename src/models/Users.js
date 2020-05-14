/* eslint-disable no-plusplus */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-useless-return */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const validator = require('validator');
const md5 = require('md5');
const usersCollection = require('../db').db().collection('users');
// console.log(usersCollection);

const User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (this.data.company) {
    // company account reg
    if (typeof (this.data.name) !== 'string') { this.data.name = ''; }
    if (typeof (this.data.address) !== 'string') { this.data.address = ''; }
    if (typeof (this.data.email) !== 'string') { this.data.email = ''; }
    if (typeof (this.data.phone) !== 'string') { this.data.phone = ''; }
    if (typeof (this.data.bvn) !== 'string') { this.data.bvn = ''; }
    if (typeof (this.data.password) !== 'string') { this.data.password = ''; }
    if (typeof (this.data.state) !== 'string') { this.data.state = ''; }
    if (typeof (this.data.city) !== 'string') { this.data.city = ''; }
    // get rid of any bogus properties
    this.data = {
      businessName: this.data.name.toLowerCase(),
      businessAddress: this.data.address.toLowerCase(),
      email: this.data.email.trim().toLowerCase(),
      phone: this.data.phone,
      bvn: this.data.bvn,
      password: this.data.password,
      state: this.data.state.trim().toLowerCase(),
      city: this.data.city.trim().toLowerCase()
    };
  } else {
    // personal business account reg
    if (typeof (this.data.name) !== 'string') { this.data.name = ''; }
    if (typeof (this.data.address) !== 'string') { this.data.address = ''; }
    if (typeof (this.data.email) !== 'string') { this.data.email = ''; }
    if (typeof (this.data.phone) !== 'string') { this.data.phone = ''; }
    if (typeof (this.data.gender) !== 'string') { this.data.gender = ''; }
    if (typeof (this.data.maritalStatus) !== 'string') { this.data.maritalStatus = ''; }
    if (typeof (this.data.birthDate) !== 'string') { this.data.birthDate = ''; }
    if (typeof (this.data.password) !== 'string') { this.data.password = ''; }
    if (typeof (this.data.bvn) !== 'string') { this.data.bvn = ''; }
    if (typeof (this.data.state) !== 'string') { this.data.state = ''; }
    if (typeof (this.data.city) !== 'string') { this.data.city = ''; }
    // get rid of any bogus properties
    this.data = {
      businessName: this.data.name.toLowerCase(),
      businessAddress: this.data.address.toLowerCase(),
      email: this.data.email.trim().toLowerCase(),
      phone: this.data.phone,
      status: this.data.maritalStatus.trim().toLowerCase(),
      gender: this.data.gender.trim().toLowerCase(),
      birthDate: this.data.birthDate,
      bvn: this.data.bvn,
      password: this.data.password,
      state: this.data.state.trim().toLowerCase(),
      city: this.data.city.trim().toLowerCase()
    };
  }
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    // Only if username is valid then check to see if it's already taken
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

User.makeId = function (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {

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
      await usersCollection.insertOne(this.data);
      resolve(this.data);
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.getUserByTaxID = function () {
  return new Promise((resolve, reject) => {

  });
};

module.exports = User;
