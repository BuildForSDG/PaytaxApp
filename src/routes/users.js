const router = require('express').Router();
const cors = require('cors');
const usersController = require('../controllers/usersController');


router.use(cors());


router.post('/register', usersController.registeration); // sent taxId as email
router.post('/login', usersController.login);
router.post('/recovery', usersController.recovery);
router.get('/biodata/:taxID', usersController.mustBeLoggedIn, usersController.getUserData);


module.exports = router;
