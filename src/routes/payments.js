/* eslint-disable no-unused-vars */
const router = require('express').Router();
const cors = require('cors');
const paymentsController = require('../controllers/paymentsController');
const userController = require('../controllers/usersController');

router.use(cors());


router.get('/types', paymentsController.paymentTypes);
router.get('/history/:taxPayerID', paymentsController.paymentHistory);
router.get('/receipt/:taxPayerID', paymentsController.paymentReceipt);

module.exports = router;
