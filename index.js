const debug = require('debug')('app:startup');
// need to run DEBUG=app:startup nodemon index.js
const express = require('express');
const connectToDb = require('./database');
const config = require('config');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const app = express();

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

const port = process.env.PORT || 5000;
app.listen(port, () => debug(`Listening on port ${port}...`));
