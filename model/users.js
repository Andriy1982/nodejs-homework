const User = require('./schemas/users');

const findByEmail = async email => {
  return User.findOne({ email });
};

const findById = async id => {
  return User.findOne({ _id: id });
};

const create = async ({ email, password, subscription }) => {
  const user = new User({ email, password, subscription });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
};
