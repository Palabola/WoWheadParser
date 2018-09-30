const winston = require('winston');

const logsDir = "Logsdir/";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({level: 'info'}),
      new winston.transports.File({ filename: logsDir+'error.log', level: 'error' })     
    ]
  });


module.exports = logger;