const express = require('express');
const router = express.Router();
const guard = require('../../../helpers/guard');

const usersController = require('../../../controllers/users');

// const { addContact, updateContact, id } = require('./validation');

router.post('/registration', usersController.reg);

router.post('/login', usersController.login);

router.post('/logout', guard, usersController.logout);

module.exports = router;
