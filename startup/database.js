const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = () => {
  mongoose
    .connect(config.get('mongodb_url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
};
