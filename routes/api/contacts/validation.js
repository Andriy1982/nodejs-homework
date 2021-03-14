const Joi = require('joi');
const mongoose = require('mongoose');

const addContact = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    phone: Joi.string().required(),
  });
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      const [{ message }] = validationResult.error.details;
      error.message = `Filed: ${message.replace(/"/g, '')}`;
      error.code = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const updateContact = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .optional(),
    phone: Joi.string().optional(),
  }).min(1);
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      const [{ message }] = validationResult.error.details;
      error.message = `Filed: ${message.replace(/"/g, '')}`;
      error.code = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const id = (req, _res, next) => {
  const { contactId } = req.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(contactId);
  try {
    if (!isIdValid) {
      const error = new Error();
      error.message = 'Id is invalid';
      error.code = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
  next();
};

module.exports = { addContact, updateContact, id };
