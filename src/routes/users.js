/* eslint-disable linebreak-style */
const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.registeration); // sent taxId as email
router.post('/login', usersController.login);
router.post('/recovery', usersController.recovery);
router.post('/change-password', usersController.recoverPassword);
router.get('/:taxID', usersController.mustBeLoggedIn, usersController.getUserData);


module.exports = router;
