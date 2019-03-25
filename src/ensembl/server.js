const path = require('path');
const https = require('https');
const fs = require('fs');

const Koa = require('koa');
const serve = require('koa-static');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

const app = new Koa();

app.use(convert(history()));
app.use(serve(path.join(__dirname, 'dist'), { br: true, gzip: false }));

let protocol = 'http';

if (process.argv[2] === '-p') {
  protocol = process.argv[3];
}

if (protocol.toLowerCase() === 'https') {
  https
    .createServer(
      {
        key: fs.readFileSync('localhost.key'),
        cert: fs.readFileSync('localhost.crt')
      },
      app.callback()
    )
    .listen(3000);
} else {
  app.listen(3000);
}

console.log(`Running on ${protocol}://localhost:3000`);
