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

import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { getPaths } from 'ensemblRoot/webpack/paths';

const paths = getPaths();

const genomeBrowserRouter = Router();

// This part of the middleware should become obsolete when we start packaging the genome browser module better.
// Then it will be webpack dev middleware's responsibility to serve the wasm files
genomeBrowserRouter.get(
  '*wasm',
  (req: Request, res: Response, next: NextFunction) => {
    const requestUrl = req.url; // e.g. /static/browser/browser-80f51620ed443c640cdfd6b5aebd505b.wasm
    const fileName = path.parse(requestUrl).base;
    const options = {
      root: path.join(paths.nodeModulesPath, 'ensembl-genome-browser'),
      dotfiles: 'deny',
      headers: {
        'Content-Type': 'application/wasm'
      }
    };
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      }
    });
  }
);

/**
 * Below are the rules to proxying requests to api endpoints.
 * Normally, in development, all request to api endpoints are proxied to staging-2020.ensembl.org
 *
 * If you need to proxy only some requests to staging-2020 and others to a different host
 * (e.g. a review deployment or your local installation of an api endpoint),
 * update the current proxy middleware to exclude the endpoints you want to proxy to a different host,
 * and add a new dedicated middleware that would enable this proxying.
 *
 * EXAMPLE: to proxy all requests except for help&docs api to staging-2020,
 * while directing requests for help&docs api to your locally running server,
 * use the following configuraiton:

const proxyMiddleware = createProxyMiddleware(['/api/**', '!/api/docs/**'], {
  target: 'https://staging-2020.ensembl.org',
  changeOrigin: true,
  secure: false
});

const docsProxyMiddleware = createProxyMiddleware('/api/docs/**', {
  target: 'http://localhost:3000',
  pathRewrite: {
    '^/api/docs': '/api', // rewrite path
  },
  changeOrigin: true,
  secure: false
});

const devMiddleware = [genomeBrowserRouter, proxyMiddleware, docsProxyMiddleware];

*/

const proxyMiddleware = createProxyMiddleware(['/api/**', '!/api/docs/**'], {
  target: 'https://staging-2020.ensembl.org',
  changeOrigin: true,
  secure: false
});

const docsProxyMiddleware = createProxyMiddleware('/api/docs/**', {
  target: 'http://localhost:3000',
  pathRewrite: {
    '^/api/docs': '/api' // rewrite path
  },
  changeOrigin: true,
  secure: false
});

const devMiddleware = [
  genomeBrowserRouter,
  proxyMiddleware,
  docsProxyMiddleware
];

export default devMiddleware;
