const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

const app = new Koa();

app.use(convert(history()));
app.listen(3000);

app.use(serve(path.join(__dirname, 'dist')));

console.log('Running on http://localhost:3000');
