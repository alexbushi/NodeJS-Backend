const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const home = require('../routes/home');
const error = require('../middleware/error');

module.exports = (app) => {
  app.use(express.json());
  app.use('/', home);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  // Error checking in express middleware needs to come after all other middleware!
  // When we call next() in another middleware function, this error function will be the last middleware
  app.use(error);
};
