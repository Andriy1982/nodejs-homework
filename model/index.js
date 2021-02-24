const fs = require('fs/promises');
const path = require('path');
const contacts = require('./contacts.json');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, '/contacts.json');

const listContacts = async () => {
  return contacts;
};

const getContactById = async contactId => {
  try {
    const contact = await contacts.find(({ id }) => String(id) === contactId);
    return contact;
  } catch (e) {
    console.log(e);
  }
};

const removeContact = async contactId => {
  try {
    const contact = await contacts.find(({ id }) => String(id) === contactId);
    if (contact) {
      await fs.writeFile(
        contactsPath,
        JSON.stringify(contacts.filter(({ id }) => String(id) !== contactId)),
      );
      return contact;
    }
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
    const contact = {
      id: uuidv4(),
      ...body,
    };

    const newContacts = [...contacts, contact];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    console.log('We add new contact');
    return contact;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contact = await contacts.find(({ id }) => String(id) === contactId);
    if (contact) {
      const newContact = {
        ...contact,
        ...body,
      };
      await fs.writeFile(
        contactsPath,
        JSON.stringify(
          contacts.map(contact => {
            if (String(contact.id) === contactId) {
              return newContact;
            } else return contact;
          }),
        ),
      );
      return newContact;
    }
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
