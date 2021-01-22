require('express-async-errors');
const winston = require('winston');
//require('winston-mongodb');

// error
// warning
// info
// verbose
// debug
// silly

module.exports = () => {
  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  const colorizer = winston.format.colorize();

  winston.add(
    winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf((msg) =>
              colorizer.colorize(
                msg.level,
                `${msg.timestamp} - ${msg.level}: ${msg.message}`
              )
            )
          ),
          level: 'debug',
        }),
        new winston.transports.File({ filename: 'logfile.log', level: 'info' }),
      ],
    })
  );

  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: config.get('mongodb_url'),
  //     level: 'error',
  //   })
  // );
};
