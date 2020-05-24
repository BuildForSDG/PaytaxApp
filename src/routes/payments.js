/* eslint-disable no-unused-vars */
const router = require('express').Router();
const cors = require('cors');
const paymentsController = require('../controllers/paymentsController');
const usersController = require('../controllers/usersController');

router.use(cors());


router.get('/types', paymentsController.paymentTypes);
router.get('/history/:taxPayerID', usersController.mustBeLoggedIn, paymentsController.paymentHistory);
router.get('/receipt/:taxPayerID', paymentsController.paymentReceipt);

module.exports = router;
