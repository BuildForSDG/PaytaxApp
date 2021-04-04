/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const Gateway = require('../models/Gateway');
const Payments = require('../models/Payments');

exports.pay = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: false,
      data: 'empty payload'
    });
  }
  const paystack = new Gateway(req.body);
  paystack.initializePayment().then((response) => res.status(200).json({
    status: true,
    data: response.data
  })
    // console.log(response.data.data.authorization_url);
  ).catch((err) => {
    res.status(400).json({
      status: false,
      data: err
    });
  });
};

// verification callback
exports.verify = (req, res) => {
  if (req.query.reference === undefined) {
    return res.status(400).json({
      status: false,
      data: 'empty query param'
    });
  }

  const ref = req.query.reference;
  const paystack = new Gateway();
  paystack.verifyPayment(ref).then((verification) => {
    const { response } = verification;
    // add the reciepts to history
    Payments.addToHistory(response.data).then((status) =>
      // redirect to payment receipt
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(200).json({
        status: true,
        data: status
      })).catch((err) => {
      res.status(400).json({
        status: false,
        data: err
      });
    });
  });
};
