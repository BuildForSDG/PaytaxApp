/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const router = require('express').Router();
const usersController = require('../controllers/usersController');
const gatewayController = require('../controllers/gatewayController');

// protected routes
router.post('/pay', gatewayController.pay);

router.get('/callback', gatewayController.verify);


module.exports = router;
