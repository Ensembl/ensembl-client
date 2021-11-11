import winston from 'winston';
import fetch from 'cross-fetch';

const { format } = winston;

export const devLogger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console
  ]
});

export const prodLogger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console
  ]
});

export const justUseFetch = (json: any) => {
  const url = 'http://hx-rke-wp-webadmin-14-worker-1.caas.ebi.ac.uk:31198';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  });
};
