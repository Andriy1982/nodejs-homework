// const { required } = require('joi');
const passport = require('passport');
// const { reg } = require('../controllers/users');
require('../config/passport');
const { HttpCode } = require('./constants');

const guard = (req, res, next) => {
  //   console.log('req', req);
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const [, token] = req.get('Authorization').split(' ');
    // console.log('User', user);
    // console.log('Err', err);
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        data: 'Forbidden',
        message: 'Access is denied',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
