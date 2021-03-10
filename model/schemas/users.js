const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { Sub } = require('../../helpers/constants');
const SALT_WORK_FACTOR = 8;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.+\S/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    subscription: {
      type: String,
      enum: [Sub.FREE, Sub.PRO, Sub.PREM],
      default: Sub.FREE,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Аналогіно можно написати валідацію
// userSchema.path('email').validate(function (value) {
//      const re = /\S+@\S+\.+\S/;
//      return re.test(String(value).toLowerCase());
// })

const User = model('user', userSchema);

module.exports = User;
