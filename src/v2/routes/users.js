/* eslint-disable linebreak-style */
const cors = require('cors');
const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.use(cors());

router.post('/register', usersController.registeration); // sent taxId as email
router.post('/login', usersController.login);
router.post('/recovery', usersController.recovery);
router.post('/change-password', usersController.recoverPassword);
router.get('/:taxID', usersController.mustBeLoggedIn, usersController.getUserData);
router.put('/update', usersController.mustBeLoggedIn, usersController.updateUser);

module.exports = router;
