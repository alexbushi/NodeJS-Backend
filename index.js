const express = require('express');
const config = require('config');
const helmet = require('helmet');
const logger = require('./logger');
const app = express();

if (app.get('env') === 'development') {
    // load some other middleware, etc...
}

// Configuration
console.log('Application Name: ' + config.get('name'));
//console.log('Password: ' + config.get('password'))

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