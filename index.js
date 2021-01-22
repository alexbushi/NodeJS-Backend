const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
