const Contact = require('./schemas/contact');

const listContacts = async userId => {
  const result = await Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  });
  return result;
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({
      path: 'owner',
      select: 'email subscription -_id',
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findByIdAndRemove({
      _id: contactId,
      owner: userId,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
    const result = await Contact.create(body);
    // console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true },
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
