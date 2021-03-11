const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const validateUser = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } })
      .required(),
    password: Joi.string().min(6).required(),
  });
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      const [{ message }] = validationResult.error.details;
      error.message = `Filed: ${message.replace(/"/g, '')}`;
      error.code = HttpCode.BAD_REQUEST;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = { validateUser };
