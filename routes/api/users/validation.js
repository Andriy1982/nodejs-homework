const Joi = require('joi');
const { HttpCode, Subscription } = require('../../../helpers/constants');

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

const updateUser = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    subscription: Joi.string().valid(...Object.values(Subscription)),
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

const updateAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'bad request',
      message: 'Filed of avatar not found',
    });
  }

  next();
};

module.exports = { validateUser, updateUser, updateAvatar };
