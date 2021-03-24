const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
require('dotenv').config();
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const createFolderIsExist = require('../helpers/create-dir');
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
    const verifyToken = nanoid();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verifyToken, email);

    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verifyToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
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
    if (!user || !(await user.validPassword(password)) || !user.verify) {
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

const avatars = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
    const pathFile = req.file.path;
    const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
    const img = await Jimp.read(pathFile);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathFile);

    await createFolderIsExist(path.join(AVATARS_OF_USERS, userId));
    await fs.rename(
      pathFile,
      path.join(AVATARS_OF_USERS, userId, newNameAvatar),
    );
    const avatarUrl = path.normalize(
      path.join('images', userId, newNameAvatar),
    );
    try {
      await fs.unlink(path.join(process.cwd(), 'public', req.user.avatarURL));
    } catch (e) {
      console.log(e);
    }
    await Users.updateAvatar(userId, avatarUrl);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          avatarUrl,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful',
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'User not found',
    });
  } catch (e) {
    next(e);
  }

  const userId = req.user.id;
  await Users.updateToken(userId, null);
};

module.exports = {
  reg,
  login,
  logout,
  currentUser,
  updateSubscribe,
  avatars,
  verify,
};
