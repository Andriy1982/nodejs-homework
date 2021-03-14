const { Schema, model, SchemaTypes } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Enter email for contact'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Enter phone for contact'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
