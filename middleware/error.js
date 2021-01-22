const winston = require('winston');

// wraps around the "next" middleware function in routes
module.exports = (err, req, res, next) => {
  winston.error(err.message, err);

  res.status(500).send('Internal Server Error: something failed');
};
