const winston = require('winston');

module.exports = (err, req, res, next) => {
  winston.error(err.message, err);

  // error
  // warning
  // info
  // verbose
  // debug
  // silly

  res.status(500).send('Internal Server Error: something failed');
};
