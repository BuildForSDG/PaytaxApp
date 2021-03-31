/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
// const cors = require('cors');
const router = require('express').Router();
const paymentsController = require('../controllers/paymentsController');
const usersController = require('../controllers/usersController');

// router.use(cors());

router.get('/tax_types', usersController.mustBeLoggedIn, paymentsController.getTaxTypes);

router.post('/tax_types', usersController.mustBeLoggedIn, paymentsController.addTaxTypes);

router.get('/history/:taxPayerID', usersController.mustBeLoggedIn, paymentsController.paymentHistory);

router.post('/history', usersController.mustBeLoggedIn, paymentsController.addPaymentToHistory);

router.post('/payment_income_tax', paymentsController.paymentIncomeTax);

// insecure routes needs to be protected
router.get('/receipt', paymentsController.paymentReceipt);

module.exports = router;
