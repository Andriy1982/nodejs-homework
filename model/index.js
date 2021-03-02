// const fs = require('fs/promises');
// const path = require('path');
// const contacts = require('./contacts.json');
// const { v4: uuidv4 } = require('uuid');

// const contactsPath = path.join(__dirname, '/contacts.json');

const db = require('./db')
const {ObjectID} = require('mongodb')

const getCollection = async (db, name) => {
  const client =await db
  const collection = await client.db().collection(name)
  return collection
}

const listContacts = async () => {
  const collection = await getCollection(db, 'Contact')
  const result = await collection.find({}).toArray()
  return result
};

const getContactById = async contactId => {
  try {
    const collection = await getCollection(db, 'Contact')
    const objectId = new ObjectID(contactId)
    console.log(objectId.getTimestamp());
    const [result] = await collection.find({_id: objectId}).toArray()
    return result
  } catch (e) {
    console.log(e);
  }
};

const removeContact = async contactId => {
  try {
    const collection = await getCollection(db, 'Contact')
    const objectId = new ObjectID(contactId)
    const {value: result} = await collection.findOneAndDelete(
      {_id: objectId},
    )
    return result
  } catch (err) {
    console.log(err);
  }
};

const addContact = async body => {
  try {
    const contact = {
      ...body,
    };
    const collection = await getCollection(db, 'Contact')
    const {ops: [result]} = await collection.insertOne(contact)
    console.log('We add new contact');
    return  result;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const collection = await getCollection(db, 'Contact')
    const objectId = new ObjectID(contactId)
    const {value: result} = await collection.findOneAndUpdate(
      {_id: objectId},
      {$set: body},
      {returnOriginal: false}
    )
    
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
