const debug = require('debug')('app:startup');
// need to run DEBUG=app:startup nodemon index.js
const express = require('express');
const connectToDb = require('./database');
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const error = require('./middleware/error');
const app = express();

process.on('uncaughtException', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
// Only log Error level to mongodb
// winston.add(
//   new winston.transports.MongoDB({
//     db: config.get('mongodb_url'),
//     level: 'error',
//   })
// );

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// export NODE_ENV=development
// if did export NODE_ENV=default config.get will pull from respective file
if (app.get('env') === 'development') {
  // load some other middleware, etc...
}

debug('Application Name: ' + config.get('name'));
// need to say export app_password=1234 or whatever we need in custom-environment-variables file
//debug('Password: ' + config.get('password'));

connectToDb();

// Middleware = .use
app.use(helmet());
app.use(logger);
app.use(express.json());
app.use('/', home);
app.use('/api/courses', courses);
app.use('/api/users', users);
app.use('/api/auth', auth);
// Error checking in express middleware needs to come after all other middleware!
// When we call next() in another middleware function, this error function will be the last middleware
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => debug(`Listening on port ${port}...`));
