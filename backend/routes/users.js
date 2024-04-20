const router = require('express').Router();
const { login, signUp, getUser }  = require('../controllers/users.js');

router.route('/login').post(login);
router.route('/signup').post(signUp);
router.route('/:id').get(getUser);

module.exports = router;