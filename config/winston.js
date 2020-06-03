var appRoot = require('app-root-path');
var winston = require('winston');

var offset = 8.0 
dateFormat = () => {
  // // suppose the date is 12:00 UTC
  // var invdate = new Date(Date().toLocaleString('en-US', {
  //   timeZone: 'Asia/Kuala_Lumpur'
  // }));

  // // then invdate will be 07:00 in Toronto
  // // and the diff is 5 hours
  // var diff = Date().getTime() - invdate.getTime();

  // // so 12:00 in Toronto is 17:00 UTC
  // return new Date(Date().getTime() + diff);
  return new Date()
}


var options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    errorFile: {
      level: 'error',
      filename: `${appRoot}/logs/ErrApp.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }
  };

  let logger = winston.createLogger({
    transports: [
      new (winston.transports.File)(options.file),
      new (winston.transports.Console)(options.console)
    ],
    format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message} | `
        message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
        message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
        return message
    }),
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = logger;
  
// const winston = require('winston');
// dateFormat = () => {
//     return new Date(Date.now()).toUTCString()
// }
// class LoggerService {
//     constructor(route) {
//         this.log_data = null;
//         this.route = route;
//         const logger = winston.createLogger({
//             transports: [
//                 new winston.transports.Console(),
//                 new winston.transports.File({
//                     filename: `${appRoot}/logs/app.log`
//                 })      
//             ],
//             format: winston.format.printf((info) => {
//                 let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
//                 message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
//                 message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
//                 return message
//             })
//         });
//         this.logger = logger
//     }
    
//     setLogData(log_data) {
//         this.log_data = log_data
//     }
    
//     async info(message) {
//         this.logger.log('info', message);
//     }
    
//     async info(message, obj) {
//         this.logger.log('info', message, {
//             obj
//         })
//     }
    
//     async debug(message) {
//         this.logger.log('debug', message);
//     }
    
//     async debug(message, obj) {
//         this.logger.log('debug', message, {
//             obj
//         })
//     }
    
//     async error(message) {
//         this.logger.log('error', message);
//     }
    
//     async error(message, obj) {
//         this.logger.log('error', message, {
//             obj
//         })
//     }
// }
    
// module.exports = LoggerService