const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path')
require('dotenv').config();
const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users');
const { HttpCode } = require('./helpers/constants');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRouter);
app.use('/auth', usersRouter);
app.use('/users', usersRouter);

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;
