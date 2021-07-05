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

import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const genomeBrowserRouter = Router();

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

const proxyMiddleware = createProxyMiddleware('/api', {
  target: 'https://staging-2020.ensembl.org',
  changeOrigin: true,
  secure: false
});

const devMiddleware = [genomeBrowserRouter, proxyMiddleware];

export default devMiddleware;
