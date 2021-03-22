const express = require('express');
const router = express.Router();
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

const usersController = require('../../../controllers/users');

const { validateUser, updateUser, updateAvatar } = require('./validation');

router.post('/register', validateUser, usersController.reg);

router.post('/login', validateUser, usersController.login);

router.post('/logout', guard, usersController.logout);

router.get('/current', guard, usersController.currentUser);

router.patch('/', guard, updateUser, usersController.updateSubscribe)

router.patch('/avatars', guard, upload.single('avatar'), updateAvatar, usersController.avatars)

module.exports = router;
