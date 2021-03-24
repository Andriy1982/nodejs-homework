const User = require('./schemas/users');

const findByEmail = async email => {
  return User.findOne({ email });
};

const findById = async id => {
  return User.findOne({ _id: id });
};

const findByVerifyToken = async verifyToken => {
  return User.findOne({ verifyToken });
};

const create = async ({
  email,
  password,
  subscription,
  verify,
  verifyToken,
}) => {
  const user = new User({ email, password, subscription, verify, verifyToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verify, verifyToken });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatarURL: avatar });
};

const updateSubscription = async (id, subscription) => {
  await User.updateOne({ _id: id }, { subscription });
  return await User.findOne({ _id: id });
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
  updateSubscription,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};
