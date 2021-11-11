import morgan, { FormatFn } from 'morgan';

import { devLogger, prodLogger, justUseFetch } from 'src/server/tools/logger';

const toWinstonStream = {
  write: (text: string) => {
    // text = text.trim();
    prodLogger.info(text.trim());

    // prodLogger.info('', JSON.parse(text));
    // prodLogger.info(JSON.parse(text));
    // justUseFetch(JSON.parse(text));
  }
}

// FIXME: delete reference: https://www.moesif.com/blog/technical/logging/How-we-built-a-Nodejs-Middleware-to-Log-HTTP-API-Requests-and-Responses/ 
// https://github.com/winstonjs/winston/issues/1401#issuecomment-403279367

const jsonFormat: FormatFn = (tokens, req, res) => {
  return JSON.stringify({
      'remote-address': tokens['remote-addr'](req, res),
      'time': tokens['date'](req, res, 'iso'),
      'method': tokens['method'](req, res),
      'url': tokens['url'](req, res),
      'http-version': tokens['http-version'](req, res),
      'status-code': tokens['status'](req, res),
      'content-length': tokens['res'](req, res, 'content-length'),
      'referrer': tokens['referrer'](req, res),
      'user-agent': tokens['user-agent'](req, res),
      'response-time': tokens['response-time'](req, res)
  });
}

const loggingMiddleware = morgan('combined', { stream: toWinstonStream });
// const loggingMiddleware = morgan(jsonFormat, { stream: toWinstonStream });

export default loggingMiddleware;
