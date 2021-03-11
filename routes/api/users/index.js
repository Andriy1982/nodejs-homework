const express = require('express');
const router = express.Router();
const guard = require('../../../helpers/guard');

const usersController = require('../../../controllers/users');

const { validateUser } = require('./validation');

router.post('/registr', validateUser, usersController.reg);

router.post('/login', validateUser, usersController.login);

router.post('/logout', guard, usersController.logout);

router.get('/current', guard, usersController.currentUser);

module.exports = router;
