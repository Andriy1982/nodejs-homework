const express = require('express');
// const { required } = require('joi');
const router = express.Router();
const guard = require('../../../helpers/guard');

const contactsController = require('../../../controllers/contacts');

const { addContact, updateContact, id } = require('./validation');

router.get('/', guard, contactsController.get);

router.get('/:contactId', guard, id, contactsController.getById);

router.post('/', guard, addContact, contactsController.create);

router.delete('/:contactId', guard, id, contactsController.remove);

router.patch(
  '/:contactId',
  guard,
  updateContact,
  id,
  contactsController.update,
);

module.exports = router;
