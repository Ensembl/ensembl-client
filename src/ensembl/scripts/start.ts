/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import webpack, { EntryObject } from 'webpack';
import nodemon from 'nodemon';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import once from 'lodash/once';

import { getPaths } from '../webpack/paths';
import getWebpackConfigs from '../webpack/getWebpackConfigs';

const paths = getPaths();

// FIXME: should be able to pass the port dynamically (e.g. process.env.WEBPACK_PORT)
// Better yet, should be able to detect that a port is occupied and use a free one instead
const WEBPACK_PORT = 8081;
const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

// This is a script we will call for local development
const start = async () => {
  const app = express();
  const [webpackClientConfig, webpackServerConfig] = await getWebpackConfigs({
    dev: true
  });
  (webpackClientConfig.entry as EntryObject).client = [
    `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
    (webpackClientConfig.entry as EntryObject).client as string
  ];
  webpackClientConfig.output.hotUpdateMainFilename =
    'updates/[hash].hot-update.json';
  webpackClientConfig.output.hotUpdateChunkFilename =
    'updates/[id].[hash].hot-update.js';

  console.log('ABOUT TO COMPILE'); // eslint-disable-line no-console

  const multiCompiler = webpack([webpackClientConfig, webpackServerConfig]);

  const [clientCompiler, serverCompiler] = multiCompiler.compilers;

  clientCompiler.hooks.done.tap(
    'StartServer',
    once(() => {
      // Not sure if this message is sufficiently visible
      setTimeout(
        () => console.log('Starting the server; please wait...'), // eslint-disable-line no-console
        1000
      );
      serverCompiler.watch(
        {},
        once(() => {
          console.log('server should be ready now'); // eslint-disable-line no-console
          runNodemon();
        })
      );
    })
  );

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    return next();
  });

  app.use(
    webpackDevMiddleware(clientCompiler, {
      // according to the docs, the middleware should be able to pick the publicPath straight from the clientCompiler,
      // but it refuses to do so, hence the manually passed option – TODO: investigate
      publicPath: '/static/'
    })
  );

  app.use(webpackHotMiddleware(clientCompiler));

  app.listen(WEBPACK_PORT);
};

const runNodemon = () => {
  const serverBuildDirectory = paths.buildServerDir;
  const script = nodemon({
    script: `${serverBuildDirectory}/server.js`,
    watch: [serverBuildDirectory],
    delay: 200
  });

  script.on('restart', () => {
    console.log('Server-side app has been restarted.'); // eslint-disable-line no-console
  });

  script.on('quit', () => {
    console.log('Process ended'); // eslint-disable-line no-console
    process.exit();
  });

  script.on('error', () => {
    console.log('An error occured. Exiting'); // eslint-disable-line no-console
    process.exit(1);
  });
};

start();
