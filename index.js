const debug = require('debug')('app:startup')
// need to run DEBUG=app:startup nodemon index.js

const express = require('express');
const config = require('config');
const helmet = require('helmet');
const logger = require('./logger');
const app = express();

// export NODE_ENV=development
// if did export NODE_ENV=default config.get will pull from respective file
if (app.get('env') === 'development') {
    // load some other middleware, etc...
}

debug('Application Name: ' + config.get('name'));
// need to say export app_password=1234 or whatever we neeed in custom-environment-variables file
debug('Password: ' + config.get('password'))

// Middleware = .use
app.use(helmet());

app.use(logger);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3, 4]);
});

app.get('/api/courses/:id', (req, res) => {
    res.send(req.params.id);
    //req.query returns object of the query parameters
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));