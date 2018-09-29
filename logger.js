const winston = require('winston');

const logsDir = "Logsdir/";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.Console({level: 'info'}),
      new winston.transports.File({ filename: logsDir+'error.log', level: 'error' }),
      new winston.transports.File({ filename: logsDir+'combined.log', level: 'error' })
      
    ]
  });


module.exports = logger;