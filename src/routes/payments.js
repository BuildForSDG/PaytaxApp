const router = require('express').Router();
const cors = require('cors');
const paymentsController = require('../controllers/paymentsController');
const userController = require('../controllers/usersController');

router.use(cors());


router.get('/types', paymentsController.paymentTypes);
router.get('/history:taxID', userController.mustBeLoggedIn, paymentsController.paymentHistory);

module.exports = router;
