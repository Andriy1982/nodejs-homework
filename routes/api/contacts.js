const express = require('express');
const router = express.Router();

const contactsController = require('../../controllers/contacts');

const { addContact, updateContact, id } = require('./validation');

router.get('/', contactsController.get);

router.get('/:contactId', id, contactsController.getById);

router.post('/', addContact, contactsController.create);

router.delete('/:contactId', id, contactsController.remove);

router.patch('/:contactId', updateContact, id, contactsController.update);

module.exports = router;
