const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../model/contacts');

const get = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await listContacts(userId);
    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await getContactById(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await addContact({ ...req.body, owner: userId });
    console.log('New contact', contact);
    if (contact) {
      return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          contact,
        },
      });
    } else {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Not created',
      });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await removeContact(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'contact deleted',
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing fields',
      });
    }
    const contact = await updateContact(req.params.contactId, req.body, userId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};
