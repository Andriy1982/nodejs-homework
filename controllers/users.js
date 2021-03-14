const jwt = require('jsonwebtoken');
require('dotenv').config();
const { HttpCode } = require('../helpers/constants');
const SECRET_KEY = process.env.JWT_SECRET;
const Users = require('../model/users');

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      });
    }
    const newUser = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    if (!user || !(await user.validPassword(password))) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  const userId = req.user.id;
  await Users.updateToken(userId, null);
  return res.status(HttpCode.NO_CONTENT).json({ message: 'Nothing' });
};

const currentUser = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          data: {
            user: {
              email: user.email,
              subscription: user.subscription,
            },
          },
        });
  } catch (err) {
    next(err);
  }
};

const updateSubscribe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subscription } = req.body;
    const updateUser = await Users.updateSubscription(userId, subscription);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          user: {
            email: updateUser.email,
            subscription: updateUser.subscription,    
          },
        },
      });
  } catch (err) {
    next(err);
  }
};

module.exports = { reg, login, logout, currentUser, updateSubscribe };
