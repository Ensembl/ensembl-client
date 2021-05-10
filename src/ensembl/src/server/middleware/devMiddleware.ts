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

import { getPaths } from '../../../webpack/paths';

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
 * Rules to proxy requests to the backend server in development.
 * The `context` field can be either a string or an array of strings for matching routes.
 * If you want to match just a subgroup of urls within a namespace,
 * you can add an exclusion rule to the array.
 * Example: { context: ['/api/**', '!/api/docs/**'] }
 * will match all routes in the `/api` namespace except for `/api/docs`.
 *
 * Notice that, according to the docs, the context array cannot contain a mix
 * of string paths and wildcard paths.
 * Valid examples:
 *  - only string paths: { context: '/foo' }, { context: ['/foo', '/bar'] }
 *  - only wildcard paths: { context: ['/api/**', '!/api/docs/**'] }
 * Invalid example:
 *  - mix of string and wildcard paths: { context: ['/api', '!/api/docs/**'] }
 */
const proxyMiddleware = createProxyMiddleware('/api', {
  target: 'https://staging-2020.ensembl.org',
  changeOrigin: true,
  secure: false
});

const devMiddleware = [genomeBrowserRouter, proxyMiddleware];

export default devMiddleware;
