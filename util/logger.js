import winston from 'winston';

winston.cli();

function prettyPrint(obj) {
  return JSON.stringify(obj)
    .replace(/\{/g, '< wow ')
    .replace(/\:/g, ' such ')
    .replace(/\}/g, ' >');
}

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      // prettyPrint,
      json: true,
      timestamp: true
    }),
    new (winston.transports.File)({
      filename: './app.log',
      // prettyPrint,
      json: true,
      timestamp: true
    })
  ]
});

logger.cli();

export {logger};

export default logger;
