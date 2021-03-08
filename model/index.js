const Contact = require('./schemas/contact');

const listContacts = async () => {
  const result = await Contact.find({});
  return result;
};

const getContactById = async contactId => {
  try {
    const result = await Contact.findOne({ _id: contactId });
    return result;
  } catch (e) {
    console.log(e);
  }
};

const removeContact = async contactId => {
  try {
    const result = await Contact.findByIdAndRemove({ _id: contactId });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
    const result = await Contact.create(body);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
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
