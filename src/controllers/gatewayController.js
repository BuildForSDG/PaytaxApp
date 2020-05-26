/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const Gateway = require('../models/Gateway');
const Payments = require('../models/Payments');


exports.pay = (req, res) => {
  const paystack = new Gateway(req.body);
  paystack.initializePayment().then((response) => {
    res.redirect(response.data.data.authorization_url);
    console.log(response.data.data.authorization_url);
  }).catch((err) => {
    res.status(400).json({
      status: false,
      data: err
    });
  });
};

// verification callback
exports.verify = (req, res) => {
  const ref = req.query.reference;
  const paystack = new Gateway();
  paystack.verifyPayment(ref).then((verification) => {
    const { response } = verification;
    // add the reciepts to history
    Payments.addToHistory(response.data).then((status) => {
      // redirect to payment receipt
      res.redirect(`/api/v1/payments/receipt?taxPayerID=${status.taxPayerId}&paymentDate=${status.payment_date}`);
    }).catch((err) => {
      res.status(400).json({
        status: false,
        data: err
      });
    });
  });
};
