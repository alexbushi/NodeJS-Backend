const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = () => {
  const db_url = config.get('mongodb_url');
  mongoose
    .connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Connected to ${db_url}...`));
};
