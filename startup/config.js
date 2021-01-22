const config = require('config');
const winston = require('winston');

module.exports = (app) => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  // if did export NODE_ENV=default config.get will pull from respective file
  if (app.get('env') === 'development') {
    // load some other middleware, etc...
  }

  winston.debug('Application Name: ' + config.get('name'));
};
